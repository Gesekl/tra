(function () {
  'use strict';

  angular
    .module('lectures')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    
    // // Set top bar menu items
    // Menus.addMenuItem('topbar', {
    //   title: 'Lectures',
    //   state: 'lectures',
    //   type: 'dropdown',
    //   roles: ['hod', 'lecture']
    // });

    // Add the dropdown list item
    // Menus.addMenuItem('topbar', {
    //   title: 'Lectures',
    //   state: 'lectures.list',
    //   roles: ['hod' ]
    // });

    // // Add the dropdown list item
    // Menus.addMenuItem('topbar', {
    //   title: 'Subjects',
    //   state: 'lectures.mysubjects',
    //   roles: ['lecture' ]
    // });
    

    // // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'lectures', {
    //   title: 'Create Lecture',
    //   state: 'lectures.create',
    //   roles: ['hod']
    // });
  }
}());
