import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {HelperService} from '../common/helper.service';
import {UserService} from '../common/user.service';
import {EventService} from '../common/event.service';


@Component({
	selector: 'home-component',
	templateUrl: 'app/components/home/home.html',
	directives: [ROUTER_DIRECTIVES],
})
export class HomeComponent {
  public searchQuery = '';
  public interestData = {};
  public interests = [];
  public trendingEvents = [];
  public userJoinedEvents = [];
  public subscription: any;
	constructor(private helperService: HelperService, private router:Router, private userService:UserService, private eventService: EventService){
    this.getHomePageData();
    this.subscription = this.userService.getUserLoggedInStatus()
      .subscribe(item => {
        this.getHomePageData();
      });
  }
	getMachingInterest(searchKey = null) {
    if(searchKey === null) {
      searchKey = this.searchQuery;
    }
    this.helperService.getMachingInterest(searchKey).subscribe(
      data => {
        if (data.success) {
          this.interestData = data.response;
          this.userService.selectedInterest = this.interestData;
          this.router.navigate(['Activity']);
        } else {
         //TBD
        }
      },
      err => {
        console.log('Error Occured', err);
      }
    );
  }

  getHomePageData() {
    this.helperService.getHomePageData(this.searchQuery).subscribe(
      data => {
        if (data.success) {
          this.interests = data.response.interests || [];
          this.trendingEvents = data.response.trending_events || [];
          if(this.userService.isAuthorized()){
            this.userJoinedEvents = data.response.user_events || [];
          }
        } else {
          //TBD
        }
      },
      err => {
        console.log('Error Occured', err);
      }
    );
  }
  joinEvent(event, index) {
    var body = {
      event_id: event.id
    }
    this.eventService.joinEvent(body).subscribe(
      data => {
        if (data.success) {
          alert("You have Joined this activity.");
          this.trendingEvents.splice(index, 1);
          this.userJoinedEvents.push(event);
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