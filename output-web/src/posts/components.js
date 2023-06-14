import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import { PostsModel } from '../models'
import { loadPosts, postAction, loadDetail } from '../lookup'
import { ProfileDisplay, ProfilePicture } from '../profiles'
import { DisplayCount, getCookie, Dropzone } from '../utils'


export function PostsComponent({ username, permission }) {
    return <PostsModel username={username} permission={permission} loadFunction={loadPosts} />
}

export function PostsList({ posts, current, onRepost }) {
    return (
        <div className='d-flex flex-column justify-content-evenly'>
            {posts.map((post) => {
                return <Post post={post} key={post.id} current={current} onRepost={onRepost} />
            })}
        </div>
    )
}

export function Post({ post, current, onRepost, isRepost, hideActions }) {

    const [data, setData] = useState(post)
    const path = window.location.pathname
    const match = path.match(/(?<post_id>\d+)/)
    const url_id = match !== null ? match.groups.post_id : null
    const isDetail = `${url_id}` === `${post.id}`

    if (post.original) {
        post.content = ''
    }
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
                <div className='d-flex justify-content-end p-1'>

                </div>
                {isRepost === true && <div className='border-bottom font5 mb-3'>Repost via <ProfileDisplay profile={post.profile} /></div>}
                <div>
                    <div className='d-flex mt-3'>
                        <ProfilePicture profile={post.profile} />
                        <p className='border-bottom font6'>
                            {isRepost === true ? `${post.profile.first_name} ${post.profile.last_name} ` : <ProfileDisplay profile={post.profile} includeName />}
                        </p>
                        {isRepost !== true && post.profile.username === current.username
                            && <DeleteButton post={post} />}
                    </div>
                    {post.content && <p className='my-5 mx-5 text-center font4'>{post.content}</p>}
                    {post.image && <img src={post.resized_image} alt='Post'></img>}
                    <Repost post={post} />
                </div>
                <div className='btn btn-group mb-3 col-12 d-flex justify-content-end'>
                    {(data && hideActions !== true) && <>
                        <Button post={data} action={'like'} onAction={handleAction} />
                        <Button post={data} action={'repost'} onAction={handleAction} />
                    </>}
                    {isDetail === false && isRepost && <button className='rounded font2' onClick={handlePostLink}>View</button>}
                </div>
            </div>
        </div>
    )
}


export function Repost({ post }) {
    const repostProps = {
        isRepost: true,
        hideActions: true,
        hideUsername: true,
        post: post.original,
        key: post.id
    }
    return post.is_repost === true ? <Post className={' '} {...repostProps} /> : null
}

export function Button({ post, action, onAction }) {

    const likes = post.likes ? post.likes : 0
    const likeClass = 'btn btn-primary btn-sm font2 rounded'
    const unlikeClass = 'btn btn-white btn-sm font2 border-dark rounded'
    const [buttonClass, setButtonClass] = useState((post && post.has_liked) ? likeClass : unlikeClass)

    const [showConfirmation, setShowConfirmation] = useState(false);

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
        if (action === 'repost') {
            setShowConfirmation(false)
        }
    }

    if (action === 'like' || action === 'unlike') {
        return <button className={buttonClass} onClick={handleClick}>
            <DisplayCount>{likes}</DisplayCount>
            &nbsp;{post.likes === 1 ? 'LIKE' : 'LIKES'}</button>

    } else if (action === 'repost') {
        return (
            <>
                {!showConfirmation && (
                    <button className='btn btn-white btn-sm font2 border-dark rounded ml-1' onClick={() => setShowConfirmation(true)}>REPOST</button>
                )}
                {showConfirmation && (
                    <dialog>
                        <p className='font6'>Are you sure you want to repost this?</p>
                        <button className='btn btn-white btn-sm font2 border-dark rounded mr-1' onClick={handleClick}>Yes</button>
                        <button className='btn btn-white btn-sm font2 border-dark rounded' onClick={() => setShowConfirmation(false)}>No</button>
                    </dialog>
                )}
            </>)
    }
}


export function DeleteButton({ post }) {

    const [showConfirmation, setShowConfirmation] = useState(false);
    const csrftoken = getCookie('csrftoken')

    const handleDelete = () => {
        axios.post(`http://localhost:8000/api/posts/${post.id}/delete/`, {
            headers: {
                'X-CSRFToken': csrftoken,
            }
        })
            .then(response => {
                setShowConfirmation(true);
                window.location.reload()
            })
            .catch(error => {
                console.log(error);
            });
    }
    return (
        <>
            {!showConfirmation && (
                <button className='btn btn-danger btn-sm font2 border-dark rounded ml-auto mr-2 mb-auto' onClick={() => setShowConfirmation(true)}>X</button>
            )}
            {showConfirmation && (
                <dialog>
                    <p className='font6'>Are you sure you want to delete this post?</p>
                    <button className='btn btn-white btn-sm font2 border-dark rounded mr-1' onClick={handleDelete}>Yes</button>
                    <button className='btn btn-white btn-sm font2 border-dark rounded' onClick={() => setShowConfirmation(false)}>No</button>
                </dialog>
            )}
        </>
    );
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
                    <div className='d-flex mb-5'>
                        <p className='align-self-center font7 text-white my-5'>280 characters maximum ⇢</p>
                        <textarea ref={inputRef} className='form-control mx-3 font4' name='post' style={{ height: '150px' }}></textarea>
                        <button type='submit' className='btn btn-primary mx-3 align-self-center font2' style={{ height: '60px' }}>Post</button>
                    </div>
                </form>
                <Dropzone></Dropzone>
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

    return post === null ? null : <div className='bg-dark'><Post post={post} className='text-center' /></div>
}