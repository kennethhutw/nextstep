import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userFilter'
})

export class UserFilterPipe implements PipeTransform {
    transform(users: any[], searchText: string, label: string): any[] {

        if (!users) { return []; }
        if (!searchText) { return users; }
        if (searchText === ''
            || searchText === null) {
            return [];
        }

        return users.filter(function Islable(user) {
            if (user[label] === undefined) {
                return false;
            } else {
                return user[label].toLowerCase().indexOf(searchText.toLowerCase()) > -1;
            }
        });
    }
}
