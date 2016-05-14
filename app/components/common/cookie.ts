export class Cookie {
	public static getCookie(cname: string): string {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return decodeURI(c.substring(name.length, c.length));
		}
		return "";
	}
	public static setCookie(name: string, value: string, expires?: number, path: string = '/', domain?: string) {
		let cookieStr = encodeURI(name) + '=' + encodeURI(value) + ';';

		if (expires) {
			let dtExpires = new Date(new Date().getTime() + expires * 1000 * 60 * 60 * 24);
			cookieStr += 'expires=' + dtExpires.toUTCString() + ';';
		}
		if (path) {
			cookieStr += 'path=' + path + ';';
		}
		if (domain) {
			cookieStr += 'domain=' + domain + ';';
		}
		document.cookie = cookieStr;
	}
	public static deleteCookie(name: string, path: string = '/', domain?: string) {
		if (Cookie.getCookie(name)) {
			Cookie.setCookie(name, '', -1, path, domain);
		}
	}

}
