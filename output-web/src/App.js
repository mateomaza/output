import React from "react";
import { Routes, Route } from "react-router-dom";
import { PostsComponent } from "./posts";
import { PersonalFeedComponent, GlobalFeedComponent } from "./feed";
import { ProfileComponent } from "./profiles";
import { PostDetail } from "./posts";
import ChatList from "./chat/chat-list";
import Chat from "./chat/chatbox";

const root = document.getElementById('root')

function App() {
  const rootProps = root.dataset;

  return (
    <div>
      <Routes>
        <Route path="/posts" element={<PostsComponent {...rootProps} />} />
        <Route path="/personal" element={<PersonalFeedComponent {...rootProps}/>} />
        <Route path="/global" element={<GlobalFeedComponent {...rootProps}/>} />
        <Route path="/profiles/:username" element={<ProfileComponent />} />
        <Route path="/posts/:postId" element={<PostDetail {...rootProps}/>} />
        <Route path="/chat" element={<ChatList {...rootProps} />} />
        <Route path="/chat/:chatId" element={<Chat {...rootProps} />} />
      </Routes>
    </div>
  );
}

export default App;
