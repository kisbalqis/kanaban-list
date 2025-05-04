"use client";
import React, { useState, useEffect } from "react";
import { FaPerson } from "react-icons/fa6";
import { FiSearch, FiArrowUp, FiArrowDown } from "react-icons/fi";

export default function KanbanTable() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortField, setSortField] = useState("title");

  useEffect(() => {
    fetch("https://mocki.io/v1/9d9895f9-70eb-49d2-99f7-cb3dacca8a94")
      .then((res) => res.json())
      .then((data) => {
        if (data.response && data.data) {
          setTasks(data.data);
        }
      })
      .catch((err) => console.error("Error fetching tasks:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleInputChange = (e, field, taskToUpdate) => {
    const updatedValue = e.target.value;
    const updatedTasks = tasks.map((task) =>
      task === taskToUpdate ? { ...task, [field]: updatedValue } : task
    );
    setTasks(updatedTasks);
  };

  const handleAddNewTask = () => {
    const newTask = {
      title: "",
      developer: "",
      status: "",
      priority: "",
      type: "",
      "Estimated SP": 0,
      "Actual SP": 0,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const handleSortToggle = (field) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredTasks = tasks.filter((task) =>
    Object.values(task).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery)
    )
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aValue = a[sortField]?.toString().toLowerCase();
    const bValue = b[sortField]?.toString().toLowerCase();
    return aValue < bValue
      ? sortDirection === "asc"
        ? -1
        : 1
      : aValue > bValue
      ? sortDirection === "asc"
        ? 1
        : -1
      : 0;
  });

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={handleAddNewTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          New Task
        </button>
        <div className="relative">
          <div className="absolute inset-y-0 left-8 pl-2 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400 w-4 h-4" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search"
            className="pl-16 bg-transparent border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-0 transition w-full"
          />
        </div>
        <button
          className="p-2 rounded hover:bg-gray-700 transition text-white"
          title="User"
        >
          <FaPerson className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleSortToggle("title")}
          className="p-2 rounded hover:bg-gray-700 transition text-white"
          title={`Sort ${sortDirection === "asc" ? "Descending" : "Ascending"}`}
        >
          {sortDirection === "asc" ? (
            <FiArrowUp className="w-4 h-4" />
          ) : (
            <FiArrowDown className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="mb-4">
        <select
          className="bg-[#161b22] text-white border border-gray-600 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
          defaultValue="all"
        >
          <option value="all">All Tasks</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading tasks...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-white border-collapse border border-gray-700">
            <thead>
              <tr className="bg-[#161b22] text-left">
                <th
                  className="p-3 border border-gray-700 cursor-pointer"
                  onClick={() => handleSortToggle("title")}
                >
                  Task
                  {sortField === "title" && (
                    <span className="inline ml-1">
                      {sortDirection === "asc" ? (
                        <FiArrowUp className="inline ml-1" />
                      ) : (
                        <FiArrowDown className="inline ml-1" />
                      )}
                    </span>
                  )}
                </th>
                <th className="p-3 border border-gray-700">Status</th>
                <th className="p-3 border border-gray-700">Priority</th>
                <th className="p-3 border border-gray-700">Date</th>
                <th className="p-3 border border-gray-700">Type</th>
                <th className="p-3 border border-gray-700">Estimated SP</th>
                <th className="p-3 border border-gray-700">Actual SP</th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.map((task, idx) => (
                <tr key={idx} className="border border-gray-700">
                  <td className="p-3 border border-gray-700 flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox text-blue-600" />
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => handleInputChange(e, "title", task)}
                      className="bg-transparent text-white focus:ring-2 focus:ring-blue-500 w-full"
                    />
                    <span className="ml-2 text-blue-600">
                      <i className="fas fa-comment-alt"></i>
                    </span>
                  </td>
                  <td className="p-3 border border-gray-700">
                    <input
                      type="text"
                      value={task.developer}
                      onChange={(e) => handleInputChange(e, "developer", task)}
                      className="bg-transparent text-white focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  </td>
                  <td
                    className={`p-3 border border-gray-700 ${task.status === "Ready to start"
                      ? "bg-blue-300 text-black"
                      : task.status === "In Progress"
                      ? "bg-yellow-300"
                      : task.status === "Waiting to review"
                      ? "bg-blue-200"
                      : task.status === "Pending deploy"
                      ? "bg-orange-500"
                      : task.status === "Done"
                      ? "bg-green-600"
                      : task.status === "Stuck"
                      ? "bg-red-600"
                      : ""
                    }`}
                  >
                    <input
                      type="text"
                      value={task.status}
                      onChange={(e) => handleInputChange(e, "status", task)}
                      className="bg-transparent text-white focus:ring-2 focus:ring-blue-300 w-full"
                    />
                  </td>
                  <td
                    className={`p-3 border border-gray-700 ${task.priority === "Medium"
                      ? "bg-blue-300 text-black"
                      : task.priority === "Critical"
                      ? "bg-yellow-300"
                      : task.priority === "Best Effort"
                      ? "bg-grey-500"
                      : task.priority === "Pending deploy"
                      ? "bg-orange-500"
                      : task.priority === "High"
                      ? "bg-purple-600"
                      : task.priority === "Low"
                      ? "bg-red-600"
                      : ""
                    }`}
                  >
                    <input
                      type="text"
                      value={task.priority}
                      onChange={(e) => handleInputChange(e, "priority", task)}
                      className="bg-transparent text-white focus:ring-2 focus:ring-blue-300 w-full"
                    />
                  </td>
                  <td
                    className={`p-3 border border-gray-700 ${task.type === "Feature Enhancement"
                      ? "bg-pink-300 text-black"
                      : task.type === "Other"
                      ? "bg-purple-300 text-black"
                      : task.type === "Bug"
                      ? "bg-gray-500"
                      : ""
                    }`}
                  >
                    <input
                      type="text"
                      value={task.type}
                      onChange={(e) => handleInputChange(e, "type", task)}
                      className="bg-transparent text-white focus:ring-2 focus:ring-blue-300 w-full"
                    />
                  </td>
                  <td className="p-3 border border-gray-700">
                    <input
                      type="date"
                      value={task.date ? new Date(task.date).toISOString().split("T")[0] : ""}
                      onChange={(e) => handleInputChange(e, "date", task)}
                      className="bg-transparent text-white focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  </td>
                  <td className="p-3 border border-gray-700">
                    <input
                      type="number"
                      value={task["Estimated SP"]}
                      onChange={(e) => handleInputChange(e, "Estimated SP", task)}
                      className="bg-transparent text-white focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  </td>
                  <td className="p-3 border border-gray-700">
                    <input
                      type="number"
                      value={task["Actual SP"]}
                      onChange={(e) => handleInputChange(e, "Actual SP", task)}
                      className="bg-transparent text-white focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
