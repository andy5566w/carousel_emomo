import {
  containerNameCheck,
  buildNextOrPrevBtn,
  buildDom,
} from './utility/configure'
import { Carousel } from './models/carousel'
// @ts-ignore
import gsap from 'gsap'
// @ts-ignore
window['carousel_emomo'] = class carousel_emommo<T extends Carousel> {
  private readonly containerName: HTMLElement
  private readonly sliders: Array<HTMLElement>
  private currentPosition: number = 0
  private delayStatus?: gsap
  private prevPosition: number = 0
  private nextPosition: number = -1
  private isAllowClick: boolean = true
  private duration: number | string = 1
  private delay: number = 5
  private numberPointer: number = 0
  private controlBarSpans: Array<HTMLDivElement | HTMLSpanElement> = []
  private prevBtn: HTMLDivElement = buildNextOrPrevBtn('prev') as HTMLDivElement
  private nextBtn: HTMLDivElement = buildNextOrPrevBtn('next') as HTMLDivElement
  private numOfControlBar: number = 5
  private controlBar?: HTMLElement

  constructor(option: T) {
    this.containerName = containerNameCheck(option.containerName)

    if (typeof option.sliders === 'string')
      this.sliders = Array.prototype.slice.call(
        document.getElementsByClassName(option.sliders)
      )
    else
      throw new Error(
        '參數 sliders is not invalid, error type is ' + typeof option.sliders
      )

    this.configure(option)

    if (this.sliders.length > 1) {
      this.init()
    } else {
      gsap.to(this.sliders[0], { left: '0', opacity: 1 })
      if (this.prevBtn && this.nextBtn) {
        this.prevBtn.style.display = 'none'
        this.nextBtn.style.display = 'none'
      } else {
        throw new Error('prevBtn or nextBtn is invalid')
      }
    }
  }

  private init() {
    this.sliders.forEach((slide, index) => {
      if (index !== 0) gsap.to(slide, { left: '100%' })
    })

    gsap.to(this.sliders[0], { opacity: 1 })

    this.autoPlay()

    this.bindClickEvent()

    if (window.innerWidth < 600) {
      this.bindHoverEvent()
      this.prevBtn.style.display = 'none'
      this.nextBtn.style.display = 'none'
      this.bindSwipeEvent()
    }
  }

  private bindSwipeEvent() {
    this.sliders.forEach((slide) => {
      this.detectSwipe(slide, (el: Element, d: string) => {
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

  private detectSwipe(el: Element, func: Function) {
    var swipe_det = {
      sX: 0,
      sY: 0,
      eX: 0,
      eY: 0,
    }
    let min_x = 30 //min x swipe for horizontal swipe
    let max_x = 30 //max x difference for vertical swipe
    let min_y = 50 //min y swipe for vertical swipe
    let max_y = 60 //max y difference for horizontal swipe
    let direc = ''
    let ele = el
    ele.addEventListener(
      'touchstart',
      function (e: any) {
        let t = e.touches[0]
        swipe_det.sX = t.screenX
        swipe_det.sY = t.screenY
      },
      false
    )
    ele.addEventListener(
      'touchmove',
      function (e: any) {
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

  private autoPlay(type: string = '') {
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

  private navigator(type: string = '', controlIndex?: number) {
    if (this.isAllowClick) {
      this.isAllowClick = false
      let targetAddActive: number = -1
      if (type === 'next') {
        if (controlIndex != null) targetAddActive = controlIndex
        else targetAddActive = this.nextPosition
        gsap.fromTo(
          this.sliders[this.currentPosition],
          { left: 0, duration: this.duration, opacity: 1 },
          {
            left: `-100%`,
            duration: this.duration,
          }
        )
        gsap.fromTo(
          this.sliders[targetAddActive],
          { opacity: 1, left: '100%', duration: this.duration },
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
        if (controlIndex != null) targetAddActive = controlIndex
        else targetAddActive = this.prevPosition
        gsap.fromTo(
          this.sliders[this.currentPosition],
          { left: 0, duration: this.duration, opacity: 1 },
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
      this.calcPosition()

      if (this.controlBarSpans.length > 0) {
        carousel_emommo.removeActiveClass(this.controlBarSpans)
        this.controlBarSpans[targetAddActive!].classList.add('active')
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
            this.currentPosition === this.controlBarSpans.length - 1)
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

  private configure(option: T) {
    this.currentPosition = 0
    this.prevPosition = this.sliders.length - 1
    this.nextPosition = this.currentPosition + 1

    if (this.containerName) {
      this.containerName.appendChild(this.prevBtn)
      this.containerName.appendChild(this.nextBtn)
    }

    if (option.delay != null) this.delay = option.delay
    if (option.numOfControlBar != null)
      this.numOfControlBar = option.numOfControlBar

    if (option.showControlBar) {
      this.buildControlBar()
      this.orderControlBar()
      this.controlBarSpans[0].classList.add('active')
    }

    if (window && window.innerWidth <= 1280 && window.innerWidth > 600)
      this.numOfControlBar =
        this.numOfControlBar - 1 ? this.numOfControlBar - 1 : 1
    else if (window.innerWidth <= 600)
      this.numOfControlBar =
        this.numOfControlBar - 2 ? this.numOfControlBar - 2 : 1
  }

  private calcPosition() {
    this.nextPosition =
      this.sliders.length - 1 > this.currentPosition
        ? this.currentPosition + 1
        : 0
    this.prevPosition =
      this.currentPosition === 0
        ? this.sliders.length - 1
        : this.currentPosition - 1
  }

  private static removeActiveClass(
    target: Array<HTMLDivElement | HTMLSpanElement> = []
  ) {
    target.forEach((e) => e.classList.remove('active'))
  }

  private orderControlBar(type = 'next') {
    // tool.removeAllContainerChildren(this.controlBar)
    if (this.controlBar) this.controlBar.innerHTML = ''
    let count = 0

    if (type === 'next' && this.controlBarSpans.length === this.numberPointer) {
      this.numberPointer = 0
    }
    if (
      type === 'prev' &&
      this.currentPosition === this.controlBarSpans.length - 1
    ) {
      let divide_result = this.controlBarSpans.length / this.numOfControlBar
      // if $divide_result meet to result and don't subtract 1 union, it will lead to over one pair
      if (this.controlBarSpans.length % this.numOfControlBar === 0)
        divide_result--
      this.numberPointer = Math.floor(divide_result) * this.numOfControlBar
    } else if (type === 'prev') {
      this.numberPointer = this.currentPosition - (this.numOfControlBar - 1)
    }
    while (count < this.numOfControlBar) {
      if (this.controlBar && this.controlBarSpans[this.numberPointer]) {
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

  private bindClickEvent() {
    this.prevBtn!.addEventListener('click', () => {
      if (this.isAllowClick) {
        this.delayStatus!.kill()
        this.navigator('prev')
      }
    })

    this.nextBtn!.addEventListener('click', () => {
      if (this.isAllowClick) {
        this.delayStatus!.kill()
        this.navigator('next')
      }
    })
  }

  private bindHoverEvent() {
    this.sliders.forEach((slide) => {
      slide.addEventListener('mouseenter', () => {
        this.delayStatus.kill()
      })
      slide.addEventListener('mouseleave', () => {
        this.autoPlay()
      })
    })
  }

  private buildControlBar() {
    this.sliders.forEach((img, imgIndex) => {
      if (img.dataset.title != null) {
        // @ts-ignore
        let _span = buildDom('span', img.dataset.title, {
          classList: { control: 'control' },
          functionArray: {
            click: () => {
              if (this.isAllowClick) {
                if (this.currentPosition === imgIndex) return
                gsap.fromTo(
                  this.sliders[this.currentPosition],
                  { opacity: 0 },
                  {
                    left: '100%',
                  }
                )
                let direction =
                  this.currentPosition < imgIndex ? 'next' : 'prev'
                this.delayStatus.kill()
                this.navigator(direction, imgIndex)
              }
            },
          },
        })
        this.controlBarSpans.push(_span)
      }
    })

    this.controlBar = buildDom('div', null, {
      classList: { controlBar: 'controlBar' },
    })
    this.containerName.insertAdjacentElement('beforeend', this.controlBar)
  }
}
