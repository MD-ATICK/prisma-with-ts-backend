import { Router } from "express";
import authMiddleware from "../middlewares/userAuth";
import controller from "./controller";
import adminMiddleware from "../middlewares/admin";

const authRoute: Router = Router()


authRoute.get('/me', authMiddleware, adminMiddleware, controller.auth)
authRoute.post('/register', controller.register)
authRoute.post('/login', controller.login)
authRoute.get('/users', controller.getUsers)


export default authRoute;