function deepClone(origin, target) {
    // cannot be undefined
    var target = target || {},
        toStr = Object.prototype.toString,
        arrStr = '[object Array]'
    for (var prop in origin) {
        if (origin.hasOwnProperty(prop)) {
            if (origin[prop] !== 'null' && typeof origin[prop] == 'object') {
                // if (toStr.call(origin[prop]) === arrStr) {
                //   target[prop] = [];
                // } else {
                //   target[prop] = {};
                // }
                target[prop] = toStr.call(origin[prop]) == arrStr ? [] : {}
                deepClone(origin[prop], target[prop])
            } else {
                target[prop] = origin[prop]
            }
        }
    }
    return target
}

function checkType(target) {
    var ret = typeof target
    var template = {
        '[object Array]': 'array - object',
        '[object Object]': 'object - object',
        '[object Number]': 'number - object',
        '[object String]': 'string - object',
        '[object Boolean]': 'boolean - object',
    }

    if (target === null) {
        return 'null'
    } else if (ret == 'object') {
        // Object.prototype.toString
        // 包裝類別, new Number()
        var str = Object.prototype.toString.call(target)
        return template[str]
    } else {
        return ret
    }
}

/**
 * Convert strings into lowercase-hyphen
 *
 * @param  {String} str
 * @return {String}
 */
function hyphenCase(str) {
    str = str.replace(/[^\w\s\-]/gi, '')
    str = str.replace(/([A-Z])/g, function ($1) {
        return '-' + $1.toLowerCase()
    })

    return str.replace(/\s/g, '-').replace(/^-+/g, '')
}

/**
 * convert a hyphenated string to camelCase
 * @param  {String} str
 * @return {String}
 */
function camelCase(str) {
    var strR = str.replace(/-([a-z])/g, (m, w) => w.toUpperCase())
    return strR
}

// 取得視窗滾動的位置
function getScrollOffset() {
    if (window.pageXOffset) {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset,
        }
    } else {
        return {
            x: document.body.scrollLeft + document.documentElement.scrollLeft,
            y: document.body.scrollTop + document.documentElement.scrollTop,
        }
    }
}

function getViewportOffset() {
    if (window.innerWidth) {
        return {
            w: window.innerWidth,
            h: window.innerHeight,
        }
    } else {
        if (document.compatMode === 'BackCompat') {
            return {
                w: document.body.clientWidth,
                h: document.body.clientHeight,
            }
        } else {
            return {
                w: document.documentElement.clientWidth,
                h: document.documentElement.clientHeight,
            }
        }
    }
}

function getPosition(element) {
    var x = 0
    var y = 0
    while (element) {
        x += element.offsetLeft - element.scrollLeft + element.clientLeft
        y += element.offsetTop - element.scrollLeft + element.clientTop
        element = element.offsetParent
    }

    return { x: x, y: y }
}

function addEvent(elems, type, fn) {
    if (elems.addEventListener) {
        elems.addEventListener(type, fn, false)
    } else if (elems.attachEvent) {
        // ie
        elems.attachEvent('no' + type, function () {
            fn.call(elems)
        })
    } else {
        elems['on' + type] = fn
    }
}

// Restricts input for the given textbox to the given inputFilter.
// 篩選input值
// https://jsfiddle.net/emkey08/zgvtjc51
function setInputFilter(textbox, inputFilter) {
    ;[
        'input',
        'keydown',
        'keyup',
        'mousedown',
        'mouseup',
        'select',
        'contextmenu',
        'drop',
    ].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value
                this.oldSelectionStart = this.selectionStart
                this.oldSelectionEnd = this.selectionEnd
            } else if (this.hasOwnProperty('oldValue')) {
                this.value = this.oldValue
                this.setSelectionRange(
                    this.oldSelectionStart,
                    this.oldSelectionEnd
                )
            } else {
                this.value = ''
            }
        })
    })
}

function stopBubble(event) {
    if (event.stopPropagation) {
        event.stopPropagation()
    } else {
        // ie9 以下
        event.cancelBubble = true
    }
}

function cancelHandler(event) {
    if (event.preventDefault) {
        event.preventDefault()
    } else {
        // ie9 以下
        event.returnValue = false
    }
}

// 取得DOM的style
function getStyle(elem, prop) {
    if (window.getComputedStyle) {
        // ie 11 以下去計算長寬會剪去padding....
        return window.getComputedStyle(elem, null)[prop]
    } else {
        // ie 8以下
        return elem.currentStyle[prop]
    }
}

function buildDom(
    domName = '',
    child = null,
    {
        classList = [],
        functionArray = {},
        attrs = {},
        textContent = '',
        id = '',
        style = {},
    } = {}
) {
    let dom = document.createElement(domName)
    if (classList && classList.length > 0) {
        classList.forEach((name) => {
            dom.classList.add(name)
        })
    }

    if (functionArray && Object.keys(functionArray).length > 0) {
        for (let key in functionArray) {
            addEvent(dom, key, functionArray[key])
        }
    }

    if (textContent && textContent !== '') {
        dom.textContent = textContent
    }

    if (attrs && Object.keys(attrs).length > 0) {
        for (let key in attrs) {
            dom[key] = attrs[key]
        }
    }

    if (id) {
        dom.id = id
    }

    for (let key in style) {
        if (style.hasOwnProperty(key)) {
            dom.style[key] = style[key]
        }
    }

    // child
    if (child != null) {
        if (Array.isArray(child)) {
            child.forEach((child) => {
                if (child instanceof HTMLElement) {
                    dom.appendChild(child)
                }
            })
        } else if (checkType(child).indexOf('string') != -1) {
            dom.innerHTML = child
        } else {
            throw new Error(`this child :${child} do not match any valid type`)
        }
    }

    return dom
}

// 確認某一個js加載完, 執行裡面的function
function loadScript(url, callback) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    if (script.readyState) {
        // ie
        script.onreadystatecgange = function () {
            if (
                script.readyState == 'complete' ||
                script.readyState == 'loaded'
            ) {
                // callback();
                tools[callback]()
            }
        }
    } else {
        // safari chrome firefox opera
        script.onload = function () {
            // callback();
            tools[callback]()
        }
    }
    script.src = url
    document.head.appendChild(script)
}

/* 
	上方的loadScript要這樣使用, 如果直接寫callback會報錯
	loadScript("demo.js", function(){
		callback();
	})

	ex: demo.js
	var tools = {
		test: function(){
			console.log("test");
		},
		demo: function(){
			console.log("demo");
		}
	}
*/

function fixForEach() {
    if ('NodeList' in window && !NodeList.prototype.forEach) {
        // console.info('polyfill for IE11')
        NodeList.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || window
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this)
            }
        }
    }
}

function uuid() {
    return Math.random().toString(16).slice(2)
}

function sleep(miliseconds) {
    var currentTime = new Date().getTime()

    while (currentTime + miliseconds >= new Date().getTime()) {}
}
function removeAllContainerChildren(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }
}

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
    return v ? v[2] : null
}
function setCookie(name, value, days) {
    var d = new Date()
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days)
    document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString()
}
function deleteCookie(name) {
    setCookie(name, '', -1)
}
export {
    checkType,
    stopBubble,
    getStyle,
    cancelHandler,
    addEvent,
    buildDom,
    getPosition,
    fixForEach,
    uuid,
    sleep,
    removeAllContainerChildren,
    getCookie,
    deleteCookie,
}
