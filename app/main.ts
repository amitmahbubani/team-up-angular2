import { bootstrap }    from '@angular/platform-browser-dynamic';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import { HTTP_PROVIDERS } from '@angular/http';
import { AppComponent } from './app.component';
import { BaseService } from './components/common/base.service';
import { UserService } from './components/common/user.service';
import { HelperService } from './components/common/helper.service';
import { EventService } from './components/common/event.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
bootstrap(AppComponent, [ROUTER_PROVIDERS, HTTP_PROVIDERS, BaseService, UserService, HelperService, EventService]);