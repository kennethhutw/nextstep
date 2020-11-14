import { Injectable } from "@angular/core";
import { BsModalService ,BsModalRef} from 'ngx-bootstrap/modal';

import { LoadingDialogComponent } from "./loading-dialog/loading-dialog.component";

@Injectable()
export class LoadingDialogService {
  private opened = false;
  bsModalRef: BsModalRef;

  constructor(private modalService: BsModalService) {}

  openDialog(): void {
    if (!this.opened) {
      this.opened = true;
      this.bsModalRef = this.modalService.show(LoadingDialogComponent);
    }
  }

  hideDialog() {
    //this.bsModalRef.hide();
  }
}