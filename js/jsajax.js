/**
* Root script for jsajax search results page
*
* @author Joshua Grierson
* @version 0.0.1
*/
(function () {

  /**
  * Call setup function to start module
  */
  window.jsajax.component.setup(
    '.js-jsajax-container', // root container on client
    '.js-pagination', // pagination container on remote
    'https://reqres.in', // remote domain
    '/api/users', // remote endpoint search page
  );

})();
