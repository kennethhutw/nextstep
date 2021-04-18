import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'userFilter'
})

export class UserFilterPipe implements PipeTransform {
    transform(users: any[], searchText: string, label: string): any[] {
        console.log("UserFilterPipe ================ ")
        if (!users) { return []; }
        if (!searchText) { return users; }
        if (searchText === ''
            || searchText === null) {
            return [];
        }

        return users.filter(user => {
            if (user[label] === undefined) {
                return false;
            } else {
                console.log("UserFilterPipe ================ ", user[label].toLowerCase());
                console.log("UserFilterPipe ================ ", user[label].toLowerCase().indexOf(searchText.toLowerCase()));
                return user[label].toLowerCase().indexOf(searchText.toLowerCase()) > -1;
            }
        });
    }
}
