import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SecuriteService {
  escapeChars: string[] = [
    '/',
    '[',
    '&',
    '<',
    '>',
    '(',
    ')',
    '"',
    '`',
    '=',
    '?',
    ']',
  ];

  testField(value: string): boolean {
    for (let i = 0; i < value.length; i++) {
      if (this.escapeChars.includes(value[i])) {
        return false;
      }
    }
    return true;
  }

  testObject(object: any): boolean {
    console.log(object);

    for (const property in object) {
      const value = object[property];
      if (value !== null && value !== undefined) {
        for (let i = 0; i < value.length; i++) {
          if (this.escapeChars.includes(value[i])) {
            return false;
          }
        }
      }
    }
    return true;
  }
}
