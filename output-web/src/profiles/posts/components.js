import React from "react";
import { PostsModel } from "../../models";
import { loadProfilePosts } from "../../lookup";

export function ProfilePostsComponent({ username, permission }) {
    return <PostsModel username={username} permission={permission} loadFunction={loadProfilePosts} noRepost hideForm />
}