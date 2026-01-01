import express from "express";
import userRouter from "./user.js"
import projectRouter from "./project.js"
import { authMiddleware } from "../../middleware/authMiddleware.js";
import collabraterRouter from "./collabrater.js";
import { verifyProjectOwner } from "../../middleware/verifyProjectOwner.js";
const router = express.Router();

router.use('/project',authMiddleware,projectRouter)
router.use('/user',userRouter)
router.use('/collabrater',authMiddleware,verifyProjectOwner,collabraterRouter);

export default router;