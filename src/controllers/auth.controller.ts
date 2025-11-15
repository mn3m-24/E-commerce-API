import config from "../config/config.ts";
import type { RequestHandler } from "express";
import type { RefreshPayload } from "../types/auth.types.ts";
import { verifyRefreshToken } from "../utils/jwt.utils.ts";
import { compareHash } from "../utils/hash.utils.ts";
import UserService from "../services/users.service.ts";
import AuthService from "../services/auth.service.ts";

export const register: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

    await UserService.createUser(email, password);
    return res.status(201).json({ message: "User Created Successfully" });
};

export const login: RequestHandler = async (req, res) => {
    const { email, password } = req.body;
    const user = await UserService.fetchUserByEmail(email);

    if (!user) return res.status(401).json({ error: "User Doesn't exist" });
    if (!compareHash(password, user.passwordHash))
        return res.status(401).json({ error: "Invalid password" });

    const access = await AuthService.createAccessToken(
        user._id.toString(),
        user.role,
    ); // access token generation
    const refresh = await AuthService.createRefreshToken(user._id.toString()); // refresh token generation

    res.cookie("refreshToken", refresh, config.refreshOptions); // send refresh token in a cookie
    return res.json({ access }); // send access token in res body
};

export const refresh: RequestHandler = async (req, res) => {
    const { refreshToken } = req.cookies;
    let payload: RefreshPayload;
    try {
        payload = await verifyRefreshToken(refreshToken);
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Invalid Refresh Token" });
    }

    // getting tokens that have the same familyId as the incoming token
    const tokenInFamily = await AuthService.getFamilyTokens(payload.fam);

    // matching the incoming token with any of the family tokens
    let matchedToken = null;
    for (const t of tokenInFamily) {
        if (!compareHash(refreshToken, t.tokenHash)) continue;
        matchedToken = t;
    }

    // no matching token, but incoming token has the same familyId,
    // then a rotated token reuse has been detected
    if (!matchedToken) {
        if (tokenInFamily.length > 0)
            await AuthService.revokeFamilyTokens(payload.fam);
        return res.status(401).json({
            error: "Refresh token reuse detected. All sessions revoked.",
        });
    }
    // if token exists but already used & revoked, then reuse detection
    if (matchedToken.revoked) {
        await AuthService.revokeFamilyTokens(payload.fam);
        return res.status(401).json({
            error: "Refresh token revoked. Possible reuse detected. All sessions revoked.",
        });
    }

    // create new refresh token & save it to the db
    const newRefresh = await AuthService.createRefreshToken(
        matchedToken.userId.toString(),
        matchedToken,
    );

    // create access token
    const user = await UserService.fetchUserById(
        matchedToken.userId.toString(),
    );
    const newAccess = await AuthService.createAccessToken(
        matchedToken.userId.toString(),
        user!.role,
    );

    // send new refresh token in a cookie
    res.cookie("refreshToken", newRefresh, config.refreshOptions);

    return res.json({ newAccess }); // send new access token in res body
};

export const logout: RequestHandler = async (req, res) => {
    const { refreshToken } = req.cookies;
    const decoded = await verifyRefreshToken(refreshToken);
    await AuthService.revokeFamilyTokens(decoded.fam);
    return res.clearCookie("refreshToken").json({ ok: true });
};
