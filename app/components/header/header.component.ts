import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {UserService} from '../common/user.service'
@Component({
	selector: 'header-component',
	templateUrl: 'app/components/header/header.html',
	directives: [ROUTER_DIRECTIVES]
})
export class HeaderComponent {
	public showLoginModal = false;
	public showLoginSection = true;
	public signUp: any = {
		name:'',
		email:'',
		password:'',
		confirmPassword: ''
	}
	public login: any = {
		password: '',
		email: ''
	}
	public subscription: any;
	constructor(public userService: UserService, public router:Router){
		this.subscription = this.userService.getUserLoggedInStatus()
			.subscribe(item => {
				this.showLoginModal = false;
			});
	}
	emailSignUp(){
		if(this.signUp.name === '' || this.signUp.email === ''){
			alert("invalid details in form.");
			return;
		}
		this.signUp.confirmPassword = this.signUp.password;
		this.userService.userSignup(this.signUp);
		this.signUp = {
			name: '',
			email: '',
			password: '',
			confirmPassword: ''
		};
	}
	emailLogin() {
		if (this.login.email === '' || this.login.password === '') {
			alert("Email and Password cannot be left blank.");
			return;
		}
		this.userService.userLogin(this.login,'email');
		this.login = {
			password: '',
			email: ''
		}
	}
}