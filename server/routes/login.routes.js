import {Router} from "express"
import { login } from "../controllers/login.controllers.js";
import { createUser } from "../controllers/login.controllers.js";


const router = Router();

router.post('/login', login);

router.post('/create', createUser);

export default router; 