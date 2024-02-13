FUNC.save = function() {
	var site = MAIN.db;
	var model = {};
	model.id = site.id;
	model.dtcreated = site.dtcreated;
	model.dtupdated = NOW;
	model.name = site.name || CONF.name;
	model.vars = site.vars;
	model.config = site.config;
	model.storage = site.storage || {};
	FILESTORAGE(MAIN.id).savejson('meta', model);
};

FUNC.unload = function(callback) {
	FILESTORAGE(MAIN.id).drop(callback);
	EMIT('unload');
};

FUNC.refresh = NOOP;

FUNC.reconfigure = function() {

	var config = {};

	for (var key in MAIN.db.config)
		config[key] = MAIN.db.config[key];

	LOADCONFIG(config);
	MAIN.db.name = CONF.name;
	EMIT('configure');

};

FUNC.load = function(callback) {
	FILESTORAGE(MAIN.id).readjson('meta', function(err, value) {

		var empty = false;

		if (!value) {
			value = { id: MAIN.id, name: CONF.name, vars: {}, config: {}, storage: {} };
			empty = true;
		}

		value.config.$tapi = true;
		MAIN.db = value;

		if (!value.storage)
			value.storage = {};

		value.ready = true;
		value.fs = FILESTORAGE(MAIN.id);

		for (var key in F.plugins) {
			var item = F.plugins[key];
			if (item.config) {
				for (let m of item.config) {
					if (MAIN.db.config[m.id] == null)
						MAIN.db.config[m.id] = m.value;
				}
			}
		}

		FUNC.refresh();
		FUNC.reconfigure();
		callback && callback();
		empty && FUNC.save();
		EMIT('reload', MAIN.db);
	});
};