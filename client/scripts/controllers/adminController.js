angular.module('ariadne').controller('AdminController',
    [ '$scope', 'User', 'Task', '$filter', function( $scope, User, Task, $filter) {

        var vm = this;

        vm.stats = {};
        vm.userList = User.query({ id: 'all'}, function() {
            vm.stats.totalUsers = vm.userList.length;
        });

        vm.taskList = Task.query({}, function() {
            vm.stats.totalTasks = vm.taskList.length;
            vm.stats.archivedTasks = $filter('filter')(vm.taskList, { flags: { isArchived: true } } ).length;
            vm.stats.activeTasks = $filter('filter')(vm.taskList, { flags: { isActive: true, isArchived: false, isComplete: false } } ).length;
            vm.stats.completeTasks = $filter('filter')(vm.taskList, { flags: { isArchived: false, isComplete: true } } ).length;
            vm.stats.currentTasks = vm.stats.totalTasks - vm.stats.archivedTasks;
        });

        vm.archive = function() {
            User.get({id: 'archive'}, function() {

            });
        };

        vm.toggleUser = function ( id ) {

        };
    }]);