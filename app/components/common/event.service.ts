import {Injectable} from '@angular/core';
import {BaseService} from './base.service';

@Injectable()
export class EventService {
	public eventResultList = [];
	constructor(private baseService: BaseService) {

	}
	findPartner(params: Object = null) {
		var serviceUrl: string = '/event/list';
		return this.baseService.postRequest(serviceUrl, params);
	}
}