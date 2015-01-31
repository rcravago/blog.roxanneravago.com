(function () {
  var sidebarToggleEl = document.getElementById('sidebar-toggle');

  sidebarToggleEl.addEventListener('click', function () {
    toggleClass(document.body, 'sidebar-open');
  });

  function hasClass (el, className) {
    return (' ' + el.className + ' ').indexOf(className) > -1;
  }

  function toggleClass (el, className) {
    if (hasClass(el, className)) {
      return el.className = el.className.replace(' ' + className, '');
    }

    el.className += ' ' + className;
  }
})();