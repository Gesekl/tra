'use strict';

angular
    .module ('core')
    .directive ('toggle', function () {
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                if (attrs.toggle === "tooltip"){
                    $(element).tooltip();
                }else if (attrs.toggle === "popover"){
                    $(element).popover();
                }
            }
        };
    
    });
 