/**
 * X.util.Observer 클래스는 custom 이벤트를 발생시켜주며 대부분의 클래스의 최상위 클래스로 존재한다.
 * @class
 */
X.util.Observer = X.extend(X.emptyFn, {
	initialize: function(listener){
		this.eventTypes = this.eventTypes || {};
		for (var attr in listener) {
			this.eventTypes[attr] = listener[attr];
		}
	},
	/**
     * custom 이벤트를 등록한다.
     * @param {args} ... 
     * @example 
     * var observer = new X.util.Observer();
     * observer.addEvent({
     *  success: function(){ }
     *  error: function(){ }
     * });
     * 
     * observer.addEvent({
     *  success: {
     *      scope: window,
     *      params: [ ].
     *      fn: function(){ }
     *  },
     *  error: {
     *      scope: window,
     *      params: [ ].
     *      fn: function(){ }
     *  }
     * });
     */
	addEvent: function(){
		var a = arguments,
			i = a.length,
			eventTypes = this.eventTypes;

		while(i--) {
			for (var attr in a[i]){
				if(eventTypes[attr]){
					if(X.type(eventTypes[attr]) === 'array'){
						this.eventTypes[attr].push(a[i][attr]);
					}
					else{
						this.eventTypes[attr] = [eventTypes[attr], a[i][attr]];
					}
				}
				else{
					this.eventTypes[attr] = a[i][attr];
				}
			}
		}
	},
	/**
     * custom 이벤트를 발생시킨다.
     * @param {Object} 이벤트 핸들러의 scope
     * @param {String} type 커스텀 이벤트의 이름 
     * @param {args} args 이벤트 핸들러에 전달될 argument.
     */
	fireEvent: function(o, type, args){
		var params = o.config ? o.config.params || [] : [],
		    eventTypes = this.eventTypes;
		
		if (eventTypes[type]) {
			args = args || [];
			if(X.type(eventTypes[type]) === 'object'){
				var event = eventTypes[type];
				params = event.params ? params.concat(event.params) : params;
				
				return event.fn.apply(event.scope || o, args.concat(params));
			}
			else if(X.type(eventTypes[type]) === 'array'){
				for(var i=0, len = eventTypes[type].length; i<len; i++){
					var event = eventTypes[type][i],
						result = false;

					result = event.apply(o.config ? o.config.scope || o : o, args.concat(params));
				}
				return result;
			}
			else{
				return eventTypes[type].apply(o.config ? o.config.scope || o : o, args.concat(params));
			}
		}
	},
	/**
     * custom 이벤트를 삭제한다
     * @param {String} type
     */
	removeEvent: function(type){
		if (this.eventTypes[type]) {
			delete this.eventTypes[type];
		}
	},
	/**
     * 등록한 custom 이벤트를 모두 삭제한다
     */
	clear: function(){
		this.eventTypes = { };
	}
});

/**
 * @method on
 * @alias addEvent#on
 */
X.util.Observer.prototype.on = X.util.Observer.prototype.addEvent;
/**
 * @method off
 * @alias removeEvent#off
 */
X.util.Observer.prototype.off = X.util.Observer.prototype.removeEvent;
/**
 * @method fire
 * @alias fireEvent#fire
 */
X.util.Observer.prototype.fire = X.util.Observer.prototype.fireEvent;
