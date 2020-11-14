import {Injectable} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {ErrorDialogComponent} from "./error-dailog/error-dialog.component";

@Injectable()
export class ErrorDialogService {
    private opened = false;
    bsModalRef: BsModalRef;
    constructor(private modalService: BsModalService) {}

    openDialog(message:string, status?: number): void{
        const initialState = {
            message:message,
            status: status
          };
        this.bsModalRef = this.modalService.show(ErrorDialogComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
    }
}