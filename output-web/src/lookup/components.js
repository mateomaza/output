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
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.setRequestHeader('X-CSRFToken', csrftoken)
    xhr.onload = function () {
        callback(xhr.response, xhr.status)
    }
    xhr.onerror = function () {
        callback({message: 'The request was an error'}, 400)
    }
    xhr.send(parsedData)
}

export function loadPosts(callback) {
    backendLookup('GET', '/posts/', callback)
}

export function createPost(newPost, callback) {
    backendLookup('POST', '/posts/create/', callback, newPost )
}

export function actionPost(id, action, callback) {
    const data =  {id: id, action: action}
    backendLookup('POST', '/posts/action/', callback, data )
}
