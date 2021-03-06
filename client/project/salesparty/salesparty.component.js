angular.module('supariApp').directive('salesparty', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/project/salesparty/salesparty.html',
        controllerAs: 'salesparty',
        controller: function ($scope, $reactive, $meteor, $stateParams) {
            $reactive(this).attach($scope);

            var x = getCookie("LoginUser");
            Meteor.call('getNameByPin', x, function (err, data) {
                if (!err) {
                    if (data[0].Name == "Admin") {

                    }
                    else{
                        window.location.href="/birthdaycalculator";

                    }
                }
            });
            $(".stock").removeClass("hidden");
            $(".salesparty").removeClass("hidden");
            $(".purchaseparty").removeClass("hidden");
            $scope.predicate = 'Name';
            $scope.reverse = true;
            $scope.order = function (predicate) {
                $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                $scope.predicate = predicate;
            }
            Meteor.call('getSalesAccountNameAddParty', function (err, data) {
                if (!err) {
                    $scope.Sales = data;
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

            $scope.delete = function (id,tagad) {
                $("#delete-modal").modal('show');
                    $scope.confirm = function(){
                        Meteor.call('CheckForTransactionBeforeDelete', tagad,function(err, data) {
                            if (!err) {
                                if(data.length == 0){
                                    Meteor.call('DeleteSalesAccountParty', id, function (err, data) {
                                        if (!err) {
                                            location.reload();
                                            $scope.updateProcessObj(id);
                                        } else {
                                            console.log(err);
                                            var message = "Error in Deleting Sales party";
                                            var error = JSON.stringify(err);
                                            Meteor.call('sendEmail',message,error);
                                        }
                                    });
                                }
                                else{
                                   $("#recordExists").modal("show");
                                }
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
                    var tagad = $("#tagad").val();
                    $scope.add = function(name){
                        var tagad = $("#tagad").val();
                        Meteor.call('CheckForDuplicateAccount',tagad, function (err, data) {
                            if (!err) {
                                if(data.length == 0){
                                    var tagad = $("#tagad").val();
                                    Meteor.call('AddNewSalesAccountparty',tagad, function (err, data) {
                                        if (!err) {
                                            $("html").mask("");
                                            location.reload();
                                        }

                                    });
                                }
                                else{
                                   $("#alert-modal").modal("show");
                                }

                            }});

                 };
            }

       }
    }
});