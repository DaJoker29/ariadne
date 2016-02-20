angular.module('ariadne').controller('FeedbackController',
    [ 'Feedback', '$scope', function(Feedback, $scope) {
        var vm = this;

        vm.createComment = function() {
            var feedback = new Feedback();
            feedback.message = vm.newMessage;
            feedback.name = $scope.main.user.username;
            feedback.$save(function (result) {
                vm.newMessage = '';
            });
        };
    }]);
