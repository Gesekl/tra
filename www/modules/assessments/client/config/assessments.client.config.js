(function () {
  'use strict';

  angular
    .module('assessments')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Assessments',
      state: 'assessments',
      type: 'dropdown',
      roles: ['lecture']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar','assessments',   {
      title: 'Marks Update',
      state: 'assessments.internal',
      roles: ['lecture']
    });
    // Add the dropdown for QP List for lecture
     Menus.addSubMenuItem('topbar','assessments',   {
      title: 'Question List',
      state: 'assessments.question',
      roles: ['lecture']
    });
    Menus.addSubMenuItem('topbar', 'assessments', {
      title: 'assessmentsList',
      state: 'assessments.list',
      roles: ['lecture']
    });

    // Add the dropdown create item
    Menus.addMenuItem('topbar', {
      title: 'Assessment Marks',
      state: 'assessments.student',
      roles: ['student']
    });
    //Add the dropdown for parent
     Menus.addMenuItem('topbar', {
      title: 'Assessment Marks',
      state: 'assessments.parent',
      roles: ['parent']
    });
    // Add the dropdown for QP List for Student
     Menus.addMenuItem('topbar',  {
      title: 'Question Paper',
      state: 'assessments.qpstudent',
      roles: ['student']
    });

    
  }
}());
