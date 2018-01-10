(function () {
  'use strict';

  angular
    .module('colleges')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Colleges',
      state: 'colleges',
      type: 'dropdown',
      roles: ['super']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'colleges', {
      title: 'List Colleges',
      state: 'colleges.list',
      roles: ['super']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'colleges', {
      title: 'Create College',
      state: 'colleges.create',
      roles: ['super']
    });
  }
}());
