// This file configures a web server for testing the production build
// on your local machine.

import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';
import compression from 'compression';

// Run Browsersync
browserSync({
  port: process.env.PORT || 3000,
  ui: false,
  open: false,
  server: {
    baseDir: 'dist'
  },
  files: [
    'src/*.html'
  ],

  middleware: [compression(), historyApiFallback()]
});
