import { motion } from "framer-motion";
import toast from "react-hot-toast";

const TaskItem = ({ task, onDelete, onToggle, onUpdate }) => {
  const isCompleted = task.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 
      border border-gray-700 shadow-md flex justify-between items-center hover:shadow-lg transition"
    >
      {/* LEFT CONTENT */}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-white">
          {task.title}
        </h3>

        <p className="text-sm text-gray-300">
          {task.description || "No description"}
        </p>

        <div className="text-xs mt-1">
          <span className="text-gray-400">Status:</span>{" "}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${isCompleted
              ? "bg-green-500/20 text-green-400"
              : "bg-yellow-500/20 text-yellow-400"
              }`}
          >
            {task.status}
          </span>
        </div>
      </div>

      {/* RIGHT BUTTONS */}
      <div className="grid grid-cols-1 gap-2">
        <button
          onClick={() => {
            onToggle(task._id);
            toast.success(
              isCompleted ? "Marked as pending" : "Task completed 🎉"
            );
          }}
          className="px-4 py-1.5 text-sm rounded-lg bg-blue-500/20 text-blue-400 
          hover:bg-blue-500 hover:text-white transition"
        >
          {isCompleted ? "Undo" : "Complete"}
        </button>

        <button
          onClick={() => {
            const newTitle = prompt("Enter new title", task.title);
            if (!newTitle || !newTitle.trim()) {
              toast.error("Title cannot be empty");
              return;
            }

            const newDescription = prompt(
              "Enter new description",
              task.description
            );

            onUpdate(task._id, {
              title: newTitle,
              description: newDescription || "",
            });

            toast.success("Task updated");
          }}

          className="px-4 py-1.5 text-sm rounded-lg  bg-purple-500/20 text-blue-400 
          hover:bg-purple-500 hover:text-white transition"
        >
          Edit
        </button>

        <button
          onClick={() => {
            onDelete(task._id);
            toast.success("Task deleted");
          }}
          className="px-4 py-1.5 text-sm rounded-lg bg-red-500/20 text-red-400 
          hover:bg-red-500 hover:text-white transition"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default TaskItem;