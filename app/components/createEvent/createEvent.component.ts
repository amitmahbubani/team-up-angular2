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
	constructor(public userService: UserService, private eventService: EventService, private router:Router) {
		this.userResponse = this.eventService.userResponse;
	}
	createEvent(){
		this.eventService.createEvent(this.userResponse).subscribe(
			data => {
				if (data.success) {
					alert("We will get back to you soon, when we team you up with a partner!");
					//this.router.navigate(['Home']);
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