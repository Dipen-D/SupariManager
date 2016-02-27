angular.module('supariApp').directive('purchaseList', function () {
        return {
            restrict: 'E',
			templateUrl: 'client/project/purchaselist/purchase-list.html',
            controllerAs: 'purchaseList',
            controller: ['$scope', function ($scope, $stateParams) {

                var x = getCookie("LoginUser");
                Meteor.call('getNameByPin', x, function (err, data) {
                    if (!err) {
                        if (data[0].Name == "Admin") {
                            $(".stock").removeClass("hidden");
                            $(".salesparty").removeClass("hidden");
                            $(".purchaseparty").removeClass("hidden");
                            Meteor.call('getPurchaseList', function (err, data) {

                                if (!err) {
                                    $scope.Purchase = data;
                                    if (!$scope.$$phase) {
                                        $scope.$digest();
                                    }
                                    if (data.length == 0) {
                                        $(".tableHeader,.listShadow").hide();
                                        $("body").append("<br><div class='container'><div class='alert alert-info'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>No Records! </div></div>");
                                    }
                                    else {
                                        $(".tableHeader").show();
                                    }
                                    $('[data-toggle="popover"]').popover();
                                } else {
                                    console.log(err);
                                    var message = "Error in getPurchaseList Method in Purchase List for Admin";
                                    var error = JSON.stringify(err);
                                    Meteor.call('sendEmail',message,error);
                                }


                            });
                        }
                        else {
                            Meteor.call('getPurchaseDataByGodown', data[0].Name, function (err, data) {
                                if (!err) {
                                    $scope.Purchase = data;
                                    if (!$scope.$$phase) {
                                        $scope.$digest();
                                    }
                                    if (data.length == 0) {
                                        $(".tableHeader,.listShadow").hide();
                                        $("body").append("<br><div class='container'><div class='alert alert-info'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>No Records! </div></div>");
                                    }
                                    else {
                                        $(".tableHeader").show();
                                    }
                                    $('[data-toggle="popover"]').popover();
                                } else {
                                    console.log(err);
                                    var message = "Error in getPurchaseDataByGodown Method in Purchase List for Admin";
                                    var error = JSON.stringify(err);
                                    Meteor.call('sendEmail',message,error);
                                }

                            });

                        }
                    }
                    else {
                        console.log(err);
                        var message = "Error in fetching purchase list records for admin";
                        var error = JSON.stringify(err);
                        Meteor.call('sendEmail',message,error);
                    }

                });
                $("html").mask("");
                $scope.weight = function (nStr) { //regulerExpression function add coma(,) in price range
                    nStr += '';
                    x = nStr.split('.');
                    x1 = x[0];
                    x2 = x.length > 1 ? '.' + x[1] : '';
                    var rgx = /(\d+)(\d{3})/;
                    while (rgx.test(x1)) {
                        x1 = x1.replace(rgx, '$1' + ',' + '$2');
                    }
                    return x1 + x2;
                }
                $scope.Purchase1 = function () {
                        window.location.href = "/purchase";
                }
                $scope.loader = function (id) {
                    alert(id);
                }
                $scope.pop = function (x) {
                    var bags = Math.floor(x / 65);
                    var packets = x - Math.floor(x / 65) * 65;
                    var stringObj = bags + ' * 65 ';
                    var packetObj = packets;

                    if (packets == 0) {
                        return stringObj + ' = ' + x;
                    }
                    else {
                        return stringObj + '+ ' + packetObj + ' = ' + x;
                    }
                };
                $scope.trim = function (x) {
                    var pattern=/(.*?)\/(.*?)\/(.*?)$/;
                    var result = x.replace(pattern,function(match,p2,p1){
                        var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        return (p2<10?p2:p2)+months[(p1-1)];
                    });
                    return result;
                };
               /* $scope.trim = function (x) {
                    x = x.substring(0, 5);
                    return x;
                };*/
                $scope.predicate = 'date';
                $scope.reverse = true;
                $scope.order = function (predicate) {
                    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                    $scope.predicate = predicate;
                }
                $(".tableHeader,.listShadow").hide();
                $scope.delete = function (id) {
                    $("#delete-modal").modal('show');
                    var that = $(this);
                    $(".yes").click(function () {
                        that.parent().parent().parent().parent().remove();
                        $("html").unmask();
                        Meteor.call('deletePurchaseEntry', id, function (err, data) {
                            if (!err) {
                                $("html").mask("");
                                $scope.updateProcessObj(id);
                            } else {
                                console.log(err);
                                var message = "Error in deletePurchaseEntry Method on purchase list";
                                var error = JSON.stringify(err);
                                Meteor.call('sendEmail',message,error);
                            }
                            $("html").unmask();
                        });
                    });
                };

                $scope.deleteMobile = function (id) {
                    $("#delete-modal").modal('show');
                    var that = $(this);
                    $(".yes").click(function () {
                        that.parent().parent().parent().parent().remove();
                        $("html").unmask();
                        Meteor.call('deletePurchaseEntry', id, function (err, data) {
                            if (!err) {
                                $("html").mask("");
                                $scope.updateProcessObj(id);
                            } else {
                                console.log(err);
                                var message = "Error in deletePurchaseEntry Method on purchase list for Mobile view";
                                var error = JSON.stringify(err);
                                Meteor.call('sendEmail',message,error);
                            }
                            $("html").unmask();
                        });
                    });

                };
                $scope.updateProcessObj = function (id) {
                    for (var i = 0; i < $scope.Purchase.length; i++) {
                        if ($scope.Purchase[i]._id == id) {
                            $scope.Purchase.splice(i, 1);
                        }
                    }
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                    if ($scope.Purchase.length == 0) {
                        $(".tableHeader").hide();
                        $("body").append("<br><div class='container'><div class='alert alert-info'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>No Records! </div></div>");
                    }
                };
                $(document).ready(function () {
                    $("body").hide();
                    $("html").mask("");
                    window.onload = function () {
                        $("html").unmask();
                        $("body").show();
                    };

                })


            }]
        }
    });