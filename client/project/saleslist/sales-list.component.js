angular.module('supariApp').directive('salesList', function () {
        return {
            restrict: 'E',
            templateUrl: 'sales-list.html',
				templateUrl: 'client/project/saleslist/sales-list.html',
            controllerAs: 'salesList',
              controller: ['$scope', function ($scope, $stateParams) {
                $scope.bags = function (nStr) { //regulerExpression function add coma(,) in price range
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
                $scope.SaleEntry = function () {
                        window.location.href = "/sales";
                    };
                /*$scope.trim = function (x) {
                    x = x.substring(0, 5);
                    return x;
                };*/
              $scope.trim = function (x) {
                  var pattern=/(.*?)\/(.*?)\/(.*?)$/;
                  var result = x.replace(pattern,function(match,p2,p1){
                      var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                      return (p2<10?p2:p2)+" "+months[(p1-1)];
                  });
                  return result;
              };
                $scope.load = function (id) {
                    $("html").mask("");
                    setInterval(function () {
                        window.location.href = '/sales/' + id;
                    }, 500);
                    window.onload = function () {
                        $("html").unmask();
                        $("body").show();
                    };
                };
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
                $scope.predicate = 'date';
                $scope.reverse = true;
                $scope.order = function (predicate) {
                    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                    $scope.predicate = predicate;
                }
                $(".tableHeader,.listShadow").hide();
                var x = getCookie("LoginUser");
                Meteor.call('getNameByPin', x, function (err, data) {
                    if (!err) {
                        if (data[0].Name == "Admin") {
                            $(".stock").removeClass("hidden");
                            $(".salesparty").removeClass("hidden");
                            Meteor.call('getSalesList', function (err, data) {
                                if (!err) {
                                    $scope.Sales = data;
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
                                    var message = "Error in getNameByPin Method on Sales List Page";
                                    var error = JSON.stringify(err);
                                    Meteor.call('sendEmail',message,error);
                                }
                            });
                        }
                        else {
                            Meteor.call('getSalesDataByGodown', data[0].Name, function (err, data) {
                                if (!err) {
                                    $scope.Sales = data;
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
                                    var message = "Error in getSalesDataByGodown Method on Sales List Page for admin";
                                    var error = JSON.stringify(err);
                                    Meteor.call('sendEmail',message,error);
                                }
                            });
                        }
                    }
                    else {
                        console.log(err);
                        var message = "Error in access on Sales List Page for admin";
                        var error = JSON.stringify(err);
                        Meteor.call('sendEmail',message,error);
                    }

                });
                $scope.delete = function (id) {
                    $("#delete-modal").modal('show');
                    var that = $(this);
                    $(".yes").click(function () {
                        that.parent().parent().parent().parent().remove();
                        $("html").unmask();

                        Meteor.call('deleteSaleEntry', id, function (err, data) {
                            if (!err) {
                                $scope.updateProcessObj(id);
                            } else {
                                console.log(err);
                                var message = "Error in deleteSaleEntry method  on Sales List Page";
                                var error = JSON.stringify(err);
                                Meteor.call('sendEmail',message,error);
                            }
                        });
                    });
                }
                $scope.deleteMobile = function (id) {
                    $("#delete-modal").modal('show');
                    var that = $(this);
                    $(".yes").click(function () {
                        that.parent().parent().parent().remove();
                        $("html").unmask();
                        Meteor.call('deleteSaleEntry', id, function (err, data) {
                            if (!err) {
                                $scope.updateProcessObj(id);
                            } else {
                                console.log(err);
                                var message = "Error in deleteSaleEntry method  on Sales List Page Mobile view";
                                var error = JSON.stringify(err);
                                Meteor.call('sendEmail',message,error);
                            }
                        });
                    });
                }
                $scope.updateProcessObj = function (id) {
                    for (var i = 0; i < $scope.Sales.length; i++) {
                        if ($scope.Sales[i]._id == id) {
                            $scope.Sales.splice(i, 1);
                        }
                    }
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                    if ($(".item").length === 1) {
                        $(".tableHeader").hide();
                        $("body").append("<br><div class='container'><div class='alert alert-info'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>No Records! </div></div>");
                    }
                };
            }]
        }
    });