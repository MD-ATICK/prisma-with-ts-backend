import { Router } from "express";
import controller from "./controller";
const productRoute: Router = Router();

productRoute.post('/create', controller.createProduct)
productRoute.get('/products', controller.enterName)


export default productRoute;