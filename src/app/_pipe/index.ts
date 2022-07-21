import { AddressShortenPipe } from "./addressShorten.pipe";
import { ShortenPipe } from "./shorten.pipe";
import { UserFilterPipe } from "./userFilter.pipe";
import { FilterPipe } from './filter.pipe';

export const pipes = [
    AddressShortenPipe,
    ShortenPipe,
    UserFilterPipe,
    FilterPipe
];
export { AddressShortenPipe } from "./addressShorten.pipe";
export { ShortenPipe } from "./shorten.pipe";
export { UserFilterPipe } from "./userFilter.pipe";
export * from './filter.pipe';
