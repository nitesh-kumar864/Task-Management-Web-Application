import { useState } from "react";
import { motion } from "framer-motion";

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  const validateForm = () => {
    const errs = {};

    if (!title.trim()) {
      errs.title = "Title is required";
    }

    if (!description.trim()) {
      errs.description = "Description is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onAdd({ title, description });

    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">

      {/* Title */}
      <input
        type="text"
        placeholder="Task title"
        className={`w-full p-3 rounded-lg bg-gray-800 text-white cursor-pointer 
          ${errors.title ? "border border-red-500" : ""}`}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setErrors({ ...errors, title: "" });
        }}
      />

      {errors.title && (
        <p className="text-red-400 text-xs">{errors.title}</p>
      )}

      {/* Description */}
      <input
        type="text"
        placeholder="Description"
        className={`w-full p-3 rounded-lg bg-gray-800 text-white cursor-pointer
          ${errors.description ? "border border-red-500" : ""}`}
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setErrors({ ...errors, description: "" });
        }}
      />

      {errors.description && (
        <p className="text-red-400 text-xs">{errors.description}</p>
      )}

      <motion.button
        whileTap={{ scale: 0.95 }}
        className="w-full bg-green-500 py-2 rounded-lg text-white font-semibold"
      >
        Add Task
      </motion.button>
    </form>
  );
};

export default TaskForm;