import React, { useState } from 'react';

interface Task {
  id: number;
  task: string;
  completed: boolean;
}

const TaskComponent: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTaskItem: Task = {
        id: Date.now(),
        task: newTask,
        completed: false,
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask('');
    }
  };

  const handleToggleTask = (taskId: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleRemoveTask = (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  return (
    <div className="task-container">
      <h1>TO-DO List</h1>
      <div>
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task ${task.completed ? 'completed' : ''}`}
            onClick={() => handleToggleTask(task.id)}
          >
            {task.task}
            <button onClick={(e) => {e.stopPropagation(); handleRemoveTask(task.id)}}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskComponent;