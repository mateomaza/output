import './App.css';
import { PostsComponent } from './posts';
import { FeedComponent } from './feed';
import { ProfilesComponent } from './profiles';

const root = document.getElementById('root')

function Posts() {
  return <div className="App">
    <header className="App-header">
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <PostsComponent {...(root.dataset)} />
    </header>
  </div>
}

function Feed() {
  return <div className="App">
    <header className="App-header">
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <FeedComponent {...(root.dataset)} />
    </header>
  </div>
}

function Profiles() {
  return <div className="App">
    <header className="App-header">
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <ProfilesComponent {...(root.dataset)} />
    </header>
  </div>
}

export { Posts, Feed, Profiles }
