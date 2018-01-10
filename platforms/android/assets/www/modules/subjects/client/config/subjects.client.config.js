(function () {
  'use strict';

  angular
    .module('subjects')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    // Menus.addMenuItem('topbar', {
    //   title: 'Subjects',
    //   state: 'subjects',
    //   type: 'dropdown',
    //   roles: ['hod' ]
    // });
  

    // Add the dropdown list item
    // Menus.addMenuItem('topbar', {
    //   title: 'Subjects',
    //   state: 'subjects.list',
    //   roles: ['hod']
    // });

    // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'subjects', {
    //   title: 'Create Subject',
    //   state: 'subjects.create',
    //   roles: ['hod']
    // }); 


    // Add the dropdown create item
    Menus.addMenuItem('topbar', {
      title: 'Subject Allocation',
      state: 'subjects.subjectToLecture',
      position: 0,
      roles: ['hod']
    }); 

  }
}());
