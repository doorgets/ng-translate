import { Directive, AfterViewChecked, OnInit, OnDestroy, ElementRef, Input } from '@angular/core';
import { Subscription } from "rxjs";

import { DoorgetsFunction } from './ng-translate.function';
import { DoorgetsTranslateService } from './ng-translate.service';
import { ChangeEventInterface } from './ng-translate.interface';

declare const currentTranslations: any;

@Directive({selector: '[dgTranslate]'})
export class DoorgetsTranslateDirective implements AfterViewChecked, OnInit, OnDestroy {

  translations: any;

  currentKey: any;
  lastParams: any;
  onSubscription: Subscription;

  @Input() set dgTranslate(key: string) {
    if(DoorgetsFunction.isDefined(key)) {
      this.currentKey = key;
      this.doTranslation();
    }
  }

  @Input() dgTranslateOptions: any;

  constructor(
    private element: ElementRef,
    private doorgetsTranslateService: DoorgetsTranslateService
  ) {}

  ngOnInit() {
    if(!this.onSubscription) {
      this.onSubscription = this.doorgetsTranslateService.onLangChange
        .subscribe((event: ChangeEventInterface) => {
          this.translations = event.translations;
          this.doTranslation(event.translations);
        });
    }
  }

  ngAfterViewChecked() {
    this.doTranslation();
  }

  private doTranslation(translations?: any) {

    if (DoorgetsFunction.isDefined(this.currentKey)) {
      this.element.nativeElement.textContent = ' ';
    }

    let childNodes: NodeList = this.element.nativeElement.childNodes;
    for(let i = 0; i < childNodes.length; ++i) {
      let node: any = childNodes[i];
      if(node.nodeType === 3) {
        this.checkNode(node, translations);
      }
    }
  }

  private checkNode(node: any, translations: any) {

    if(!DoorgetsFunction.isDefined(this.currentKey)) {
      this.currentKey = this.getContent(node.textContent.trim(), node, translations);
    }

    if(DoorgetsFunction.isDefined(this.currentKey)) {
      this.transform(this.currentKey, node, translations);
    }
  }

  private getContent(content: any, node: any, translations: any): any {
    if(content.length > 0) {
      if(content !== node.currentValue) {
        this.currentKey = content;
        node.content = node.textContent;
      } else if(node.content && DoorgetsFunction.isDefined(translations)) {
        this.currentKey = node.content.trim();
        node.lastKey = null;
      }
    }
    return this.currentKey;
  }

  private transform(currentKey: string, node: any, translations: any) {
    let params: Object = this.dgTranslateOptions;
    if(this.alreadyTransformed(node, currentKey, params)) {
      return;
    }

    this.lastParams = params;

    if(DoorgetsFunction.isDefined(translations)) {
      let translated = this.doorgetsTranslateService
        .output(currentKey, translations, params);

      this.updateContent(translated, currentKey, node);
    } else {
      this.doorgetsTranslateService
        .get(currentKey, params)
        .subscribe((translated: string) => {
          this.updateContent(translated, currentKey, node);
        });
    }
  }

  private setNodeKey(translated: any, currentKey: any, node: any) {
    if(translated !== currentKey) {
      node.lastKey = currentKey;
    }
  }

  private setNodeContent(node: any) {
    if(!node.content) {
      node.content = node.textContent;
    }
  }

  private updateContent(translated: any, currentKey: any, node: any) {
    this.setNodeKey(translated, currentKey, node);
    this.setNodeContent(node);

    node.currentValue = DoorgetsFunction.isDefined(translated)
      ? translated
      : (node.content || currentKey);

    node.textContent = DoorgetsFunction.isDefined(this.currentKey)
      ? node.currentValue
      : node.content.replace(currentKey, node.currentValue);
  }

  private alreadyTransformed(node: any, currentKey: any, params: any) {
    return node.lastKey === currentKey && this.lastParams === params;
  }

  private unsubscribe(): void {
    if(this.onSubscription) {
      this.onSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
