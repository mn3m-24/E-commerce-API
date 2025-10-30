import type { RequestHandler } from "express";
import UserService from "../services/users.service.ts";

export const getUsers: RequestHandler = async (req, res) => {
    const users = await UserService.fetchUsers();
    return res.status(200).json(users);
};

export const getUser: RequestHandler = async (req, res) => {
    const user = await UserService.fetchUserById(req.params.id ?? req.user.sub);
    return res.status(200).json(user);
};

export const patchUser: RequestHandler = async (req, res) => {
    const user = await UserService.updateUserById(
        req.params.id ?? req.user.sub,
        req.body,
    );
    return res.status(200).json(user);
};

export const deleteUser: RequestHandler = async (req, res) => {
    const result = await UserService.removeUserById(
        req.params.id ?? req.user.sub,
    );
    return res
        .status(200)
        .json({ message: "User Deleted Successfully", result });
};
