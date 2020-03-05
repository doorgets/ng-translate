import { TestBed } from '@angular/core/testing';

import { NgTranslateService } from './ng-translate.service';

describe('NgTranslateService', () => {
  let service: NgTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
