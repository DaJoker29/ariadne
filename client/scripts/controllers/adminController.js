angular.module('ariadne').controller('AdminController',
    [ '$scope', 'Admin', '$filter', function( $scope, Admin, $filter) {

        var vm = this;

        vm.stats = {};
        vm.userList = Admin.query({ tag: 'users'}, function() {
            vm.stats.totalUsers = vm.userList.length;
        });

        vm.taskList = Admin.query({ tag: 'tasks'}, function() {
            vm.stats.totalTasks = vm.taskList.length;
            vm.stats.archivedTasks = vm.archiveList;
            vm.stats.activeTasks = $filter('filter')(vm.taskList, { flags: { isActive: true, isArchived: false, isComplete: false } } ).length;
            vm.stats.completeTasks = $filter('filter')(vm.taskList, { flags: { isArchived: false, isComplete: true } } ).length;
            vm.stats.currentTasks = vm.stats.totalTasks - vm.stats.archivedTasks;
        });

        vm.feedbackList = Admin.query({ tag: 'feedback'}, function() {
            console.log('Feedback Queried');
        });

        vm.archiveList = Admin.query({ tag: 'archive'});

        // vm.stats = Admin.query({ tag: 'stats' });

        vm.archive = function() {
            Admin.save({tag: 'archive'}, function() {
                console.log('Archive Run');
            });
        };

        vm.toggleUser = function ( id ) {

        };
    }]);