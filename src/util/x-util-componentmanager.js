/**
 * @static
 * @desc x ui 로 선언된 ui 컴포넌트에 대한 참조를 가지고 ui 의 고유한 id로 가져올 수 있다.
 * @alias X.util.cm
 */
X.util.ComponentManager = X.util.cm = {
	map: { },
	cString: { },
	create: function(contain, items){
		for(var i=0, len=items.length; i<len; i++){
			if(!items[i].render){
				items[i] = new this.cString[items[i].cString](items[i]);
			}

			this.elementAdd(contain, items[i].el);
			if(!items[i].config.autoRender){
				items[i].render();
			}
			
			this.set(items[i].el.attr('id'), items[i]);
		}
		
		return items;
	},
	elementAdd: function(contain, el){
		contain.append(el);
	},
	set: function(id, item){
		this.map[id] = item;
	},
	/**
     * @static
     * @memberof X.util.ComponentManager
     * @param {String} id - 컴포넌트 id
     * @desc x ui 로 선언된 ui 컴포넌트의 참조를 가져온다.
     */
	get: function(id){
		return this.map[id];
	},
	addCString: function(name, klass){
		this.cString[name] = klass;
	},
	remove: function(id){
		delete this.map[id];
	},
	clear: function(){
		this.map = { };
	}
};