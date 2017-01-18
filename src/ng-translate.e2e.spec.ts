import {NgTranslate} from "./../index";
import {Component} from "@angular/core";
import {Http} from "@angular/http";

@Component({
    selector: 'hmx-app'
})
class App {
}

describe('NgTranslate', () => {
  let ngTranslate: NgTranslate;
  let http: Http;

  beforeEach(() => {
    ngTranslate = new NgTranslate(http, 'locale');
  });

  afterEach(() => {
    ngTranslate = undefined;
  });

  it('should be defined' , () => {
    expect(ngTranslate).toBeDefined();
    expect(ngTranslate instanceof NgTranslate).toBeTruthy();
  });
});

