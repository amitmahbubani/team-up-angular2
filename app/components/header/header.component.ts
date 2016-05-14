import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
	selector: 'header-component',
	templateUrl: 'app/components/header/header.html',
	directives: [ROUTER_DIRECTIVES]
})
export class HeaderComponent {
}