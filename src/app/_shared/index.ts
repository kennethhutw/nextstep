import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { LoadingDialogComponent } from "./loading/loading-dialog/loading-dialog.component";
import { ErrorDialogComponent } from "./errors/error-dailog/error-dialog.component";
import { ErrorDialogService } from "./errors/error-dialog.service";
import { LoadingDialogService } from "./loading/loading-dialog.service";

export { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
export { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';


export const components = [
    ConfirmDialogComponent,
    LoadingSpinnerComponent,
    LoadingDialogComponent,
    ErrorDialogComponent
];
