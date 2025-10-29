import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.ts";
import {
    getAllCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
    getCategoryProducts,
} from "../controllers/categories.controller.ts";
import validate from "../middlewares/validateSchema.ts";
import authorizeRole from "../middlewares/authorizeRole.ts";
import isObjectId from "../middlewares/isObjectId.ts";
import { categoryBodySchema } from "../validation/categories.schema.ts";

const categoriesRouter: Router = Router().use(isAuthenticated);

categoriesRouter
    .route("/")
    .get(getAllCategories)
    .post(
        authorizeRole("admin"),
        validate(categoryBodySchema, "body"),
        createCategory,
    );

categoriesRouter
    .route("/:id")
    .all(isObjectId())
    .get(getCategory)
    .all(authorizeRole("admin"))
    .put(validate(categoryBodySchema.partial(), "body"), updateCategory)
    .delete(deleteCategory);

categoriesRouter.get("/:id/products", isObjectId(), getCategoryProducts);

export default categoriesRouter;
