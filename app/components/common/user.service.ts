import {Injectable, EventEmitter} from '@angular/core';
import {BaseService} from './base.service';
import {Router} from '@angular/router-deprecated';
import {Cookie} from './cookie';

declare var FB: any;

@Injectable()
export class UserService {
	public selectedInterest = {};
	public userLogged = new EventEmitter();
	public baseUrl = '/users';
	public userDetails = null;
	constructor(private baseService: BaseService, private _router: Router) {
		console.log("User Service Created.")
		if (baseService.isLoggedIn) {
			this.getUserProfileData();
		}
	}

	isAuthorized() {
		return this.baseService.isLoggedIn;
	}

	userLogin(params: Object){
		var serviceUrl = '/login';
		return this.baseService.postRequest(serviceUrl, params)
			.subscribe(data => {
				if (data.success) {
					Cookie.setCookie('isAuthorized', 'true', 14);
					this.baseService.isLoggedIn = true;
					this.getUserProfileData();
					this.emitUserLoggedInEvent();
				}
				else {
					alert("Something went wrong. Try again.")
				}
			},
			err => console.log('Signup Error: ', err)
			);
	}

	userSignup(params: Object) {
		var serviceUrl = '/register';
		return this.baseService.postRequest(serviceUrl, params)
			.subscribe(data => {
				if (data.success) {
					Cookie.setCookie('isAuthorized', 'true', 14);
					this.baseService.isLoggedIn = true;
					this.getUserProfileData();
					this.emitUserLoggedInEvent();				
				}
				else {
					alert("Something went wrong. Try again.")
				}
			},
			err => console.log('Signup Error: ', err)
			);
	}

	facebookLogin() {
		var thisObj = this;
		FB.login(function(response) {
			console.log(response);
			if (response.status === "connected") {
				thisObj.userLogin({
					type: 2,
					fb_access_token: response.authResponse.accessToken,
					//referral_code: thisObj.signupInfo.referral_code
				});

			} else if (response.status === "not_authorized") {
				return console.error({
					err: "Not authorized",
					message: "User did not approve authorization request"
				});
			} else {
				return console.error({
					err: "Not connected",
					message: "User did not logged in at all"
				});
			}
		}, {
				scope: 'public_profile, email'
			});
	}
	emitUserLoggedInEvent() {
		this.userLogged.emit('logged');
	}

	getUserLoggedInStatus() {
		return this.userLogged;
	}
	logout(){
		this._router.navigate(['Home']);
		Cookie.deleteCookie('auth');
		Cookie.deleteCookie('isAuthorized');
		this.baseService.isLoggedIn = false;
		this.emitUserLoggedInEvent();
	}
	getUserProfileData() {
		var serviceUrl = this.baseUrl + '/profile';
		return this.baseService.getRequest(serviceUrl)
			.subscribe(
			data => {
				if (data.success) {
					this.userDetails = data.response.user || null;
				}
				else {
					//TBD
				}
			},
			err => console.log('Error: ', err)
			);
	}
}