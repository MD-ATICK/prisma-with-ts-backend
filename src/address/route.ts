import { Router } from "express";
import controller from "./controller";
import authMiddleware from "../middlewares/userAuth";
const addressRoute: Router = Router()


addressRoute.get('/list', authMiddleware, controller.listAddress)
addressRoute.post('/add', authMiddleware, controller.addAddress)
addressRoute.delete('/delete/:id', authMiddleware, controller.deleteAddress)

export default addressRoute;