angular
    .module('ariadne')
    .factory('User', function ( $firebaseAuth ) {

        var ref = new Firebase('https://ariadne-todo.firebaseio.com'); //eslint-disable-line no-undef
        var auth = $firebaseAuth(ref);

        return auth.$authWithOAuthPopup('google');
    });