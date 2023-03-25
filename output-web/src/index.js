import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import reportWebVitals from './reportWebVitals';
import { Posts, Feed, GlobalFeed, Profile } from './App';
import { PostDetail } from './posts';


const root = ReactDOM.createRoot(document.getElementById("root"))
const profiles = ReactDOM.createRoot(document.getElementById("profiles"))

const posts = document.getElementById('posts')

if (posts && !profiles) {
  root.render(
    <React.StrictMode>
      <Posts />
    </React.StrictMode>
  )
}


const feed = document.getElementById('feed')

if (feed && !profiles) {
  root.render(
    <React.StrictMode>
      <Feed />
    </React.StrictMode>
  )
}


const global = document.getElementById('global');

if (global && !profiles) {
  root.render(
    <React.StrictMode>
      <GlobalFeed />
    </React.StrictMode>
  )
}


const detailElements = document.querySelectorAll('.post-detail')

detailElements.forEach((element) => {
  root.render(
    <React.StrictMode>
      <PostDetail {...(element.dataset)} />
    </React.StrictMode>
  );
})




profiles.render(
  <React.StrictMode>
    <Profile {...(root.dataset)} />
  </React.StrictMode>
)





// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
