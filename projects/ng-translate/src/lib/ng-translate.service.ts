import { Injectable, EventEmitter, Optional } from '@angular/core';
import { Observable, Observer } from "rxjs";

import { ChangeEventInterface, HandlerInterface } from "./ng-translate.interface";
import { NgTranslateAbstract, HandlerAbstract } from "./ng-translate.abstract";

import { DoorgetsParser } from "./ng-translate.parser";
import { DoorgetsFunction } from './ng-translate.function';

import { of  } from 'rxjs';
import { share, map, merge } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DoorgetsTranslateService {

  public current: string = 'en';
  public extension: string = '.json';

  public onLangChange: EventEmitter<ChangeEventInterface> = new EventEmitter<ChangeEventInterface>();

  private translations$: any;
  private translations: any = {};
  private default: string;
  private languages: Array<string> = [];
  private parser: DoorgetsParser = new DoorgetsParser();

  constructor(
    public ngTranslate: NgTranslateAbstract,
    @Optional() private missingTranslationHandler: HandlerAbstract
  ) {}

  public setDefault(language: string): void {
    this.default = language;
  }

  public setExtension(extension: string): void {
    this.extension = extension;
  }

  public setCurrent(language: string): Observable<any> {
    let translations$: Observable<any>;

    if(!DoorgetsFunction.isDefined(this.translations[language])) {
      this.current = language;

      translations$ = this.getTranslation(language);
      translations$.subscribe((res: any) => {
        this.swapLanguage(language);
      });

      return translations$;
    } else {
      this.swapLanguage(language);

      return of(this.translations[language]);
    }
  }

  private swapLanguage(language: string): void {
    this.current = language;

    this.onLangChange.emit({
      language: language,
      translations: this.translations[language]
    });
  }

  public add(languages: Array<string>): void {
    languages.forEach((language: string) => {
      if (!DoorgetsFunction.inArray(this.languages, language)) {
        this.languages.push(language);
      }
    });
  }

  private update(): void {
    this.add(Object.keys(this.translations));
  }

  public getTranslation(language: string): Observable<any> {
    this.translations$ = this.ngTranslate.getTranslation(language).pipe(share());
    this.translations$.subscribe((res: Response) => {
      this.translations[language] = res.json && res.json() || res;
      this.update();
      this.translations$ = undefined;
    }, (err: any) => {
      this.translations$ = undefined;
    });

    return this.translations$;
  }

  public output(searchKey: any, translations: any, params?: Object): any {
    let translated: string|Observable<string>;

    if(translations) {
      translated = this.parser
        .interpolate(this.parser.getValue(translations, searchKey), params);
    }

    if(!DoorgetsFunction.isDefined(translated) && this.default && this.default !== this.current) {
      translated = this.parser
        .interpolate(this.parser.getValue(this.translations[this.default], searchKey), params);
    }

    if (!DoorgetsFunction.isDefined(translated) && this.missingTranslationHandler) {
      let hParams: HandlerInterface = {
        searchKey: searchKey,
        translateService: this
      };

      if (DoorgetsFunction.isDefined(hParams)) {
        hParams.params = hParams;
      }

      translated = this.missingTranslationHandler.handle(hParams);
    }
    return DoorgetsFunction.isDefined(translated) || translated === '' ? translated : searchKey;
  }

  public get(searchKey: string|Array<string>, params?: Object): Observable<string|any> {
    if(!DoorgetsFunction.isDefined(searchKey)) {
      throw new Error(`Parameter "searchKey" required`);
    }

    if(this.translations$) {
      return Observable.create((observer: Observer<string>) => {
        let onComplete = (res: string) => {
          observer.next(res);
          observer.complete();
        };
        let onError = (err: any) => {
          observer.error(err);
        };
        this.translations$.subscribe((translations: any) => {
          translations = this.output(searchKey, translations.json && translations.json() || translations, params);
          if(DoorgetsFunction.isFunction(translations.subscribe)) {
            translations.subscribe(onComplete, onError);
          } else {
            onComplete(translations);
          }
        }, onError);
      });
    } else {
      let translations = this.output(searchKey, this.translations[this.current], params);
      return DoorgetsFunction.isFunction(translations.subscribe)
        ? translations
        : of(translations);
    }
  }

  public instant(searchKey: string|Array<string>, params?: Object): string|any {
    if(!searchKey) {
      throw new Error(`Parameter "searchKey" required`);
    }

    let translations = this.output(searchKey, this.translations[this.current], params);
    return DoorgetsFunction.isDefined(translations.subscribe)
      ? searchKey
      : translations;
  }

  public reload(language: string): Observable<any> {
    if (DoorgetsFunction.isDefined(this.translations[language])) {
      this.translations[language] = undefined;
      return this.getTranslation(language);
    }
  }

  public init(config: any) {
    let _config: any = DoorgetsFunction.merge(this.getConfig(), config);

    this.add(_config.languages);
    this.setDefault(_config.default);
    this.setCurrent(_config.current);
  }

  public getConfig() {
    return {
      languages: this.languages,
      current: this.current,
      default: this.default
    };
  }
}
