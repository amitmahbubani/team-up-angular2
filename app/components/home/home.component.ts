import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
	selector: 'home-component',
	templateUrl: 'app/components/home/home.html',
	directives: [ROUTER_DIRECTIVES]
})
export class HomeComponent {
	getHomePageData(failedToken = null) {
    this.helperService.getHomePageData(failedToken).subscribe(
      data => {
        if (data.success) {
        } else {
         
        }
      },
      err => {
        console.log('Error Occured', err);
      }
    );
  }
}