import * as tool from '../tool/tool'
import gsap from 'gsap'
import configure from "../tool/configure";

export default class carousel_emommo {
    constructor({containerName, slider} = {}) {
        this.wrap = configure.checkContainer(containerName)

        this.sliders = Array.prototype.slice.call(
            this.wrap.getElementsByClassName(slider)
        )

        this.configure()

        if (this.sliders.length > 1) {
            this.init()
        } else {
            gsap.to(this.sliders[0], {left: '0', opacity: 1})
            this.prevBtn.style.display = 'none'
            this.nextBtn.style.display = 'none'
        }
    }

    configure() {
        this.currentPosition = 0
        this.delayStatus
        this.prevPosition = this.sliders.length - 1
        this.nextPosition = this.currentPosition + 1
        this.count = 0
        this.isAllowClick = true
        this.duration = 1
        this.delay = 5
        this.numberPointer = 0
        this.controlBarSpans = []
        this.prevBtn = this.wrap.getElementsByClassName('prev')[0]
        this.nextBtn = this.wrap.getElementsByClassName('next')[0]
        this.numOfControlBar = 5
        if (window && window.innerWidth <= 1280 && window.innerWidth > 600)
            this.numOfControlBar = 4
        else if (window.innerWidth <= 600) this.numOfControlBar = 3
    }

    init() {
        this.sliders.forEach((slide, index) => {
            if (index !== 0) gsap.to(slide, {left: '100%'})
        })

        gsap.to(this.sliders[0], {opacity: 1})

        this.autoPlay()

        this.bindClickEvent()

        this.bindHoverEvent()

        if (this.wrap.dataset.controlbar === 'true') {
            this.buildControlBar()
            this.orderControlBar()
            this.controlBarSpans[0].classList.add('active')
        }
        if (window.innerWidth < 600) {
            this.prevBtn.style = 'display:none;'
            this.nextBtn.style = 'display:none;'
            this.bindSwipeEvent()
        }
    }

    bindSwipeEvent() {
        this.sliders.forEach((slide) => {
            this.detectSwipe(slide, (el, d) => {
                if (d === 'l') {
                    this.delayStatus.kill()
                    this.navigator('next')
                } else if (d === 'r') {
                    this.delayStatus.kill()
                    this.navigator('prev')
                }
            })
        })
    }

    detectSwipe(el, func) {
        var swipe_det = {}
        swipe_det.sX = 0
        swipe_det.sY = 0
        swipe_det.eX = 0
        swipe_det.eY = 0
        var min_x = 30 //min x swipe for horizontal swipe
        var max_x = 30 //max x difference for vertical swipe
        var min_y = 50 //min y swipe for vertical swipe
        var max_y = 60 //max y difference for horizontal swipe
        var direc = ''
        var ele = el
        ele.addEventListener(
            'touchstart',
            function (e) {
                var t = e.touches[0]
                swipe_det.sX = t.screenX
                swipe_det.sY = t.screenY
            },
            false
        )
        ele.addEventListener(
            'touchmove',
            function (e) {
                e.preventDefault()
                var t = e.touches[0]
                swipe_det.eX = t.screenX
                swipe_det.eY = t.screenY
            },
            false
        )
        ele.addEventListener(
            'touchend',
            function (e) {
                //horizontal detection
                if (
                    (swipe_det.eX - min_x > swipe_det.sX ||
                        swipe_det.eX + min_x < swipe_det.sX) &&
                    swipe_det.eY < swipe_det.sY + max_y &&
                    swipe_det.sY > swipe_det.eY - max_y &&
                    swipe_det.eX > 0
                ) {
                    if (swipe_det.eX > swipe_det.sX) direc = 'r'
                    else direc = 'l'
                }
                //vertical detection
                else if (
                    (swipe_det.eY - min_y > swipe_det.sY ||
                        swipe_det.eY + min_y < swipe_det.sY) &&
                    swipe_det.eX < swipe_det.sX + max_x &&
                    swipe_det.sX > swipe_det.eX - max_x &&
                    swipe_det.eY > 0
                ) {
                    if (swipe_det.eY > swipe_det.sY) direc = 'd'
                    else direc = 'u'
                }

                if (direc != '') {
                    if (typeof func == 'function') func(el, direc)
                }
                direc = ''
                swipe_det.sX = 0
                swipe_det.sY = 0
                swipe_det.eX = 0
                swipe_det.eY = 0
            },
            false
        )
    }

    bindHoverEvent() {
        this.sliders.forEach((slide) => {
            tool.addEvent(slide, 'mouseenter', () => {
                this.delayStatus.kill()
            })
            tool.addEvent(slide, 'mouseleave', () => {
                this.autoPlay()
            })
        })
    }

    orderControlBar(type = 'next') {
        tool.removeAllContainerChildren(this.controlBar)
        let count = 0

        if (
            type === 'next' &&
            this.controlBarSpans.length === this.numberPointer
        ) {
            this.numberPointer = 0
        }
        if (
            type === 'prev' &&
            this.currentPosition === this.controlBarSpans.length - 1
        ) {
            let divide_result =
                this.controlBarSpans.length / this.numOfControlBar
            // if $divide_result meet to result and don't subtract 1 union, it will lead to over one pair
            if (this.controlBarSpans.length % this.numOfControlBar === 0)
                divide_result--
            this.numberPointer =
                Math.floor(divide_result) * this.numOfControlBar
        } else if (type === 'prev') {
            this.numberPointer =
                this.currentPosition - (this.numOfControlBar - 1)
        }
        while (count < this.numOfControlBar) {
            if (this.controlBarSpans[this.numberPointer]) {
                this.controlBar.insertAdjacentElement(
                    'beforeend',
                    this.controlBarSpans[this.numberPointer]
                )
                this.numberPointer++
            }
            if (this.sliders.length === this.numberPointer) break
            count++
        }
        // console.log('this.numberPointer', this.numberPointer)
    }

    buildControlBar() {
        this.sliders.forEach((img, imgIndex) => {
            let _span = tool.buildDom('span', img.dataset.title, {
                classList: ['control'],
                functionArray: {
                    click: () => {
                        if (this.isAllowClick) {
                            if (this.currentPosition === imgIndex) return
                            gsap.fromTo(
                                this.sliders[this.currentPosition],
                                {opacity: 0},
                                {
                                    left: '100%',
                                }
                            )
                            let direction =
                                this.currentPosition < imgIndex
                                    ? 'next'
                                    : 'prev'
                            this.delayStatus.kill()
                            this.navigator(direction, imgIndex)
                        }
                    },
                },
            })
            this.controlBarSpans.push(_span)
        })

        this.controlBar = tool.buildDom('div', null, {
            classList: ['controlBar'],
        })
        this.wrap.insertAdjacentElement('beforeend', this.controlBar)
    }

    autoPlay(type) {
        gsap.to(this.sliders[this.currentPosition], {
            left: 0,
        })
        if (type === 'auto-reverse') {
            this.delayStatus = gsap.delayedCall(
                this.delay,
                this.navigator.bind(this, 'prev')
            )
        } else {
            this.delayStatus = gsap.delayedCall(
                this.delay,
                this.navigator.bind(this, 'next')
            )
        }
    }

    navigator(type, controlIndex) {
        if (this.isAllowClick) {
            this.isAllowClick = false
            let targetAddActive

            if (type === 'next') {
                targetAddActive =
                    controlIndex > -1 ? controlIndex : this.nextPosition
                gsap.fromTo(
                    this.sliders[this.currentPosition],
                    {left: 0, duration: this.duration, opacity: 1},
                    {
                        left: `-100%`,
                        duration: this.duration,
                    }
                )
                gsap.fromTo(
                    this.sliders[targetAddActive],
                    {opacity: 1, left: '100%', duration: this.duration},
                    {
                        left: 0,
                        duration: this.duration,
                    },
                    '<'
                )
                this.currentPosition = targetAddActive
                this.delayStatus = gsap.delayedCall(
                    this.delay,
                    this.navigator.bind(this, 'next')
                )
                gsap.delayedCall(this.duration, () => {
                    this.isAllowClick = true
                })
            } else if (type === 'prev') {
                targetAddActive =
                    controlIndex > -1 ? controlIndex : this.prevPosition
                gsap.fromTo(
                    this.sliders[this.currentPosition],
                    {left: 0, duration: this.duration, opacity: 1},
                    {
                        left: `100%`,
                        duration: this.duration,
                    }
                )
                gsap.fromTo(
                    this.sliders[targetAddActive],
                    {
                        left: '-100%',
                        duration: this.duration,
                        opacity: 1,
                    },
                    {
                        left: 0,
                        duration: this.duration,
                    },
                    '<'
                )
                this.currentPosition = targetAddActive
                this.delayStatus = gsap.delayedCall(
                    this.delay,
                    this.navigator.bind(this, 'next')
                )
                gsap.delayedCall(this.duration, () => {
                    this.isAllowClick = true
                })
            }

            // matomo
            let matomo_event = this.sliders[targetAddActive].dataset
                .matomo_event
            let matomo_category = this.sliders[targetAddActive].dataset
                .matomo_category
            let matomo_action = this.sliders[targetAddActive].dataset
                .matomo_action
            let matomo_name = this.sliders[targetAddActive].dataset.matomo_name
            let matomo_value = this.sliders[targetAddActive].dataset
                .matomo_value
            let matomo_values = [
                matomo_event,
                matomo_category,
                matomo_action,
                matomo_name,
                matomo_value,
            ]

            // push
            if (
                window._paq &&
                this.sliders[targetAddActive].dataset.isMatomo !== '1' &&
                this.isEmpty(matomo_values)
            ) {
                this.sliders[targetAddActive].dataset.isMatomo = '1'
                window._paq.push([
                    matomo_event,
                    matomo_category,
                    matomo_action,
                    matomo_name,
                    matomo_value,
                ])
            }
            this.calcPosition()

            if (this.controlBarSpans.length > 0) {
                this.removeActiveClass(this.controlBarSpans)
                this.controlBarSpans[targetAddActive].classList.add('active')
                if (
                    (this.currentPosition !== 0 &&
                        this.currentPosition % this.numOfControlBar === 0) ||
                    (this.currentPosition === 0 &&
                        this.controlBarSpans.length === this.numberPointer)
                ) {
                    if (type === 'next') this.orderControlBar('next')
                }

                if (
                    type === 'prev' &&
                    (this.currentPosition % this.numOfControlBar ===
                        this.numOfControlBar - 1 ||
                        this.currentPosition ===
                        this.controlBarSpans.length - 1)
                ) {
                    this.orderControlBar('prev')
                }
            }

            // console.log('this.prevPosition', this.prevPosition)
            // console.log('this.currentPosition', this.currentPosition)
            // console.log('this.nextPosition', this.nextPosition)
            // console.log('this.numberPointer', this.numberPointer)
            // console.log('----------------------------')
        }
    }

    isEmpty(target = []) {
        let isValid = true
        target.forEach((t) => (isValid = isValid && t))
        return isValid
    }

    bindClickEvent() {
        tool.addEvent(this.prevBtn, 'click', () => {
            if (this.isAllowClick) {
                this.delayStatus.kill()
                this.navigator('prev')
            }
        })
        tool.addEvent(this.nextBtn, 'click', () => {
            if (this.isAllowClick) {
                this.delayStatus.kill()
                this.navigator('next')
            }
        })
    }

    calcPosition() {
        this.nextPosition =
            this.sliders.length - 1 > this.currentPosition
                ? this.currentPosition + 1
                : 0
        this.prevPosition =
            this.currentPosition === 0
                ? this.sliders.length - 1
                : this.currentPosition - 1
    }

    removeActiveClass(target = []) {
        target.forEach((e) => e.classList.remove('active'))
    }

}
