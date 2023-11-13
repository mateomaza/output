import React from "react"
import { useParams } from "react-router-dom";
import { PostsModel } from "../models"
import { loadFeed, loadGlobalFeed } from '../lookup'


export function PersonalFeedComponent() {
    const { username, permission } = useParams();
    return <PostsModel permission={permission} loadFunction={loadFeed} username={username}/>
}

export function GlobalFeedComponent() {
    const { username, permission } = useParams();
    return <>
        <h2 className="font7 text-white mb-5">Posts with most likes ⭭</h2>
        <PostsModel permission={permission} loadFunction={loadGlobalFeed} noRepost hideForm username={username}/>
    </>
}
