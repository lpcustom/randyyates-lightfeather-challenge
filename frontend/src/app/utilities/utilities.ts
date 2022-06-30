export class Utilities {

  static removeNulls(data: any): object {
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key] === null) {
        delete data[key];
      }
    }
    return data;
  }

  static buildUrlParams(data: any): string {
    const params = [];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        let value = data[key];
        if (typeof value === 'object') {
          value = JSON.stringify(value);
        }
        params.push(key + '=' + value);
      }
    }
    if (params.length > 0) {
      return params.join('&');
    } else {
      return '';
    }
  }

  /**
   * Combines removeNulls and buildUrlParams
   * @param data
   */
  static paramsFromInput(data: any): string {
    return this.buildUrlParams(this.removeNulls(data));
  }

  /**
   * used for dct add/edit to limit input on the column names
   * @param row
   */
  static checkColumnName(row: { name: any; }): void {
    let value = row.name;
    const badCharacters = value.match(/[^a-z0-9_]/g);
    if (badCharacters && badCharacters.length > 0) {
      for (const i of badCharacters) {
        if (i.match(/[A-Z]/)) {
          value = value.replace(i, i.toLowerCase());
        } else if (i === '-') {
          value = value.replace(i, '_');
        } else {
          value = value.replace(i, '');
        }
      }
    }
    if (value.indexOf('_') === 0) {
      value = value.replace('_', '');
    }
    row.name = value;
  }
}
