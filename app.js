const fs = require('fs')

const express = require('express')

const bodyParser = require('body-parser')

// 只用来展示 SPA，没存 DB
// const loadDB = (filePath) => {
//     let content = fs.readFileSync(filePath, 'utf8')
//     let DB = JSON.parse(content)
//     return DB
// }

var todoList = []

const app = express()

app.use(bodyParser.json())

app.use(express.static('static'))

const sendHtml = (path, response) => {
    let options = {
        encoding: 'utf-8',
    }
    fs.readFile(path, options, (error, data) => {
        response.send(data)
    })
}

const sendJSON = (response, data) => {
    let r = JSON.stringify(data, null, 2)
    response.send(r)
}

// 路由
app.get('/', (request, response) => {
    let path = 'static/index.html'
    let options = {
        encoding: 'utf-8',
    }
    fs.readFile(path, options, (error, data) => {
        response.send(data)
    })
})

app.get('/all', (requrest, response) => {
    sendJSON(response, todoList)
})

const todoAdd = (form) => {
    if (todoList.length == 0) {
        form.id = 1
    } else {
        let lastTodo = todoList[todoList.length - 1]
        form.id = lastTodo.id + 1
    }
    todoList.push(form)
    return form
}

app.post('/add', (request, response) => {
    let form = request.body
    let todo = todoAdd(form)
    sendJSON(response, todo)
})

const todoDelete = (id) => {
    id = Number(id)
    var index = -1
    for (var i = 0; i < todoList.length; i++) {
        let t = todoList[i]
        if (t.id == id) {
            index = i
            break
        }
    }
    if (index > -1) {
        let t = todoList.splice(index, 1)[0]
        return t
    } else {
        return {}
    }
}

app.get('/delete/:id', (request, response) => {
    let id = request.params.id
    let todo = todoDelete(id)
    sendJSON(response, todo)
})

const todoCamplete = (id) => {
    id = Number(id)
    for (var i = 0; i < todoList.length; i++) {
        var t = todoList[i]
        if (t.id == id) {
            if (t.status == true) {
                t.status = false
                return t
            } else if (t.status == false) {
                t.status = true
                return t
            }
        }
    }
}

app.get('/complete/:id', (request, response) => {
    let id = request.params.id
    let todo = todoCamplete(id)
    sendJSON(response, todo)
})

// 监听 localhost:8000
const server = app.listen(8000, (...args) => {
    let host = server.address().address
    let port = server.address().port
    console.log(`应用实例，访问地址为 http://${host}:${port}`)
})
