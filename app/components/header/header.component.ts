import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {UserService} from '../common/user.service'
@Component({
	selector: 'header-component',
	templateUrl: 'app/components/header/header.html',
	directives: [ROUTER_DIRECTIVES]
})
export class HeaderComponent {
	public showLoginModal = false;
	public showLoginSection = true;
	constructor(public userService: UserService){
		
	}
}