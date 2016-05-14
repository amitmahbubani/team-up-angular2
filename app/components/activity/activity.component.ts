import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {EventService} from '../common/event.service';
import {UserService} from '../common/user.service'

@Component({
	selector: 'activity-component',
	templateUrl: 'app/components/activity/activity.html',
	directives: [ROUTER_DIRECTIVES],
	providers: [EventService]
})
export class ActivityComponent {
	public selectedInterest = {};
	public response = {
		id: null
	}
	constructor(public userService:UserService, private eventService: EventService){
		this.selectedInterest = this.userService.selectedInterest;
		this.response.id = this.selectedInterest['id'];
		this.createPostResponseStrcuture(this.selectedInterest['questions']);
	}
	createPostResponseStrcuture(ques){
		for (var i = 0; i < ques.length; i++){
			this.response[ques[i]['id']] = null;
		}
	}
	findPartner(){
		this.eventService.findPartner(this.response).subscribe(
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