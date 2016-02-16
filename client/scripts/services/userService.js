angular
    .module('ariadne')
    .factory('User', function ( $resource ) {
        return $resource('/api/users/');
    });