import express from "express";
import { createProjectController, getProjectTree, getUserprojects } from "../../controllers/project/projectController.js";
import projectAccessMiddleware from "../../middleware/projectAccessMiddleware.js";
const router = express.Router();

// Create a new project /api/v1/project
router.post('/',createProjectController);
router.get('/:projectId/tree',projectAccessMiddleware,getProjectTree);
router.get('/me/projects',getUserprojects);


export default router;