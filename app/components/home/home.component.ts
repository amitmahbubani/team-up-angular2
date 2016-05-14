import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {HelperService} from '../common/helper.service'

@Component({
	selector: 'home-component',
	templateUrl: 'app/components/home/home.html',
	directives: [ROUTER_DIRECTIVES],
	providers : [HelperService]
})
export class HomeComponent {
	constructor(private helperService: HelperService){
		this.getHomePageData();
	}
	getHomePageData() {
    this.helperService.getHomePageData().subscribe(
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