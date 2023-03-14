import { useState, useEffect, useId, useRef } from 'react'

import { loadPosts, createPost, postAction, loadDetail } from '../lookup'

export function PostsComponent({ username, permission }) {

    const post_id = useId()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const callback = (response, status) => {
            if (status === 200) {
                setPosts(response.results)
            }
        }
        loadPosts(username, callback)

    }, [username])

    const addPost = (content) => {
        const key = posts.length
        const newPost = { post_id, ...content, key }
        createPost(newPost, (response, status) => {
            if (status === 201) {
                setPosts([response.results, ...posts])
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
            <PostsList post_id={post_id} posts={posts} onRepost={handleRepost} username={username}/>
        </div>
    )
}

function PostsList({ post_id, posts, onRepost, username }) {
    return (
        <>
            {posts.map((post) => {
                return <Post post_id={post_id} post={post} key={post.id} onRepost={onRepost} username={username}/>
            })}
        </>
    )
}

function Post({ post, onRepost, hideActions, username }) {

    const [actionData, setAction] = useState(post)
    const path = window.location.pathname
    const match = path.match(/(?<post_id>\d+)/)
    const url_id = match !== null ? match.groups.post_id : null
    const isDetail = `${url_id}` === `${post.id}`

    const handleAction = (newAction, status) => {
        if (status === 200) {
            setAction(newAction)
        } else if (status === 201 && onRepost) {
            onRepost(newAction)
        }
    }
    const handleLink = () => {
        window.location.href = post.id
    }
    return (
        <div className='col-10 col-md-6 mx-auto my-5 py-5 border bg-white text-dark'>
            <div>
                <p>{post.id} - {post.content}</p>
                <Repost post={post} />
            </div>
            <div className='btn btn-group'>
                {(actionData && hideActions !== true) && <>
                    <Button data={actionData} action={'like'} onAction={handleAction} username={username}/>
                    <Button data={actionData} action={'repost'} onAction={handleAction} username={username}/>
                </>}
                {isDetail === false && <button onClick={handleLink}>View</button>}
            </div>
        </div>
    )
}

function Repost({ post }) {
    return post.is_repost === true ? <div className='row'>
        <div className='col-11 mx-auto p-3 border rounded'>
            <p className='mb-0 text-muted small'>Repost</p>
            <Post className={' '} post={post.original} key={post.id} hideActions />
        </div>
    </div> : null
}

function Button({ data, action, onAction, username }) {

    const likes = data.likes ? data.likes : 0
    const [likeDisplay, toggleDisplay] = useState(likes === 1 ? 'Like' : 'Likes')
    const [hasLiked, setLiked] = useState(false)

    const handleBackend = (response, status) => {
        if ((status === 200 || status === 201) && onAction) {
            onAction(response, status)
        }
    }
    const handleClick = () => {
        if (action === 'like') {
            setLiked(true)
        }
        if (action === 'like' && hasLiked === true) {
            action = 'unlike'
            setLiked(false)
        }
        postAction(data.id, data.content, action, handleBackend, username)
    }
    const handleDisplay = () => {
        if (!username) {
            return
        }
        if (likeDisplay === 'Like') {
            toggleDisplay('Likes')
        }
        if (likeDisplay === 'Likes' && likes === 0) {
            toggleDisplay('Like')
        }
        if (likeDisplay === 'Likes' && likes === 2 && hasLiked === true) {
            toggleDisplay('Like')
        }
    }
    if (action === 'like') {
        return <button className='btn btn-primary btn-sm' onClick={() => { handleClick(); handleDisplay(); }}>
            {likes}&nbsp;{likeDisplay}</button>

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

export function PostDetail({ id, className }) {

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
            loadDetail(id, handleLookup)
            setLookup(true)
        }
    }, [id, lookup, setLookup])

    return post === null ? null : <Post post={post} className={className} />
}

/*
const [initialAction, toggleAction] = useState(action)

    const [likesCount, setLikesCount] = useState(likes)
    const [hasLiked, toggleLike] = useState(false)

    function likeUpdate() {
        if (likes === 0 || (hasLiked === true && likes === 2)) {
            toggleDisplay('Like')
        }
        if (likes === 1) {
            toggleDisplay('Likes')
        }
    }

    
    const likeDisplay = data.likes === 1 ? 'Like' : 'Likes'
    const [initialDisplay, toggleDisplay] = useState(likeDisplay)

*/
