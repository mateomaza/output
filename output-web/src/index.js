import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css'
import { Posts, Feed} from './App';
import reportWebVitals from './reportWebVitals';
import { PostDetail } from './posts';

const posts = ReactDOM.createRoot(document.getElementById('posts'));

posts.render(
  <React.StrictMode>
    <Posts />
  </React.StrictMode>
);

const feed = ReactDOM.createRoot(document.getElementById('feed'));

feed.render(
  <React.StrictMode>
    <Feed />
  </React.StrictMode>
);

const detailRoot = ReactDOM.createRoot(document.getElementById('details'))
const detailElements = document.querySelectorAll('.post-detail')

detailElements.forEach((element) => {
  detailRoot.render(
    <React.StrictMode>
      <PostDetail {...(element.dataset)} />
    </React.StrictMode>
  );
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
