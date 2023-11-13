import { PostsList, PostForm } from "../posts";
import React, { useState, useEffect } from "react";
import { createPost, currentProfile } from "../lookup";
import InfiniteScroll from "react-infinite-scroller";

export function PostsModel({
  username,
  permission,
  loadFunction,
  noRepost,
  hideForm,
}) {
  const [posts, setPosts] = useState([]);
  const [next, setNext] = useState(null);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const callback = (response, status) => {
      if (status === 200) {
        setPosts(response.results);
        setNext(response.next);
      }
      if (status === 202) {
        setCurrent(response);
      }
    };
    loadFunction(callback, username);
    currentProfile(callback)
  }, [username, loadFunction]);

  const handleAdd = (data) => {
    createPost(data, (response, status) => {
      if (status === 201) {
        setPosts([response, ...posts]);
      } else {
        alert("An error has occured, please try again.");
      }
    });
  };
  const handleRepost = (repost) => {
    if (!noRepost) {
      setPosts([repost, ...posts]);
    }
  };
  const handleNext = () => {
    if (next !== null) {
      const callback = (response, status) => {
        if (status === 200) {
          const nextPosts = [...posts].concat(response.results);
          setNext(response.next);
          setPosts(nextPosts);
        } else {
          alert("An error has occured, please try again.");
        }
      };
      loadFunction(callback, username, next);
    }
  };
  return (
    <div>
      {!hideForm && <PostForm onAdd={handleAdd} permission={permission} />}
      <PostsList posts={posts} current={current} onRepost={handleRepost} />
      {next !== null && (
        <InfiniteScroll
          children={""}
          pageStart={0}
          loadMore={handleNext}
          hasMore={true || false}
          loader={<div className="loader" key={0}></div>}
        ></InfiniteScroll>
      )}
    </div>
  );
}
