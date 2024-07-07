import { Router } from "express";
import controller from "./controller";

const adminRoute: Router = Router()


// users access
adminRoute.get('/users', controller.users)
adminRoute.get('/single/:id', controller.getUserById)
adminRoute.put('/change-role/:id', controller.changeUserRole)


// order access




export default adminRoute;