const apiTodoAll = (callback) => {
    let method = 'GET'
    let path = '/all'
    let data = {}
    ajax(method, path, data, callback)
}

const apiTodoAdd = (content, callback) => {
    let method = 'POST'
    let path = '/add'
    let data = {
        content,
        status: false,
    }
    ajax(method, path, data, callback)
}

const apiTodoDelete = (id, callback) => {
    let method = 'GET'
    let path = '/delete/' + id
    let data = {}
    ajax(method, path, data, callback)
}

const apiTodoComplete = (id, callback) => {
    let method = 'GET'
    let path = '/complete/' + id
    let data = {}
    ajax(method, path, data, callback)
}

const apiTodoUpdate = (id, content, callback) => {
    let method = 'POST'
    let path = '/update/' + id
    let data = {
        content,
        status: false,
        id,
    }
    log(data)
    ajax(method, path, data, callback)
}
