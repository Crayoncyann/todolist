const templateTodo = (d) => {
    let content = d.content
    let id = d.id
    let status = d.status
    let html = `
        <section data-id="${id}" data-status="${status}" class="section-in">
            <img class="todo-check check-checked dis" src="icon/check.png" data-id="0">
            <p class="p-todo p-space-no" contentEditable="false">${content}</p>
            <img src="icon/checkbox.png" class="todo-status">
            <img src="icon/update.png" class="todo-update dis">
            <img class="todo-check check-delete" src="icon/delete.png"/>
        </section>
    `
    return html
}

const templateComp = (d) => {
    let content = d.content
    let id = d.id
    let status = d.status
    let html = `
        <section data-id="${id}" data-status="${status}" class="section-in">
            <img class="todo-check check-checked dis" src="icon/check.png" data-id="0">
            <p class="p-comp p-space-no" contentEditable="false">${content}</p>
            <img src="icon/checkbox2.png" class="todo-status">
            <img class="todo-check check-delete" src="icon/delete.png"/>
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
