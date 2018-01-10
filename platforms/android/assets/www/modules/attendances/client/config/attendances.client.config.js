(function () {
  'use strict';

  angular
    .module('attendances')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Attendances',
      state: 'attendances',
      type: 'dropdown',
      roles: ['lecture','student','parent','hod','college_admin']
    });

   //Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'attendances', {
         title: 'Attendance Summary',
         state: 'attendances.studentsummary',
         roles: ['student','college_admin']
     });
    // Add the dropdown list item for parent
    Menus.addSubMenuItem('topbar', 'attendances', {
         title: 'Attendance Summary',
         state: 'attendances.parent',
         roles: ['parent','college_admin']
     });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'attendances', {
      title: 'Attendance',
      state: 'attendances.create',
      roles: ['lecture']
    });
    Menus.addSubMenuItem('topbar', 'attendances', {
      title: 'Attendance update',
      state: 'attendances.update',
      roles: ['lecture','college_admin']
    });
    //Add the dropdown summary item 
     Menus.addSubMenuItem('topbar', 'attendances', {
      title: 'Summary',
      state: 'attendances.summary',
      roles: ['lecture','college_admin']
    });
  }
}());
