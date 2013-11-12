X.util.Observer = X.extend(X.emptyFn, {
	initialize: function(listener){
		this.eventTypes = this.eventTypes || {};
		for (var attr in listener) {
			this.eventTypes[attr] = listener[attr];
		}
	},
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
	removeEvent: function(type){
		if (this.eventTypes[type]) {
			delete this.eventTypes[type];
		}
	},
	clear: function(){
		this.eventTypes = {};
	}
});

X.util.Observer.prototype.on = X.util.Observer.prototype.addEvent;
X.util.Observer.prototype.off = X.util.Observer.prototype.removeEvent;
X.util.Observer.prototype.fire = X.util.Observer.prototype.fireEvent;
