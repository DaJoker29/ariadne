angular
    .module('ariadne')
    .controller('UserController', function ($firebaseArray, $firebaseAuth, $log) {


        var ref = new Firebase('https://ariadne-todo.firebaseio.com'); //eslint-disable-line no-undef
        var auth = $firebaseAuth(ref);
        var vm = this;

        vm.authenticated = false;

        vm.signIn = function () {
            auth.$authWithOAuthPopup('google').then(function ( data ) {
                vm.user = data;
                vm.authenticated = true;
                $log.log('Authenticated', data);
            }).catch( function( err ) {
                $log.log('Error:', err);
            });
        };

        vm.logOut = function () {
            auth.$unauth();
            vm.authenticated = false;
            vm.user = null;
            $log.log('UnAuthenticated');
        };
    });