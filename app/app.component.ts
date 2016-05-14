declare var System: any;
import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES, RouteConfig, AsyncRoute} from '@angular/router-deprecated';
import {HeaderComponent} from './components/header/header.component'
import {FooterComponent} from './components/footer/footer.component'
import {Http, HTTP_PROVIDERS} from '@angular/http';


@Component({
	selector: 'main-component',
	templateUrl: 'app/mainBody.html',
	viewProviders: [HTTP_PROVIDERS],
	directives: [ROUTER_DIRECTIVES, HeaderComponent, FooterComponent]
}) 
@RouteConfig([
	new AsyncRoute({
		path: '/',
		name: 'Home',
		loader: () => {
			return System.import('compiled/components/home/home.component.js')
				.then(m => m.HomeComponent);
		}
	}),
	new AsyncRoute({
		path: '/create-event',
		name: 'CreateEvent',
		loader: () => {
			return System.import('compiled/components/createEvent/createEvent.component.js')
				.then(m => m.CreateEventComponent);
		}
	}),
	new AsyncRoute({
		path: '/activity',
		name: 'Activity',
		loader: () => {
			return System.import('compiled/components/activity/activity.component.js')
				.then(m => m.ActivityComponent);
		}
	}),
	new AsyncRoute({
		path: '/result',
		name: 'Result',
		loader: () => {
			return System.import('compiled/components/result/result.component.js')
				.then(m => m.ResultComponent);
		}
	})
])
export class AppComponent {
	constructor() {
	}

}