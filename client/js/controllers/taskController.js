app.controller(
    'taskController',
    ['$scope', '$resource', function ($scope, $resource) {

        // Defaults
        $scope.taskName = '';
        $scope.taskCategory = 'Personal';

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
}]);