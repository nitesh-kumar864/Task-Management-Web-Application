import Task from "../models/taskModel.js";


// create task
export const createTask = async (req, res) => {

    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "All field is required",
            })
        }

        const task = await Task.create({
            title,
            description,
            userId: req.userId,
        });

        return res.status(201).json({
            success: true,
            message: "Created new task",
            task
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


// Get all task

export const getTasks = async (req, res) => {

    try {

        const tasks = await Task.find({ userId: req.userId }).sort({
            createAt: -1,
        });

        if (!tasks) {
            return res.status(400).json({
                success: false,
                message: "no found tasks",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Show all messages successfully",
            tasks,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "internal error"
        })
    }
}

// update task

export const updateTask = async (req, res) => {

    try {
        const { id } = req.params;

        const task = await Task.findByIdAndUpdate(
            {
                _id: id,
                userId: req.userId
            },
            req.body,
            { new: true }
        );

        if (!task) {
            return res.status(400).json({
                success: false,
                message: "Task not found"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Task update successfully",
            task,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "internal error"
        });
    }
}

// delete task

export const deleteTask = async (req, res) => {

    try {
        const { id } = req.params;

        const task = await Task.findByIdAndDelete(
            {
                _id: id,
                userId: req.userId
            },
        )

        if (!task) {
            return res.status(400).json({
                success: false,
                message: "Task not found",
            });
        }

        return res.status(201).json({
            success: true,
            message: "Task delete successfully",
            task,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "internal error"
        });
    }
}

//  TOGGLE TASK STATUS 

export const toggleTaskStatus = async (req, res) => {
    
     try {
        const { id } = req.params;

        const task = await Task.findOne(
            {
                _id: id,
                userId: req.userId
            },
        )

        if (!task) {
            return res.status(400).json({
                success: false,
                message: "Task not found",
            });
        }

        task.status = task.status === "pending" ? "completed" : "pending";

        await task.save();

        return res.status(201).json({
            success: true,
            message: "Task delete successfully",
            task,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "internal error"
        });
    }
}