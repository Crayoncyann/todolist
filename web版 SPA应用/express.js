// 引入
// node.js
var fs = require('fs')
// express app 实例
var express = require('express')
var app = express()
// body-parser
var bodyParser = require('body-parser')
// 把 todo 存到一个数组里
var todoList = []
/*
// 配置静态文件目录
app.use(express.static('文件名'))
*/
// 前端数据的解析(JSON获取数据)
app.use(bodyParser.json())
// log
var log = console.log.bind(console)
/*
    发送html文件
    编码：utf-8
    文件获取 fs.readFile(路径, 编码, callback(文件))
*/
var sendHtml = (path, response) => {
    var options = {
        encoding: 'utf-8',
    }
    fs.readFile(path, options, (error, data) => {
        // console.log(`读取的 html 文件 ${path} 内容是`, data)
        response.send(data)
    })
}
// JSON转义
var sendJSON = (response, data) => {
    var r = JSON.stringify(data, null, 2)
    response.send(r)
}
/*
// 定义一个首页 (用 get 定义一个给用户访问的网址)
// request 是浏览器发送的请求
// response 是我们要发给浏览器的响应
*/
// 获取所有
app.get('/', (request, response) => {
    // var path = 'index.html'
    // 主页
    var path = 'index.html'
    var options = {
        encoding: 'utf-8',
    }
    fs.readFile(path, options, (error, data) => {
        // log(`读取的 html 文件 ${path} 内容是`, data)
        // 用 response.send 函数返回数据给浏览器
        // log('data type', typeof data)
        response.send(data)
    })
    // sendHtml(path, response)
})
app.get('/all', (requrest, response) => {
    sendJSON(response, todoList)
})
// 添加
// todoAdd 参数是一个对象(表单) 作用：form.id的赋值
var todoAdd = (form) => {
    // form.id 的赋值方式，form为空赋值1，form不为空就递增
    if (todoList.length == 0) {
        form.id = 1
    } else {
        var lastTodo = todoList[todoList.length - 1]
        form.id = lastTodo.id + 1
    }
    todoList.push(form)
    return form
}
// post 获取body，添加id
app.post('/add', (request, response) => {
    var form = request.body
    var todo = todoAdd(form)
    sendJSON(response, todo)
})
// 删除form.id
var todoDelete = (id) => {
    id = Number(id)
    // 在 todoList 中找到 id 对应的数据, 删除掉
    var index = -1
    for (var i = 0; i < todoList.length; i++) {
        var t = todoList[i]
        if (t.id == id) {
            // 找到了
            index = i
            break
        }
    }
    // 判断 index 来查看是否找到了相应的数据
    if (index > -1) {
        // 找到了, 用 splice 函数删除
        // splice 函数返回的是包含被删除元素的数组
        // 所以要用 [0] 取出数据
        var t = todoList.splice(index, 1)[0]
        return t
    } else {
        // 没找到
        return {}
    }
}
app.get('/delete/:id', (request, response) => {
    // 动态路由的变量是通过 request.params.名字 的方式得到的
    // 变量类型永远是 string
    var id = request.params.id
    log('delete 路由', id, typeof id)
    var todo = todoDelete(id)
    sendJSON(response, todo)
})
// 更新状态
var todoCamplete = (id) => {
    id = Number(id)
    // 在 todoList 中找到 id 对应的数据
    for (var i = 0; i < todoList.length; i++) {
        var t = todoList[i]
        if (t.id == id) {
            // 找到了
            if (t.status == true) {
                t.status = false
                log('t', t)
                return t
            } else if (t.status == false) {
                t.status = true
                log('t', t)
                return t
            }
        }
    }
}
app.get('/complete/:id', (request, response) => {
    var id = request.params.id
    var todo = todoCamplete(id)
    sendJSON(response, todo)
})
/*
listen 函数
第一个参数是监听的端口(默认的端口是 80，1024 以下的端口是系统保留端口 -- 别用)
*/
var server = app.listen(8000, (...args) => {
    log('server', args, args.length)
    var host = server.address().address
    var port = server.address().port
    console.log(`应用实例，访问地址为 http://${host}:${port}`)
})
