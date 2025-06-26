import { Router } from "express";
import {
    createResource,
    listResources,
    getResource,
    updateResource,
    deleteResource
} from "../controllers/learningResource.js";
import { multerUpload, uploadToCloudinary } from "../middlewares/cloudinary.js";
import { hasPermission, isAuthenticated } from "../middlewares/auth.js";

const learningResourceRouter = Router();

learningResourceRouter.post("/learningresources/", isAuthenticated, hasPermission('createResource'), multerUpload.single("file"), uploadToCloudinary(), createResource); // File upload for resource creation
learningResourceRouter.get("/learningresources", listResources); // public
learningResourceRouter.get("/learningresources/:id", getResource); // public
learningResourceRouter.patch("/learningresources/:id", isAuthenticated, hasPermission('updateResource'), multerUpload.single("file"), uploadToCloudinary(), updateResource); // public

learningResourceRouter.delete("/learningresources/:id", isAuthenticated, hasPermission('deleteResoure'), deleteResource); // public


export default learningResourceRouter;
