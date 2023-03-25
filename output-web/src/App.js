import './App.css';
import { PostsComponent } from './posts';
import { FeedComponent, GlobalFeedComponent } from './feed';
import { ProfileComponent } from './profiles';
/*import { ProfilePostsComponent } from './profiles/posts';*/

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

function GlobalFeed() {
  return <div className="App">
    <div className='bg-dark'>
      <GlobalFeedComponent {...(root.dataset)} />
    </div>
  </div>
}

function Profile() {
  return <div className="App">
    <div className='bg-dark'>
      <ProfileComponent {...(root.dataset)} />
    </div>
  </div>
}

export { Posts, Feed, GlobalFeed, Profile }
