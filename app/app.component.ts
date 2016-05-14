import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
	selector: 'main-component',
	template: `
		<div class="header">
			<div class="jumbotron">
				<div class="top-nav container">
					<div class="row col-xs-12">
						<div class="logo">
							<img src="/app/assets/images/logo-white.png"/>
						</div>
						<div class="nav-links">
							<a href=""><span class="nav-link">CREATE A TEAM</span></a>
							<a href=""><span class="nav-link">LOGIN</span></a>
							<a href=""><span class="nav-link">SIGNUP</span></a>
						</div>
					</div>
				</div>
			</div>
		</div>
		

	`,
})

export class AppComponent {
}