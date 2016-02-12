angular
    .module('ariadne')
    .controller('TaskController', function ($filter, Task, User) {


        var vm = this;
        vm.taskName = '';
        vm.taskCategory = 'Personal';
        vm.tasks = [];

        User.then(function ( data ) {
            vm.uid = data.uid.slice(7);
            Task.query({uid: vm.uid}, function ( results ) {
                vm.tasks = results;
            });
        }).catch( function ( err ) {
            if ( err ) { return; }
        });


        vm.createTask = function () {
            var task = new Task();
            task.name = vm.taskName;
            task.category = vm.taskCategory;
            task.owner = vm.uid;
            task.$save({uid: vm.uid}, function ( result ) {
                vm.tasks.push( result );
                vm.taskName = '';
                vm.taskCategory = 'Personal';
            });
        };

        vm.removeTask = function ( taskID ) {
            Task.remove({uid: vm.uid, id: taskID}, function ( result ) {
                vm.tasks = $filter('filter')(vm.tasks, function (e) {
                    return e._id !== result._id;
                });
            });
        };

        vm.toggleActive = function ( taskID ) {
            var doc = $filter('filter')(vm.tasks, { _id: taskID })[0];
            doc.current = !doc.current;
            Task.save( {uid: vm.uid, id: taskID}, doc, function() {
                return;
            });
        };

        vm.toggleCompletion = function ( taskID ) {
            var doc = $filter('filter')(vm.tasks, { _id: taskID })[0];
            doc.completed = !doc.completed;
            Task.save( {uid: vm.uid, id: taskID}, doc, function() {
                return;
            });
        };
    });