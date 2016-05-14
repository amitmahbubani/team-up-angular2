import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {EventService} from '../common/event.service';
import {UserService} from '../common/user.service'


@Component({
	selector: 'create-event-component',
	templateUrl: 'app/components/createEvent/createEvent.html',
	directives: [ROUTER_DIRECTIVES]
})
export class CreateEventComponent {
	public userResponse = {};
	constructor(public userService: UserService, private eventService: EventService) {
		this.userResponse = this.eventService.userResponse;
	}
	createEvent(){
		this.eventService.createEvent(this.userResponse).subscribe(
			data => {
				if (data.success) {
					
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