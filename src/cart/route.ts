import { Router } from "express";
import controller from "./controller";
import authMiddleware from "../middlewares/userAuth";
const cartRoute: Router = Router()


cartRoute.get('/get', authMiddleware, controller.getCarts)
cartRoute.post('/add', authMiddleware, controller.addCart)
cartRoute.delete('/delete/:id', authMiddleware, controller.deleteCart)
cartRoute.put('/update/:id', authMiddleware, controller.changeQuantity)


export default cartRoute;

