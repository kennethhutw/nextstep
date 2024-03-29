import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable()
export class DialogService {
    private subject = new Subject<any>();
    private title = new Subject<any>();

    confirmThis(message: string, yesFn: () => void, noFn: () => void): any {
        this.setConfirmation(message, yesFn, noFn);
    }

    infoThis(message: string, yesFn: () => void, noFn: () => void): any {
        this.setInformation(message, yesFn, noFn);
    }



    setConfirmation(message: string, yesFn: () => void, noFn: () => void): any {
        const that = this;
        this.subject.next({
            type: 'confirm',
            text: message,
            yesFn(): any {
                that.subject.next(); // This will close the modal
                yesFn();
            },
            noFn(): any {
                that.subject.next();
                noFn();
            }
        });
    }

    deleteThis(title: string, message: string, yesFn: () => void, noFn: () => void): any {
        this.setDelete(title, message, yesFn, noFn);
    }

    setDelete(title: string, message: string, yesFn: () => void, noFn: () => void): any {
        const that = this;
        this.subject.next({
            type: 'delete',
            title,
            text: message,
            yesFn(): any {
                that.subject.next(); // This will close the modal
                yesFn();
            },
            noFn(): any {
                that.subject.next();
                noFn();
            }
        });
    }

    setInformation(message: string, yesFn: () => void, noFn: () => void): any {
        const that = this;
        this.subject.next({
            type: 'info',
            text: message,
            yesFn(): any {
                that.subject.next(); // This will close the modal
                yesFn();
            },
            noFn(): any {
                that.subject.next();
                noFn();
            }
        });
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    getTitle(): Observable<any> {
        return this.title.asObservable();
    }
}
