import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
	selector: 'help-component',
	templateUrl: 'app/components/help/help.html',
	directives: [ROUTER_DIRECTIVES]
})
export class HelpComponent {
}