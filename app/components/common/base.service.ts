import {Injectable} from '@angular/core';
import {Http,Headers} from '@angular/http';
import {Cookie} from './cookie';

@Injectable()
export class BaseService {
	private apiUrl = couponDuniaNamespace.config.apiEndpoint;
	public guestToken = null;
	public isAuthorized = false;
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
}