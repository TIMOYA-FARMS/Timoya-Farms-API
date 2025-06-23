import { Router } from "express";
import upload from "../middlewares/multer.js";
import { countProducts, createProduct, deleteProduct, getAllProducts, getOneProduct, updateProduct } from "../controllers/products.js";
import { hasPermission, isAuthenticated } from "../middlewares/auth.js";


const productRouter = Router()

productRouter.post('/products', isAuthenticated,  hasPermission('createProduct'), upload.single('image'), createProduct);

productRouter.get('/products', getAllProducts);

productRouter.get('/products/:id', getOneProduct);

productRouter.patch('/products/:id', isAuthenticated, hasPermission('updateProduct'), upload.single('image'), updateProduct);

productRouter.delete('/products/:id', isAuthenticated, hasPermission('deleteProduct'),  deleteProduct);

productRouter.get('/products/count', countProducts);

export default productRouter;