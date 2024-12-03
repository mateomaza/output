import React from "react";
import { PostsModel } from "../models";
import { loadFeed, loadGlobalFeed } from "../lookup";
import { Link } from "react-router-dom";

export function PersonalFeedComponent({ username, permission }) {
  return (
    <>
    <Link to="/movies">View Top Movies and TV Shows</Link>
    <PostsModel
      permission={permission}
      loadFunction={loadFeed}
      username={username}
    /></>
    
  );
}

export function GlobalFeedComponent({ username, permission }) {
  return (
    <>
      <h2 className="font7 mb-5">Posts with most likes ⭭</h2>
      <PostsModel
        permission={permission}
        loadFunction={loadGlobalFeed}
        noRepost
        hideForm
        username={username}
      />
    </>
  );
}
