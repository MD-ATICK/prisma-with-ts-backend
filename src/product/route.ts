import { Router } from "express";
import controller from "./controller";
import authMiddleware from "../middlewares/userAuth";
import adminMiddleware from "../middlewares/admin";
const productRoute: Router = Router();

productRoute.get('/products', controller.products)
productRoute.get('/product/:id', controller.singleProduct)
productRoute.post('/create', controller.createProduct)
productRoute.delete('/delete/:id', controller.deleteProduct)
productRoute.post('/update/:id', authMiddleware, adminMiddleware, controller.updateProduct)


export default productRoute;