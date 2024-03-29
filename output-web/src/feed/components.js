import React from "react";
import { PostsModel } from "../models";
import { loadFeed, loadGlobalFeed } from "../lookup";

export function PersonalFeedComponent({ username, permission }) {
  return (
    <PostsModel
      permission={permission}
      loadFunction={loadFeed}
      username={username}
    />
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
