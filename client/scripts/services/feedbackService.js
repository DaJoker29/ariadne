angular.module('ariadne').factory('Feedback',
    [ '$resource', function($resource) {
        return $resource('/api/feedback');
    }]);