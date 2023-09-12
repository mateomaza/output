import { PostsModel } from "../models"
import { loadFeed, loadGlobalFeed } from '../lookup'


export function FeedComponent({ username, permission }) {
    return <PostsModel permission={permission} loadFunction={loadFeed} username={username}/>
}

export function GlobalFeedComponent({ username, permission }) {
    return <>
        <h2 className="font7 text-white mb-5">Posts with most likes ⭭</h2>
        <PostsModel permission={permission} loadFunction={loadGlobalFeed} noRepost hideForm username={username}/>
    </>
}
