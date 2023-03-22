import { PostsModel } from "../models"
import { loadFeed, loadGlobalFeed } from '../lookup'


export function FeedComponent({ permission }) {
    return <PostsModel permission={permission} loadFunction={loadFeed} />
}

export function GlobalFeedComponent({ permission }) {
    return <>
        <h2 className="font text-white my-5">Posts with most likes ⭭</h2>
        <PostsModel permission={permission} loadFunction={loadGlobalFeed} noRepost hideForm />
    </>
}
