angular.module('supariApp').directive('purchaseparty', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/project/purchaseparty/purchaseparty.html',
        controllerAs: 'purchaseparty',
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
            Meteor.call('getPurchaseAccountNameAddParty', function (err, data) {
                if (!err) {
                    $scope.Purchase = data;
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                } else {
                    console.log(err);
                    var message = "Error in getPurchaseAccountNameAddParty Method adding new purchase account";
                    var error = JSON.stringify(err);
                    Meteor.call('sendEmail', message, error);
                }
            });

            $scope.delete = function (id,name) {
                $("#delete-modal").modal('show');
                $scope.confirm = function(){
                    Meteor.call('CheckForTransactionBeforeDelete', name,function(err, data) {
                        if (!err) {
                            if(data.length == 0){
                                Meteor.call('DeletePurchaseAccountparty', id, function (err, data) {
                                    if (!err) {
                                        location.reload();
                                        $scope.updateProcessObj(id);

                                    } else {
                                        console.log(err);
                                        var message = "Error in Deleting Purchase party";
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
                for (var i = 0; i < $scope.Purchase.length; i++) {
                    if ($scope.Purchase[i]._id == id) {
                        $scope.Purchase.splice(i, 1);
                    }
                }
            };
            $scope.create = function(){
                $("#party-modals").modal("show");
                var name = $("#name").val();
                $scope.add = function(name){
                    var name = $("#name").val();
                    Meteor.call('checkForDuplicatePurchaseAccount',name, function (err, data) {
                        if (!err) {
                            if(data.length == 0){
                                var name = $("#name").val();
                                Meteor.call('AddNewPurchaseAccountParty',name, function (err, data) {
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