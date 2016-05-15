import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {HelperService} from '../common/helper.service';
import {UserService} from '../common/user.service'


@Component({
	selector: 'home-component',
	templateUrl: 'app/components/home/home.html',
	directives: [ROUTER_DIRECTIVES],
})
export class HomeComponent {
  public searchQuery = '';
  public interestData = {};
  public trendingEvents = [];
  public userJoinedEvents = [];
  public subscription: any;
	constructor(private helperService: HelperService, private router:Router, private userService:UserService){
    this.getHomePageData();
    this.subscription = this.userService.getUserLoggedInStatus()
      .subscribe(item => {
        this.getHomePageData();
      });
  }
	getMachingInterest() {
    this.helperService.getMachingInterest(this.searchQuery).subscribe(
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
}