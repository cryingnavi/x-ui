var Doc = {
	cache: { },
	path: "./html/",
	head: $("head"),
	script: '<script type="text/javascript" src="{src}"></script>',
	append: function(rel){
		if(!this.cache[rel]){
			var script = document.createElement("script");
			script.setAttribute("type", "text/javascript");
			script.setAttribute("src", this.path + rel + ".js");
			this.head.get(0).appendChild(script);

			this.cache[rel] = true;
		}

		if(window[rel]){
			window[rel].render();
		}
	}
};

$(function(){
	$("a").click(function(){
		var el = $(this),
			rel = el.attr("rel");
		
		if(rel){
			Doc.append(rel);
			return false;
		}
		else{
			return true;
		}
	});
});