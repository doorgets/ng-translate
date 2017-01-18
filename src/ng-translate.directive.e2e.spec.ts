import {Component, ViewChild, ElementRef, Input} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {TestBed, ComponentFixture, getTestBed} from "@angular/core/testing";
import {Injector, Injectable, ChangeDetectionStrategy, ViewContainerRef} from "@angular/core";

import {ResponseOptions, Response, XHRBackend, HttpModule} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing";

import {DoorgetsTranslateService, DoorgetsTranslateModule} from '../index';

@Injectable()
@Component({
    selector: 'hmx-app',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div #noKey dgTranslate>Are you ready?</div>
        <div #withKey [dgTranslate]="'Are you ready?'"></div>
        <div #withParams [dgTranslate]="'Hello $0'" [dgTranslateOptions]="[myName]"></div>

        <div #withPluralOneParams [dgTranslate]="'[($0)]'" [dgTranslateOptions]="[myNumber]"></div>
        <div #withPluralTwoParams [dgTranslate]="'[($0|$0 items)]'" [dgTranslateOptions]="[myNumber]"></div>
        <div #withPluralThreeParams [dgTranslate]="'[($0|$0 item|$0 items)]'" [dgTranslateOptions]="[myNumber]"></div>
        <div #withPluralFourParams [dgTranslate]="'[($0|$0 item|$0 items|Not yet items)]'" [dgTranslateOptions]="[myNumber]"></div>

        <div #withPluralZeroOneParams [dgTranslate]="'[($0)]'" [dgTranslateOptions]="[myNumberZero]">[($0)]</div>
        <div #withPluralZeroTwoParams [dgTranslate]="'[($0|$0 items)]'" [dgTranslateOptions]="[myNumberZero]"></div>
        <div #withPluralZeroThreeParams [dgTranslate]="'[($0|$0 item|$0 items)]'" [dgTranslateOptions]="[myNumberZero]"></div>
        <div #withPluralZeroFourParams [dgTranslate]="'[($0|$0 item|$0 items|Not yet items)]'" [dgTranslateOptions]="[myNumberZero]"></div>

        <div #withPluralStringOneParams [dgTranslate]="'[($0)]'" [dgTranslateOptions]="[myNumberString]">[($0)]</div>
        <div #withPluralStringTwoParams [dgTranslate]="'[($0|$0 items)]'" [dgTranslateOptions]="[myNumberString]"></div>
        <div #withPluralStringThreeParams [dgTranslate]="'[($0|$0 item|$0 items)]'" [dgTranslateOptions]="[myNumberString]"></div>
        <div #withPluralStringFourParams [dgTranslate]="'[($0|$0 item|$0 items|Not yet items)]'" [dgTranslateOptions]="[myNumberString]"></div>

    `,
    providers: [FormsModule]
})
class App {
    myName: string;
    @Input() myNumber: number;
    @Input() myNumberZero: number;
    @Input() myString: string;

    viewContainerRef: ViewContainerRef;

    @ViewChild('noKey') noKey: ElementRef;
    @ViewChild('withKey') withKey: ElementRef;
    @ViewChild('withOtherElements') withOtherElements: ElementRef;
    @ViewChild('withParams') withParams: ElementRef;

    @ViewChild('withPluralOneParams') withPluralOneParams: ElementRef;
    @ViewChild('withPluralTwoParams') withPluralTwoParams: ElementRef;
    @ViewChild('withPluralThreeParams') withPluralThreeParams: ElementRef;
    @ViewChild('withPluralFourParams') withPluralFourParams: ElementRef;

    @ViewChild('withPluralZeroOneParams') withPluralZeroOneParams: ElementRef;
    @ViewChild('withPluralZeroTwoParams') withPluralZeroTwoParams: ElementRef;
    @ViewChild('withPluralZeroThreeParams') withPluralZeroThreeParams: ElementRef;
    @ViewChild('withPluralZeroFourParams') withPluralZeroFourParams: ElementRef;

    @ViewChild('withPluralStringOneParams') withPluralStringOneParams: ElementRef;
    @ViewChild('withPluralStringTwoParams') withPluralStringTwoParams: ElementRef;
    @ViewChild('withPluralStringThreeParams') withPluralStringThreeParams: ElementRef;
    @ViewChild('withPluralStringFourParams') withPluralStringFourParams: ElementRef;


    constructor(viewContainerRef: ViewContainerRef) {
        this.viewContainerRef = viewContainerRef;
        this.myName = 'Moon';
        this.myNumber = 1;
        this.myNumberZero = 0;
        this.myString = ' ';
    }
}

const mockBackendResponse = (connection: MockConnection, response: string) => {
  connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

describe('TranslateDirective', () => {
    let injector: Injector;
    let translate: DoorgetsTranslateService;
    let fixture: ComponentFixture<App>;
    let connection: MockConnection; // this will be set when a new connection is emitted from the backend.
    let backend: MockBackend;

    beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [HttpModule, DoorgetsTranslateModule.forRoot()],
          providers: [
            {provide: XHRBackend, useClass: MockBackend}
          ],
          declarations: [App]
        });
        injector = getTestBed();
        backend = injector.get(XHRBackend);
        translate = injector.get(DoorgetsTranslateService);

        backend.connections.subscribe((c: MockConnection) => connection = c);

        fixture = (<any>TestBed).createComponent(App);
        fixture.detectChanges();

    });

    afterEach(() => {
        injector = undefined;
        translate = undefined;
        fixture = undefined;
        connection = undefined;
    });

    it('should translate a string using the container value', () => {
        translate.setCurrent('fr');
        mockBackendResponse(connection, '{"Are you ready?": "Êtes-vous prêt ?", "No": "Non", "Yes": "Oui"}');

        expect(fixture.componentInstance.noKey.nativeElement.innerHTML).not.toEqual('Are you ready?');
        expect(fixture.componentInstance.noKey.nativeElement.innerHTML).toEqual('Êtes-vous prêt ?');
    });

    it('should be able to get translations with params', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"Hello $0": "Salut $0"}');

      expect(fixture.componentInstance.withParams.nativeElement.innerHTML).not.toEqual('Hello $0');
      expect(fixture.componentInstance.withParams.nativeElement.innerHTML).toEqual('Salut Moon');
    });

    it('should be able to get translations with plural one block', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0)]": "[($0)]"}');

      expect(fixture.componentInstance.withPluralOneParams.nativeElement.innerHTML).not.toEqual('[($0)]');
      expect(fixture.componentInstance.withPluralOneParams.nativeElement.innerHTML).toEqual('1');

    });

    it('should be able to get translations with plural two block', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 items)]": "[($0|$0 items)]"}');

      expect(fixture.componentInstance.withPluralTwoParams.nativeElement.innerHTML).not.toEqual('[($0|$0 items)]');
      expect(fixture.componentInstance.withPluralTwoParams.nativeElement.innerHTML).toEqual('1 items');
    });

    it('should be able to get translations with plural three block', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 item|$0 items)]": "[($0|$0 item|$0 items)]"}');

      expect(fixture.componentInstance.withPluralThreeParams.nativeElement.innerHTML).not.toEqual('[($0|$0 item|$0 items)]');
      expect(fixture.componentInstance.withPluralThreeParams.nativeElement.innerHTML).toEqual('1 item');
    });

    it('should be able to get translations with plural four block', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 item|$0 items|Not yet items)]": "[($0|$0 item|$0 items|Not yet items)]"}');

      expect(fixture.componentInstance.withPluralFourParams.nativeElement.innerHTML).not.toEqual('[($0|$0 item|$0 items|Not yet items)]');
      expect(fixture.componentInstance.withPluralFourParams.nativeElement.innerHTML).toEqual('1 item');
    });

    it('should be able to get translations with plural one block for 0', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0)]": "[($0)]"}');

      expect(fixture.componentInstance.withPluralZeroOneParams.nativeElement.innerHTML).not.toEqual('[($0)]');
      expect(fixture.componentInstance.withPluralZeroOneParams.nativeElement.innerHTML).toEqual('0');

    });

    it('should be able to get translations with plural two block for 0', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 items)]": "[($0|$0 items)]"}');

      expect(fixture.componentInstance.withPluralZeroTwoParams.nativeElement.innerHTML).not.toEqual('[($0|$0 items)]');
      expect(fixture.componentInstance.withPluralZeroTwoParams.nativeElement.innerHTML).toEqual('0 items');
    });

    it('should be able to get translations with plural three block for 0', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 item|$0 items)]": "[($0|$0 item|$0 items)]"}');

      expect(fixture.componentInstance.withPluralZeroThreeParams.nativeElement.innerHTML).not.toEqual('[($0|$0 item|$0 items)]');
      expect(fixture.componentInstance.withPluralZeroThreeParams.nativeElement.innerHTML).toEqual('0 item');
    });

    it('should be able to get translations with plural four block for 0', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 item|$0 items|Not yet items)]": "[($0|$0 item|$0 items|Not yet items)]"}');

      expect(fixture.componentInstance.withPluralZeroFourParams.nativeElement.innerHTML).not.toEqual('[($0|$0 item|$0 items|Not yet items)]');
      expect(fixture.componentInstance.withPluralZeroFourParams.nativeElement.innerHTML).toEqual('Not yet items');
    });

    it('should be able to get translations with plural two block for string', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 items)]": "[($0|$0 items)]"}');

      expect(fixture.componentInstance.withPluralStringTwoParams.nativeElement.innerHTML).not.toEqual('[($0|$0 items)]');
      expect(fixture.componentInstance.withPluralStringTwoParams.nativeElement.innerHTML).toEqual('0 items');
    });

    it('should be able to get translations with plural three block for string', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 item|$0 items)]": "[($0|$0 item|$0 items)]"}');

      expect(fixture.componentInstance.withPluralStringThreeParams.nativeElement.innerHTML).not.toEqual('[($0|$0 item|$0 items)]');
      expect(fixture.componentInstance.withPluralStringThreeParams.nativeElement.innerHTML).toEqual('0 item');
    });

    it('should be able to get translations with plural four block for string', () => {
      translate.setCurrent('fr');

      mockBackendResponse(connection, '{"[($0|$0 item|$0 items|Not yet items)]": "[($0|$0 item|$0 items|Not yet items)]"}');

      expect(fixture.componentInstance.withPluralStringFourParams.nativeElement.innerHTML).not.toEqual('[($0|$0 item|$0 items|Not yet items)]');
      expect(fixture.componentInstance.withPluralStringFourParams.nativeElement.innerHTML).toEqual('Not yet items');
    });

});
