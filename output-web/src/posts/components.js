import { useState, useEffect, useId, useRef } from 'react'

import { loadPosts, createPost, postAction, postDetail } from '../lookup'

export function PostsComponent({ username, permission }) {

    const id = useId()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const callback = (response, status) => {
            if (status === 200) {
                setPosts(response)
            }
        }
        loadPosts(username, callback)

    }, [username])

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

    const handleRepost = (repost) => {
        setPosts([repost, ...posts])
    }

    return (
        <div>
            <PostForm onAdd={addPost} permission={permission} />
            <PostsList id={id} posts={posts} onRepost={handleRepost} />
        </div>
    )
}

function PostsList({ id, posts, onRepost }) {
    return (
        <>
            {posts.map((post, index) => {
                return <Post id={id} post={post} key={index} onRepost={onRepost} />
            })}
        </>
    )
}

function Post({ id, post, onRepost, hideActions }) {

    const [action, setAction] = useState(post)

    const handleAction = (newAction, status) => {
        if (status === 200) {
            setAction(newAction)
        } else if (status === 201 && onRepost) {
            onRepost(newAction)
        }
    }

    return (
        <div className='col-10 col-md-6 mx-auto my-5 py-5 border bg-white text-dark'>
            <div>
                <p>{id} - {post.content}</p>
                <Repost post={post} />
            </div>
            {(action && hideActions !== true) && <div className='btn btn-group'>
                <Button post={action} action={'like'} onAction={handleAction} />
                <Button post={action} action={'repost'} onAction={handleAction} />
            </div>}
        </div>
    )
}

function Repost({ post }) {
    return post.is_repost === true ? <div className='row'>
        <div className='col-11 mx-auto p-3 border rounded'>
            <p className='mb-0 text-muted small'>Repost</p>
            <Post className={' '} post={post.original} hideActions />
        </div>
    </div> : null
}

function Button({ post, action, onAction }) {

    const likes = post.likes ? post.likes : 0

    const handleBackend = (response, status) => {
        if ((status === 200 || status === 201) && onAction) {
            onAction(response, status)
        }
    }

    const handleClick = () => {
        postAction(post.id, post.content, action, handleBackend)
    }

    if (action === 'like') {
        return <button className='btn btn-primary btn-sm' onClick={handleClick}>
            {likes}&nbsp;Likes</button>

    } else if (action === 'repost') {
        return <button className='btn btn-primary btn-sm' onClick={handleClick}>Repost</button>
    }
}

function PostForm({ onAdd, permission }) {

    const inputRef = useRef()
    const canPost = permission === 'yes' ? true : false

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
        <>
            {canPost === true && <div className='col-12 mb-3'>
                <form onSubmit={handleSubmit}>
                    <textarea ref={inputRef} className='form-control' name='post'></textarea>
                    <button type='submit' className='btn btn-primary my-3'>Post</button>
                </form>
            </div>}
        </>
    )
}

export function PostDetail({id, className}) {
    const [lookup, setLookup] = useState(false)
    const [post, setPost] = useState(null)
    const handleLookup = (response, status) => {
        if (status === 200) {
            setPost(response)
        } else {
            alert('No post to show')
        }
    }
    useEffect(() => {
        if (lookup === false) {
            postDetail(id, handleLookup)
            setLookup(true)
        }
    }, [id, lookup, setLookup])
    return post === null ? null : <Post post={post} className={className}/>
}
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

