angular.module('supariApp').directive('salesparty', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/project/salesparty/salesparty.html',
        controllerAs: 'salesparty',
        controller: function ($scope, $reactive, $meteor, $stateParams) {
            $reactive(this).attach($scope);
            $(".stock").removeClass("hidden");
            $(".salesparty").removeClass("hidden");

            $scope.predicate = 'Name';
            $scope.reverse = true;
            $scope.order = function (predicate) {
                $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                $scope.predicate = predicate;
            }
            Meteor.call('getSalesAccountNameAddParty', function (err, data) {
                if (!err) {
                    $scope.Sales = data;
                    console.log(data);
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                } else {
                    console.log(err);
                    var message = "Error in getPurchaseList Method in Purchase List for Admin";
                    var error = JSON.stringify(err);
                    Meteor.call('sendEmail', message, error);
                }
            });

            $scope.delete = function (id) {
                $("#delete-modal").modal('show');
                    $scope.confirm = function(){
                        Meteor.call('DeleteSalesAccountParty', id, function (err, data) {
                            if (!err) {
                                $scope.updateProcessObj(id);
                                location.reload();
                            } else {
                                console.log(err);
                                var message = "Error in Deleting Sales party";
                                var error = JSON.stringify(err);
                                Meteor.call('sendEmail',message,error);
                            }
                        });

                    }

            };
            $scope.updateProcessObj = function (id) {
                for (var i = 0; i < $scope.Sales.length; i++) {
                    if ($scope.Sales[i]._id == id) {
                        $scope.Sales.splice(i, 1);
                    }
                }
            };
            $scope.create = function(){
                $("#salesparty-modals").modal("show");
                    var name = $("#account").val();
                    var tagad = $("#tagad").val();
                    $scope.add = function(name){
                        var name = $("#account").val();
                        var tagad = $("#tagad").val();
                        Meteor.call('AddNewSalesAccountparty', name,tagad, function (err, data) {
                            if (!err) {
                                $("html").mask("");
                                location.reload();
                            }

                        });


                    };
            }
            }
    }
});