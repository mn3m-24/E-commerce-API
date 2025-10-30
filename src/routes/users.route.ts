import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.ts";
import authorizeRoles from "../middlewares/authorizeRole.ts";
import isObjectId from "../middlewares/isObjectId.ts";
import validate from "../middlewares/validateSchema.ts";
import { userSchema } from "../validation/users.schema.ts";
import {
    getUsers,
    getUser,
    patchUser,
    deleteUser,
} from "../controllers/users.controller.ts";

const usersRouter: Router = Router().use(isAuthenticated);

usersRouter.get("/", authorizeRoles("admin"), getUsers);

usersRouter
    .route("/me")
    .get(getUser)
    .patch(validate(userSchema.partial(), "body"), patchUser)
    .delete(deleteUser);

usersRouter
    .route("/:id")
    .all(isObjectId(), authorizeRoles("admin"))
    .get(getUser)
    .delete(deleteUser);

export default usersRouter;
