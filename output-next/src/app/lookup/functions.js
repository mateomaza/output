import { getCookie } from "../utils";
import axios from "axios";

function backendLookup(method, endpoint, callback, data) {
  const parsedData = JSON.stringify(data);
  const xhr = new XMLHttpRequest();
  const url = `http://localhost:8000/api${endpoint}`;
  const csrftoken = getCookie("csrftoken");
  xhr.responseType = "json";
  xhr.open(method, url);
  xhr.setRequestHeader("Content-Type", "multipart/form-data");
  if (csrftoken) {
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
  }
  xhr.onload = function () {
    if (xhr.status === 401) {
      window.location.href = "/login?showLoginRequired=true";
    }
    callback(xhr.response, xhr.status);
  };
  xhr.onerror = function () {
    callback({ message: "The request was an error" }, 400);
  };
  xhr.send(parsedData);
}

function postLookup(method, endpoint, callback, data) {
  const url = `http://localhost:8000/api${endpoint}`;
  const csrftoken = getCookie("csrftoken");
  const headers = {
    "Content-Type": "multipart/form-data",
    "X-Requested-With": "XMLHttpRequest",
    "X-CSRFToken": csrftoken,
  };
  const formData = new FormData();
  if (data.id) {
    formData.append("id", data.id);
  }
  if (data.content) {
    formData.append("content", data.content);
  }
  if (data.image) {
    formData.append("image", data.image);
  }
  if (data.action) {
    formData.append("action", data.action);
  }
  console.log(data.likes);
  formData.append("likes", data.likes);

  axios({
    method: method,
    url: url,
    headers: headers,
    data: formData,
  })
    .then((response) => {
      console(formData);
      callback(response.data, response.status);
    })
    .catch((error) => {
      callback({ message: "The request was an error" }, 400);
    });
}

export function loadPosts(callback, username, next) {
  let endpoint = "/posts";
  if (username) {
    endpoint = `/posts/?username=${username}`;
  }
  if (next !== null && next !== undefined) {
    endpoint = next.replace("http://localhost:8000/api", "");
  }
  backendLookup("GET", endpoint, callback);
}

export function loadDetail(post_id, callback) {
  backendLookup("GET", `/posts/${post_id}`, callback);
}

export function createPost(data, callback) {
  postLookup("POST", "/posts/create/", callback, data);
}

export function postAction(data, callback) {
  console.log(data);
  postLookup("POST", "/posts/action/", callback, data);
}

export function loadFeed(callback, username, next) {
  username = null;
  let endpoint = "/posts/feed";
  if (next !== null && next !== undefined) {
    endpoint = next.replace("http://localhost:8000/api", "");
  }
  backendLookup("GET", endpoint, callback);
}

export function loadGlobalFeed(callback, username, next) {
  username = null;
  let endpoint = "/posts/feed/global";
  if (next !== null && next !== undefined) {
    endpoint = next.replace("http://localhost:8000/api", "");
  }
  backendLookup("GET", endpoint, callback);
}

export function loadProfile(callback, username) {
  backendLookup("GET", `/profiles/${username}`, callback);
}

export function loadProfilePosts(callback, username, next) {
  let endpoint = `/posts/${username}/profile`;
  if (next !== null && next !== undefined) {
    endpoint = next.replace("http://localhost:8000/api", "");
  }
  backendLookup("GET", endpoint, callback);
}

export function profileFollow(action, username, callback) {
  const data = { action: `${action && action}`.toLowerCase() };
  backendLookup("POST", `/profiles/${username}/follow/`, callback, data);
}

export function currentProfile(callback) {
  backendLookup("GET", "/profiles/request/current", callback);
}
