// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  assetUrl: 'http://localhost:3000',
  assetAPIUrl: 'http://localhost:3000',
  environment: 'staging',
  contractAddress: '0xD805D8154cc248ADe9B076AC3Da2D9a39C936b1e'
};

// export const environment = {
//   production: false,
//   apiUrl: 'http://localhost:3000',
//   assetUrl: 'http://localhost:3000',
//   assetAPIUrl: 'http://localhost:3000',
//   environment: 'dev'
//   contractAddress: '0x8Cad66326e9c72C87971f3b945f15bE6A43bC4dD'
// };

// export const environment = {
//     production: true,
//     apiUrl: 'http://cryptopaymentserver.herokuapp.com',
//     assetAPIUrl: 'https://server.eatlaunchpad.com:8440',
//     assetUrl: 'https://server.eatlaunchpad.com:8440',
//     environment: 'prod.'
// };

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
