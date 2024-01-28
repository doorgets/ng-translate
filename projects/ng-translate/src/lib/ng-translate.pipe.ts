import { OnDestroy, PipeTransform, Pipe, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DoorgetsTranslateService } from './ng-translate.service';
import { ChangeEventInterface } from './ng-translate.interface';

import { DoorgetsFunction } from './ng-translate.function';

declare var document: any;

@Pipe({
  name: 'dgTranslate',
  pure: false
})
export class DoorgetsTranslatePipe implements PipeTransform, OnDestroy {
  translated: string = '';
  currentKey: string;
  currentParams: any[];

  onLangChange: Subscription;

  constructor(private translate: DoorgetsTranslateService, private _ref: ChangeDetectorRef) {}

  transform(sentence: string, ...args: any[]): any {
    if (!sentence || sentence.length === 0) {
      return sentence;
    }

    if (DoorgetsFunction.equals(sentence, this.currentKey) && DoorgetsFunction.equals(args, this.currentParams)) {
      return this.translated;
    }

    this.currentKey = sentence;
    this.currentParams = args;

    this.doTranslate(sentence, args);

    return this.translated;
  }

  doTranslate(sentence: string, args?: Object) {
    this.doUpdate(this.currentKey, this.currentParams);

    this.watchEvent(sentence, args);
  }

  doUpdate(sentence: string, args?: Object): void {
    this.translate.get(sentence, args).subscribe((translated: string) => {
      this.translated = !DoorgetsFunction.isUndefined(translated) ? translated : sentence;
      this.currentKey = sentence;
      this._ref.markForCheck();
    });
  }

  doUpdateEvent(sentence: string, args?: Object, translations?: any): void {
    let doTranslation = (translated: string) => {
      this.translated = !DoorgetsFunction.isUndefined(translated) ? translated : sentence;
      this.currentKey = sentence;
      this._ref.markForCheck();
    };

    if (translations) {
      let translated = this.translate.output(sentence, translations, args);

      if (DoorgetsFunction.isFunction(translated.subscribe)) {
        translated.subscribe(doTranslation);
      } else {
        doTranslation(translated);
      }
    }

    this.translate.get(sentence, args).subscribe(doTranslation);
  }

  watchEvent(sentence: string, args?: Object) {
    this.unsubscribe();

    if (!this.onLangChange) {
      this.onLangChange = this.translate.onLangChange.subscribe((event: ChangeEventInterface) => {
        if (this.currentKey) {
          this.currentKey = null;
          this.doUpdateEvent(sentence, this.currentParams, event.translations);
        }
      });
    }
  }

  unsubscribe(): void {
    if (this.onLangChange) {
      this.onLangChange.unsubscribe();
      this.onLangChange = undefined;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
