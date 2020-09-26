/// <reference path="utility/configure.ts" />
/// <reference path="interface/type.ts" />
namespace App {
  export class carousel_emommo<T extends Carousel> {
    // private containerName: HTMLElement;
    constructor(option: Carousel) {
      // this.containerName = containerCheck(option.containerName);
      // option.sliders;
      // console.log("fff");
    }
  }
  export const carousel = new carousel_emommo({
    containerName: "ff",
    sliders: "ss",
  });
  console.log(carousel);
}
