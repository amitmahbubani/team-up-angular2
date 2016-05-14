import {Injectable} from '@angular/core';
import {BaseService} from './base.service';

@Injectable()
export class UserService {
	public selectedInterest = {};
	constructor(private baseService: BaseService){
		console.log("User Service Created.")
	}

	isAuthorized() {
		return this.baseService.isLoggedIn;
	}
}