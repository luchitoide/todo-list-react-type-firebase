import React from "react";
import "./App.css";
import Task from "./Task";
import Auth from "./Auth";
import { Provider } from "react-redux";
import store from "./store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="flex justify-center h-full min-h-screen bg-gray-100">
        <div className="bg-white rounded shadow h-fit p-6 m-8 w-full lg:w-5/6 lg:max-w-xl">
          <div className="Auth">
            <Auth />
          </div>
          <div className="App">
            <Task />
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default App;
