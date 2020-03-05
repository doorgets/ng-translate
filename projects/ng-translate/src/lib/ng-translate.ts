import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

import { NgTranslateAbstract } from "./ng-translate.abstract";

export class NgTranslate implements NgTranslateAbstract {

  constructor(
    private http: HttpClient,
    private path: string = "locale"
  ) {}

  getTranslation(language: string, extension?: string): Observable<any> {
    extension = extension || '.json';
    return this.http.get(this.path + '/' + language + extension);
  }
}
