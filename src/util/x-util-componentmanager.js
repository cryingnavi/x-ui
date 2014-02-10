/**
 * @static
 * @desc x ui 로 선언된 ui 컴포넌트에 대한 참조를 가지고 ui 의 고유한 id로 가져올 수 있다. X.util.cm 이라는 별칭을 가지고 있다.
 */
X.util.ComponentManager = X.util.cm = {
	map: { },
	cString: { },
	create: function(contain, children){
		for(var i=0, len=children.length; i<len; i++){
			if(!children[i].render){
				children[i] = new this.cString[children[i].cString](children[i]);
			}

			this.elementAdd(contain, children[i].el);
			if(!children[i].config.autoRender){
				children[i].render();
			}
			
			this.set(children[i].el.attr('id'), children[i]);
		}
		
		return children;
	},
	elementAdd: function(contain, el){
		contain.append(el);
	},
	set: function(id, children){
		this.map[id] = children;
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