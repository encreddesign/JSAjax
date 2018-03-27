/**
* Module - Component for jsajax sample results page
*
* @author Joshua Grierson
* @version 0.0.1
*/
jsajax.component = {

  /**
  * Sets global variables and registers events
  * @param container
  * @param pagination
  * @param domain
  * @param endpoint
  */
  setup: function (container, pagination, domain, endpoint) {
    window.container = container;
    window.pagination = pagination;
    window.domain = domain;
    window.endpoint = endpoint;

    window.lastResults = false;
    window.requestActive = false;

    window.page = 1;
    window.count = 6;

    jsajax.component.registerLoadEvents();
  },

  /**
  * Gets global variables
  * @return Object
  */
  getGlobals: function () {
    return {
      tag: 'jsajax API',
      domain: window.domain,
      endpoint: window.domain + window.endpoint,
      container: document.querySelector(window.container),
      pagination: document.querySelector(window.pagination)
    };
  },

  /**
  * Register events on elements
  */
  registerLoadEvents: function () {
    document.addEventListener('DOMContentLoaded', jsajax.component.onDocumentReady);
  },

  /**
  * Register late dom elements
  */
  registerLateEvents: function () {
    var paginationButton = jsajax.component.getGlobals().pagination.querySelectorAll('button');

    for(var paginationI = 0; paginationI < paginationButton.length; paginationI++) {
      paginationButton[paginationI].addEventListener('click', jsajax.component.onPaginationTrigger);
    }
  },

  /**
  * On document loaded logic, do initial call to search page
  */
  onDocumentReady: function () {
    var requestUrl = jsajax.component.getEndpoint(window.page, window.count);

    jsajax.component.addClass(jsajax.component.getGlobals().container, 'is-loading');

    jsajax.component.get(requestUrl, function (response) {
      var html = [],
          results = JSON.parse(response).data,
          pagination = JSON.parse(response).total_pages;

      setTimeout(function () {
        jsajax.component.removeClass(jsajax.component.getGlobals().container, 'is-loading');
      }, 500);

      if(results.length === 0) {

        window.lastResults = true;
        return;
      }

      for(var resultsI = 0; resultsI < results.length; resultsI++) {
        html.push('<div class="l-jsajax__block  c-block">');

        if(results[resultsI].avatar) html.push('<h3 class="c-block__image"><img src="' + results[resultsI].avatar + '" /></h3>');
        if(results[resultsI].first_name && results[resultsI].last_name) html.push('<p class="c-block__description">' + results[resultsI].first_name + ' ' + results[resultsI].last_name + '</p>');

        html.push('</div>');
      }

      jsajax.component.write(jsajax.component.getGlobals().container, html.join(''));

      jsajax.component.buildPagination(pagination);
      jsajax.component.registerLateEvents();
    });
  },

  /**
  * On click of pagination link
  * @param e
  */
  onPaginationTrigger: function (e) {
    e.preventDefault();

    var page = e.currentTarget.getAttribute('data-page'),
        requestUrl = jsajax.component.getEndpoint(page, window.count);

    jsajax.component.removeClasses(jsajax.component.getGlobals().pagination.querySelectorAll('button'), 'is-active');

    jsajax.component.addClass(e.currentTarget, 'is-active');
    jsajax.component.addClass(jsajax.component.getGlobals().container, 'is-loading');

    jsajax.component.get(requestUrl, function (response) {
      var html = [],
          results = JSON.parse(response).data,
          pagination = JSON.parse(response).total_pages;

      window.page = page;

      setTimeout(function () {
        jsajax.component.removeClass(jsajax.component.getGlobals().container, 'is-loading');
      }, 500);

      if(results.length === 0) {

        window.lastResults = true;
        return;
      }

      for(var resultsI = 0; resultsI < results.length; resultsI++) {
        html.push('<div class="l-jsajax__block  c-block">');

        if(results[resultsI].avatar) html.push('<h3 class="c-block__image"><img src="' + results[resultsI].avatar + '" /></h3>');
        if(results[resultsI].first_name && results[resultsI].last_name) html.push('<p class="c-block__description">' + results[resultsI].first_name + ' ' + results[resultsI].last_name + '</p>');

        html.push('</div>');
      }

      jsajax.component.write(jsajax.component.getGlobals().container, html.join(''));
    });
  },

  /**
  * Build pagination
  * @param pages
  */
  buildPagination: function (pages) {
    var html = [];

    for(var pagesI = 1; pagesI < (pages + 1); pagesI++) {
      html.push('<button' + (pagesI === window.page ? ' class="is-active"' : '') + ' data-page="' + pagesI + '">' + pagesI + '</button>');
    }

    jsajax.component.write(jsajax.component.getGlobals().pagination, html.join(''));
  },

  /**
  * Cast to document element
  * @param html
  * @return Element
  */
  wrapper: function (html) {
    var element = document.createElement('div');

    element.innerHTML = html;
    return element;
  },

  /**
  * Write html string to element
  * @param html
  */
  write: function (element, html) {
    if(!element) return;

    element.innerHTML = html;
  },

  /**
  * Returns full url including passed query params
  * @param page
  * @param count
  * @return String
  */
  getEndpoint: function (page, count) {
    return jsajax.component.getGlobals().endpoint + '?page=' + page + '&per_page=' + count;
  },

  /**
  * Adds class value to classes
  * @param element
  * @param clazz
  */
  addClass: function (element, clazz) {
    var findClass = element.className.split(/\s+/g).indexOf(clazz);

    if(element.classList) {
      if(findClass === -1) element.classList.add(clazz);
    } else {
      if(findClass === -1) element.className += clazz;
    }
  },

  /**
  * Removes class value from classes
  * @param element
  * @param clazz
  */
  removeClass: function (element, clazz) {
    var findClass = element.className.split(/\s+/g).indexOf(clazz);

    if(element.classList) {
      if(findClass > -1) element.classList.remove(clazz);
    } else {
      if(findClass > -1) element.className += element.className.replace(new RegExp("(^|\\b)" + clazz.split(' ').join('|') + "(\\b|$)", 'gi'), ' ').trim();
    }
  },

  /**
  * Remove array of elements class
  * @param clazz
  */
  removeClasses: function (elements, clazz) {
    if(elements.length === 0) return;

    for(var elementI = 0; elementI < elements.length; elementI++) {
      jsajax.component.removeClass(elements[elementI], clazz);
    }
  },

  /**
  * GET request using ajax
  * @param url
  * @param callback
  */
  get: function (url, callback) {
    var http = new XMLHttpRequest();

    if(window.requestActive) return;

    window.requestActive = true;

    http.onreadystatechange = function () {

      if(this.readyState === XMLHttpRequest.DONE && this.status < 400) {
        window.requestActive = false;

        if(typeof callback === 'function') callback.call(this, http.responseText);
      } else if(this.status >= 400) {
        window.requestActive = false;

        jsajax.component.logger(this.status, this.statusText);
      }
    };

    http.open('GET', url, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send();
  },

  /**
  * Log messages in console
  * @param code
  * @param message
  */
  logger: function (code, message) {
    console.log(jsajax.component.getGlobals().tag + ' [' + code + ']: ' + message);
  }
};
