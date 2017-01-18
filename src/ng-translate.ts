import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";

import { NgTranslateAbstract } from "./ng-translate.abstract";

export class NgTranslate implements NgTranslateAbstract {

  constructor(
    private http: Http,
    private path: string = "locale"
  ) {}

  getTranslation(language: string): Observable<any> {
    let extension = '.json';
    return this.http.get(this.path + '/' + language + extension)
      .map((res: Response) => res.json());
  }
}
