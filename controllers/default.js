exports.install = function() {
	ROUTE('+GET ?*', admin);
};

function admin($) {

	var plugins = [];
	var hostname = $.hostname();

	if (CONF.url !== hostname)
		CONF.url = hostname;

	for (var key in F.plugins) {
		var item = F.plugins[key];
		if (!item.visible || item.visible($.user)) {
			var obj = {};
			obj.id = item.id;
			obj.position = item.position;
			obj.name = TRANSLATE($.user.language || '', item.name);
			obj.icon = item.icon;
			obj.import = item.import;
			obj.routes = item.routes;
			obj.hidden = item.hidden;
			plugins.push(obj);
		}
	}

	$.view('admin', plugins);
}