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
        const detail = xhr.response.detail
        if (xhr.status === 403 && detail === 'Authentication credentials were not provided.') {
            window.location.href = '/login?showLoginRequired=true'
        }
        callback(xhr.response, xhr.status)
    }
    xhr.onerror = function () {
        callback({ message: 'The request was an error' }, 400)
    }
    xhr.send(parsedData)
}

export function loadPosts(username, callback) {
    let endpoint = '/posts/'
    if (username) {
        endpoint = `/posts/?username=${username}`
    }
    backendLookup('GET', endpoint, callback)
}

export function loadDetail(post_id, callback) {
    backendLookup('GET', `/posts/${post_id}`, callback)
}

export function createPost(newPost, callback) {
    backendLookup('POST', '/posts/create/', callback, newPost)
}

export function postAction(post_id, content, action, callback, username) {
    const data = { id: post_id, content: content, action: action, username: username }
    backendLookup('POST', '/posts/action/', callback, data)
}