const templateTodo = (d) => {
    let task = d.task
    let id = d.id
    let status = d.status
    let html = `
        <section data-id="${id}" data-status="${status}" class="section-in">
            <p class="p-todo">
                ${task}
            </p>
            <img src="icon/checkbox.png" class="todo-status">
            <img class="todo-delete" src="icon/delete.png"/>
        </section>
    `
    return html
}

const templateComp = (d) => {
    let task = d.task
    let id = d.id
    let status = d.status
    let html = `
        <section data-id="${id}" data-status="${status}" class="section-in">
            <p class="p-comp">
                ${task}
            </p>
            <img src="icon/checkbox2.png" class="todo-status">
            <img class="todo-delete" src="icon/delete.png"/>
        </section>
    `
    return html
}

const insertTodo = (d) => {
    let todoDiv = e('#list-todo')
    let html = templateTodo(d)
    appendHTML(todoDiv, html)
}

const insertComp = (d) => {
    let compDiv = e('#list-comp')
    let html = templateComp(d)
    appendHTML(compDiv, html)
}

const insertTodos = (data) => {
    data = JSON.parse(data)
    for (var i = 0; i < data.length; i++) {
        let d = data[i]
        if (d.status == false) {
            insertTodo(d)
        } else if (d.status == true) {
            insertComp(d)
        }
    }
}

// const actionReload = () => {
//     var reload = e('#todo-reload')
//     bindEvent(reload, 'click', () => {
//         log('click reload')
//         // 刷新页面
//         location.reload()
//     })
// }

// 统计每项有多少个
const actionInfo = (data) => {
    let todo = 0
    let comp = 0
    for (var i = 0; i < data.length; i++) {
        let d = data[i].status
        if (d == false) {
            todo += 1
        } else {
            comp += 1
        }
    }
    e('.list-status').innerHTML = ` 种草 ${todo} - 拔草 ${comp} `
}

// 桌面更新
const desktopShow = (data) => {
    if (data.length == 0) {
        e('.none-pageshow').classList.remove('dis')
        e('.list-line').classList.add('dis')
    } else {
        e('.list-line').classList.remove('dis')
        e('.none-pageshow').classList.add('dis')
    }
}

const todosInfo = () => {
    apiTodoAll((data) => {
        data = JSON.parse(data)
        desktopShow(data)
        actionInfo(data)
    })
}

// 添加
const actionAdd = () => {
    let add = e('#todo-add')
    bindEvent(add, 'touchstart', () => {
        e('aside').classList.toggle('dis')
    })
}

const actionExit = () => {
    let aside = e('aside')
    bindEvent(aside, 'touchstart', (e) => {
        let self = e.target
        if (self == aside) {
            aside.classList.toggle('dis')
        }
    })
}

const actionInput = () => {
    let submit = e('#todo-submit')
    bindEvent(submit, 'touchstart', () => {
        let input = e('#todo-input')
        let value = input.value
        if (value != '') {
            apiTodoAdd(value, (data) => {
                data = JSON.parse(data)
                insertTodo(data)
            })
            e('aside').classList.toggle('dis')
            input.value = ''
        } else {
            input.placeholder = ' plz create (´・ω・`) '
        }
        todosInfo()
    })
}

const actionAddTodo = () => {
    actionAdd()
    actionExit()
    actionInput()
}

// 状态更新
const completeAnimation = (div, d) => {
    let p = div.querySelector('p')
    p.classList.toggle('p-todo')
    p.classList.toggle('p-comp')
    div.classList.remove('section-in')
    let time = setTimeout(() => {
        div.classList.add('section-out')
    }, 500)
    bindEvent(div, 'animationend', () => {
        div.classList.remove('section-out')
        d = JSON.parse(d)
        if (d.status == false) {
            insertTodo(d)
        } else if (d.status == true) {
            insertComp(d)
        }
        div.remove()
    })
}

const actionComplete = () => {
    let main = e('main')
    bindEvent(main, 'touchstart', (e) => {
        let self = e.target
        if (self.classList.contains('todo-status')) {
            let div = self.closest('section')
            let id = Number(div.dataset.id)
            if (div.dataset.status == 'false') {
                apiTodoComplete(id, (d) => {
                    div.dataset.status = true
                    self.src = 'icon/checkbox2.png'
                    completeAnimation(div, d)
                })
            } else if (div.dataset.status == 'true') {
                apiTodoComplete(id, (d) => {
                    div.dataset.status = false
                    self.src = 'icon/checkbox.png'
                    completeAnimation(div, d)
                })
            }
        }
        todosInfo()
    })
}

// 删除
const actionTouchmove = () => {
    // 记录开始, 结束的坐标
    let startX = -1
    let startY = -1
    let endX = -1
    let endY = -1
    // result = 滑动状态, -1:静止, 0:右, 1:左
    let result = -1
    let main = e('main')
    bindEvent(main, 'touchstart', (e) => {
        if (e.target.closest('section') != null) {
            startX = e.changedTouches[0].pageX
            startY = e.changedTouches[0].pageY
        }
    })
    bindEvent(main, 'touchmove', (e) => {
        if (e.target.closest('section') != null) {
            endX = e.changedTouches[0].pageX
            endY = e.changedTouches[0].pageY
            let distanceX = endX-startX
            let distanceY = endY-startY
            if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX > 0) {
                result = 0
            } else if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX < 0) {
                result = 1
            }
        }
    })
    bindEvent(main, 'touchend', (e) => {
        if (e.target.closest('section') != null) {
            let self = e.target
            let div = self.closest('section')
            let del = div.querySelector('.todo-delete')
            if (result == 1 && !del.classList.contains('delete-show')) {
                del.classList.toggle('delete-show')
                result = -1
            } else if (result == 0 && del.classList.contains('delete-show')) {
                del.classList.toggle('delete-show')
                result = -1
            }
        }
    })
}

const actionDelete = () => {
    bindEvent(e('main'), 'touchstart', (e) => {
        if (e.target.classList.contains('todo-delete')) {
            let self = e.target
            let div = self.closest('section')
            let id = Number(div.dataset.id)
            apiTodoDelete(id, (d) => {
                div.classList.toggle('op')
                bindEvent(div, 'animationend', () => {
                    div.remove()
                })
                apiTodoAll((data) => {
                    data = JSON.parse(data)
                    desktopShow(data)
                })
            })
        }
        todosInfo()
    })
}



// 加载全部
const loadTodos = () => {
    apiTodoAll((data) => {
        insertTodos(data)
    })
}

// 应用
const actionClass = () => {
    actionAddTodo()
    actionComplete()
    actionTouchmove()
    actionDelete()
}

const __main = () => {
    loadTodos()
    todosInfo()
    actionClass()
}

__main()
