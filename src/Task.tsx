import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTask,
  toggleTask,
  removeTask,
  loadUserTasks,
} from "./features/taskSlice";
import axios from "axios";
import { Task as TaskType } from "./features/taskSlice";
import { auth, db } from "./components/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore/lite";

const Task: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: { tasks: { isAuthenticated: boolean } }) =>
      state.tasks.isAuthenticated
  );

  const [newTask, setNewTask] = useState<string>("");
  const tasks = useSelector(
    (state: { tasks: { tasks: TaskType[] } }) => state.tasks.tasks
  );
  const dispatch = useDispatch();

  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const handleAddTask = async () => {
    if (newTask.trim()) {
      try {
        const userTasksCollection = collection(
          db,
          "users",
          auth.currentUser.uid,
          "tasks"
        );
        const newTaskDocRef = await addDoc(userTasksCollection, {
          task: newTask,
          completed: false, // Agregar el estado inicial como "false"
        });
        const newTaskId = newTaskDocRef.id;
        console.log(newTaskId);

        setNewTask(""); // Limpiar el campo de entrada
        dispatch(addTask({ id: newTaskId, task: newTask, completed: false }));
      } catch (error) {
        console.error("Error adding task to Firestore", error);
      }
    }
  };

  useEffect(() => {
    const loadTasksFromFirestore = async () => {
      try {
        const userTasksCollection = collection(
          db,
          "users",
          auth.currentUser.uid,
          "tasks"
        );
        const querySnapshot = await getDocs(userTasksCollection);
        const loadedTasks = [];
        const loadedCompletedTasks = []; // Nuevo array para almacenar las tareas completadas
        querySnapshot.forEach((doc) => {
          const taskData = doc.data();
          loadedTasks.push({
            id: doc.id,
            ...taskData,
          });
          if (taskData.completed) {
            loadedCompletedTasks.push(doc.id);
          }
        });
        setCompletedTasks(loadedCompletedTasks); // Actualizar el estado local de las tareas completadas
        dispatch(loadUserTasks(loadedTasks)); // Usa la acción loadUserTasks para cargar las tareas en el estado
      } catch (error) {
        console.error("Error loading tasks from Firestore", error);
      }
    };

    if (isAuthenticated) {
      loadTasksFromFirestore(); // Llama a la función para cargar las tareas desde Firestore
    }
  }, [isAuthenticated, dispatch]);

  const handleToggleTask = (taskId: number) => {
    dispatch(toggleTask(taskId));
  };

  const handleRemoveTask = async (taskId: number) => {
    try {
      // Eliminar la tarea del estado local a través de Redux
      dispatch(removeTask(taskId));

      // Eliminar la tarea de la base de datos de Firebase
      await deleteDoc(
        doc(
          db,
          "users",
          auth.currentUser.uid.toString(),
          "tasks",
          taskId.toString()
        )
      );
    } catch (error) {
      console.error("Error removing task from Firestore", error);
    }
  };

  const handleToggleDone = async (taskId: number) => {
    console.log(auth.currentUser.uid);
    console.log(taskId);

    try {
      const taskRef = doc(
        db,
        "users",
        auth.currentUser.uid.toString(),
        "tasks",
        taskId.toString()
      );
      // Actualizar el estado local de completedTasks primero
      if (completedTasks.includes(taskId)) {
        setCompletedTasks(completedTasks.filter((id) => id !== taskId));
      } else {
        setCompletedTasks([...completedTasks, taskId]);
      }

      // Luego, actualizar el estado en Firestore para reflejar el cambio
      await updateDoc(taskRef, {
        completed: !completedTasks.includes(taskId),
      });

      // Actualizar el estado local en Redux
      dispatch(toggleTask(taskId));
    } catch (error) {
      console.error("Error changing done", error);
    }
  };

  return (
    <div className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
      <div className="bg-white rounded shadow p-6 m-8 w-full lg:w-3/4 lg:max-w-lg">
        {isAuthenticated ? (
          <>
            <div className="mb-4">
              <h1 className="text-grey-darkest text-3xl mb-4">TO-DO List</h1>
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
                    key={task.id} // Agrega la prop key con el ID de la tarea
                    className={`task ${
                      task.completed ? "completed" : ""
                    } cursor-pointer py-2`}
                    onClick={() => handleToggleTask(task.id)}
                  >
                    <div className="flex mb-4 items-center">
                      <p
                        className={`w-full text-black ${
                          completedTasks.includes(task.id)
                            ? "line-through text-green-500"
                            : ""
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
          </>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-grey-darkest text-3xl mb-4">TO-DO List</h1>
              <p className="text-red-500 text-xl mb-4">
                You must log in first.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Task;
