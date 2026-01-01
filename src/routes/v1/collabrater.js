import express from "express";
import { addCollabraterController, getProjectCollabratersController } from "../../controllers/collabrater/CollabraterController.js";
const router = express.Router();

// Add a collabrater to a project /api/v1/collabrater
router.post('/',addCollabraterController);
router.post('/getCollabraters',getProjectCollabratersController);
export default router;