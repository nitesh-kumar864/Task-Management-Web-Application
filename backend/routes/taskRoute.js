import express from 'express';

import { 
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    toggleTaskStatus,
 } from '../controllers/taskController.js';

import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post("/", verifyToken, createTask);
router.get("/", verifyToken, getTasks);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);
router.patch("/:id/toggle", verifyToken, toggleTaskStatus);


export default router;