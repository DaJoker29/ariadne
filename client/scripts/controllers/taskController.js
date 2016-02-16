angular
    .module('ariadne')
    .controller('TaskController', function ($filter, Task, User, $scope) {

        var vm = this;
        vm.taskLimit = 9;
        vm.taskList = [];
        vm.activeCount = $filter('filter')(vm.taskList, { flags: { isActive: true } } ).length;
        vm.completeCount = $filter('filter')(vm.taskList, { flags: { isComplete: true } } ).length;


        $scope.$watch(function () {
             return vm.taskList;
        }, function() {
            vm.activeCount = $filter('filter')(vm.taskList, { flags: { isActive: true } } ).length;
            vm.completeCount = $filter('filter')(vm.taskList, { flags: { isComplete: true } } ).length;
        });

        vm.newTask = {
            name: '',
            label: ''
        };

        vm.user = User.get();

        vm.createTask = function () {
            var task = new Task();

            angular.merge(task, vm.newTask);
            task.owner = vm.user._id;

            task.$save({_id: vm.user._id}, function ( result ) {
                vm.taskList.push( result );
                vm.newTask.name = '';
                vm.newTask.label = '';
            });
        };

        vm.removeTask = function ( taskID ) {
            Task.remove({uid: vm.uid, id: taskID}, function ( result ) {
                vm.taskList = $filter('filter')(vm.taskList, function (e) {
                    return e._id !== result._id;
                });
            });
        };

        vm.toggle = function ( taskID, flag ) {
            // Check against task limit before moving to active
            if('isActive' === flag) {
                if(
                    !$filter('filter')(vm.taskList, { _id: taskID })[0].flags.isActive &&
                    $filter('filter')(vm.taskList, { flags: { isActive: true } } ).length >= vm.taskLimit
                ) {
                    console.log('Active Task Limit Reached');
                    return;
                } else if (
                    !$filter('filter')(vm.taskList, { _id: taskID })[0].flags.isActive
                    ) {
                    vm.activeCount++;
                } else if (
                    $filter('filter')(vm.taskList, { _id: taskID })[0].flags.isActive
                    ) {
                    vm.activeCount--;
                }
            }

            if('isComplete' === flag) {
                if (!$filter('filter')(vm.taskList, { _id: taskID })[0].flags.isComplete) {
                    vm.completeCount++;
                } else if ($filter('filter')(vm.taskList, { _id: taskID })[0].flags.isComplete ) {
                    vm.completeCount--;
                }
            }

            var doc = $filter('filter')(vm.taskList, { _id: taskID })[0];
            doc.flags[flag] = !doc.flags[flag];
            Task.save( {uid: vm.uid, id: taskID}, doc);
        };
    });