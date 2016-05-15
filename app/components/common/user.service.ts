import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {Cookie} from './cookie';

declare var FB: any;

@Injectable()
export class UserService {
	public selectedInterest = {};
	constructor(private baseService: BaseService){
		console.log("User Service Created.")
	}

	isAuthorized() {
		return this.baseService.isLoggedIn;
	}

	userLogin(params: Object, type){
		params['type'] = type;
		var serviceUrl = '/login';
		return this.baseService.postRequest(serviceUrl, params)
			.subscribe(data => {
				if (data.success) {
					Cookie.setCookie('isAuthorized', 'true', 14);
					this.baseService.isLoggedIn = true;
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
					this.baseService.isLoggedIn = true;				}
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
					source: 'facebook',
					access_token: response.authResponse.accessToken,
					//referral_code: thisObj.signupInfo.referral_code
				}, 'social');

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
}