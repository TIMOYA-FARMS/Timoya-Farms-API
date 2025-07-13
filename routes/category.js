import { Router } from "express";
import { 
    createCategory, 
    getAllCategories, 
    getCategory, 
    updateCategory, 
    deleteCategory 
} from "../controllers/category.js";
import { isAuthenticated, hasPermission } from "../middlewares/auth.js";
import { apiCache } from "../middlewares/cache.js";

const categoryRouter = Router();

// Admin routes (require authentication and permissions)
categoryRouter.post(
    "/category",
    isAuthenticated,
    hasPermission("createCategory"),
    createCategory
);

categoryRouter.patch(
    "/category/:id",
    isAuthenticated,
    hasPermission("updateCategory"),
    updateCategory
);

categoryRouter.delete(
    "/category/:id",
    isAuthenticated,
    hasPermission("deleteCategory"),
    deleteCategory
);

// Public routes (cached)
categoryRouter.get("/category", apiCache, getAllCategories);
categoryRouter.get("/category/:id", apiCache, getCategory);

export default categoryRouter; 