angular
    .module('ariadne')
    .factory('Task', function ($resource) {

        return $resource('/api/users/:_id/tasks/:id', {_id: '@_id', id: '@id'});
    });