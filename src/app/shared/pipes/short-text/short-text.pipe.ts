import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortText'
})
export class ShortTextPipe implements PipeTransform {

  transform(value: string | null | undefined, maxLength: number = 50): string {
    if (!value) return '';
    
    if (value.length > maxLength) {
      return value.slice(0, maxLength) + '...';
    }
    return value;
  }

}
