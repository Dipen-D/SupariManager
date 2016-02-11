angular.module('supariApp').directive('processList', function () {
        return {
            restrict: 'E',
			templateUrl: 'client/project/processlist/process-list.html',
            controllerAs: 'processList',
             controller: ['$scope', function ($scope, $stateParams) {
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
                $scope.ProcessEntry = function () {
                    $("html").mask("");
                    setInterval(function () {
                        window.location.href = "/process";
                    }, 100);
                    $("html").mask("");
                    window.onload = function () {
                        $("html").unmask();
                        $("body").show();
                    };
                }
                $scope.trim = function (x) {
                    x = x.substring(0, 5);
                    return x;
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
                $(".tableHeader,.listShadow").hide();
                Meteor.call('getAccounts', function (err, data) {
                    if (!err) {
                        $scope.PurchaseAccountNames = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    } else {
                        console.log(err);
                        var message = "Error in getAccounts Process-List Page";
                        var error = JSON.stringify(err);
                        Meteor.call('sendEmail',message,error);
                    }
                });
                var x = getCookie("LoginUser");
                Meteor.call('getNameByPin', x, function (err, data) {
                    if (!err) {
                        if (data[0].Name == "Admin") {
                            $(".stock").removeClass("hidden");
                            Meteor.call('getProcessList', function (err, data) {
                                if (!err) {
                                    $scope.Process = data;
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
                                    var message = "Error in getAccounts Process-List Page for Admin";
                                    var error = JSON.stringify(err);
                                    Meteor.call('sendEmail',message,error);
                                }
                            });
                        }
                        else {
                            Meteor.call('getProcessDataByGodown', data[0].Name, function (err, data) {
                                if (!err) {
                                    $scope.Process = data;
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
                                    var message = "Error in getProcessDataByGodown Process-List Page for Admin";
                                    var error = JSON.stringify(err);
                                    Meteor.call('sendEmail',message,error);
                                }
                            });

                        }
                    }
                    else {
                        console.log(err);
                        var message = "Error in getProcessDataByGodown Process-List Page";
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
                        Meteor.call('deleteProcessEntry', id, function (err, data) {
                            if (!err) {
                                $scope.updateProcessObj(id);
                            } else {
                                console.log(err);
                                var message = "Error in deleteProcessEntry Method in Process-List Page";
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
                        Meteor.call('deleteProcessEntry', id, function (err, data) {
                            if (!err) {
                                $scope.updateProcessObj(id);
                            } else {
                                console.log(err);
                                var message = "Error in deleteProcessEntry Method in Process-List Page Mobile View";
                                var error = JSON.stringify(err);
                                Meteor.call('sendEmail',message,error);
                            }
                        });
                    });
                }
                $scope.predicate = 'date';
                $scope.reverse = true;
                $scope.order = function (predicate) {
                    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                    $scope.predicate = predicate;
                };
                $scope.updateProcessObj = function (id) {
                    for (var i = 0; i < $scope.Process.length; i++) {
                        if ($scope.Process[i]._id == id) {
                            $scope.Process.splice(i, 1);
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
