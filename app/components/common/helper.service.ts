import {Injectable} from '@angular/core';
import {BaseService} from './base.service';

@Injectable()
export class HelperService {
	constructor(private baseService: BaseService){

	}
	getMachingInterest(query, params: Object = null) {
		var serviceUrl: string = '/search?q=' +query ;
		return this.baseService.getRequest(serviceUrl, params);
	}
	getHomePageData(params: Object = null) {
		var serviceUrl: string = '/home';
		return this.baseService.getRequest(serviceUrl, params);
	}
}