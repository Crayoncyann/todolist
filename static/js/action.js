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

/*
    *** 禁止滑动
    项目里没什么用, 就当学习了, 备份以后用
*/
// const banTouchmove = () => {
//     let clear = e('.check-clear')
//     if (!clear.classList.contains('dis')) {
//         let main = e('main')
//         bindEvent(main, 'touchmove', (e) => {
//             log(e.target)
//             e.preventDefault()
//             e.stopPropagation()
//         })
//     }
// }

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
    let aside = e('aside')
    bindEvent(add, 'touchstart', (e) => {
        aside.classList.toggle('dis')
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
    d = JSON.parse(d)
    let p = div.querySelector('p')
    p.classList.toggle('p-todo')
    p.classList.toggle('p-comp')
    div.classList.remove('section-in')
    // 经测试, 感觉 0.3秒 比较舒服, 0.5s 稍微有一点慢, 以后应该多看别人的实例
    let time = setTimeout(() => {
        div.classList.add('section-out')
    }, 300)
    bindEvent(div, 'animationend', () => {
        div.classList.remove('section-out')
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
    let clear = e('.check-clear')
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
        if (e.target.closest('section') != null && clear.classList.contains('dis')) {
            let self = e.target
            let div = self.closest('section')
            if (result == 1 && !div.classList.contains('delete-show')) {
                div.classList.toggle('delete-show')
                result = -1
            } else if (result == 0 && div.classList.contains('delete-show')) {
                div.classList.toggle('delete-show')
                result = -1
            }
        }
    })
}

const actionSingleDelete = () => {
    bindEvent(e('main'), 'touchstart', (e) => {
        if (e.target.classList.contains('check-delete')) {
            let self = e.target
            let div = self.closest('section')
            let id = Number(div.dataset.id)
            apiTodoDelete(id, () => {
                div.classList.toggle('op')
                bindEvent(div, 'animationend', () => {
                    div.remove()
                })
                todosInfo()
            })
        }
        todosInfo()
    })
}

// 批量删除
const checkDivExit = () => {
    let sections = es('section')
    for (var i = 0; i < sections.length; i++) {
        let s = sections[i]
        s.classList.toggle('checked-show')
        let check = s.querySelector('.check-checked')
        check.classList.toggle('dis')
        check.src = 'icon/check.png'
        check.dataset.id = 0
    }
    let clear = e('.check-clear')
    clear.classList.toggle('dis')
    let ok = e('#todo-clear-ok')
    ok.classList.add('letter-spac')
    ok.innerHTML = '删除'
    todosInfo()
}

const checkAnimation = () => {
    let menu = e('#todo-menu')
    bindEvent(menu, 'touchstart', (e) => {
        apiTodoAll((data) => {
            data = JSON.parse(data)
            if (data.length != 0) {
                checkDivExit()
            }
        })
    })
}

const actionCheck = (array) => {
    bindEvent(e('main'), 'touchstart', (e) => {
        let self = e.target
        let selfId = Number(self.dataset.id)
        let div = self.closest('section')
        if (self.classList.contains('check-checked')) {
            if (selfId == 1) {
                self.src = 'icon/check.png'
                _.pull(array, div)
            } else if (selfId == 0) {
                self.src = 'icon/check2.png'
                array.push(div)
            }
            self.dataset.id = (selfId + 1) % 2
        }
    })
}

const actionAllDelete = (array) => {
    let clear = e('#todo-clear-ok')
    bindEvent(clear, 'touchstart', () => {
        if (array.length == 0) {
            clear.classList.remove('letter-spac')
            clear.innerHTML = '(・`ω´･) 选一个'
        } else {
            for (var i = 0; i < array.length; i++) {
                let div = array[i]
                let id = div.dataset.id
                // 这里重复了, 应该提取出来 *******************
                apiTodoDelete(id, () => {
                    div.classList.toggle('op')
                    bindEvent(div, 'animationend', () => {
                        div.remove()
                    })
                    todosInfo()
                })
            }
            checkDivExit()
        }
    })
}

const actionCheckExit = () => {
    let exit = e('#todo-clear-exit')
    bindEvent(exit, 'touchstart', () => {
        checkDivExit()
    })
}

const actionClearTodo = () => {
    var result = []
    checkAnimation()
    actionCheck(result)
    actionAllDelete(result)
    actionCheckExit()
}

// 加载全部
const loadTodos = () => {
    apiTodoAll((data) => {
        insertTodos(data)
    })
}

// 更新
const todoEditShow = () => {
    let time = null
    let st = 2
    let et = 0
    // 一个定时器, 手指按住 1s 后, 文字才可编辑
    bindEvent(e('#list-todo'), 'touchstart', (e) => {
        if (e.target.classList.contains('p-todo')) {
            time = setInterval(() => {
                et += 1
            }, 500)
        }
    })
    bindEvent(e('#list-todo'), 'touchend', (e) => {
        clearInterval(time)
        if (e.target.classList.contains('p-todo')) {
            if (et - st >= 0) {
                e.target.contentEditable = 'true'
                e.target.classList.add('p-border')
                let div = e.target.closest('section')
                let update = div.querySelector('.todo-update')
                update.classList.toggle('dis')
                let p = div.querySelector('p')
                p.classList.remove('p-space-no')
                p.classList.add('p-space-pre')
            }
            et = 0
        }
    })
}

const todoUpdate = () => {
    bindEvent(e('main'), 'touchstart', (e) => {
        let div = e.target.closest('section')
        let p = div.querySelector('p')
        let value = p.innerText
        let id = Number(div.dataset.id)
        let update = div.querySelector('.todo-update')
        if (e.target.classList.contains('todo-update') && p.contentEditable == 'true') {
            if (value.length > 15) {
                let text = value
                p.innerText = 'input so long (,,•́ . •̀,,)'
                setTimeout(() => {
                    p.innerText = text
                }, 800)
            } else {
                apiTodoUpdate(id, value, (data) => {
                    data = JSON.parse(data)
                    div.remove()
                    insertTodo(data)
                })
                p.contentEditable = 'false'
                update.classList.toggle('dis')
                p.classList.remove('p-space-pre')
                p.classList.add('p-space-no')
            }
        }
    })
}

const actionUpdate = () => {
    todoEditShow()
    todoUpdate()
}

// 应用
const actionClass = () => {
    actionAddTodo()
    actionComplete()
    actionTouchmove()
    actionSingleDelete()
    actionClearTodo()
    actionUpdate()
}
