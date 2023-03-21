import { useState, useEffect, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroller'

import { loadPosts, createPost, postAction, loadDetail } from '../lookup'
import { ProfileDisplay, ProfilePicture } from '../profiles'


export function PostsComponent({ username, permission }) {

    const [posts, setPosts] = useState([])
    const [next, setNext] = useState(null)

    useEffect(() => {
        const callback = (response, status) => {
            if (status === 200) {
                setPosts(response.results)
                setNext(response.next)
            } else {
                alert('An error has occured, please try again.')
            }
        }
        loadPosts(username, callback)

    }, [username])

    const addPost = (content) => {
        createPost(content, (response, status) => {
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
    const handleNext = () => {
        if (next !== null) {
            const callback = (response, status) => {
                if (status === 200) {
                    const nextPosts = [...posts].concat(response.results)
                    setNext(response.next)
                    setPosts(nextPosts)
                } else {
                    alert('An error has occured, please try again.')
                }
            }
            loadPosts(username, callback, next)
        }
    }
    return (
        <div>
            <PostForm onAdd={addPost} permission={permission} />
            <PostsList posts={posts} onRepost={handleRepost} />
            {next !== null && <InfiniteScroll
                children={''}
                pageStart={0}
                loadMore={handleNext}
                hasMore={true || false}
                loader={<div className='loader' key={0}>Loading ...</div>}>
            </InfiniteScroll>}
        </div>
    )
}

export function PostsList({ posts, onRepost}) {
    return (
        <div className='d-flex flex-column justify-content-evenly'>
            {posts.map((post) => {
                return <Post post={post} key={post.id} onRepost={onRepost} />
            })}
        </div>


    )
}

export function Post({ post, onRepost, isRepost, hideActions, repostVia }) {

    const [data, setData] = useState(post)
    const path = window.location.pathname
    const match = path.match(/(?<post_id>\d+)/)
    const url_id = match !== null ? match.groups.post_id : null
    const isDetail = `${url_id}` === `${post.id}`

    const handleAction = (response, status) => {
        if (status === 200) {
            setData(response)
        }
        if (status === 201 && onRepost) {
            onRepost(response)
        }
    }
    const handlePostLink = () => {
        window.location.href = post.id
    }
    return (
        <div className='mx-auto mt-2 mb-5 bg-white text-dark w-75'>
            <div className='border border-dark'>
                <div className='mb-3'>
                    {isRepost === true && <span className='border-bottom'>Repost via <ProfileDisplay profile={repostVia}/></span>}
                </div>
                <div>
                    <div className='d-flex p-3'>
                        <ProfilePicture profile={post.profile} />
                        <p className='border-bottom'>
                            <ProfileDisplay profile={post.profile} includeName />
                        </p>
                    </div>
                    <p className='mt-3 mb-5 text-center'>{post.content}</p>
                    <Repost post={post} repostVia={post.profile} />
                </div>
                <div className='btn btn-group mb-3'>
                    {(data && hideActions !== true) && <>
                        <Button post={data} action={'like'} onAction={handleAction} />
                        <Button post={data} action={'repost'} onAction={handleAction} />
                    </>}
                    {isDetail === false && <button className='align-end' onClick={handlePostLink}>View</button>}
                </div>
            </div>
        </div>
    )
}

export function Repost({ post, repostVia }) {
    const repostProps = {
        isRepost: true,
        hideActions: true,
        repostVia: repostVia,
        post: post.original,
        key: post.id

    }
    return post.is_repost === true ? <Post className={' '} {...repostProps} /> : null
}

export function Button({ post, action, onAction }) {

    const likes = post.likes ? post.likes : 0

    if (action === 'like') {
        action = (post && post.has_liked) ? 'unlike' : 'like'
    }

    const handleBackend = (response, status) => {
        if (status === 200 && onAction) {
            onAction(response, status)
        }
        if (status === 201 && onAction) {
            onAction(response, status)
        }
    }
    const handleClick = () => postAction(post.id, post.content, action, handleBackend)

    if (action === 'like' || action === 'unlike') {
        return <button className='btn btn-primary btn-sm' onClick={handleClick}>
            {likes}&nbsp;{post.likes === 1 ? 'Like' : 'Likes'}</button>

    } else if (action === 'repost') {
        return <button className='btn btn-primary btn-sm' onClick={handleClick}>Repost</button>

    }
}

export function PostForm({ onAdd, permission }) {

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
            {canPost === true && <div className='col-12 mx-auto mb-3 p-5' style={{ width: '800px' }}>
                <form onSubmit={handleSubmit}>
                    <div className='d-flex'>
                        <p className='align-self-center text-white fw-bolder'>280 characters maximum ⇢</p>
                        <textarea ref={inputRef} className='form-control mx-3' name='post' style={{ height: '150px' }}></textarea>
                        <button type='submit' className='btn btn-primary mx-3 align-self-center' style={{ height: '60px' }}>Post</button>
                    </div>
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

    return post === null ? null : <Post post={post} className='text-center' />
}