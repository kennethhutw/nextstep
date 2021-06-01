import { KeyValueDiffers, Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'addressshorten'
})
export class AddressShortenPipe implements PipeTransform {
    transform(value: any) {
        if (!!value) {
            if (value.length > 12 && value.indexOf('0x') > -1) {
                let first = value.substring(0, 6);
                let last = value.substring(
                    value.length - 6,
                    value.length
                );
                return first + "..." + last;
            } else {
                return value;
            }
        } else {
            return value;
        }
    }

    //       let first = this.walletAddress.substring(0, 6);
    // let last = this.walletAddress.substring(
    //     this.walletAddress.length - 6,
    //     this.walletAddress.length
    // );
    // return first + "..." + last;
}
