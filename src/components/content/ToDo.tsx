import { useState, useEffect } from "react";
import { FaCheck, FaTrash, FaPlus } from "react-icons/fa6";

type FilterType = "all" | "active" | "completed";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const STORAGE_KEY = "todolist-tasks";

const defaultTasks: Task[] = [
  { id: "1", text: "Complete 3D portfolio website", completed: true },
  { id: "2", text: "Add more interactive elements", completed: true },
  { id: "3", text: "Optimize performance", completed: false },
  { id: "4", text: "Add mobile responsiveness", completed: false },
];

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        return JSON.parse(savedTasks);
      }
    }
    return defaultTasks;
  });
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: inputValue,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setInputValue("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const activeCount = tasks.filter((task) => !task.completed).length;

  return (
    <div className="space-y-4">
      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Add
        </button>
      </form>

      {/* Filter Buttons */}
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-orange-500 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All ({tasks.length})
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            filter === "active"
              ? "bg-orange-500 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            filter === "completed"
              ? "bg-orange-500 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Completed ({tasks.length - activeCount})
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No tasks to show</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors group"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  task.completed
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300 hover:border-green-400"
                }`}
              >
                {task.completed && <FaCheck className="w-3 h-3 text-white" />}
              </button>
              <span
                className={`flex-1 ${
                  task.completed
                    ? "text-gray-400 line-through"
                    : "text-gray-700"
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => removeTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all p-1"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
