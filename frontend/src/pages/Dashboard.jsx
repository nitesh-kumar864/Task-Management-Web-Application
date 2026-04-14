import { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useTaskStore } from "../store/taskStore";
import { Search } from "lucide-react";
import LoadingSpinner from "../components/LodingSpinner";

const DashboardPage = () => {
	const {
		tasks,
		fetchTasks,
		addTask,
		deleteTask,
		updateTask,
		toggleTask,
		isLoading,

	} = useTaskStore();

	const [search, setSearch] = useState("");

	const filteredTasks = tasks.filter((task) =>
		task.title.toLowerCase().includes(search.toLowerCase())
	);

	useEffect(() => {
		fetchTasks();
	}, []);

	return (
		<div className="min-h-screen w-full pt-16">
			<div className="flex justify-center mt-6 px-4">
				<div className="max-w-2xl w-full bg-gray-900 p-6 rounded-xl">

					<div className="relative mb-4">
						<Search
							size={18}
							className="absolute flex left-3 top-1/2 -translate-y-1/2 text-gray-400"
						/>

						<input
							type="text"
							placeholder="Search by title..."
							className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800 text-white cursor-pointer
    								focus:outline-none focus:ring-2 focus:ring-green-500"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>

					</div>

					<TaskForm onAdd={addTask} />

					<h2 className="text-lg text-white flex justify-center mt-10 mb-4">
						All Tasks
					</h2>

					{isLoading ? (
						<p className="text-gray-400"><LoadingSpinner /></p>
					) : (
						<TaskList
							tasks={filteredTasks}
							onDelete={deleteTask}
							onToggle={toggleTask}
							onUpdate={updateTask}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;