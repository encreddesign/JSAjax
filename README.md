# JSAjax
Shows simple ajax functionality, that makes requests to https://reqres.in/api/users api and fetches sample data and paginates it.

One function to setup script
```javascript
// setup core module
window.jsajax.component.setup(
  '.js-jsajax-container', // root container on client
  '.js-pagination', //pagination container on client
  'https://reqres.in', // remote domain
  '/api/users' // remote endpoint
);
```

Ovveride styling in ```theme.css``` for styling components in the project
