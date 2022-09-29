export const environment = {
  production: true,
  // baseUrl: 'http://localhost:3000/api',
  baseUrl: 'https://step-post-nodejs.herokuapp.com/api',
  mailRegex:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  numberRegex: /^[0-9]*$/,
  passwordRegex:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
  genericRegex: /^[a-zA-Z0-9\s,.'-+éàèù]{0,}$/,
};
