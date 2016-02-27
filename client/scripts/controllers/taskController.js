angular
    .module('ariadne')
    .controller('TaskController', [ '$filter', 'Task', '$scope', function ($filter, Task, $scope) {

        var vm = this;

        vm.taskLimit = 5;
        vm.activeCount = $filter('filter')($scope.main.taskList, { flags: { isActive: true } } ).length;
        vm.completeCount = $filter('filter')($scope.main.taskList, { flags: { isComplete: true } } ).length;

        vm.newTask = {};
        vm.newParent = null;

        $scope.$watch(function () {
             return $scope.main.taskList;
        }, function() {
            vm.activeCount = $filter('filter')($scope.main.taskList, { flags: { isActive: true } } ).length;
            vm.completeCount = $filter('filter')($scope.main.taskList, { flags: { isComplete: true } } ).length;
        });


        vm.createTask = function () {
            var task = new Task();

            angular.merge(task, vm.newTask);
            task.owner = $scope.main.user._id;

            if(vm.newParent) {
                task.parent = vm.newParent._id;
            }

            task.$save(function ( result ) {
                $scope.main.taskList.push( result );
                vm.newTask = {};
                delete vm.newParent;

                // Set Parent
                if(result.parent) {
                    vm.addChild( result.parent, result._id);
                }
                console.log(result);
            });
            $('#createTask').modal('hide');
        };

        vm.removeTask = function ( taskID ) {
            Task.remove({id: taskID}, { justOne: true }, function ( result ) {
                $scope.main.taskList = $filter('filter')($scope.main.taskList, function (e) {
                    return e._id !== taskID;
                });
            });
        };

        vm.addChild = function ( parentID, childID ) {
            // // Add Parent to Child
            // Task.save({id: childID}, { parent: parentID });

            // var parentChildren = $filter('filter')($scope.main.taskList, { _id: parent })[0].children;
            // parentChildren.push(childID);
            // // Add Child to Parent's Children
            // Task.save({id: parentID}, { $push children: parentChildren });

            // $filter('filter')($scope.main.taskList, { _id: parentID })[0].children.push(childID);

        };

        vm.toggle = function ( taskID, flag ) {
            // Check against task limit before moving to active
            if('isActive' === flag) {
                if(
                    !$filter('filter')($scope.main.taskList, { _id: taskID })[0].flags.isActive &&
                    $filter('filter')($scope.main.taskList, { flags: { isActive: true } } ).length >= vm.taskLimit
                ) {
                    console.log('Active Task Limit Reached');
                    return;
                } else if (
                    !$filter('filter')($scope.main.taskList, { _id: taskID })[0].flags.isActive
                    ) {
                    vm.activeCount++;
                } else if (
                    $filter('filter')($scope.main.taskList, { _id: taskID })[0].flags.isActive
                    ) {
                    vm.activeCount--;
                }
            }

            // Adjust Complete Counter
            if('isComplete' === flag) {
                if (!$filter('filter')($scope.main.taskList, { _id: taskID })[0].flags.isComplete) {
                    vm.completeCount++;
                } else if ($filter('filter')($scope.main.taskList, { _id: taskID })[0].flags.isComplete ) {
                    vm.completeCount--;
                }
            }

            var doc = $filter('filter')($scope.main.taskList, { _id: taskID })[0];
            doc.flags[flag] = !doc.flags[flag];
            Task.save( {_id: $scope.main.user._id, id: taskID}, doc);
        };
    }]);
