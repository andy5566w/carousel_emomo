export function containerNameCheck(name: String | HTMLElement): HTMLElement {
  let container
  if (typeof name === 'string') {
    if (name[0] === '#') container = document.getElementById(name.slice(1))
    else if (name[0] === '.')
      container = document.getElementsByClassName(name.slice(1))[0]
    else container = document.getElementsByClassName(name)[0]
  } else container = name

  return container as HTMLElement
}

export function buildNextOrPrevBtn(type: string): HTMLDivElement {
  const btn = document.createElement('div')
  btn.classList.add(type)
  return btn
}

// @ts-ignore
export function buildDom(
  domName = '',
  child = null,
  {
    classList = {},
    functionArray = {},
    attrs = {},
    textContent = '',
    id = '',
    style = {},
  } = {}
) {
  let dom: HTMLElement = document.createElement(domName)
  if (classList) {
    Object.keys(classList).forEach((name) => {
      dom.classList.add(name)
    })
  }

  if (functionArray && Object.keys(functionArray).length > 0) {
    for (let key in functionArray) {
      addEvent(dom, key, (functionArray as any)[key])
    }
  }

  if (textContent && textContent !== '') {
    dom.textContent = textContent
  }

  if (attrs && Object.keys(attrs).length > 0) {
    for (let key in attrs) {
      // @ts-ignore
      dom[key] = attrs[key]
    }
  }

  if (id) {
    dom.id = id
  }

  for (let key in style) {
    if (style.hasOwnProperty(key)) {
      // @ts-ignore
      dom.style[key] = style[key]
    }
  }

  // child
  if (child != null) {
    if (Array.isArray(child)) {
      // @ts-ignore
      child.forEach((child) => {
        if (child instanceof HTMLElement) {
          dom.appendChild(child)
        }
      })
    } else if (checkType(child).indexOf('string') != -1) {
      // @ts-ignore
      dom.innerHTML = child
    } else {
      throw new Error(`this child :${child} do not match any valid type`)
    }
  }

  return dom
}

function addEvent(elems: any, type: string, fn: Function) {
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
function checkType(target: any) {
  var ret = typeof target
  var template = {
    '[object Array]': 'array - object',
    '[object Object]': 'object - object',
    '[object Number]': 'number - object',
    '[object String]': 'string - object',
    '[object Boolean]': 'boolean - object',
    '[object HTMLDivElement]': 'HTMLElement',
  }
  if (target === null) {
    return 'null'
  } else if (ret == 'object') {
    // Object.prototype.toString
    // 包裝類別, new Number()
    let str = Object.prototype.toString.call(target)
    // @ts-ignore
    if (template[str]) return template[str]
    else return 'HTMLElement'
  } else {
    return ret
  }
}
