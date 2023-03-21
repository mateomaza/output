import './App.css';
import { PostsComponent } from './posts';
import { FeedComponent } from './feed';
import { ProfilesComponent } from './profiles';

const root = document.getElementById('root')

function Posts() {
  return <div className="App">
    <div>
      <PostsComponent {...(root.dataset)} />
    </div>
  </div>
}

function Feed() {
  return <div className="App">
    <div className='bg-dark'>
      <FeedComponent {...(root.dataset)} />
    </div>
  </div>
}

function Profiles() {
  return <div className="App">
    <div>
      <ProfilesComponent {...(root.dataset)} />
      <PostsComponent {...(root.dataset)}/>
    </div>
  </div>
}

export { Posts, Feed, Profiles }
