import { defineConfig } from 'cypress';
export default defineConfig({ video:false, screenshotOnRunFailure:true, screenshotsFolder:'reports/screenshots',
  reporter:'mochawesome', reporterOptions:{reportDir:'reports',overwrite:false,html:true,json:true},
  retries:0, defaultCommandTimeout:20000,
  e2e:{baseUrl:process.env.PARABANK_URL || 'https://parabank.parasoft.com/parabank',supportFile:false} });
