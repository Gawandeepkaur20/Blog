import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import App from './App.jsx';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from "./Redux/store.js";
import 'react-quill/dist/quill.snow.css';
import { BlogProvider } from './context/BlogContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <Provider store={store}>
      <BrowserRouter>
      <BlogProvider>
        <App />
        </BlogProvider>
      </BrowserRouter>
    </Provider>
 
);

