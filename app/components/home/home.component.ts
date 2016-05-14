import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {HelperService} from '../common/helper.service'

@Component({
	selector: 'home-component',
	templateUrl: 'app/components/home/home.html',
	directives: [ROUTER_DIRECTIVES],
})
export class HomeComponent {
  public searchQuery = '';
	constructor(private helperService: HelperService){
	}
	getMachingInterest() {
    this.helperService.getMachingInterest(this.searchQuery).subscribe(
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