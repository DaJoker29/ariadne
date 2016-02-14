angular
    .module('ariadne')
    .controller('TaskController', function ($filter, Task, User) {

        var vm = this;
        vm.taskLimit = 9;
        vm.taskList = [];

        vm.newTask = {
            name: '',
            label: ''
        };

        User.then(function ( data ) {
            vm.uid = data.uid.slice(7);
            Task.query({uid: vm.uid}, function ( results ) {
                vm.taskList = results;
            });
        }).catch( function ( err ) {
            if ( err ) { return; }
        });


        vm.createTask = function () {
            var task = new Task();

            angular.merge(task, vm.newTask);
            task.owner = vm.uid;

            task.$save({uid: vm.uid}, function ( result ) {
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
            if(
                'isActive' === flag &&
                !$filter('filter')(vm.taskList, { _id: taskID })[0].flags.isActive &&
                $filter('filter')(vm.taskList, { flags: { isActive: true } } ).length >= vm.taskLimit
                ) {
                console.log('Active Task Limit Reached');
                return;
            }

            var doc = $filter('filter')(vm.taskList, { _id: taskID })[0];
            doc.flags[flag] = !doc.flags[flag];
            Task.save( {uid: vm.uid, id: taskID}, doc);
        };
    });