import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, toggleTask, removeTask } from './features/taskSlice';
import axios from 'axios';
import { Task as TaskType } from './features/taskSlice'; // Cambio de nombre del tipo

const Task: React.FC = () => {
  const [newTask, setNewTask] = useState<string>('');
  const tasks = useSelector((state: { tasks: { tasks: TaskType[] } }) => state.tasks.tasks); // Uso del nuevo nombre del tipo
  const dispatch = useDispatch();

  const handleAddTask = () => {
    if (newTask.trim()) {
      dispatch(addTask(newTask));
      setNewTask('');
    }
  };

  const handleToggleTask = (taskId: number) => {
    dispatch(toggleTask(taskId));
  };

  const handleRemoveTask = async (taskId: number) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${taskId}`);
      dispatch(removeTask(taskId));
    } catch (error) {
      console.error('Error removing task', error);
    }
  };

  return (
    <div className="task-container">
      <h1 className="text-purple-600">TO-DO List</h1>
      <div>
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>
      <ul className="task-list">
        {tasks.map(task => (
          <li
            key={task.id}
            className={`task ${task.completed ? 'completed' : ''}`}
            onClick={() => handleToggleTask(task.id)}
          >
            {task.task}
            <button onClick={() => handleRemoveTask(task.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Task;