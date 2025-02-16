import React, { useEffect, useState } from "react";
import { MoonIcon, PlusIcon } from "@heroicons/react/24/outline";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  // 从后端获取任务列表
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("未登录，请先登录");
        return;
      }
      try {
        const res = await fetch("http://127.0.0.1:5000/tasks", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setTasks(data);
        } else {
          alert(data.error || "获取任务失败");
        }
      } catch (error) {
        console.error("获取任务异常", error);
      }
    };

    fetchTasks();
  }, []);

  // 添加任务：调用后端 POST /tasks 接口
  const handleAddTask = async () => {
    if (!inputValue.trim()) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: inputValue })
      });
      const data = await res.json();
      if (res.ok) {
        setTasks([...tasks, data]);
        setInputValue("");
      } else {
        alert(data.error || "添加任务失败");
      }
    } catch (error) {
      console.error("添加任务异常", error);
    }
  };

  // 切换任务完成状态：调用后端 PUT /tasks/<task_id> 接口
  const handleToggleCompleted = async (taskId, currentStatus) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !currentStatus })
      });
      const data = await res.json();
      if (res.ok) {
        // 更新本地状态
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        );
        setTasks(updatedTasks);
      } else {
        alert(data.error || "更新任务失败");
      }
    } catch (error) {
      console.error("更新任务异常", error);
    }
  };

  // 删除任务：调用后端 DELETE /tasks/<task_id> 接口
  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:5000/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      } else {
        alert(data.error || "删除任务失败");
      }
    } catch (error) {
      console.error("删除任务异常", error);
    }
  };

  // 计算任务完成进度
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // 根据筛选状态过滤任务
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className={darkMode ? "dark bg-gray-900 min-h-screen" : "bg-gray-50 min-h-screen"}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 顶部：标题 + 月亮图标 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Todo List</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <MoonIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* 输入框 + 添加按钮 */}
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-md shadow-md px-4 py-2 mb-4">
          <input
            type="text"
            className="flex-1 outline-none bg-transparent dark:text-gray-100 placeholder-gray-400"
            placeholder="添加新的待办事项..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            onClick={handleAddTask}
            className="ml-2 bg-blue-500 text-white rounded-md px-3 py-2 flex items-center hover:bg-blue-600 transition"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            添加
          </button>
        </div>

        {/* 统计 + 进度条 */}
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-md px-4 py-2 mb-4 flex items-center justify-between">
          <div className="text-gray-700 dark:text-gray-200">总计: {totalTasks} 项</div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 dark:text-gray-200">{progress}%</span>
            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 筛选 Tab */}
        <div className="flex justify-around bg-white dark:bg-gray-800 rounded-md shadow-md px-4 py-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === "active"
                ? "bg-blue-500 text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            进行中
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === "completed"
                ? "bg-blue-500 text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            已完成
          </button>
        </div>

        {/* 任务列表 */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">暂无任务</p>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-md shadow-sm px-4 py-2"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleCompleted(task.id, task.completed)}
                    className="h-5 w-5 accent-blue-500"
                  />
                  <span className={task.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-100"}>
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-600 dark:hover:text-red-400"
                >
                  删除
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoList;
