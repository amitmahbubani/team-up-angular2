import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
	selector: 'footer-component',
	templateUrl: 'app/components/footer/footer.html',
	directives: [ROUTER_DIRECTIVES]
})
export class FooterComponent {
}