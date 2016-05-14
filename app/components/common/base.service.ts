import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
import {Cookie} from './cookie';

@Injectable()
export class BaseService {
	private apiUrl = couponDuniaNamespace.config.apiEndpoint;
	public guestToken = null;
	public isAuthorized = false;
	public isLoggedIn = false;
	constructor(private http: Http) {
		var authorizeCookie = Cookie.getCookie('isAuthorized');
		var isAuthorized = (authorizeCookie && authorizeCookie === 'true') ? true : false;
		this.isLoggedIn = isAuthorized;
	}

	setHeaders(token){
		return new Headers({
			'Authorization': 'Basic ' + btoa(token + ":"),
			'Content-Type': 'application/json',
			'X-Request-Source': 'WEB'
		});
	}
}