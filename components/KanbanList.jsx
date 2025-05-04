import React, { useState, useEffect } from "react";

export default function KanbanList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("https://mocki.io/v1/9d9895f9-70eb-49d2-99f7-cb3dacca8a94")
      .then((res) => res.json())
      .then((data) => {
        if (data.response && data.data) {
          setTasks(data.data);
        }
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const statuses = [
    "Ready to Start",
    "In Progress",
    "Waiting for Review",
    "Done",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Ready to Start":
        return "bg-blue-600";
      case "In Progress":
        return "bg-yellow-500";
      case "Waiting for Review":
        return "bg-purple-600";
      case "Done":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusTasks = (status) =>
    tasks.filter((task) => {
      const normalized = task.status?.toLowerCase();
      if (status === "Ready to Start") return normalized === "ready to start";
      if (status === "In Progress") return normalized === "In Progress";
      if (status === "Waiting for Review") return normalized === "In Progress";
      if (status === "Done") return normalized === "done";
      return false;
    });

  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {statuses.map((status) => (
        <div
          key={status}
          className="bg-[#161b22] p-4 rounded-md w-80 min-w-[20rem]">
          <div className={`${getStatusColor(status)} px-4 py-2 rounded-t-md`}>
            <h3 className="font-medium text-white">
              {status} {getStatusTasks(status).length}
            </h3>
          </div>
          <div className="space-y-4">
            {getStatusTasks(status).map((task, index) => (
              <div
                key={index}
                className="bg-gray-800 text-white p-3 rounded shadow hover:shadow-lg transition">
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-400">{task.type}</p>
                <p className="text-xs mt-1">
                  Est. SP: {task["Estimated SP"]} | Actual SP:{" "}
                  {task["Actual SP"]}
                </p>
                <p className="text-xs mt-1 text-blue-300">{task.developer}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
