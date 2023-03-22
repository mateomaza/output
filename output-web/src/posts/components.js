import { useState, useEffect, useRef } from 'react'

import { PostsModel } from '../models'
import { loadPosts, postAction, loadDetail } from '../lookup'
import { ProfileDisplay, ProfilePicture } from '../profiles'


export function PostsComponent({ username, permission }) {
    return <PostsModel username={username} permission={permission} loadFunction={loadPosts} />
}

export function PostsList({ posts, onRepost }) {
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
        <div className='mx-auto mt-2 mb-5 bg-white text-dark w-75 rounded'>
            <div className='border border-info rounded'>
                <div className='mb-3'>
                    {isRepost === true && <span className='border-bottom font5'>Repost via <ProfileDisplay profile={repostVia} /></span>}
                </div>
                <div>
                    <div className='d-flex p-3 mt-5'>
                        <ProfilePicture profile={post.profile} />
                        <p className='border-bottom font4'>
                            <ProfileDisplay profile={post.profile} includeName />
                        </p>
                    </div>
                    <p className='mt-3 mb-5 text-center font3'>{post.content}</p>
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
    const likeClass = 'btn btn-primary btn-sm font2'
    const unlikeClass = 'btn btn-white btn-sm font2 border-dark'
    const [buttonClass, setButtonClass] = useState((post && post.has_liked) ? likeClass : unlikeClass)

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
    const handleClick = () => {
        postAction(post.id, post.content, action, handleBackend)
        if (action === 'like') {
            setButtonClass(likeClass)
        }
        if (action === 'unlike') {
            setButtonClass(unlikeClass)
        }
    }

    if (action === 'like' || action === 'unlike') {
        return <div ><button className={buttonClass} onClick={handleClick}>
            {likes}&nbsp;{post.likes === 1 ? 'LIKE' : 'LIKES'}</button></div>

    } else if (action === 'repost') {
        return <div><button className='btn btn-primary btn-sm font2' onClick={handleClick}>REPOST</button></div>

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
                        <p className='align-self-center font text-white my-5'>280 characters maximum ⇢</p>
                        <textarea ref={inputRef} className='form-control mx-3' name='post' style={{ height: '150px' }}></textarea>
                        <button type='submit' className='btn btn-primary mx-3 align-self-center font2' style={{ height: '60px' }}>Post</button>
                    </div>
                </form>
            </div>}
        </>
    )
}

export function PostDetail({ id }) {

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

    return post === null ? null : <div className='bg-dark'><Post post={post} className='text-center bg-dark' /></div>
}