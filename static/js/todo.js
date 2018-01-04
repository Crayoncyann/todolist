const templateTodo = (d) => {
    let task = d.task
    let id = d.id
    let status = d.status
    let html = `
        <section data-id="${id}" data-status="${status}">
            <p class="p-todo">
                ${task}
            </p>
            <img src="icon/checkbox.png" class="todo-status">
        </section>
    `
    return html
}

const templateComp = (d) => {
    let task = d.task
    let id = d.id
    let status = d.status
    let html = `
        <section data-id="${id}" data-status="${status}">
            <p class="p-comp">
                ${task}
            </p>
            <img src="icon/checkbox2.png" class="todo-status">
        </section>
    `
    return html
}

const insertTodo = (d) => {
    let todoDiv = e('#list-todo')
    let compDiv = e('#list-comp')
    let html = templateTodo(d)
    if (d.status == false) {
        appendHTML(todoDiv, html)
    } else if (d.status == true) {
        appendHTML(compDiv, html)
    }
}

const insertTodos = (data) => {
    let todoDiv = e('#list-todo')
    let compDiv = e('#list-comp')
    data = JSON.parse(data)
    for (var i = 0; i < data.length; i++) {
        let d = data[i]
        insertTodo(d)
    }
}

const loadTodos = () => {
    apiTodoAll((data) => {
        // log 一下下
        log('所有的:', data)
        insertTodos(data)
    })
}

loadTodos()

// const actionReload = () => {
//     var reload = e('#todo-reload')
//     bindEvent(reload, 'click', () => {
//         log('click reload')
//         // 刷新页面
//         location.reload()
//     })
// }

const actionAdd = () => {
    let add = e('#todo-add')
    bindEvent(add, 'touchstart', () => {
        log('click add')
        e('aside').classList.toggle('dis')
    })
}

const actionExit = () => {
    let aside = e('aside')
    bindEvent(aside, 'touchstart', (e) => {
        let self = e.target
        log(self)
        if (self == aside) {
            aside.classList.toggle('dis')
        }
    })
}

const actionInput = () => {
    let submit = e('#todo-submit')
    bindEvent(submit, 'touchstart', () => {
        log('click submit')
        let input = e('#todo-input')
        let value = input.value
        if (value != '') {
            apiTodoAdd(value, (data) => {
                log('添加:', data)
                data = JSON.parse(data)
                insertTodo(data)
            })
            e('aside').classList.toggle('dis')
            input.value = ''
        } else {
            input.placeholder = ' plz create (´・ω・`) '
        }
    })
}

const actionAddTodo = () => {
    actionAdd()
    actionExit()
    actionInput()
}

actionAddTodo()

const actionComplete = () => {
    let bs = es('.todo-status')
    log(bs)
    for (var i = 0; i < bs.length; i++) {
        let b = bs[i]
        if (b.checked == true) {
            log('改了')
            let div = b.closest('section')
            let id = Number(div.dataset.id)
            apiTodoComplete(id, (d) => {
                log(d)
                div.remove()
                insertTodo(d)
            })
        }
    }
}

var time = setTimeout(() => {
    actionComplete()
}, 0)





// var actionDelete = () => {
//     var a = e('.todolist')
//     bindEvent(a, 'click', (event) => {
//         var self = event.target
//         if (self.classList.contains('option-delete')) {
//             log('click delete')
//             var b = self.closest('article')
//             var id = b.dataset.id
//             apiTodoDelete(id, (data) => {
//                 log('删除:', data)
//                 b.remove()
//             })
//         }
//     })
// }

// var actionOn = () => {
//     var a = e('.todolist')
//     bindEvent(a, 'click', (event) => {
//         var self = event.target
//         if (self.classList.contains('onoff-on')) {
//             var b = self.closest('article')
//             var id = b.dataset.id
//             apiTodoComplete(id, (data) => {
//                 log('状态变更:', data)
//                 var b = self.closest('article')
//                 var p = b.querySelector('.onoff-box')
//                 p.classList.toggle('option-onoff-active')
//                 // article添加active
//                 b.classList.add('article-active')
//                 // on按钮加上none
//                 self.classList.add('onoff-active')
//                 // off按钮变更
//                 var off = p.querySelector('.onoff-off')
//                 off.classList.toggle('onoff-active')
//             })
//         }
//     })
// }

// var actionOff = () => {
//     var a = e('.todolist')
//     bindEvent(a, 'click', (event) => {
//         log('click off')
//         var self = event.target
//         if (self.classList.contains('onoff-off')) {
//             var b = self.closest('article')
//             var id = b.dataset.id
//             apiTodoComplete(id, (data) => {
//                 log('状态改变', data)
//                 var b = self.closest('article')
//                 var p = b.querySelector('.onoff-box')
//                 p.classList.toggle('option-onoff-active')
//                 // article移除active
//                 b.classList.remove('article-active')
//                 // on按钮移除none
//                 var on = p.querySelector('.onoff-on')
//                 on.classList.remove('onoff-active')
//                 // off按钮变更none
//                 self.classList.toggle('onoff-active')
//             })
//         }
//     })
// }

// var actionComplete = () => {
//     actionOn()
//     actionOff()
// }

// var bindEventClass = () => {
//     actionReload()
//     actionAddData()
//     actionDelete()
//     actionComplete()
// }

// // 入口函数
// var __main = () => {
//     loadTodos()
//     bindEventClass()
// }
// __main()
