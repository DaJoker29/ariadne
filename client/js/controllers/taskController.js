app.controller(
    'taskController',
    ['$scope', '$resource', '$filter', function ($scope, $resource, $filter) {

        // Defaults
        $scope.taskName = '';
        $scope.taskCategory = 'Personal';
        $scope.tasks = [];

        var Tasks = $resource('/api/tasks');
        var Task = $resource('/api/tasks/:id', {id: '@id'});

        Tasks.query(function ( results ) {
            $scope.tasks = results;
        });

        $scope.createTask = function () {
            var task = new Tasks();
            task.name = $scope.taskName;
            task.category = $scope.taskCategory;
            task.$save(function ( result ) {
                $scope.tasks.push( result );
                $scope.taskName = '';
                $scope.taskCategory = 'Personal';
            });
        };

        $scope.removeTask = function ( taskID ) {
            Task.remove({id: taskID}, function ( result ) {
                $scope.tasks = $filter('filter')($scope.tasks, function (e) {
                    return e._id !== result._id;
                });

            })
        }

        $scope.toggleActive = function ( taskID ) {
            var doc = $filter('filter')($scope.tasks, { _id: taskID })[0];
            doc.current = !doc.current;
            Task.save( {id: taskID}, doc, function() {
                return;
            });
        };
}]);