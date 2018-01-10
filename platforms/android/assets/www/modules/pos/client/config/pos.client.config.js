(function () {
  'use strict';

  angular
    .module('pos')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    // Menus.addMenuItem('topbar', {
    //   title: 'PO',
    //   state: 'pos',
    //   type: 'dropdown',
    //   roles: ['hod']
    // });

    // Add the dropdown list item
    // Menus.addMenuItem('topbar', {
    //   title: 'PO',
    //   state: 'pos.list',
    //   roles: ['hod']
    // }); 
  }
}());
