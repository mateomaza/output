import { useEffect, useState, useId } from 'react'
import './App.css';


function loadPosts(callback) {
  const xhr = new XMLHttpRequest()
  const method = 'GET'
  const url = 'http://localhost:8000/api/posts/'
  const responseType = 'json'
  xhr.responseType = responseType
  xhr.open(method, url)
  xhr.onload = function () {
    callback(xhr.response, xhr.status)
  }
  xhr.onerror = function (e) {
    console.log(e)
    callback({ 'message': 'The response was an error' }, 400)
  }
  xhr.send()
}

function Posts({ post }) {
  return <div className='my-5 py-5 border bg-white text-dark col-10 col-md-6 mx-auto'>
    <p>{post.id} - {post.content}</p>
  </div>
}


    function App() {

  const postId = useId()
    const [posts, setPosts] = useState([])


  useEffect(() => {
    const callback = (response, status) => {
      console.log(response, status)
      if (status === 200) {
      setPosts(response)
    }
    }
    loadPosts(callback)
  }, [])

    return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          {posts.map((post, index) => {
            return <Posts id={`${postId}-post`} post={post} key={index} />
          })}
        </div>

      </header>
    </div>
    );
}

    export default App;
