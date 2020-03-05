import { Observable } from 'rxjs/Observable';

import { HandlerInterface } from './ng-translate.interface';

export abstract class NgTranslateAbstract {
  abstract getTranslation(language: string): Observable<any>;
}

export abstract class HandlerAbstract {
  abstract handle(params: HandlerInterface): any;
}

