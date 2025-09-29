import config from "../config/config.ts";
import { type RequestHandler } from "express";
import { type JwtPayload } from "jsonwebtoken";
import { verifyRefreshToken } from "../utils/jwt.utils.ts";
import { compareHash } from "../utils/hash.utils.ts";
import {
    createUser,
    fetchUserByEmail,
    fetchUserById,
} from "../services/users.service.ts";
import {
    createAccessToken,
    createRefreshToken,
    getFamilyTokens,
    revokeFamilyTokens,
} from "../services/auth.service.ts";

export const register: RequestHandler = async (req, res) => {
    const { email, password } = req.body;

    await createUser(email, password);
    return res.status(201).json({ message: "User Created Successfully" });
};

export const login: RequestHandler = async (req, res) => {
    const { email, password } = req.body;
    const user = await fetchUserByEmail(email);

    if (!user) return res.status(401).json({ error: "User Doesn't exist" });
    if (!compareHash(password, user.passwordHash))
        return res.status(401).json({ error: "Invalid password" });

    const access = createAccessToken(user._id.toString(), user.role); // access token generation
    const refresh = await createRefreshToken(user._id.toString()); // refresh token generation

    res.cookie("refreshToken", refresh, config.refreshOptions); // send refresh token in a cookie
    return res.json({ access }); // send access token in res body
};

export const refresh: RequestHandler = async (req, res) => {
    const { refreshToken } = req.cookies;
    let decoded;
    try {
        decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Invalid Refresh Token" });
    }

    // getting tokens that have the same familyId as the incoming token
    const tokenInFamily = await getFamilyTokens((decoded as JwtPayload).fam);

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
            await revokeFamilyTokens((decoded as JwtPayload).fam);
        return res.status(401).json({
            error: "Refresh token reuse detected. All sessions revoked.",
        });
    }
    // if token exists but already used & revoked, then reuse detection
    if (matchedToken.revoked) {
        await revokeFamilyTokens((decoded as JwtPayload).fam);
        return res.status(401).json({
            error: "Refresh token revoked. Possible reuse detected. All sessions revoked.",
        });
    }

    // create new refresh token & save it to the db
    const newRefresh = await createRefreshToken(
        matchedToken.userId.toString(),
        matchedToken,
    );

    // create access token
    const user = await fetchUserById(matchedToken.userId.toString());
    const newAccess = createAccessToken(
        matchedToken.userId.toString(),
        user!.role,
    );

    // send new refresh token in a cookie
    res.cookie("refreshToken", newRefresh, config.refreshOptions);

    return res.json({ newAccess }); // send new access token in res body
};

export const logout: RequestHandler = async (req, res) => {
    const { refreshToken } = req.cookies;
    const decoded = verifyRefreshToken(refreshToken);
    await revokeFamilyTokens((decoded as JwtPayload).fam);
    return res.clearCookie("refreshToken").json({ ok: true });
};
