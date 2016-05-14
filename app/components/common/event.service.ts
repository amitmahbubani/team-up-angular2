import {Injectable} from '@angular/core';
import {BaseService} from './base.service';

@Injectable()
export class EventService {
	public eventResultList = [];
	public userResponse = {};
	constructor(private baseService: BaseService) {

	}
	findPartner(params: Object = null) {
		var serviceUrl: string = '/event/list';
		return this.baseService.postRequest(serviceUrl, params);
	}
	createEvent(params: Object = null) {
		var serviceUrl: string = '/event/create';
		return this.baseService.postRequest(serviceUrl, params);
	}
}