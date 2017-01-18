import { NgModule, ModuleWithProviders } from '@angular/core';
import { Http } from '@angular/http';

import { NgTranslateAbstract } from './src/ng-translate.abstract';

import { DoorgetsFunction } from './src/ng-translate.function';

import { DoorgetsTranslatePipe } from './src/ng-translate.pipe';

import { DoorgetsTranslateService } from './src/ng-translate.service';
import { DoorgetsTranslateDirective } from './src/ng-translate.directive';

export * from "./src/ng-translate";

export * from "./src/ng-translate.pipe";
export * from "./src/ng-translate.service";
export * from "./src/ng-translate.directive";

export * from "./src/ng-translate.interface";

export * from "./src/ng-translate.function";
export * from "./src/ng-translate.abstract";

@NgModule({
  providers: [DoorgetsTranslateService],
  declarations: [DoorgetsTranslatePipe, DoorgetsTranslateDirective],
  exports: [DoorgetsTranslatePipe, DoorgetsTranslateDirective]
})
export class DoorgetsTranslateModule {
  static forRoot(ngTranslate: any = {
        provide: NgTranslateAbstract,
        useFactory: DoorgetsFunction.ngTranslateFactory,
        deps: [Http]
    }): ModuleWithProviders {
        return {
            ngModule: DoorgetsTranslateModule,
            providers: [ngTranslate, DoorgetsTranslateService]
        };
    }
}
