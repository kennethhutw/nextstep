import { ErrorHandler ,Injectable } from "@angular/core";
import { ErrorDialogService } from "../../_shared/errors/error-dialog.service";
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  

    handleError(error) {
      // do something with the exception
    console.log("error ====================", error);
    }
  }