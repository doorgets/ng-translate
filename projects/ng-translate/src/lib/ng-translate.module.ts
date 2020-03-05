import { NgModule, ModuleWithProviders, FactoryProvider } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { NgTranslateAbstract } from './ng-translate.abstract';

import { DoorgetsFunction } from './ng-translate.function';

import { DoorgetsTranslatePipe } from './ng-translate.pipe';

import { DoorgetsTranslateService } from './ng-translate.service';
import { DoorgetsTranslateDirective } from './ng-translate.directive';

@NgModule({
  providers: [DoorgetsTranslateService],
  imports: [HttpClientModule],
  declarations: [DoorgetsTranslatePipe, DoorgetsTranslateDirective],
  exports: [DoorgetsTranslatePipe, DoorgetsTranslateDirective]
})
export class DoorgetsTranslateModule {
  static forRoot(ngTranslate: FactoryProvider = {
        provide: NgTranslateAbstract,
        useFactory: DoorgetsFunction.ngTranslateFactory,
        deps: [HttpClient]
    }): ModuleWithProviders {
        return {
            ngModule: DoorgetsTranslateModule,
            providers: [
              ngTranslate,
              DoorgetsTranslateService
            ]
        };
    }
}
