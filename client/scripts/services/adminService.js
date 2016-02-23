angular.module('ariadne').factory('Admin',
    [ '$resource', function($resource) {
        return $resource('/api/admin/:tag/:id', { tag: '@tag', id: '@id'});
}]);