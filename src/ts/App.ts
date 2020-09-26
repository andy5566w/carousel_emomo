import { containerNameCheck } from "./utility/configure";
import { Carousel } from "./models/carousel";
// @ts-ignore
import gsap from "gsap";
// @ts-ignore
window["carousel_emomo"] = class carousel_emommo<T extends Carousel> {
  private containerName: HTMLElement;
  constructor(option: T) {
    this.containerName = containerNameCheck(option.containerName);
  }
};
