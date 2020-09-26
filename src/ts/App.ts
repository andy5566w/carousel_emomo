import { containerNameCheck, buildNextOrPrevBtn } from './utility/configure'
import { Carousel } from './models/carousel'
// @ts-ignore
import gsap from 'gsap'
// @ts-ignore
window['carousel_emomo'] = class carousel_emommo<T extends Carousel> {
  private containerName: HTMLElement
  private readonly sliders: Array<HTMLElement>
  private currentPosition: number = 0
  private delayStatus?: gsap
  private prevPosition: number = 0
  private nextPosition: number = -1
  private count: number | string = 0
  private isAllowClick: boolean = true
  private duration: number | string = 1
  private delay: number = 5
  private numberPointer: number = 0
  private controlBarSpans: Array<HTMLDivElement> = []
  private prevBtn?: HTMLDivElement
  private nextBtn?: HTMLDivElement
  private numOfControlBar: number = 5
  private controlBar?: HTMLDivElement

  constructor(option: T) {
    this.containerName = containerNameCheck(option.containerName)

    if (typeof option.sliders === 'string')
      this.sliders = Array.prototype.slice.call(option.sliders)
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

    this.bindHoverEvent()

    if (this.containerName.dataset.controlbar === 'true') {
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
      let targetAddActive: number

      if (type === 'next') {
        targetAddActive =
          controlIndex && controlIndex > -1 ? controlIndex : this.nextPosition
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
        targetAddActive =
          controlIndex && controlIndex > -1 ? controlIndex : this.prevPosition
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

    // this.count = 0
    // this.isAllowClick = true
    // this.duration = 1
    // this.delay = 5
    // this.numberPointer = 0
    // this.controlBarSpans = []

    this.prevBtn = buildNextOrPrevBtn('prev') as HTMLDivElement
    this.nextBtn = buildNextOrPrevBtn('next') as HTMLDivElement

    this.numOfControlBar = 5
    if (window && window.innerWidth <= 1280 && window.innerWidth > 600)
      this.numOfControlBar = 4
    else if (window.innerWidth <= 600) this.numOfControlBar = 3
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

  private static removeActiveClass(target: Array<HTMLDivElement> = []) {
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
    // tool.addEvent(this.prevBtn, 'click', () => {
    //   if (this.isAllowClick) {
    //     this.delayStatus.kill()
    //     this.navigator('prev')
    //   }
    // })
    // tool.addEvent(this.nextBtn, 'click', () => {
    //   if (this.isAllowClick) {
    //     this.delayStatus.kill()
    //     this.navigator('next')
    //   }
    // })

    this.prevBtn!.addEventListener('click', () => {
      if (this.isAllowClick) {
        this.delayStatus!.kill()
        this.navigator('prev')
      }
    })

    this.nextBtn!.addEventListener('click', () => {
      if (this.isAllowClick) {
        this.delayStatus!.kill()
        this.navigator('prev')
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
      let _span = tool.buildDom('span', img.dataset.title, {
        classList: ['control'],
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
              let direction = this.currentPosition < imgIndex ? 'next' : 'prev'
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
}
