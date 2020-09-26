import tool from  './tool'
function checkContainer(target){
    const validation = tool.checkType(target)
    let container
    if(validation === 'string' || validation.indexOf('string') !== -1){
        if(target[0] === '#') container = document.getElementById(target)
        else if(target[0] ==='.') container = document.getElementsByClassName(target)[0]
        else throw new Error('containerName is invalid!')
    } else if(validation === 'HTMLElement') {
        container = target
    }
    return Array.prototype.slice.call(container)
}

export default {
    checkContainer
}