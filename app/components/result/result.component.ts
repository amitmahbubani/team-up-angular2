import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
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
	constructor(public userService: UserService, private eventService: EventService, private router: Router) {
		this.eventResultSet = this.eventService.eventResultList;
	}
	getNextResult() {
		this.currentCount++;
	}
	joinEvent(event_id){
		var body = {
			event_id:event_id
		}
		this.eventService.joinEvent(body).subscribe(
			data => {
				if (data.success) {
					alert("You have Joined this activity.");
					this.router.navigate(['Home']);
				} else {
					//TBD
				}
			},
			err => {
				console.log('Error Occured', err);
			}
		);
	}
}