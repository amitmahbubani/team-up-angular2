import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
	selector: 'about-component',
	templateUrl: 'app/components/about/about.html',
	directives: [ROUTER_DIRECTIVES]
})
export class AboutComponent {
}