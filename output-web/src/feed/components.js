import { useState, useEffect} from 'react'
import InfiniteScroll from 'react-infinite-scroller'

import { PostsList, PostForm, } from '../posts'
import { loadPosts, createPost } from '../lookup'

export function FeedComponent({ username, permission }) {

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
        loadPosts(callback)

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
            loadPosts(callback, next)
        }
    }
    return (
        <div>
            <PostForm onAdd={addPost} permission={permission} />
            <PostsList posts={posts} onRepost={handleRepost} username={username} />
            {next !== null && <InfiniteScroll
                children={''}
                pageStart={0}
                loadMore={handleNext}
                hasMore={true || false}
                loader={<div className="loader" key={0}>Loading ...</div>}>
            </InfiniteScroll>}
        </div>
    )
}