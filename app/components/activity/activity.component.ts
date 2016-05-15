import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {EventService} from '../common/event.service';
import {UserService} from '../common/user.service'

@Component({
	selector: 'activity-component',
	templateUrl: 'app/components/activity/activity.html',
	directives: [ROUTER_DIRECTIVES],
})
export class ActivityComponent {
	public selectedInterest = {};
	public response = {
		interest_id: null,
		questions:{}
	}
	public currentCount = 0;
	constructor(public userService:UserService, private eventService: EventService, private router: Router){
		this.selectedInterest = this.userService.selectedInterest;
		this.response.interest_id = this.selectedInterest['id'];
		this.createPostResponseStrcuture(this.selectedInterest['questions']);
		this.currentCount = 0;
	}
	createPostResponseStrcuture(ques){
		for (var i = 0; i < ques.length; i++){
			this.response.questions[ques[i]['id']] = null;
		}
	}
	nextQues(){
		if ((this.currentCount + 1) === this.selectedInterest['questions'].length) {
			this.findPartner();
			return;
		}
		this.currentCount++;
	}
	findPartner(){
		this.eventService.findPartner(this.response).subscribe(
			data => {
				if (data.success) {
					this.eventService.userResponse = this.response;
					this.eventService.eventResultList = data.response;
					this.router.navigate(['Result']);

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