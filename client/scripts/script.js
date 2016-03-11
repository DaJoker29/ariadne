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
        vm.stats.currentTasks = vm.stats.totalTasks - vm.archiveList.length;
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
    vm.taskLimit = 5;
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
    vm.newTask = {};
    vm.newParent = null;
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
        if (vm.newParent) {
            task.parent = vm.newParent._id;
        }
        task.$save(function(result) {
            $scope.main.taskList.push(result);
            vm.newTask = {};
            delete vm.newParent;
            // Set Parent
            if (result.parent) {
                vm.addChild(result.parent, result._id);
            }
            console.log(result);
        });
        $("#createTask").modal("hide");
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
    vm.addChild = function(parentID, childID) {};
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

/*
    Github: jQuery plugin
 */
(function($) {
    $.fn.qod = function(options) {
        // Parameters
        var settings = $.extend({}, options);
        // Variables
        var rootURL = "http://quotes.rest";
        var endpoint = "/qod.json";
        var that = this;
        // Fetch Data
        $.ajax({
            url: rootURL + endpoint,
            success: function(data) {
                that.prepend(buildDOM(data));
            },
            error: function() {
                console.log("Problem fetching quote");
            }
        });
        function buildDOM(data) {
            var quote = data.contents.quotes[0];
            return $("<div>").addClass("well").append("<blockquote>").find("blockquote").append("<p>" + quote.quote + "</p>").append("<footer>" + quote.author + "</footer>").append('<span style="z-index:50;font-size:0.9em;"><img src="https://theysaidso.com/branding/theysaidso.png" height="20" width="20" alt="theysaidso.com"/><a href="https://theysaidso.com" title="Powered by quotes from theysaidso.com" style="color: #9fcc25; margin-left: 4px; vertical-align: middle;">theysaidso.com</a></span>');
        }
        return this;
    };
})(jQuery);

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