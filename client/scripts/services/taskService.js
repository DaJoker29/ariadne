angular
    .module('ariadne')
    .factory('Task', function ($resource) {

        return $resource('/api/users/:uid/tasks/:id', {uid: '@uid', id: '@id'});
    });