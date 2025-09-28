import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.ts";
import authorizeRoles from "../middlewares/authorizeRole.ts";
import isObjectId from "../middlewares/isObjectId.ts";
import {
    getUsers,
    getUser,
    getMe,
    patchMe,
    deleteUser,
    deleteMe,
} from "../controllers/users.controller.ts";

const usersRouter: Router = Router().use(isAuthenticated);

usersRouter.get("/", authorizeRoles("admin"), getUsers);

usersRouter.route("/me").get(getMe).patch(patchMe).delete(deleteMe);

usersRouter
    .route("/:id")
    .all(isObjectId, authorizeRoles("admin"))
    .get(getUser)
    .delete(deleteUser);

export default usersRouter;
