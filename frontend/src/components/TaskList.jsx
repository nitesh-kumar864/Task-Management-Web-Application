import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onDelete, onToggle, onUpdate }) => {
  if (tasks.length === 0) {
    return <p className="text-gray-400">No tasks yet</p>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default TaskList;