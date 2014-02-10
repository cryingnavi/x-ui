/**
 * @class
 * @desc X.util.LocalViewController 클래스는 생성된 X.View 의 자식 view 들에 대해서 화면전환을 제공한다.
 * @property {String} config.activeIndex 처음 생성시에 활성화 될 화면의 인덱스
 * @property {String} config.transition 화면 전환 animation 종류를 지정한다.<br/>
 * <b>slide</b>, <b>slidefade</b>, <b>slideup</b>, <b>slidedown</b><br/>
 * <b>pop</b>, <b>fade</b>, <b>flip</b>, <b>turn</b>, <b>flow</b><br/>
 * <b>roll</b>
 * @example
 * var view = new X.View({
 *      viewController: new X.util.LocalViewController({
 *          beforenextchange: function(){ },        //다음 화면으로 전환하기 직전에 호출된다.
 *          afternextchange: function(){ },         //다음 화면으로 전환한 후에 호출된다.
 *          beforeprevchange: function(){ },        //이전 화면으로 전환하기 진적에 호출된다.
 *          afterprevchange: function(){ }          //이전 화면으로 전환한 후에 호출된다.
 *      }),
 *      children: [
 *          new X.View(),
 *          new X.View(),
 *          new X.View()
 *      ]
 * });
 * 
 * var vc = view.getViewController();
 * vc.nextPage(1);
 */
X.util.LocalViewController = X.extend(X.util.ViewController, {
	initialize: function(config){
		this.config = {
			activeIndex: 0,
		};
		X.apply(this.config, config);
		X.util.LocalViewController.base.initialize.call(this, this.config);

		this.views = [];
	},
	init: function(view){
		X.util.LocalViewController.base.init.call(this, view);
		
		this.views = this.view.config.children;
		this.viewsInit();
	},
	viewsInit: function(){
		if(this.views.length < 1){
			return false;
		}
		
		var views = this.views,
			len = views.length,
			activeIndex = this.config.activeIndex,
			activeView;

		activeView = views[activeIndex];

		this.setActiveView(activeView);
		this.history.initPageSave(activeView.getId(), activeView);

		views.forEach(function(view){
			view.el.addClass('ui-vc-views');
			view.hide();
		});

		activeView.show();
	},
	valid: function(fromView, toView){
		if(fromView === toView){
			return true;
		}
		else{
			return false;
		}
	},
	/**
     * @method
     * @desc 현재 활성화 되어 있는 view의 인덱스를 반환한다.
     * @memberof X.util.LocalViewController.prototype
     * @return {Number} i 현재 활성화 되어있는 요소의 인덱스를 반환한다.
     */
	getActiveIndex: function(){
		var active = this.getActiveView();
		for(var i=0; i<this.views.length; i++){
			if(active === this.views[i]){
				return i;
			}
		}
	},
	/**
	 * @method
     * @desc view들 중 인자로 받은 index 에 해당 하는 view를 반환한다.
     * @memberof X.util.LocalViewController.prototype
     * @param {Number} index - 원하는 view에 해당하는 index
     * @return {X.View} view - X.View를 반환한다.
     */
	getView: function(index){
		if(this.views.length < 1){
			return null;
		}
		
		var view = this.views[index];
		if(!view){
			return null;
		}
		
		return view;
	},
	/**
	 * @method
     * @desc 다음 화면으로 화면을 전환한다.
     * @memberof X.util.LocalViewController.prototype
     * @param {Object} config - 다음 화면으로 전환한다.<br/>
     * <b>index</b>         : 전환하고자 하는 view 의 인덱스<br/>
     * <b>history</b>       : 화면전환을 history에 저장할지 여부<br/>
     * <b>transition</b>    : 화면전환에 사용할 애니메이션<br/>
     * <b>reverse</b>       : 화면전환시 방향. reverse 시 역방향. 빈값을 경우는 정방향.<br/>
     */
	nextPage: function(config){
		if(X.util.vcm.changing){
			return false;
		}
		
		if(!config){
			return false;
		}
		
		var fromView = this.getActiveView(),
			toView = this.getView(config.index);
		
		if(this.valid(fromView, toView)){
			return false;
		}
		
		X.util.vcm.changing = true;

		toView.show();
		this.nextMove(fromView, toView, config);
	},
	/**
     * @desc 이전 화면으로 전환한다.
     * @memberof X.util.LocalViewController.prototype
     * @method prevPage
     * @param {Object} config - 이전 화면으로 전환한다.<br/>
     * <b>index</b>         : 전환하고자 하는 view 의 인덱스<br/>
     * <b>transition</b>    : 화면전환에 사용할 애니메이션<br/>
     * <b>reverse</b>       : 화면전환시 방향. reverse 시 역방향. 빈값을 경우는 정방향.<br/>
     */
	prevPage: function(config){
		if(X.util.vcm.changing){
			return false;
		}
		
		if(!config){
			return false;
		}
		
		var fromView = this.getActiveView(),
			toViewInfo = this.history.getViewInfo(this.getView(config.index).getId());
		
		if(this.valid(fromView, toViewInfo.view)){
			return false;
		}

		X.util.vcm.changing = true;

		toViewInfo.view.show();
		this.prevMove(fromView, toViewInfo.view, {
			transition: toViewInfo.transition
		});
	},
	/**
     * @desc 새로운 view를 viewcontroller에 등록한다.
     * @memberof X.util.LocalViewController.prototype
     * @method appendView
     * @param {X.View} view - 등록할 새로운 view
     * @return {X.View} view - 해당 view를 반환한다.
     */
	appendView: function(view){
		view.el.addClass('ui-vc-active');
		this.views.push(view);

		return view;
	},
	/**
     * @desc 등록된 view 를 viewcontroller에서 삭제 한다.
     * @memberof X.util.LocalViewController.prototype
     * @method removeView
     * @param {X.View} view - 삭제할 view
     * @return {X.View} view - 해당 view를 반환한다.
     */
	removeView: function(view){
		var i=0,
			views = this.views,
			len = views.length,
			array = [];
		
		for(; i<len; i++){
			if(views[i] !== view){
				array.push(views[i]);
			}
		}
		this.views = array;

		this.history.removeMap(id);
		this.history.removeStack(id);

		return view;
	}
});
X.util.cm.addCString('localviewcontroller', X.util.LocalViewController);