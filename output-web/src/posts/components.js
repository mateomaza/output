import { useState, useEffect, useId, useRef } from 'react'

import { loadPosts, createPost, actionPost } from '../lookup'

export function PostsComponent() {

    const id = useId()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const callback = (response, status) => {
            if (status === 200) {
                setPosts(response)
            }
        }
        loadPosts(callback)

    }, [])

    const addPost = (content) => {
        const key = posts.length
        const newPost = { id, ...content, key }
        createPost(newPost, (response, status) => {
            if (status === 201) {
                setPosts([response, ...posts])
            } else {
                alert('An error has occured, please try again.')
            }
        })
    }

    return (
        <div>
            <PostForm onAdd={addPost} />
            {posts.map((post, index) => {
                return <Post id={id} post={post} key={index} />
            })}
        </div>
    )
}

function Post({ id, post }) {
    return (
        <div className='col-10 col-md-6 mx-auto my-5 py-5 border bg-white text-dark'>
            <div>
            <p>{id} - {post.content}</p>
            {post.original && <div><Post post={post}/></div>} 
            </div>
            <div className='btn btn-group'>
                <Button post={post} action={'like'} />
                <Button post={post} action={'repost'} />
            </div>
        </div>
    )
}

function Button({ post, action }) {

    const [currentLikes, setLikes] = useState(post.likes)
    // const [hasLiked, toggleLike] = useState(false)

    //const likeDisplay = post.likes === 1 ? 'Like' : 'Likes'
    //const [initialDisplay, toggleDisplay] = useState(likeDisplay)

    //function displayUpdate() {
        //if (currentLikes === 0 || (hasLiked === true && currentLikes === 2)) {
            //toggleDisplay('Like')
        
        //if (currentLikes === 1) {
            //toggleDisplay('Likes')
        //}
    //}

    const actionHandler = (response, status) => {
        if (action === 'like' && status === 200) {
            setLikes(response.likes)
        }

    }

    function handleClick() {
        actionPost(post.id, action, actionHandler)
    }

    if (action === 'like') {
        return <button className='btn btn-primary btn-sm' onClick={() => { handleClick()}}>
            {currentLikes}&nbsp;Likes</button>

    } else {
        return <button className='btn btn-primary btn-sm'>Repost</button>
    }
}

function PostForm({ onAdd }) {

    const inputRef = useRef()

    const handleSubmit = (e) => {
        e.preventDefault()

        const content = inputRef.current.value

        if (!content) {
            alert('Nothing to post :(')
            return
        }

        onAdd({ content })

        inputRef.current.value = ''
    }


    return (
        <div className='col-12 mb-3'>
            <form onSubmit={handleSubmit}>
                <textarea ref={inputRef} className='form-control' name='post'></textarea>
                <button type='submit' className='btn btn-primary my-3'>Post</button>
            </form>
        </div>
    )
}

