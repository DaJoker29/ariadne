angular.module('ariadne').controller('FeedbackController',
    [ 'Feedback', '$scope', function(Feedback, $scope) {
        var vm = this;

        // vm.comments = Feedback.query();

        vm.createComment = function() {
            var feedback = new Feedback();
            feedback.message = vm.newMessage;
            feedback.name = $scope.main.user.username;
            feedback.$save(function (result) {
                vm.comments.push(result);
                vm.newMessage = '';
            });
        };
    }]);