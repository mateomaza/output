import { useState, useEffect} from 'react'

import { Post } from '../posts'
import { loadPosts } from '../lookup'

function FeedList({ onRepost, username }) {
    
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
        <>
            {posts.map((post) => {
                return <Post post={post} key={post.id} onRepost={onRepost} username={username} />
            })}
        </>
    )
}