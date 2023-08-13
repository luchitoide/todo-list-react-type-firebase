import React from 'react';
import './App.css';
import Task from './Task';
import { Provider } from 'react-redux';
import store from './store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <Task />
      </div>
    </Provider>
  );
}

export default App;