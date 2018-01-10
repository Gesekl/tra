(function () {
  'use strict';

  angular
    .module('psos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    // Menus.addMenuItem('topbar', {
    //   title: 'PSO',
    //   state: 'psos',
    //   type: 'dropdown',
    //   roles: ['hod']
    // });

    // Add the dropdown list item
    // Menus.addMenuItem('topbar',  {
    //   title: 'PSO',
    //   state: 'psos.list',
    //   roles: ['hod']
    // });
  }
}());
