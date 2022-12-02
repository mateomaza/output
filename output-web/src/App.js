import './App.css';
import { PostsComponent } from './posts/components';

const root = document.getElementById('root')

function App() {
  return <div className="App">
    <header className="App-header">
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <PostsComponent {...(root.dataset)}/>
    </header>
  </div>
}

export default App;
