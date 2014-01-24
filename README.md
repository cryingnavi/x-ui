x-ui
====

# 예제는 다음에서 확인 할 수 있습니다.
http://cryingnavi.github.io/x-ui/

# x-ui
HTML 5 기반의 작은 ui framework 입니다. 웹 어플리케이션 제작 유용하도록 설계되었으며 리치한 UI 를 구현하는데 필요한 최소한의 기능을 제공합니다.
x-ui 는 크게 다음과 같이 구성되어 있습니다.

1. core
2. util
3. ui

## core
x-ui 를 구성하는 가장 핵심적인 static method 들이 존재한다. 예를 들어 extend 가 여기에 있다.

''' javascript
var Parents = X.extend(X.emptyFn, {
    initialize: function(){ }
});

var Child = Custom.extend({
    initialize: function(){
        Parents.base.initialize.call(this);
    }
});
'''

## util
util 에는 다음과 같은 기능이 있다.

1. Observer
2. Draggable
2. Droppable
3. ViewController

## ui
ui controll 들이 존재한다. 가장 핵심은 view 라는 controll 이다. view간의 조합으로 다양한 레이아웃을 만들 수 있으며 어떤 컨텐츠를 내포하고 있든지 절대적으로 레이아웃을 보장한다.
또한 x-ui 의 ui controll 들은 html 마크업 기반으로 작성할 수 있도록 제공된다.
다음과 같은 기능을 가지고 있다.

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

''' javascript
var view = new X.View({
    el: "#container"
});
'''

''' html
<div data-role="view">
    <!-- someting html -->
</div>
'''


#Road Map
## 1.1.0
+ FireFox, IE10, IE11 대응
## 1.0.2
+ jsdoc 를 이용한 문서화
## 1.0.1
+ 프로젝트 첫 릴리즈


# 작업일지 및 변경사항
## 1.1.0
+ grunt-jsdoc 설정 변경
+ CSS3 flex box 모델 도입
+ firefox, IE 10, IE 11 대응
+ carousel 버그 수정

## 1.0.2
+ jsdoc 를 이용한 문서화
+ X.View 의 toobar 생성 버그 수정
+ 그 외 자잘한 버그 수정

## 1.0.1
+ Draggable Bug 문서 최상단 부터 구하던 좌표를 부모 요소로 부터 구하도록 변경
+ LayoutView 의 Spliiter가 화면상에 잘 못 표시되던 버그 수정
+ LayoutView 가 여러개 생성되었을 경우 상호간에 사이즈 변경시 다른 LayoutView 에게 통지되도록 변경

## 1.0.0
+ 프로젝트 첫 릴리즈
