import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import reportWebVitals from './reportWebVitals';
import { Posts, Feed, GlobalFeed, Profile } from './App';
import { PostDetail } from './posts';


const root = ReactDOM.createRoot(document.getElementById("root"))

const posts = document.getElementById('posts')
const feed = document.getElementById('feed')
const global = document.getElementById('global');
const profile = document.getElementById('profile')

if (posts) {
  root.render(
    <React.StrictMode>
      <Posts />
    </React.StrictMode>
  )
}

if (feed && !posts && !global && !profile) {
  root.render(
    <React.StrictMode>
      <Feed />
    </React.StrictMode>
  )
}

if (global && !feed && !posts && !profile) {
  root.render(
    <React.StrictMode>
      <GlobalFeed />
    </React.StrictMode>
  )
}

if (profile && !feed && !global && !posts) {
  root.render(
    <React.StrictMode>
      <Profile />
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
