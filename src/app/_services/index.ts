import { UserService } from "./user.service";
import { WalletService } from "./wallet.service";
import { CryptoService } from "./crypto.service";
import { Web3Service } from "./web3.service";
import { ArtistService } from "./artist.service";
import { ArtWorkService } from "./artwork.service";
import { EditionService } from "./edition.service";
import { DataService } from "./data.service";
import { AppSettingsService } from "./appSettings.service";
import { EmailService } from "./email.service";
import { AuthStore } from "./auth.store";
import { DialogService } from "./dialog.service";
import { SettingService } from "./setting.service";
import { LikeService } from "./like.service";
import { GalleryService } from "./gallery.service";
import { OfferService } from './offer.service';
import { ToastService } from './toastr.service';
import { PendingEditionService } from './pendingedition.service';
import { DelegateEmailService } from './delegateEmail.service';
import { AdminService } from "./admin.service";

export const services = [
    AdminService,
    UserService,
    WalletService,
    CryptoService,
    Web3Service,
    ArtistService,
    ArtWorkService,
    EditionService,
    DataService,
    AppSettingsService,
    DialogService,
    SettingService,
    LikeService,
    GalleryService,
    OfferService,
    EmailService,
    ToastService
    , PendingEditionService,
    DelegateEmailService];



export * from "./user.service";
export * from "./wallet.service";
export * from "./crypto.service";
export * from "./web3.service";
export { ArtistService } from "./artist.service";
export { ArtWorkService } from "./artwork.service";
export { EditionService } from "./edition.service";
export { DataService } from "./data.service";
export { AppSettingsService } from "./appSettings.service";
export { EmailService } from "./email.service";
export { AuthStore } from "./auth.store";
export { DialogService } from "./dialog.service";
export { SettingService } from "./setting.service";
export { LikeService } from "./like.service";
export { GalleryService } from "./gallery.service";
export { OfferService } from './offer.service';
export * from './toastr.service';
export { PendingEditionService } from './pendingedition.service';
export { DelegateEmailService } from './delegateEmail.service';
export { AdminService } from "./admin.service";
