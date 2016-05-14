import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
import {Cookie} from './cookie';

@Injectable()
export class BaseService {
	private apiUrl = couponDuniaNamespace.config.apiEndpoint;
	public guestToken = null;
	public isLoggedIn = false;
	public guestRequested = false;
	public guestRequestCount = 0;
	constructor(private http: Http) {
		var authorizeCookie = Cookie.getCookie('isAuthorized');
		var isAuthorized = (authorizeCookie && authorizeCookie === 'true') ? true : false;
		this.isLoggedIn = isAuthorized;
	}

	setHeaders(token){
		return new Headers({
			'Authorization': 'Basic ' + btoa(token + ":"),
			'Content-Type': 'application/json',
		});
	}

	getGuestToken(){
		var serviceUrl = this.apiUrl + '/guest';
		if(this.guestRequestCount > 5){
			return;
		}
		if (this.guestRequested) {
			return Rx.Observable.create(function(observer) {
				setTimeout(res => { observer.next('sdfsd'); }, 2000);
			})
		}
		this.guestRequested = true;
		this.guestRequestCount++;
		var a = this.http.get(serviceUrl)
		.map(res => { return res.json() })
		.map(res=> {
			if (res.success === true) {
					this.guestRequestCount = 0;
					Cookie.setCookie('auth', res.response.access_token, 1);
					this.guestRequested = false;
					return res.response;
				} else {
					this.guestRequested = false;
					return res;
			}
		})
		return a;
	}
	updateAuthorization(isAuthorized){
		if (!isAuthorized) {
			this.isLoggedIn = false;
			Cookie.deleteCookie('auth');
			Cookie.deleteCookie('isAuthorized');
		} else {
			this.isLoggedIn = true;
			Cookie.setCookie('isAuthorized', 'true', 14);
		}

	}

	getRequest(url: string,params: Object = null) {
		var serviceUrl = this.apiUrl + url;
		var authCookie = Cookie.getCookie('auth');
		var attachedToken = (authCookie && authCookie !== '') ? authCookie : null;
		if (attachedToken !== null) {
			return this.http.get(serviceUrl, {
				headers: this.setHeaders(attachedToken)
			}).map(res => { return res.json() })
				.map(res => {
					this.updateAuthorization(res.authenticated);
					if (res.success === true) {
						return res;
					} else {
						console.log("Get Request Failed", res.errors.code, res.errors.message);
						return res;
					}
				});
		} else {
			return this.getGuestToken()
				.map(res => { return res; })
				.switchMap(res => { return this.getRequest(url, params); })
		}

	}
}