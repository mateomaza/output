import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import reportWebVitals from './reportWebVitals';
import { Posts, Feed, GlobalFeed, Profile } from './App';
import { PostDetail } from './posts';


const root = ReactDOM.createRoot(document.getElementById("root"))


const posts = document.getElementById("posts")

if (posts) {
  root.render(
    <React.StrictMode>
      <Posts />
    </React.StrictMode>
  )
}

const global = document.getElementById("global")

if (global) {
  root.render(
    <React.StrictMode>
      <GlobalFeed />
    </React.StrictMode>
  )
}

const feed = document.getElementById("feed")



const profiles = document.getElementById("profiles")
const profileElements = document.querySelectorAll('.profile')

if (profiles) {
  profileElements.forEach((element) => {
    root.render(
      <React.StrictMode>
        <Profile {...(element.dataset)} />
      </React.StrictMode>
    );
  })
}

const detailElements = document.querySelectorAll('.post-detail')

detailElements.forEach((element) => {
  root.render(
    <React.StrictMode>
      <PostDetail {...(element.dataset)} />
    </React.StrictMode>
  );
})

if (feed) {
  root.render(
    <React.StrictMode>
      <Feed />
    </React.StrictMode>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
