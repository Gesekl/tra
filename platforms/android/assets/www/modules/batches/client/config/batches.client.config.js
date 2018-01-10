(function () {
  'use strict';

  angular
    .module('batches')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Program',
      state: 'batches',
      type: 'dropdown',
      position: -1,
      roles: ['hod','lecture','admin']
    });
    
    // // Add the dropdown list item
    // Menus.addMenuItem('topbar', {
    //   title: 'Program',
    //   state: 'batches.list',      
    //   roles: ['hod']
    // });

    // // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'batches',  {
      title: 'Batches',
      state: 'batches.list',
      roles: ['hod','admin']
    });

     // // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'batches',  {
      title: 'Lectures',
      state: 'lectures.list',
      roles: ['hod','admin']
    });

     // // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'batches',  {
      title: 'Students',
      state: 'students.list',
      roles: ['hod','admin']
    });

     // // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'batches',  {
      title: 'Subjects',
      state: 'subjects.list',
      roles: ['hod']
    });

       // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'batches', {
      title: 'Subjects',
      state: 'lectures.mysubjects',
      roles: ['lecture' ]
    });

     // // Add the dropdown list item
     //hiding veda
    // Menus.addSubMenuItem('topbar', 'batches',  {
    //   title: 'Program Outcome',
    //   state: 'pos.list',
    //   roles: ['hod']
    // });

    //  Menus.addSubMenuItem('topbar', 'batches',  {
    //   title: 'Program Specific Outcome',
    //   state: 'psos.list',
    //   roles: ['hod']
    // });

    // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'batches', {
    //   title: 'Create Batch',
    //   state: 'batches.create',
    //   roles: ['hod']
    // });

    //  // Add the dropdown create item
    //  //hiding veda
    // Menus.addMenuItem('topbar', {
    //   title: 'Outcome',
    //   state: 'batches.co',
    //   roles: ['hod']
    // });

     // Add the dropdown create item
    // Menus.addSubMenuItem('topbar', 'batches', {
    //   title: 'CO-PSO',
    //   state: 'batches.copso',
    //   roles: ['hod']
    // });
  }
}());
