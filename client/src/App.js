import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  const [tasks, setTasks] = useState([]);

  const [editingTask, setEditingTask] =
    useState(null);

  const [search, setSearch] = useState("");

  const [filterStatus, setFilterStatus] =
    useState("All");

  const [filterPriority, setFilterPriority] =
    useState("All");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
  });

  // Fetch Tasks

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/tasks"
      );

      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle Form Input

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add Task

  const addTask = async () => {
    if (!formData.title) {
      alert("Please enter task title");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        formData
      );

      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
      });

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Task

  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/tasks/${id}`
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Toggle Status

  const toggleStatus = async (task) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        {
          status:
            task.status === "Pending"
              ? "Completed"
              : "Pending",
        }
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Update Task

  const updateTask = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${editingTask._id}`,
        editingTask
      );

      setEditingTask(null);

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Filter Tasks

  const filteredTasks = tasks.filter(
    (task) => {
      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === "All" ||
        task.status === filterStatus;

      const matchesPriority =
        filterPriority === "All" ||
        task.priority === filterPriority;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    }
  );

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>Task Management</h1>

        {/* Add Task Form */}

        <div className="form">
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={formData.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />

          <button onClick={addTask}>
            Add Task
          </button>
        </div>

        {/* Edit Task */}

        {editingTask && (
          <div className="edit-form">
            <h2>Edit Task</h2>

            <input
              type="text"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  title: e.target.value,
                })
              }
            />

            <textarea
              value={editingTask.description}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  description: e.target.value,
                })
              }
            />

            <select
              value={editingTask.priority}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  priority: e.target.value,
                })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <input
              type="date"
              value={
                editingTask.dueDate
                  ? editingTask.dueDate.substring(
                      0,
                      10
                    )
                  : ""
              }
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  dueDate: e.target.value,
                })
              }
            />

            <button onClick={updateTask}>
              Save Changes
            </button>
          </div>
        )}

        {/* Search & Filters */}

        <div className="filters">
          <input
            type="text"
            placeholder="Search Tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value)
            }
          >
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) =>
              setFilterPriority(e.target.value)
            }
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Tasks */}

        <div className="task-grid">
          {filteredTasks.map((task) => (
            <div
              className="task-card"
              key={task._id}
            >
              <div className="top">
                <span
                  className={`priority ${task.priority}`}
                >
                  {task.priority}
                </span>

                <span
                  className={`status ${task.status}`}
                >
                  {task.status}
                </span>
              </div>

              <h2>{task.title}</h2>

              <p>{task.description}</p>

              <p>
                Due:{" "}
                {task.dueDate
                  ? new Date(
                      task.dueDate
                    ).toLocaleDateString()
                  : "No Date"}
              </p>

              <div className="buttons">
                <button
                  onClick={() =>
                    toggleStatus(task)
                  }
                >
                  Toggle Status
                </button>

                <button
                  onClick={() =>
                    setEditingTask(task)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete"
                  onClick={() =>
                    deleteTask(task._id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;