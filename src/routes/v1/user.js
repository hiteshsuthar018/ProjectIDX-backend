import express from "express";
import { signupUserController } from "../../controllers/user/signupController.js";
import { signupInController } from "../../controllers/user/signinController.js";
const router = express.Router();

// Create a new project /api/v1/project
router.post('/signup',signupUserController);
router.post('/signin',signupInController);



export default router;