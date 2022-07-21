import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'itemFilter'
})

export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string, label: string): any[] {

        if (!items) { return []; }
        if (!searchText) { return items; }
        if (searchText === ''
            || searchText === null) {
            return [];
        }

        return items.filter(function Islable(user) {
            if (user[label] === undefined) {
                return false;
            } else {
                return user[label].toLowerCase().indexOf(searchText.toLowerCase()) > -1;
            }
        });
    }
}
