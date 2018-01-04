const log = console.log.bind(console)

const e = (selector) => document.querySelector(selector)

const es = (selectors) => document.querySelectorAll(selectors)

const bindEvent = (element, eventName, callback) => element.addEventListener(eventName, callback)

const bindEvents = (elements, eventName, callback) => {
    for (const i = 0; i < elements.length; i++) {
        let e = elements[i]
        e.addEventListener(eventName, callback)
    }
}

const ajax = function(method, path, data, callback) {
    let r = new XMLHttpRequest()
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = () => {
        if (r.readyState == 4) {
            callback(r.response)
        }
    }
    data = JSON.stringify(data)
    r.send(data)
}

const appendHTML = (element, html) => element.insertAdjacentHTML('beforeend', html)
