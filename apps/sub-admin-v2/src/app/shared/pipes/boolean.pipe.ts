import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'boolean'
})
export class BooleanPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'Yes' : 'No';
  }
}
