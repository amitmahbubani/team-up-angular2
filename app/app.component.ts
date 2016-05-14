declare var System: any;
import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES, RouteConfig, AsyncRoute} from '@angular/router-deprecated';
import {HeaderComponent} from './components/header/header.component'
import {FooterComponent} from './components/footer/footer.component'

@Component({
	selector: 'main-component',
	templateUrl: 'app/mainBody.html',
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
	})
])
export class AppComponent {
}