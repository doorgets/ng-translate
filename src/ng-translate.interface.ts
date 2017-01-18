import { DoorgetsTranslateService } from './ng-translate.service';

export interface ChangeEventInterface {
  translations: any;
  language: string;
}

export interface HandlerInterface {
  searchKey: string;
  translateService: DoorgetsTranslateService;
  params?: Object;
}
