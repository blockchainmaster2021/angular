// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

require('dotenv').config();

export const environment = {
  production: false,
  API_BASE_URL: 'http://147.182.187.164:3001/v1/',
  IMG_BASE_URL: 'http://147.182.187.164:3001/',
  CONTRACT_ADDRESS: '0xaf49F92B39F22547BeaD17dDcfde18F1C662F3dD',
  OWNER_ADDRESS: '0x0cE1E760252Fd26c924c24F7f25b269B2b979c2A',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
