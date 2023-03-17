import './App.css';
import { PostsComponent } from './posts/components';
import { FeedComponent } from './feed';

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

export { Posts, Feed }
