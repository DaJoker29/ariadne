angular
    .module('ariadne')
    .factory('Task', function ($resource) {
        return $resource('/api/tasks/:id');
    });