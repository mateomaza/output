import React from "react";
import { Routes, Route, Switch } from "react-router-dom";
import { PostsComponent } from './posts';
import { PersonalFeedComponent, GlobalFeedComponent } from './feed';
import { ProfileComponent } from './profiles';
import { PostDetail } from "./posts";
import ChatList from "./chat/chat-list";
import Chat from "./chat/chatbox";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/posts" element={<PostsComponent />} />
        <Route path="/personal" element={<PersonalFeedComponent />} />
        <Route path="/global" element={<GlobalFeedComponent />} />
        <Route path="/profiles/:profileId" element={<ProfileComponent />} />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Switch>
          <Route path="/" exact component={ChatList} />
          <Route path="/chat/:chatId" component={Chat} />
        </Switch>
      </Routes>
    </div>
  );
}

export default App;
