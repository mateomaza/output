import { useState, useEffect, useId } from 'react'


import { loadPosts } from '../lookup'

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
    return (
        posts.map((post, index) => {
            return <Post id={`${postId}-post`} post={post} key={index} />
        })
    )
}

export function Post({ post }) {
    return (
        <div className='col-10 col-md-6 mx-auto my-5 py-5 border bg-white text-dark'>
            <p>{post.id} - {post.content}</p>
            <div className='btn btn-group'>
                <Button post={post} action='Like' />
                <Button post={post} action='Unlike' />
                <Button post={post} action='Repost' />
            </div>
        </div>
    )
}

export const Button = ({ post, action }) => {
    const [currentLikes, setLikes] = useState(post.likes)
    const [hasClicked, setClick] = useState(false)
    function updateLikes() {
        if (hasClicked === false) {
            setLikes((prevCount) => prevCount + 1)
            setClick(true)
        } else {
            setLikes((prevCount) => prevCount - 1)
            setClick(false)
        }
    }
    const display = action === 'Like' ? `${currentLikes} Likes` : action

    return <button className='btn btn-primary btn-sm' onClick={updateLikes}>{display}</button>
}
