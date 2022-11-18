import { useState, useEffect, useId, useRef } from 'react'

import { createPost, loadPosts } from '../lookup'

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
            <p>{id} - {post.content}</p>
            <div className='btn btn-group'>
                <Button post={post} display='Likes' />
                <Button post={post} display='Unlike' />
                <Button post={post} display='Repost' />
            </div>
        </div>
    )
}

function Button({ post, display }) {

    const [currentLikes, setLikes] = useState(post.likes)
    const [hasLike, toggleLike] = useState(false)

    function likeUpdate() {
        if (hasLike === false) {
            setLikes((prevCount) => prevCount + 1)
            toggleLike(true)
        } else {
            setLikes((prevCount) => prevCount - 1)
            toggleLike(false)
        }
    }

    if (display === 'Likes') {
        return <button className='btn btn-primary btn-sm' onClick={likeUpdate}>{currentLikes}&nbsp;{display}</button>

    } else {
        return <button className='btn btn-primary btn-sm'>{display}</button>
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

