(function () {
  'use strict';

  angular
    .module('programs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Department',
      state: 'programs',
      type: 'dropdown',
      roles: ['college_admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'programs', {
      title: 'List Programs',
      state: 'programs.list',
      roles: ['college_admin']
    });


  }
}());
