x-ui
====

# 예제는 다음에서 확인 할 수 있습니다.
http://cryingnavi.github.io/x-ui-doc/

# x-ui
HTML 5 기반의 작은 ui framework 입니다. 웹 어플리케이션 제작 유용하도록 설계되었으며 리치한 UI 를 구현하는데 필요한 최소한의 기능을 제공합니다.
jquery mobile 애니메이션 css 를 사용하여 화면 전환 애니메이션을 구현하였으며 iscroll을 내장하고 있어 모바일에서도 자연스런 스크롤이 가능하도록 하였습니다.
x-ui 는 크게 다음과 같이 구성되어 있습니다.

1. core
2. util
3. ui

## core
x-ui 를 구성하는 가장 핵심적인 static method 들이 존재합니다. 예를 들어 extend 가 여기에 있습니다.

```javascript
var Parents = X.extend(X.emptyFn, {
    initialize: function(){ }
});

var Child = Custom.extend({
    initialize: function(){
        Parents.base.initialize.call(this);
    }
});
```

## util
util 에는 다음과 같은 기능이 있습니다.

1. Observer
2. Draggable
2. Droppable
3. ViewController

## ui
ui controll 들이 존재합니다. 다음과 같은 기능을 가지고 있다.

1. view
2. ListView
3. Carousel
4. Tabs
5. Accordion
6. LayoutView
7. FormView
8. TextBox
9. Progressbar
10. Slider
11. Spinner
12. SwitchBox
13. Toolbar


## build
```javascript
grunt
```


## 지원범위
HTML 5, CSS3 를 지원하는 브라우저이 최척화되어 있습니다. Chrome, FireFox, IE11, Opera 를 지원합니다.

## 사용방법
두 가지 형태의 사용방법을 제공합니다. 하나는 javascript 기반이며 다른 방법은 마크업 기반입니다.
예를 들어 가장 기본이 되는 view를 선언하는 방법에 아래와 같은 방법이 있습니다

```javascript
var view = new X.View({
    el: "#container"
});
```

```html
<div data-ui="view">
    <!-- someting html -->
</div>
```

모든 ui 컨트롤 들은 위 두가지 방법을 모두 지원합니다. 컨트롤 들이 가지는 옵션들은 자바스크립트 기반에서는 json 객체의 프로퍼티로 기술하고
마크업 기반에서는 엘리먼트의 속성으로 기술하게 됩니다. 예를 들어 다음과 같습니다.
```javascript
var view = new X.View({
    el: "#container",
    scroll: true,
    floating: true
});
```

```html
<div data-ui="view" data-scroll="true" data-floating="true">
    <!-- someting html -->
</div>
```

