import { DoorgetsFunction } from './ng-translate.function';

export class DoorgetsParser {

  prefix: string = '[(';
  suffix: string = ')]';

  marker: string = '$';

  regex: RegExp = /\$\d/g;
  regexPlural: RegExp = /\[\(\s?([^{}\]]*)\s?\)\]/g;

  public interpolate(expr: string, keys?: any): string {
    return this.transform(expr, keys);
  }

  public getValue(translations: any, keyToFind: any): string {
    if (!DoorgetsFunction.isString(keyToFind)) {
      return translations;
    }

    let stack: string[] = keyToFind.split('.');

    keyToFind = '';
    while (stack.length) {
      keyToFind += stack.shift();
      if (this.check(translations, keyToFind, stack)) {
        translations = translations[keyToFind];
        keyToFind = '';
      } else if(!stack.length) {
        translations = undefined;
      } else {
        keyToFind += '.';
      }
    }

    return translations;
  }

  private check(translations: any, keyToFind: string, stack: string[]): boolean {
    return DoorgetsFunction.isDefined(translations)
       && DoorgetsFunction.isDefined(translations[keyToFind])
       && (!stack.length || DoorgetsFunction.isObject(translations[keyToFind]));
  }

  private transform(sentence: string, keys: any) {
    if ((!DoorgetsFunction.isString(sentence) && !DoorgetsFunction.isNumber(sentence)) || !DoorgetsFunction.isDefined(keys)) {
      return sentence;
    }

    let input: any[];
    let translatedSentence: string = sentence;

    let matchedPlural = translatedSentence.match(this.regexPlural);
    if (matchedPlural) {
      let matchedPluralLength = matchedPlural.length;
      for(let i=0; i < matchedPluralLength; i++) {
        let _key = matchedPlural[i]
          .replace(this.prefix, '')
          .replace(this.suffix, '');

        input = _key.split('|');
        if (input.length) {
          let _searchKey: string = input[0].trim();
          translatedSentence = translatedSentence
            .replace(matchedPlural[i], _searchKey);

          let inputLength = input.length;
          let number = parseInt(keys[_searchKey.replace(this.marker, '')], 10);

          switch (inputLength) {
            case 1:
              translatedSentence = translatedSentence
                .replace(_searchKey, input[0].replace(_searchKey, keys[0] || 0));
              break;
            case 2:
              translatedSentence = translatedSentence
                .replace(_searchKey, input[1].replace(_searchKey, keys[0] || 0));
              break;
            case 3:
              if (number > 1) {
                translatedSentence = translatedSentence
                  .replace(_searchKey, input[2].replace(_searchKey, number || 0));
              } else {
                translatedSentence = translatedSentence
                  .replace(_searchKey, input[1].replace(_searchKey, number || 0) || 0);
              }
              break;
            case 4:
              if (number === 1) {
                translatedSentence = translatedSentence
                  .replace(_searchKey, input[1].replace(_searchKey, number || 0));
              } else if (number > 1) {
                translatedSentence = translatedSentence
                  .replace(_searchKey, input[2].replace(_searchKey, number || 0));
              } else {
                translatedSentence = translatedSentence
                  .replace(_searchKey, input[3].replace(_searchKey, number || 0));
              }

              break;
          }
        }
      };
    }

    let matched = translatedSentence.match(this.regex);
    if (!matched) {
      return translatedSentence;
    }

    if (matched) {
      let matchedLength = matched.length;
      for(let i=0; i < matchedLength; i++) {
        let _searchKey = this.marker + i;
        if (matched[i]) {
          translatedSentence = translatedSentence
            .replace(_searchKey, keys[i]);
        }
      }
    }

    return translatedSentence;
  }
}
