# doorgets-ng-translate [![Build Status](https://travis-ci.org/doorgets/ng-translate.svg?branch=master)](https://travis-ci.org/doorgets/ng-translate) [![Dependency Status](https://david-dm.org/doorgets/ng-translate.svg)](https://david-dm.org/doorgets/ng-translate)

Best Angular 2/4/5/6 (ngx) ng6 translate module i18n (internationalization) from JSON file with pluralization (Zero value state included)

Demo: http://www.ng-translate.com

Plunker: https://plnkr.co/edit/bpqyjTLuFIzZtR33Ov24?p=preview




# Table of contents
* [Installation](#installation)
* [Configuration](#configuration)
  * [SystemJS](#configuration-with-systemjs)
  * [Webpack](#configuration-with-webpack)
  * [Ionic2](#configuration-with-ionic2)
* [How it works](#how-it-works)
  * [Interpolation without params](#interpolation-without-params)
  * [Interpolation with Simple params](#interpolation-with-simple-params)
  * [Interpolation with Pluraliszation params](#interpolation-with-pluralization-params)
  * [Interpolation with Zero value params](#interpolation-with-zero-value-params)
* [Examples usage](#examples-usage)
  * [Simple translation](#simple-translation)
  * [Simple translation from shortcut](#simple-translation-from-shortcut)
  * [Translate with params](#translate-with-params)
  * [Translate with params from shortcut](#translate-with-params-from-shortcut)
  * [Translate with muliple params](#translate-with-muliple-params)
  * [Translate with muliple params from shortcut](#translate-with-muliple-params-from-shortcut)
  * [Translate with plural params](#translate-with-plural-params)
  * [Translate with plural params from shortcut](#translate-with-plural-params-from-shortcut)
  * [Translate with Zero value params](#translate-with-zero-value-params)
  * [Translate with Zero value params from shortcut](#translate-with-zero-value-params-from-shortcut)
* [Api Reference](#api-reference)
  * [Setup your ng translate module](#setup-your-ng-translate-module)
  * [Change current language](#change-current-language)
  * [Translation using get method](#translation-using-get-method)
  * [Translation using get method with params](#translation-using-ge-method-with-params)
  * [Translation in instant](#translation-in-instant)

## Installation

Install npm module

```sh
// Angular 15+
npm install doorgets-ng-translate --save

// Angular 2 -> 8
npm install doorgets-ng-translate@1.0.4 --save


```
## Configuration

### Configuration with SystemJS

#### 1. Import doorgets-ng-translate module into systemjs-config.ts file:

```ts
System.config({
  ...
  map: {
    ...,
    'doorgets-ng-translate': 'node_modules/doorgets-ng-translate'
  },
  packages: {
    ...,
    'doorgets-ng-translate': {main: 'bundles/doorgets-ng-translate.umd.js', defaultExtension: 'js'}
});
```
#### 2. Update your app.module.ts file:
```ts
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DoorgetsTranslateModule } from 'doorgets-ng-translate';
import { AppComponent } from './app.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        DoorgetsTranslateModule.forRoot()
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
```
Import:
```ts
...
import { HttpModule } from '@angular/http';
import { DoorgetsTranslateModule } from 'doorgets-ng-translate';
...
```
@NgModule:
```ts
  imports: [
    BrowserModule,
    HttpModule,
    DoorgetsTranslateModule.forRoot()
  ],
```
#### 3. Update your app.component.ts file:
```ts
import { Component, OnInit } from '@angular/core';
import { DoorgetsTranslateService } from 'doorgets-ng-translate';

@Component({
    selector: 'my-app',
    template: ``,
})
export class AppComponent implements OnInit {
    constructor(private doorgetsTranslateService: DoorgetsTranslateService) { }

    ngOnInit() {
      this.doorGetTranslateService.init({
        languages: ['en', 'fr'],
        current: 'fr',
        default: 'fr'
      });
    }
}

```

Import DoorgetsTranslateService:
```ts
  import { DoorgetsTranslateService } from 'doorgets-ng-translate';
```

Init constructor:
```ts
  constructor(private doorGetTranslateService: DoorgetsTranslateService) {}
```

Set Languages, Current and Default:
```ts
  ngOnInit() {
    this.doorGetTranslateService.init({
      languages: ['en', 'fr'],
      current: 'fr',
      default: 'fr'
    });
  }
```

####4. Finally, create a `locale` folder at the root of your project with appropiate country traduction files
```
|-- + locale/
    |-- en.json
    |-- fr.json
    |-- es.json
    |-- ...
|-- + src/
|-- package.json
|-- tsconfig.json
|-- systemjs.config.js
```

**[Back to top](#table-of-contents)**

### Configuration with Webpack

#### 1. Import doorgets-ng-translate module into vendor.ts file:

```ts
// Angular
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@angular/router';
// RxJS
import 'rxjs';
// Doorgets
import 'doorgets-ng-translate';
```

#### 2. Update app.module.ts file (Angular 9):
```ts
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { DoorgetsTranslateModule , NgTranslate, NgTranslateAbstract } from 'doorgets-ng-translate';

export function newNgTranslate(http: HttpClient) {
  return new NgTranslate(http, '../../public/locale');
}

@NgModule({
  imports: [
    HttpModule,
    DoorgetsTranslateModule.forRoot({
      provide: NgTranslateAbstract,
      useFactory: (newNgTranslate),
      deps: [HttpClient]
    }),
    BrowserModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
```
Import:
```ts
...
import { HttpModule, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { DoorgetsTranslateModule , NgTranslate, NgTranslateAbstract } from 'doorgets-ng-translate';
...
```

Export:
```ts
...
export function newNgTranslate(http: HttpClient) {
  return new NgTranslate(http, '../../public/locale');
}
...
```

@NgModule:
```ts
  imports: [
    HttpModule,
    DoorgetsTranslateModule.forRoot({
      provide: NgTranslateAbstract,
      useFactory: (newNgTranslate),
      deps: [Http]
    }),
    BrowserModule
  ],
```

#### 2. Update app.module.ts file (Angular 2 -> 8):
```ts
import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { DoorgetsTranslateModule , NgTranslate, NgTranslateAbstract } from 'doorgets-ng-translate';

export function newNgTranslate(http: Http) {
  return new NgTranslate(http, '../../public/locale');
}

@NgModule({
  imports: [
    HttpModule,
    DoorgetsTranslateModule.forRoot({
      provide: NgTranslateAbstract,
      useFactory: (newNgTranslate),
      deps: [Http]
    }),
    BrowserModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
```
Import:
```ts
...
import { HttpModule, Http } from '@angular/http';
import { DoorgetsTranslateModule , NgTranslate, NgTranslateAbstract } from 'doorgets-ng-translate';
...
```

Export:
```ts
...
export function newNgTranslate(http: Http) {
  return new NgTranslate(http, '../../public/locale');
}
...
```

@NgModule:
```ts
  imports: [
    HttpModule,
    DoorgetsTranslateModule.forRoot({
      provide: NgTranslateAbstract,
      useFactory: (newNgTranslate),
      deps: [Http]
    }),
    BrowserModule
  ],
```

#### 3. Update app.component.ts file:
```ts
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import '../../public/css/styles.css';

import { DoorgetsTranslateService } from 'doorgets-ng-translate';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(private doorGetTranslateService: DoorgetsTranslateService) {}

  ngOnInit() {
    this.doorGetTranslateService.init({
      languages: ['en', 'fr'],
      current: 'fr',
      default: 'fr'
    });
  }
}
```

Import DoorgetsTranslateService:
```ts
  import { DoorgetsTranslateService } from 'doorgets-ng-translate';
```

Init constructor:
```ts
  constructor(private doorGetTranslateService: DoorgetsTranslateService) {}
```

Set Languages, Current and Default:
```ts
  ngOnInit() {
    this.doorGetTranslateService.init({
      languages: ['en', 'fr'],
      current: 'fr',
      default: 'fr'
    });
  }
```

#### 4. Finally, create a `locale` folder at the `public` folder of your project with appropiate country traduction files
```
|-- + public/
    |-- + locale/
        |-- en.json
        |-- fr.json
        |-- es.json
        |-- ...
|-- + config/
|-- + src/
|-- package.json
|-- tsconfig.json
|-- webpack.config.js
```

**[Back to top](#table-of-contents)**

### Configuration with Ionic2

#### 1. Update app.module.ts file

```ts
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { DoorgetsTranslateModule , NgTranslate, NgTranslateAbstract } from 'doorgets-ng-translate';

export function newNgTranslate(http: Http) {
  return new NgTranslate(http, './assets/locale');
}

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    HttpModule,
    DoorgetsTranslateModule.forRoot({
      provide: NgTranslateAbstract,
      useFactory: (newNgTranslate),
      deps: [Http]
    }),
    IonicModule.forRoot(MyApp),
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
```

Import:
```ts
...
import { HttpModule, Http } from '@angular/http';
import { DoorgetsTranslateModule , NgTranslate, NgTranslateAbstract } from 'doorgets-ng-translate';
...
```

Export:
```ts
...
export function newNgTranslate(http: Http) {
  return new NgTranslate(http, './assets/locale');
}
...
```

@NgModule:
```ts
  imports: [
    HttpModule,
    DoorgetsTranslateModule.forRoot({
      provide: NgTranslateAbstract,
      useFactory: (newNgTranslate),
      deps: [Http]
    }),
    IonicModule.forRoot(MyApp),
    FormsModule
  ],
```

#### 2. Update app.component.ts file:
```ts
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';

import { DoorgetsTranslateService } from 'doorgets-ng-translate';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage = TabsPage;

  constructor(platform: Platform, private doorgetsTranslateService: DoorgetsTranslateService) {
    platform.ready().then(() => {
      doorgetsTranslateService.init({
        languages: ['en', 'fr'],
        current: 'fr',
        default: 'fr'
      });

      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
```

Import DoorgetsTranslateService:
```ts
  import { DoorgetsTranslateService } from 'doorgets-ng-translate';
```

Init constructor:
```ts
  constructor(platform: Platform, private doorgetsTranslateService: DoorgetsTranslateService) {
```

Set Languages, Current and Default:
```ts
  platform.ready().then(() => {
    doorgetsTranslateService.init({
      languages: ['en', 'fr'],
      current: 'fr',
      default: 'fr'
    });

    StatusBar.styleDefault();
    Splashscreen.hide();
  });
```

#### 3. Finally, create a `locale` folder at the `assets` folder of your project with appropiate country traduction files
```
|-- + resources/
|-- + src/
    |-- + assets/
        |-- + locale/
            |-- en.json
            |-- fr.json
            |-- es.json
            |-- ...
    |-- + app/
    |-- + pages/
    |-- + theme/
    |-- ...
|-- config.xml
|-- package.json
|-- tsconfig.json
|-- ionic.config.json
```

**[Back to top](#table-of-contents)**

## How it works

### Interpolation without params
Translation file:
```json
  {
    "How are you?": "Comment ça va?",
    "hello": {
      "form": "Comment ça va?"
    }
  }
```
For simple translation you can use human sentence inside key object:
```ts
  "How are you?" // result => Comment ça va?
```

Or your can use key and subkey:
```ts
  "hello.form" // result => Comment ça va?
```

### Interpolation with Simple params

> Params works with __collection__ `['firstParam', 'secondParam', '...']`, __not__ Object `{}`
>
> Marker key is the concatenation of __$__ and __position__ key inside collection
>
> Why? this is very faster than object !

  Translation file:
```json
  {
    "Hello $0, my name is $1, i live in $2": "Salut $0, je m'appel $1, je vie à $2"
  }
```
Collection params: __["John Doe", "Mounir R'Quiba", "Paris"]__
```ts
  // $ + position => $0 => John Doe
  // $ + position => $1 => Mounir R'Quiba
  // $ + position => $2 => Paris
  "Hello $0, my name is $1, i live in $2"
  // result => "Salut John Doe, je m'appel Mounir R'Quiba, je vie à Paris"
```

### Interpolation with Pluralization params
> Pluralizaition works with THE BANANA IN THE BOX `[(` open tag and `)]` to close tag
>
> Every block is serparated by a pipe `|`
>
> You can use 1 to 3 blocks, so the maximum of pipes is 2

  Translation file:
```json
  {
    "I have [($0|$0 apple|$0 apples)] in [($1|$1 bag|$1 bags)]": "J'ai [($0|$0 pomme|$0 pommes)] dans [($1|$1 sac|$1 sacs)]"
  }
```

Collection params: __[2, 1]__
```ts
  // $ + position => $0 => 2
  // $ + position => $1 => 1
  "I have [($0|$0 apple|$0 apples)] in [($1|$1 bag|$1 bags)]"
  // result => "J'ai 2 pommes dans 1 sac"
```

Explanation
```ts
   [($0|$0 apple|$0 apples)]
```

> __block 1:__ `$0` is the key to find
>
> __block 2:__ `$0 apple` is the translated sentence when $0 <= 1
>
> __block 3:__ `$0 apples` is the translated sentence when $0 > 1



### Interpolation with Zero value params
> Zero value works with THE BANANA IN THE BOX `[(` open tag and `)]` to close tag
>
> Every block is serparated by a pipe `|`
>
> You can use 1 to 4 blocks, so the maximum of pipes is 3

  Translation file:
```json
  {
    "I have [($0|$0 apple|$0 apples|nothing)] [($1|in my bag|in $1 bags|)]": "[($0|J'ai une pomme|J'ai $0 pommes|Je n'ai rien)] [($1|dans mon sac|dans mes $1 sacs|)]"
  }
```

Collection params: __[1, 1]__
```ts
  // $ + position => $0 => 1
  // $ + position => $1 => 1
  "I have [($0|$0 apple|$0 apples|nothing)] in [($1|$1 bag|$1 bags|my bag)]"
  // result => "J'ai une pomme dans mon sac"
```

Collection params: __[0, 0]__
```ts
  // $ + position => $0 => 0
  // $ + position => $1 => 0
  "I have [($0|$0 apple|$0 apples|nothing)] in [($1|$1 bag|$1 bags|my bag)]"
  // result => "Je n'ai rien"
```

Explanation
```ts
   [($0|$0 apple|$0 apples|nothing)]
```

> __block 1:__ `$0` is the key to find
>
> __block 2:__ `$0 apple` is the translated sentence when $0 == 1
>
> __block 3:__ `$0 apples` is the translated sentence when $0 > 1

> __block 4:__ `nothing` is the translated sentence when $0 <= 0


**[Back to top](#table-of-contents)**

## Examples usage

### Simple translation

__./locale/fr.json__
```json
{
  "Are you ready?": "Êtes-vous prêt ?",
}
```

__@Directive:__
```html
    <span [dgTranslate]>Are you ready?</span>
```
> *Output:* __Êtes-vous prêt ?__

__@Directive:__
```html
    <span [dgTranslate]="'Are you ready?'"></span>
```

> *Output:* __Êtes-vous prêt ?__

__@Pipe:__
```html
    {{ 'Are you ready?' | dgTranslate }}
```

> *Output:* __Êtes-vous prêt ?__


### Simple translation from shortcut

__./locale/fr.json__
```json
{
  "label": {
    "ready": "Êtes-vous prêt ?"
  }
}
```

__@Directive:__
```html
    <span [dgTranslate]>label.ready</span>
```
> *Output:* __Êtes-vous prêt ?__

__@Directive:__
```html
    <span [dgTranslate]="label.ready'"></span>
```

> *Output:* __Êtes-vous prêt ?__

__@Pipe:__
```html
    {{ label.ready' | dgTranslate }}
```

> *Output:* __Êtes-vous prêt ?__

### Translate with params

__./locale/fr.json__
```json
{
  "Hello $0": "Salut $0"
}
```

__@Directive:__
```html
    <span [dgTranslate] [dgTranslateOptions]="[myName]">
      Hello $0
    </span>
```
myName = Mounir R'Quiba

> *Output:* __Salut Mounir R'Quiba__

__@Directive:__
```html
    <span [dgTranslate]="'Hello $0'" [dgTranslateOptions]="[myName]"></span>
```
myName = Mounir R'Quiba

> *Output:* __Salut Mounir R'Quiba__

__@Pipe:__
```html
    {{ 'Hello $0' | dgTranslate :myName }}
```
myName = Mounir R'Quiba

> *Output:* __Salut Mounir R'Quiba__

### Translate with params from shortcut

__./locale/fr.json__
```json
{
  "label": {
    "hello": "Salut $0"
  }
}
```

__@Directive:__
```html
    <span [dgTranslate] [dgTranslateOptions]="[myName]">
     label.hello
    </span>
```
myName = Mounir R'Quiba;

> *Output:* __Salut Mounir R'Quiba__

__@Directive:__
```html
    <span [dgTranslate]="'label.hello'" [dgTranslateOptions]="[myName]"></span>
```
myName = Mounir R'Quiba;

> *Output:* __Salut Mounir R'Quiba__

__@Pipe:__
```html
    {{ 'label.hello' | dgTranslate :myName }}
```
myName = Mounir R'Quiba;

> *Output:* __Salut Mounir R'Quiba__




### Translate with muliple params

__./locale/fr.json__
```json
{
  "label": {
    "name": "Je m'appel $0 j'aime coder avec $1"
  }
}
```

__@Directive:__
```html
    <span [dgTranslate] [dgTranslateOptions]="[myName, myLanguage]">
      My name is $0 I like coding with $1
    </span>
```
myName = Mounir R'Quiba; myLanguage = Angular 2;

> *Output:* __Je m'appel Mounir R'Quiba j'aime coder avec Angular 2__

__@Directive:__
```html
    <span [dgTranslate]="'My name is $0 I like coding with $1'" [dgTranslateOptions]="[myName, myLanguage]"></span>
```
myName = Mounir R'Quiba; myLanguage = Angular 2;

> *Output:* __Je m'appel Mounir R'Quiba j'aime coder avec Angular 2__

__@Pipe:__
```html
    {{ 'My name is $0 I like coding with $1' | dgTranslate :myName :myLanguage }}
```
myName = Mounir R'Quiba; myLanguage = Angular 2;

> *Output:* __Je m'appel Mounir R'Quiba j'aime coder avec Angular 2__




### Translate with muliple params from shortcut

__./locale/fr.json__
```json
{
  "label": {
    "name": "Je m'appel $0 j'aime coder avec $1"
  }
}
```

__@Directive:__
```html
    <span [dgTranslate] [dgTranslateOptions]="[myName, myLanguage]">
     label.name
    </span>
```
myName = Mounir R'Quiba; myLanguage = Angular 2;

> *Output:* __Je m'appel Mounir R'Quiba j'aime coder avec Angular 2__

__@Directive:__
```html
    <span [dgTranslate]="'label.name'" [dgTranslateOptions]="[myName, myLanguage]"></span>
```
myName = Mounir R'Quiba; myLanguage = Mounir R'Quiba

> *Output:* __Je m'appel Mounir R'Quiba j'aime coder avec Angular 2__

__@Pipe:__
```html
    {{ 'label.name' | dgTranslate :myName :myLanguage }}
```
myName = Mounir R'Quiba; myLanguage = Mounir R'Quiba

> *Output:* __Je m'appel Mounir R'Quiba j'aime coder avec Angular 2__




### Translate with plural params

__./locale/fr.json__
```json
{
  "I have [($0|$0 apple|$0 apples)] in [($1|$1 bag|$1 bags)]": "J'ai [($0|$0 pomme|$0 pommes)] dans [($1|$1 sac|$1 sacs)]"
}
```

__@Directive:__
```html
    <span [dgTranslate] [dgTranslateOptions]="[countApple, countBag]">
      I have [($0|$0 apple|$0 apples)] in [($1|$1 bag|$1 bags)]
    </span>
```
countApple = 2; countBag = 1;

> *Output:* __J'ai 2 pommes dans 1 sac__

__@Directive:__
```html
    <span [dgTranslate]="'I have [($0|$0 apple|$0 apples)] in [($1|$1 bag|$1 bags)]'" [dgTranslateOptions]="[countApple, countBag]"></span>
```
countApple = 2; countBag = 1;

> *Output:* __J'ai 2 pommes dans 1 sac__

__@Pipe:__
```html
    {{ 'I have [($0|$0 apple|$0 apples)] in [($1|$1 bag|$1 bags)]' | dgTranslate :countApple :countBag }}
```
countApple = 2; countBag = 1;

> *Output:* __J'ai 2 pommes dans 1 sac__




### Translate with plural params from shortcut

__./locale/fr.json__
```json
{
  "label": {
    "quantity": "J'ai [($0|$0 pomme|$0 pommes)] dans [($1|$1 sac|$1 sacs)]"
  }
}
```

__@Directive:__
```html
    <span [dgTranslate] [dgTranslateOptions]="[countApple, countBag]">
     label.quantity
    </span>
```
countApple = 2; countBag = 1;

> *Output:* __J'ai 2 pommes dans 1 sac__

__@Directive:__
```html
    <span [dgTranslate]="'label.quantity'" [dgTranslateOptions]="[countApple, countBag]"></span>
```
countApple = 2; countBag = 1;

> *Output:* __J'ai 2 pommes dans 1 sac__

__@Pipe:__
```html
    {{ 'label.quantity' | dgTranslate :countApple :countBag }}
```
countApple = 2; countBag = 1;

> *Output:* __J'ai 2 pommes dans 1 sac__




### Translate with Zero value params

__./locale/fr.json__
```json
{
  "I have [($0|$0 apple|$0 apples|nothing)] in [($1|$1 bag|$1 bags|my bag)]": "J'ai [($0|$0 pomme|$0 pommes|rien)] dans [($1|$1 sac|$1 sacs|mon sac)]"
}
```

__@Directive:__
```html
    <span [dgTranslate] [dgTranslateOptions]="[countApple, countBag]">
      I have [($0|$0 apple|$0 apples|nothing)] in [($1|$1 bag|$1 bags|my bag)]
    </span>
```
countApple = 2; countBag = 1;

> *Output:* __J'ai 2 pommes dans 1 sac__

countApple = 0; countBag = 0;

> *Output:* __J'ai rien dans mon sac__

__@Directive:__
```html
    <span [dgTranslate]="'I have [($0|$0 apple|$0 apples|nothing)] in [($1|$1 bag|$1 bags|my bag)]'" [dgTranslateOptions]="[countApple, countBag]"></span>
```
countApple = 2; countBag = 1;

> *Output:* __J'ai 2 pommes dans 1 sac__

countApple = 0; countBag = 0;

> *Output:* __J'ai rien dans mon sac__

__@Pipe:__
```html
    {{ 'I have [($0|$0 apple|$0 apples|nothing)] in [($1|$1 bag|$1 bags|my bag)]' | dgTranslate :countApple :countBag }}
```
countApple = 2; countBag = 1;

> *Output:* __J'ai 2 pommes dans 1 sac__

countApple = 0; countBag = 0;

> *Output:* __J'ai rien dans mon sac__



### Translate with zero value params from shortcut

__./locale/fr.json__
```json
{
  "label": {
    "zero": "J'ai [($0|$0 pomme|$0 pommes|rien)] en [($1|$1 sac|$1 sacs|mon sac)]"
  }
}
```

__@Directive:__
```html
    <span [dgTranslate] [dgTranslateOptions]="[countApple, countBag]">
     label.zero
    </span>
```
countApple = 2; countBag = 1;

> *Output:* __J'ai 2 pommes dans 1 sac__

countApple = 0; countBag = 0;

> *Output:* __J'ai rien dans mon sac__

__@Directive:__
```html
    <span [dgTranslate]="'label.zero'" [dgTranslateOptions]="[countApple, countBag]"></span>
```
countApple = 2; countBag = 1;

> *Output:* __J'ai 2 pommes dans 1 sac__

countApple = 0; countBag = 0;

> *Output:* __J'ai rien dans mon sac__

__@Pipe:__
```html
    {{ 'label.zero' | dgTranslate :countApple :countBag }}
```
countApple = 2; countBag = 1;

> *Output:* __J'ai 2 pommes dans 1 sac__

countApple = 0; countBag = 0;

> *Output:* __J'ai rien dans mon sac__

## Api Reference

### Setup your ng translate module
__Quick init__

```ts
 doorGetTranslateService.init({
  languages: ['fr', 'en'],
  current: 'fr',
  default: 'en'
 });
```
__Or__
```ts
 doorGetTranslateService.add(['fr', 'en'])
 doorGetTranslateService.setCurrent('fr');
 doorGetTranslateService.setDefault('fr');
```

### Change current language
```ts
  doorGetTranslateService.setCurrent('en');
```
### Translation using get method
```ts
  doorGetTranslateService.get('myKey').subscribe((res: string) => {
    // res contain translated value
  });
```
### Translation using get method with params
```ts
  doorGetTranslateService.get('myKey', [1, 1]).subscribe((res: string) => {
    // res contain translated value
  });
```
### Translation in instant
```ts
  // res contain translated value
  res = doorGetTranslateService.instant('myKey');
```

**[Back to top](#table-of-contents)**

# License

The MIT License

Copyright (c) 2017 Mounir R'Quiba http://www.doorgets.com/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**[Back to top](#table-of-contents)**
