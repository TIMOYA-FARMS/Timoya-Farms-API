import { Router } from "express";
import upload from "../middlewares/multer.js";
import { countProducts, createProduct, deleteProduct, getAllProducts, getOneProduct, updateProduct } from "../controllers/products.js";
import { hasPermission, isAuthenticated } from "../middlewares/auth.js";
import { apiCache, shortCache } from "../middlewares/cache.js";


const productRouter = Router()

productRouter.post('/products', isAuthenticated,  hasPermission('createProduct'), upload.single('image'), createProduct);

productRouter.get('/products', apiCache, getAllProducts);

productRouter.get('/products/count', shortCache, countProducts);

productRouter.get('/products/:id', apiCache, getOneProduct);

productRouter.patch('/products/:id', isAuthenticated, hasPermission('updateProduct'), upload.single('image'), updateProduct);

productRouter.delete('/products/:id', isAuthenticated, hasPermission('deleteProduct'), deleteProduct);

export default productRouter;