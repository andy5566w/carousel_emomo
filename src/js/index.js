import * as tool from './tool/tool'
import carousel_emommo from './component/carouselV2'
import '@babel/polyfill'

(function () {
    tool.fixForEach()
    try {
        try {
            // 輪播
            const carousels = document.getElementsByClassName(
                'container'
            )
            for (let i = 0; i < carousels.length; i++) {
                new carousel_emommo({containerName: carousels[i], slider: 'image'})
            }
        } catch (err) {
            console.log('輪播 err', err)
        }

    } catch (err) {
        console.log('index.js, error message: ', err)
    }
})()
