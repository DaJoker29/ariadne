angular.module("ariadne", [ "ngResource", "angular.filter", "ui.bootstrap" ]);

angular.module("ariadne").controller("AdminController", [ "$scope", "Admin", "$filter", function($scope, Admin, $filter) {
    var vm = this;
    vm.stats = {};
    vm.userList = Admin.query({
        tag: "users"
    }, function() {
        vm.stats.totalUsers = vm.userList.length;
    });
    vm.taskList = Admin.query({
        tag: "tasks"
    }, function() {
        vm.stats.totalTasks = vm.taskList.length;
        vm.stats.archivedTasks = vm.archiveList;
        vm.stats.activeTasks = $filter("filter")(vm.taskList, {
            flags: {
                isActive: true,
                isArchived: false,
                isComplete: false
            }
        }).length;
        vm.stats.completeTasks = $filter("filter")(vm.taskList, {
            flags: {
                isArchived: false,
                isComplete: true
            }
        }).length;
        vm.stats.currentTasks = vm.stats.totalTasks - vm.stats.archivedTasks;
    });
    vm.feedbackList = Admin.query({
        tag: "feedback"
    }, function() {
        console.log("Feedback Queried");
    });
    vm.archiveList = Admin.query({
        tag: "archive"
    });
    // vm.stats = Admin.query({ tag: 'stats' });
    vm.archive = function() {
        Admin.save({
            tag: "archive"
        }, function() {
            console.log("Archive Run");
        });
    };
    vm.toggleUser = function(id) {};
} ]);

angular.module("ariadne").controller("FeedbackController", [ "Feedback", "$scope", function(Feedback, $scope) {
    var vm = this;
    vm.createComment = function() {
        var feedback = new Feedback();
        feedback.message = vm.newMessage;
        feedback.name = $scope.main.user.username;
        feedback.$save(function(result) {
            vm.newMessage = "";
        });
    };
} ]);

angular.module("ariadne").controller("MainController", [ "User", "Task", "$scope", "$filter", function(User, Task, $scope, $filter) {
    var vm = this;
    vm.taskList = [];
    vm.user = User.get(function() {
        Task.query(function(results) {
            vm.taskList = results;
        });
    });
} ]);

angular.module("ariadne").controller("TaskController", [ "$filter", "Task", "$scope", function($filter, Task, $scope) {
    var vm = this;
    vm.taskLimit = 9;
    vm.activeCount = $filter("filter")($scope.main.taskList, {
        flags: {
            isActive: true
        }
    }).length;
    vm.completeCount = $filter("filter")($scope.main.taskList, {
        flags: {
            isComplete: true
        }
    }).length;
    vm.newTask = {
        name: "",
        label: ""
    };
    $scope.$watch(function() {
        return $scope.main.taskList;
    }, function() {
        vm.activeCount = $filter("filter")($scope.main.taskList, {
            flags: {
                isActive: true
            }
        }).length;
        vm.completeCount = $filter("filter")($scope.main.taskList, {
            flags: {
                isComplete: true
            }
        }).length;
    });
    vm.createTask = function() {
        var task = new Task();
        angular.merge(task, vm.newTask);
        task.owner = $scope.main.user._id;
        task.$save(function(result) {
            $scope.main.taskList.push(result);
            vm.newTask = {};
        });
    };
    vm.removeTask = function(taskID) {
        Task.remove({
            id: taskID
        }, {
            justOne: true
        }, function(result) {
            $scope.main.taskList = $filter("filter")($scope.main.taskList, function(e) {
                return e._id !== taskID;
            });
        });
    };
    vm.toggle = function(taskID, flag) {
        // Check against task limit before moving to active
        if ("isActive" === flag) {
            if (!$filter("filter")($scope.main.taskList, {
                _id: taskID
            })[0].flags.isActive && $filter("filter")($scope.main.taskList, {
                flags: {
                    isActive: true
                }
            }).length >= vm.taskLimit) {
                console.log("Active Task Limit Reached");
                return;
            } else if (!$filter("filter")($scope.main.taskList, {
                _id: taskID
            })[0].flags.isActive) {
                vm.activeCount++;
            } else if ($filter("filter")($scope.main.taskList, {
                _id: taskID
            })[0].flags.isActive) {
                vm.activeCount--;
            }
        }
        // Adjust Complete Counter
        if ("isComplete" === flag) {
            if (!$filter("filter")($scope.main.taskList, {
                _id: taskID
            })[0].flags.isComplete) {
                vm.completeCount++;
            } else if ($filter("filter")($scope.main.taskList, {
                _id: taskID
            })[0].flags.isComplete) {
                vm.completeCount--;
            }
        }
        var doc = $filter("filter")($scope.main.taskList, {
            _id: taskID
        })[0];
        doc.flags[flag] = !doc.flags[flag];
        Task.save({
            _id: $scope.main.user._id,
            id: taskID
        }, doc);
    };
} ]);

angular.module("ariadne").controller("UserController", [ function() {} ]);

angular.module("ariadne").factory("Admin", [ "$resource", function($resource) {
    return $resource("/api/admin/:tag/:id", {
        tag: "@tag",
        id: "@id"
    });
} ]);

angular.module("ariadne").factory("Feedback", [ "$resource", function($resource) {
    return $resource("/api/feedback");
} ]);

angular.module("ariadne").factory("Task", [ "$resource", function($resource) {
    return $resource("/api/tasks/:id", {
        id: "@id"
    });
} ]);

angular.module("ariadne").factory("User", [ "$resource", function($resource) {
    return $resource("/api/users/:id", {
        id: "@id"
    });
} ]);