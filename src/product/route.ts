import { Router } from "express";
import adminMiddleware from "../middlewares/admin";
import authMiddleware from "../middlewares/userAuth";
import controller from "./controller";
const productRoute: Router = Router();

productRoute.get('/products', controller.products)
productRoute.get('/product/:id', controller.singleProduct)
productRoute.post('/create', controller.createProduct)
productRoute.delete('/delete/:id', controller.deleteProduct)
productRoute.post('/update/:id', authMiddleware, adminMiddleware, controller.updateProduct)


export default productRoute;