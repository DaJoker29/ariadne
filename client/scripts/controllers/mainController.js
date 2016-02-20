angular.module('ariadne').controller(
    'MainController', [ 'User', 'Task', '$scope', '$filter', function(User, Task, $scope, $filter) {
        var vm = this;
        vm.taskList = [];

        vm.user = User.get( function () {
            Task.query({ _id: vm.user._id }, function ( results ) {
                vm.taskList = results;
            });
        });
}]);