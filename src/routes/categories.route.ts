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
import authorizeRole from "../middlewares/authorizeRole.ts";

const categoriesRouter: Router = Router().use(isAuthenticated);

categoriesRouter
    .route("/")
    .get(getAllCategories)
    .post(authorizeRole("admin"), createCategory);
categoriesRouter
    .route("/:id")
    .get(getCategory)
    .all(authorizeRole("admin"))
    .put(updateCategory)
    .delete(deleteCategory);

categoriesRouter.route("/:id/products").get(getCategoryProducts);

export default categoriesRouter;
