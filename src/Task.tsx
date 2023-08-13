import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, toggleTask, removeTask } from "./features/taskSlice";
import axios from "axios";
import { Task as TaskType } from "./features/taskSlice";

const Task: React.FC = () => {
  const [newTask, setNewTask] = useState<string>("");
  const tasks = useSelector(
    (state: { tasks: { tasks: TaskType[] } }) => state.tasks.tasks
  );
  const dispatch = useDispatch();

  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      dispatch(addTask(newTask));
      setNewTask("");
    }
  };

  const handleToggleTask = (taskId: number) => {
    dispatch(toggleTask(taskId));
  };

  const handleRemoveTask = async (taskId: number) => {
    try {
      await axios.delete(
        `https://jsonplaceholder.typicode.com/todos/${taskId}`
      );
      dispatch(removeTask(taskId));
    } catch (error) {
      console.error("Error removing task", error);
    }
  };

  const handleToggleDone = (taskId: number) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter((id) => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  return (
    <div className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
      <div className="bg-white rounded shadow p-6 m-8 w-full lg:w-3/4 lg:max-w-lg">
        <div className="mb-4">
          <h1 className="text-purple-600 text-2xl mb-4">TO-DO List</h1>
          <div className="flex mt-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
              type="text"
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button
              onClick={handleAddTask}
              className="flex-no-shrink p-2 border-2 rounded text-teal border-black text-black hover:text-white bg-white hover:bg-black"
            >
              Add
            </button>
          </div>
        </div>
        <div className="mt-4">
        <ul className="">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`task ${
                task.completed ? "completed" : ""
              } cursor-pointer py-2`}
              onClick={() => handleToggleTask(task.id)}
            >
              <div className="flex mb-4 items-center">
                <p
                  className={`w-full text-black ${
                    completedTasks.includes(task.id) ? "line-through" : ""
                  }`}
                >
                  {task.task}
                </p>
                {completedTasks.includes(task.id) ? (
                  <button
                    className="flex-no-shrink p-2 ml-4 bg-white hover:bg-gray-500 text-gray-500 hover:text-white border-2 border-gray-500 py-1 px-2 rounded whitespace-nowrap"
                    onClick={() => handleToggleDone(task.id)}
                  >
                    Not Done
                  </button>
                ) : (
                  <button
                    className="flex-no-shrink p-2 ml-4 bg-white hover:bg-green-500 text-green-500 hover:text-white border-2 border-green-500 py-1 px-2 rounded"
                    onClick={() => handleToggleDone(task.id)}
                  >
                    Done
                  </button>
                )}
                <button
                  className="flex-no-shrink p-2 ml-4 bg-white hover:bg-red-500 text-red-500 hover:text-white border-2 border-red-500 py-1 px-2 rounded"
                  onClick={() => handleRemoveTask(task.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        </div>       
      </div>
    </div>
  );
};

export default Task;
