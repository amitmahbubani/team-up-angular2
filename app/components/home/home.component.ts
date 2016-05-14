import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {HelperService} from '../common/helper.service'

@Component({
	selector: 'home-component',
	templateUrl: 'app/components/home/home.html',
	directives: [ROUTER_DIRECTIVES],
})
export class HomeComponent {
  public searchQuery = '';
  public interestData = {};
	constructor(private helperService: HelperService, private router:Router){
	}
	getMachingInterest() {
    this.helperService.getMachingInterest(this.searchQuery).subscribe(
      data => {
        if (data.success) {
          this.router.navigate(['FindEvent', { data: this.interestData }]);
        } else {
         
        }
      },
      err => {
        console.log('Error Occured', err);
      }
    );
  }
}