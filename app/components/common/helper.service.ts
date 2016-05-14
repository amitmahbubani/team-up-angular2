import {Injectable} from '@angular/core';
import {BaseService} from './base.service';

@Injectable()
export class HelperService {
	constructor(private baseService: BaseService){

	}
	getHomePageData(params: Object = null) {
		var serviceUrl: string = '/home';
		return this.baseService.getRequest(serviceUrl, params);
	}
}