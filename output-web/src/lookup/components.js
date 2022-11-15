export function loadPosts(callback) {
    const xhr = new XMLHttpRequest()
    const method = 'GET'
    const url = 'http://localhost:8000/api/posts/'
    const responseType = 'json'
    xhr.responseType = responseType
    xhr.open(method, url)
    xhr.onload = function () {
        callback(xhr.response, xhr.status)
    }
    xhr.onerror = function (e) {
        console.log(e)
        callback({ 'message': 'The response was an error' }, 400)
    }
    xhr.send()
}