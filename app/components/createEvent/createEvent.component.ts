import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {EventService} from '../common/event.service';
import {UserService} from '../common/user.service'


@Component({
	selector: 'create-event-component',
	templateUrl: 'app/components/createEvent/createEvent.html',
	directives: [ROUTER_DIRECTIVES]
})
export class CreateEventComponent {
	public userResponse = {};
	public showSuccessModal = false;
	constructor(public userService: UserService, private eventService: EventService, private router:Router) {
		this.userResponse = this.eventService.userResponse;
	}
	createEvent(){
		this.eventService.createEvent(this.userResponse).subscribe(
			data => {
				if (data.success) {
					this.showSuccessModal = true;
				} else {
					alert('Oops! An error ocurred. Please fill out all fields and try again.');
				}
			},
			err => {
				console.log('Error Occured', err);
			}
		);
	}
}