import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: number;
  task: string;
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
  isAuthenticated: boolean;
  isLoadingTasks: boolean;
}

const initialState: TaskState = {
  tasks: [],
  isAuthenticated: false,
  isLoadingTasks: false,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    toggleTask: (state, action: PayloadAction<number>) => {
      const taskId = action.payload;
      const task = state.tasks.find((task) => task.id === taskId);
      if (task) {
        task.completed = !task.completed;
      }
    },
    removeTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    setAuthentication(state, action) {
      state.isAuthenticated = action.payload;
    },
    loadUserTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
});

export const { addTask, toggleTask, removeTask, setAuthentication, loadUserTasks } = taskSlice.actions;

export default taskSlice.reducer;