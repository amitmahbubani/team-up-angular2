import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {EventService} from '../common/event.service';
import {UserService} from '../common/user.service'

@Component({
	selector: 'result-component',
	templateUrl: 'app/components/result/result.html',
	directives: [ROUTER_DIRECTIVES]
})
export class ResultComponent {
	public eventResultSet = [];
	public currentCount = 0;
	constructor(public userService: UserService, private eventService: EventService) {
		this.eventResultSet = this.eventService.eventResultList;
	}
	getNextResult() {
		this.currentCount++;
	}
}