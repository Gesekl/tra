(function () {
    'use strict';

    angular
        .module('colleges')
        .factory('CsvFactory', CsvFactory);

    /** @ngInject */
    function CsvFactory() {

        return {
            fn: fn
        };

        function fn() {
            alert("Hi");
        }
    }

} ());