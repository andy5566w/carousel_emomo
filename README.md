# Carousel_EMOMO

## 如何使用
```bash
npm i @andy5566/carousel_emomo
```
or
```bash
yarn add @andy5566/carousel_emomo
```
main.js
```javascript
import '@andy5566/carousel_emomo/carousel_emomo'
```

Javascript
```javascript
new carousel_emomo({
    containerName: 'container',
    sliders: 'slider',
    delay: 5,
    numOfControlBar: 4,
    showControlBar: true
})
```

HTML
```html
<link rel="stylesheet" href="node_modules/@andy5566/carousel_emomo/main.css">
<div class="carousel">
    <a
        class = "slider"
        data-title = "範例一"
        href = "javascript:void(false)"
        style = "background-image: url('YOUR IMG PATH');"
    >
    </a>
    <a
        clas s= "slider"
        data-title = "範例二"
        href = "javascript:void(false)"
        style = "background-image: url('YOUR IMG PATH');"
    >
    </a>
    <a
        class="slider"
        data-title="範例三"
        href="javascript:void(false)"
        style="background-image: url('YOUR IMG PATH');"
    >
    </a>
    <a
        class="slider"
        data-title="範例四"
        href="javascript:void(false)"
        style="background-image: url('YOUR IMG PATH');"
    >
    </a>
</div>
```
## 參數(option)
| Name     | type | 註解 | 
| ---      | ---       | ---
| containerName | string  | ID名稱或是className
| slider     |    string    | 要滑動的區塊
| delay | number | 輪播停留時間, default: 5
| showControlBar | boolean | 是否顯示下方控制欄位
| numOfControlBar | number | 下放控制欄要顯示的數量


##Demo
[DEMO](https://andy5566w.github.io/carousel_emomo/)