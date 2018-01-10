// (function () {
//   'use strict';

//   angular
//     .module('attainments')
//     .run(menuConfig);

//   menuConfig.$inject = ['Menus'];

//   function menuConfig(Menus) {
   
//     // // Set top bar menu items
//     Menus.addMenuItem('topbar', {
//       title: 'Attainments',
//       state: 'attainments',
//       type: 'dropdown',
//       roles: ['hod','lecture']
//     });
      
//     // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'attainments', {
//       title: 'My Subjects Attainment Summary',
//       state: 'attainments.mysubjectattainment',
//       roles: ['lecture']
//     });

//      // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'attainments', {
//       title: 'Subject Attainment',
//       state: 'attainments.subjectattainment',
//       roles: ['lecture']
//     });

//       // Add the dropdown list item
//     Menus.addSubMenuItem('topbar', 'attainments',  {
//       title: 'Attainment Summary',
//       state: 'attainments.batchattainment',
//       roles: ['hod']
//     }); 

//   }
// }());
