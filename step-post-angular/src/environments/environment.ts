// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// const localUrl = 'http://localhost:3000/api';
//const remoteUrl = 'https://step-post-nodejs.herokuapp.com/api';
export const environment = {
  production: true,
  url: {
    //  serveur test  ovh
    //baseUrl: 'http://dev01.step.eco:3000/api',
    //  heroku
    baseUrl: 'https://test-api.step-post.fr/api',
    //  localhost
    //baseUrl: 'http://localhost:3000/api',
  },
  regex: {
    mailRegex:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    numberRegex: /^[0-9]*$/,
    passwordRegex:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    genericRegex: /^[a-zA-Z0-9\s,.'\-+éàèù]{0,}$/,
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
