import URLRegex from 'url-regex';

export default class URLExtractor {
  public getURLs(string: string): string[] {
    const stringArr = string.split(' ');
    let arr: string[] = [];
    for (let i = 0; i < stringArr.length; i++) {
      if (URLRegex({exact: true, strict: true}).test(stringArr[i])) {
        arr.push(stringArr[i]);
      }
    }
    return arr;
  }

  public getFirstURL(string: string): string | null {
    const stringArr = string.split(' ');
    for (let i = 0; i < stringArr.length; i++) {
      if (URLRegex({exact: true, strict: true}).test(stringArr[i])) {
        return stringArr[i];
      }
    }
    return null;
  }
}
