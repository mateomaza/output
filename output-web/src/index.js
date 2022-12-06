import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PostDetail } from './posts';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const detailElements = document.querySelectorAll('.post-detail')

detailElements.forEach(container => {
  root.render(
    <React.StrictMode>
      <PostDetail {...(container.dataset)} />
    </React.StrictMode>
  );
})
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
