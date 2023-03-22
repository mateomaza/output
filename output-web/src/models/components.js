import { PostsList, PostForm, } from '../posts'

import { useState, useEffect } from 'react'

import { createPost } from '../lookup'

import InfiniteScroll from 'react-infinite-scroller'


export function PostsModel({ username, permission, loadFunction, noRepost, hideForm }) {

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
        loadFunction(callback, username)

    }, [username, loadFunction])

    const handleAdd = (content) => {
        createPost(content, (response, status) => {
            if (status === 201) {
                setPosts([response, ...posts])
            } else {
                alert('An error has occured, please try again.')
            }
        })
    }
    
    const handleRepost = (repost) => {
        if (!noRepost) {
            setPosts([repost, ...posts])
        }
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
            loadFunction(callback, next, username)
        }
    }
    return (
        <div>
            {!hideForm && <PostForm onAdd={handleAdd} permission={permission} />}
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