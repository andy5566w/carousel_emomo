export function containerNameCheck(name: String | HTMLElement): HTMLElement {
  let container
  if (typeof name === 'string') {
    ;(name[0] === '#' && (container = document.getElementById(name))) ||
      (name[0] === '.' &&
        (container = document.getElementsByClassName(name)[0]))
  } else container = name

  return container as HTMLElement
}

export function buildNextOrPrevBtn(type: string): HTMLDivElement {
  const btn = document.createElement('div')
  btn.classList.add(type)
  return btn
}
