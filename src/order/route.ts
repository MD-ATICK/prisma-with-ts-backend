import { Router } from "express";
import controller from "./controller";
import authMiddleware from "../middlewares/userAuth";

const orderRoute: Router = Router()

orderRoute.post('/create', authMiddleware, controller.createOrder)
orderRoute.get('/user-orders', authMiddleware, controller.listOrders)
orderRoute.put('/cancel/:id', authMiddleware, controller.cancelOrder)
orderRoute.get('/single/:id', authMiddleware, controller.getOrderById)

export default orderRoute;