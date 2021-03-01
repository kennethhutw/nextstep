import { Injectable } from '@angular/core';

@Injectable()
export class TableService {

    asc = 1;
    public index = 0;
    public page = 1;
    public numberElementPerPage: number;
    public numberElt: number;
    public hasDoneLoop = 0;
    public pageMax: number;
    public pages: number[];

    onTableSort(key: string, isNumeric: boolean, objectTable: Array<any>) {
        const way = this.asc;

        this.asc = this.asc * (-1);

        objectTable.sort(function (object1: any, object2: any) {
            let title1;
            let title2;
            if (isNumeric) {
                title1 = parseInt(object1[key], 10);
                title2 = parseInt(object2[key], 10);
            } else {
                if (object1[key] !== undefined && object2[key] !== undefined) {
                    title1 = object1[key].toLowerCase();
                    title2 = object2[key].toLowerCase();
                } else {
                    title1 = object1[key];
                    title2 = object2[key];
                }
            }
            if (title1 > title2) {
                return 1 * way;
            } else if (title1 < title2) {
                return -1 * way;
            } else {
                return 0;
            }
        });
        return this.asc;
    }

    // Pagination
    changePage(pageNumber: number) {
        this.page = pageNumber;
    }

    Page(i: number, page, numberElementPerPage) {
        return i > (page - 1) * numberElementPerPage - 1 && i < ((page) * numberElementPerPage);
    }

    // Search Bar
    onSearch(content: any, val?) {
        if (val === undefined) {
            return true;
        }
        return content.title.toLowerCase().includes(val.toLowerCase());
    }
    // List for Filter
    getList(name: string, anArray: any[]) {
        let List: string[];
        anArray.forEach(function (content) {
            if (List !== undefined) {
                if (content[name] !== undefined && List.indexOf(content[name].toLowerCase()) < 0) {
                    List.push(content[name].toLowerCase());
                }
            } else {
                if (content[name] !== undefined) {
                    List = [content[name].toLowerCase()];
                }
            }
        });
        if (List !== undefined) {
            List.forEach(function (element) {
                if (element[0].toUpperCase() !== element[0]) {
                    List[List.indexOf(element)] = element[0].toUpperCase() + element.substring(1);
                }
            });
        }
        return List;
    }
}
