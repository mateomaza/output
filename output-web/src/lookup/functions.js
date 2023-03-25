function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function backendLookup(method, endpoint, callback, data) {
    const parsedData = JSON.stringify(data)
    const xhr = new XMLHttpRequest()
    const url = `http://localhost:8000/api${endpoint}`
    const csrftoken = getCookie('csrftoken')
    xhr.responseType = 'json'
    xhr.open(method, url)
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf8")
    if (csrftoken) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
        xhr.setRequestHeader('X-CSRFToken', csrftoken)
    }
    xhr.onload = function () {
        if (xhr.status === 401) {
            window.location.href = '/login?showLoginRequired=true'
        }
        callback(xhr.response, xhr.status)
    }
    xhr.onerror = function () {
        callback({ message: 'The request was an error' }, 400)
    }
    xhr.send(parsedData)
}

export function loadPosts(callback, username, next) {
    let endpoint = '/posts'
    if (username) {
        endpoint = `/posts/?username=${username}`
    }
    if (next !== null && next !== undefined) {
        endpoint = next.replace('http://localhost:8000/api', '')
    }
    backendLookup('GET', endpoint, callback)
}

export function loadDetail(post_id, callback) {
    backendLookup('GET', `/posts/${post_id}`, callback)
}

export function createPost(content, callback) {
    backendLookup('POST', '/posts/create/', callback, content)
}

export function postAction(post_id, content, action, callback) {
    const data = { id: post_id, content: content, action: action }
    backendLookup('POST', '/posts/action/', callback, data)
}

export function loadFeed(callback, username, next) {
    username = null
    let endpoint = '/posts/feed'
    if (next !== null && next !== undefined) {
        endpoint = next.replace('http://localhost:8000/api', '')
    }
    backendLookup('GET', endpoint, callback)
}

export function loadGlobalFeed(callback, username, next) {
    username = null
    let endpoint = '/posts/feed/global'
    if (next !== null && next !== undefined) {
        endpoint = next.replace('http://localhost:8000/api', '')
    }
    backendLookup('GET', endpoint, callback)
}


export function loadProfile(callback, username) {
    backendLookup("GET", `/profiles/${username}`, callback)
}

export function loadProfilePosts(callback, username, next) {
    let endpoint = `/posts/${username}/profile`
    if (next !== null && next !== undefined) {
        endpoint = next.replace('http://localhost:8000/api', '')
    }
    backendLookup("GET", endpoint, callback)
}


export function profileFollow(action, username, callback) {
    const data = { action: `${action && action}`.toLowerCase() }
    backendLookup("POST", `/profiles/${username}/follow/`, callback, data)
}
