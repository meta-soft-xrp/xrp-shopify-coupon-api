module.exports = {
	query(className) {
		const parseClass = Parse.Object.extend(className);
		const instance = new Parse.Query(parseClass);
		return instance;
	},
	instance(className) {
		const instance = Parse.Object.extend(className);
		return new instance(); 
	},
	pointer(className, id) {
		const parseClass = Parse.Object.extend(className);
		const pointer = new parseClass();
		pointer.id = id;
		return pointer;
	},
	sessTok(user, withMaster) {
		if (withMaster) {
				return { useMasterKey: true };
		}
		if (user) {
				return { sessionToken: user.getSessionToken() };
		}
		return {};
	},
	parseQuery(queryString) {
		try {
			var query = {};
			var pairs = queryString.split('?')[1].split('&');
			for (var i = 0; i < pairs.length; i++) {
					var pair = pairs[i].split('=');
					query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
			}
			return query;
		} catch (error) {
			return {}
		}
	},
}
