import type { RequestHandler } from "express";
import {
    fetchUserById,
    fetchUsers,
    removeUserById,
    updateUserById,
} from "../services/users.service.ts";

export const getUsers: RequestHandler = async (req, res) => {
    const users = await fetchUsers();
    return res.status(200).json(users);
};

export const getUser: RequestHandler = async (req, res) => {
    const user = await fetchUserById(req.params.id!);
    return res.status(200).json(user);
};

export const getMe: RequestHandler = async (req, res) => {
    const user = await fetchUserById(req.user.sub);
    return res.status(200).json(user);
};

export const patchMe: RequestHandler = async (req, res) => {
    const user = await updateUserById(req.user.sub, req.body);
    return res.status(200).json(user);
};

export const deleteUser: RequestHandler = async (req, res) => {
    const result = await removeUserById(req.params.id!);
    return res
        .status(200)
        .json({ message: "Deletion completed successfully", result });
};

export const deleteMe: RequestHandler = async (req, res) => {
    const result = await removeUserById(req.user.sub);
    return res
        .status(200)
        .json({ message: "User Deleted Successfully", result });
};
