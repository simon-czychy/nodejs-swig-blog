requirejs.config({
  paths: {
      'jquery': './static/js/lib/jquery',
      'script': './static/js/lib/script',
      'bootstrap': './static/js/lib/bootstrap'
  }
});

// Start the main app logic.
requirejs(['jquery', 'script', 'bootstrap'],
function   ($,        script,   bootstrap) {

});
