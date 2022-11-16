import { useState, useEffect, useId, useRef } from 'react'

import { loadPosts } from '../lookup'


export function PostsComponent() {

    return (
        <div>
            <PostForm id={`${postId}-post`} posts={posts} setPosts={setPosts} />
            <PostsList />
        </div>
    )
}

export function PostsList() {

    const postId = useId()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const callback = (response, status) => {
            if (status === 200) {
                setPosts(response)
            }
        }
        loadPosts(callback)
    }, [])

    return posts.map((post, index) => {
        console.log(post)
        return <Post id={`${postId}-post`} post={post} key={index} />
    })
}





export function Post({ id, post }) {
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

export function Button({ post, display }) {

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

export function PostForm({ id, posts}) {

    const postId = useId()
    const [posts, setPosts] = useState([])
    const inputRef = useRef()

    const handleSubmit = (e) => {
        e.preventDefault()

        const content = inputRef.current.value

        if (!content) {
            alert('Nothing to post :(')
            return
        }
        const key = posts.length + 1
        const newPost = { id, content, key, likes: 0 }
        setPosts(...posts, newPost)

        inputRef.current.value = ''
    }


    return (
        <div className='col-12 mb-3'>
            <form onSubmit={handleSubmit}>
                <textarea ref={inputRef} className='form-control' name='post'>123</textarea>
                <button type='submit' className='btn btn-primary my-3'>Post</button>
            </form>
        </div>
    )
}

