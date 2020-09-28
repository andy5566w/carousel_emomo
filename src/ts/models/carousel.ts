export class Carousel {
  constructor(
    public containerName: String | HTMLElement,
    public sliders: String | HTMLElement,
    public delay: number,
    public numOfControlBar: number,
    public showControlBar: boolean
  ) {}
}
