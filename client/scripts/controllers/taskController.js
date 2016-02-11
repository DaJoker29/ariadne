angular
    .module('ariadne')
    .controller('TaskController', function ($filter, Task) {

        // Defaults
        var vm = this;

        vm.taskName = '';
        vm.taskCategory = 'Personal';
        vm.tasks = [];

        Task.query(function ( results ) {
            vm.tasks = results;
        });

        vm.createTask = function () {
            var task = new Task();
            task.name = vm.taskName;
            task.category = vm.taskCategory;
            task.$save(function ( result ) {
                vm.tasks.push( result );
                vm.taskName = '';
                vm.taskCategory = 'Personal';
            });
        };

        vm.removeTask = function ( taskID ) {
            Task.remove({id: taskID}, function ( result ) {
                vm.tasks = $filter('filter')(vm.tasks, function (e) {
                    return e._id !== result._id;
                });
            });
        };

        vm.toggleActive = function ( taskID ) {
            var doc = $filter('filter')(vm.tasks, { _id: taskID })[0];
            doc.current = !doc.current;
            Task.save( {id: taskID}, doc, function() {
                return;
            });
        };

        vm.toggleCompletion = function ( taskID ) {
            var doc = $filter('filter')(vm.tasks, { _id: taskID })[0];
            doc.completed = !doc.completed;
            Task.save( {id: taskID}, doc, function() {
                return;
            });
        };
    });