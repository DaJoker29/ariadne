angular
    .module('ariadne')
    .factory('Task', [ '$resource', function ($resource) {
        return $resource('/api/tasks/:id', { id: '@id'});
    }]);