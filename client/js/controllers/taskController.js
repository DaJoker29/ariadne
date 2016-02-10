app.controller(
    'taskController',
    ['$scope', '$resource', '$filter', function ($scope, $resource, $filter) {

        // Defaults
        $scope.taskName = '';
        $scope.taskCategory = 'Personal';
        $scope.tasks = [];

        var Task = $resource('/api/tasks');

        Task.query(function ( results ) {
            $scope.tasks = results;
        });

        $scope.createTask = function () {
            var task = new Task();
            task.name = $scope.taskName;
            task.category = $scope.taskCategory;
            task.$save(function ( result ) {
                $scope.tasks.push( result );
                $scope.taskName = '';
                $scope.taskCategory = 'Personal';
            });
        };

        $scope.removeTask = function ( taskID ) {
            var Task = $resource('/api/tasks/:id', {id: '@id'});
            var task = Task.remove({id: taskID}, function ( result ) {
                $scope.tasks = $filter('filter')($scope.tasks, function (e) {
                    return e._id !== result._id;
                });

            })
        }
}]);