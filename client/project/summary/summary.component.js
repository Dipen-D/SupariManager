 angular.module('supariApp').directive('summary', function () {
        return {
            restrict: 'E',
			  templateUrl: 'client/project/summary/summary.html',
            controllerAs: 'summary',
         controller: function ($scope, $reactive, $meteor, $stateParams) {
                $("p").hide();
                $(".table").hide();
                function add_commasInAmount(nStr) { //regulerExpression function add coma(,) in price range
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

                function Show() {
                    $("html").addClass("fixed");
                    $("html").mask("");
                }

                $("#datePicker").datepicker({
                    autoclose: true,
                    todayHighlight: true
                });
                var x = getCookie("LoginUser");

                Meteor.call('getNameByPin', x, function (err, data) {
                    if (!err) {
                        if (data[0].Name == "Admin") {
                            $("#godown").removeClass("hidden");
                            $(".stock").removeClass("hidden");
                        }
                    }
                });

                $scope.Summary = function () {
                    Show();
                    setTimeout(function () {
                        $("html").removeClass("fixed");
                        $("p").show();
                        $(".table").show();
                        $("html").unmask();
                    }, 299);
                    var date = $("#datePicker").val();
                    var convertDate = function (usDate) {
                        var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                        return dateParts[3] + "-" + dateParts[1] + "-" + dateParts[2];
                    }

                    var outDate = convertDate(date);
                    //-------------------------------------------------OPP STOCK-------------------------------------------//
                    Meteor.call('getNameByPin', x, function (err, data) {

                        var godownchoice = $("#godown").val();
                        if (!err) {
                            if (data[0].Name == "Admin") {
                                $(".table-opening tbody").html('');
                                if (godownchoice == "All") {
                                    Meteor.call('getOpeningStockViaDate', date, function (err, data) {
                                        var bags = 0;
                                        var packets = 0;
                                        var kgs = 0;
                                        if (!err) {
                                            $scope.OpeningStock1 = data;
                                            var obj = "";
                                            for (i = 0; i < data.length; i++) {
                                                obj += '<tr class="' + data[i].Name + '">';
                                                obj += '<td>' + data[i].Name + '</td>';
                                                obj += '<td>' + Math.floor(data[i].Kgs / 65) + '</td>';
                                                obj += '<td> ' + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65) + '</td>';
                                                obj += '<td>' + data[i].Kgs + '</td>';
                                                obj += '</tr>';

                                                bags = bags + Math.floor(data[i].Kgs / 65);
                                                packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                                kgs = kgs + data[i].Kgs;
                                            }
                                            $(".table-opening tbody").append(obj);
                                        }
                                        else {
                                            console.log(err);
                                        }
                                        var ob = '';
                                        ob += '<tr class="' + "Total" + '">';
                                        ob += '<td>' + "Total" + '</td>';
                                        ob += '<td>' + bags + '</td>';
                                        ob += '<td> ' + packets + '</td>';
                                        ob += '<td>' + kgs + '</td>';
                                        ob += '</tr>';
                                        $(".table-opening tbody").append(ob);
                                    });
                                }
                                else {
                                    $(".table-opening tbody").html('');
                                    Meteor.call('getOpeningStockViaDateForGodown', date, godownchoice, function (err, data) {
                                        var bags = 0;
                                        var packets = 0;
                                        var kgs = 0;
                                        if (!err) {
                                            $scope.OpeningStock1 = data;
                                            var obj = "";
                                            for (i = 0; i < data.length; i++) {
                                                obj += '<tr class="' + data[i].Name + '">';
                                                obj += '<td>' + data[i].Name + '</td>';
                                                obj += '<td>' + Math.floor(data[i].Kgs / 65) + '</td>';
                                                obj += '<td> ' + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65) + '</td>';
                                                obj += '<td>' + data[i].Kgs + '</td>';
                                                obj += '</tr>';

                                                bags = bags + Math.floor(data[i].Kgs / 65);
                                                packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                                kgs = kgs + data[i].Kgs;

                                            }
                                            $(".table-opening tbody").append(obj);
                                        }
                                        else {
                                            console.log(err);
                                        }
                                        var ob = '';
                                        ob += '<tr class="' + "Total" + '">';
                                        ob += '<td>' + "Total" + '</td>';
                                        ob += '<td>' + bags + '</td>';
                                        ob += '<td> ' + packets + '</td>';
                                        ob += '<td>' + kgs + '</td>';
                                        ob += '</tr>';
                                        $(".table-opening tbody").append(ob);
                                    });
                                }
                            }
                            else {
                                $(".table-opening tbody").html('');
                                Meteor.call('getOpeningStockViaDateForGodown', date, data[0].Name, function (err, data) {
                                    var bags = 0;
                                    var packets = 0;
                                    var kgs = 0;
                                    if (!err) {
                                        $scope.OpeningStock1 = data;
                                        var obj = "";
                                        for (i = 0; i < data.length; i++) {
                                            obj += '<tr class="' + data[i].Name + '">';
                                            obj += '<td>' + data[i].Name + '</td>';
                                            obj += '<td>' + Math.floor(data[i].Kgs / 65) + '</td>';
                                            obj += '<td> ' + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65) + '</td>';
                                            obj += '<td>' + data[i].Kgs + '</td>';
                                            obj += '</tr>';

                                            bags = bags + Math.floor(data[i].Kgs / 65);
                                            packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                            kgs = kgs + data[i].Kgs;

                                        }
                                        $(".table-opening tbody").append(obj);
                                    }
                                    else {
                                        console.log(err);
                                    }
                                    var ob = '';
                                    ob += '<tr class="' + "Total" + '">';
                                    ob += '<td>' + "Total" + '</td>';
                                    ob += '<td>' + bags + '</td>';
                                    ob += '<td> ' + packets + '</td>';
                                    ob += '<td>' + kgs + '</td>';
                                    ob += '</tr>';
                                    $(".table-opening tbody").append(ob);
                                });
                            }
                        }
                        else {
                            console.log(err);
                        }
                    });
                    //-------------------------------------------------BALANCE SHEET-------------------------------------------//
                    Meteor.call('getNameByPin', x, function (err, data) {
                        var godownchoice = $("#godown").val();
                        if (!err) {
                            if (data[0].Name == "Admin") {
                                $(".table-balance tbody").html('');
                                if (godownchoice == "All") {
                                    Meteor.call('getBalanceSheetForDay', date, function (err, data) {
                                        var bags = 0;
                                        var packets = 0;
                                        var kgs = 0;
                                        if (!err) {
                                            $scope.OpeningStock2 = data;
                                            var obj = "";
                                            for (i = 0; i < data.length; i++) {
                                                obj += '<tr class="' + data[i].Name + '">';
                                                obj += '<td>' + data[i].Name + '</td>';
                                                obj += '<td>' + Math.floor(data[i].Kgs / 65) + '</td>';
                                                obj += '<td> ' + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65) + '</td>';
                                                obj += '<td>' + data[i].Kgs + '</td>';
                                                obj += '</tr>';

                                                bags = bags + Math.floor(data[i].Kgs / 65);
                                                packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                                kgs = kgs + data[i].Kgs;

                                            }
                                            $(".table-balance tbody").append(obj);
                                        }
                                        else {
                                            console.log(err);
                                        }
                                        var ob = '';
                                        ob += '<tr class="' + "Total" + '">';
                                        ob += '<td>' + "Total" + '</td>';
                                        ob += '<td>' + bags + '</td>';
                                        ob += '<td> ' + packets + '</td>';
                                        ob += '<td>' + kgs + '</td>';
                                        ob += '</tr>';
                                        $(".table-balance tbody").append(ob);

                                    });
                                }
                                else {
                                    $(".table-balance tbody").html('');
                                    Meteor.call('getBalanceSheetViaDateForGodown', date, godownchoice, function (err, data) {
                                        var bags = 0;
                                        var packets = 0;
                                        var kgs = 0;
                                        if (!err) {
                                            $scope.OpeningStock3 = data;
                                            var obj = "";
                                            for (i = 0; i < data.length; i++) {
                                                obj += '<tr class="' + data[i].Name + '">';
                                                obj += '<td>' + data[i].Name + '</td>';
                                                obj += '<td>' + Math.floor(data[i].Kgs / 65) + '</td>';
                                                obj += '<td> ' + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65) + '</td>';
                                                obj += '<td>' + data[i].Kgs + '</td>';
                                                obj += '</tr>';

                                                bags = bags + Math.floor(data[i].Kgs / 65);
                                                packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                                kgs = kgs + data[i].Kgs;

                                            }
                                            $(".table-balance tbody").append(obj);
                                        }
                                        else {
                                            console.log(err);
                                        }
                                        var ob = '';
                                        ob += '<tr class="' + "Total" + '">';
                                        ob += '<td>' + "Total" + '</td>';
                                        ob += '<td>' + bags + '</td>';
                                        ob += '<td> ' + packets + '</td>';
                                        ob += '<td>' + kgs + '</td>';
                                        ob += '</tr>';
                                        $(".table-balance tbody").append(ob);
                                    });
                                }
                            }
                            else {
                                $(".table-balance tbody").html('');
                                Meteor.call('getBalanceSheetViaDateForGodown', date, data[0].Name, function (err, data) {
                                    var bags = 0;
                                    var packets = 0;
                                    var kgs = 0;
                                    if (!err) {
                                        $scope.OpeningStock3 = data;
                                        var obj = "";
                                        for (i = 0; i < data.length; i++) {
                                            obj += '<tr class="' + data[i].Name + '">';
                                            obj += '<td>' + data[i].Name + '</td>';
                                            obj += '<td>' + Math.floor(data[i].Kgs / 65) + '</td>';
                                            obj += '<td> ' + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65) + '</td>';
                                            obj += '<td>' + data[i].Kgs + '</td>';
                                            obj += '</tr>';

                                            bags = bags + Math.floor(data[i].Kgs / 65);
                                            packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                            kgs = kgs + data[i].Kgs;

                                        }
                                        $(".table-balance tbody").append(obj);
                                    }
                                    else {
                                        console.log(err);
                                    }
                                    var ob = '';
                                    ob += '<tr class="' + "Total" + '">';
                                    ob += '<td>' + "Total" + '</td>';
                                    ob += '<td>' + bags + '</td>';
                                    ob += '<td> ' + packets + '</td>';
                                    ob += '<td>' + kgs + '</td>';
                                    ob += '</tr>';
                                    $(".table-balance tbody").append(ob);
                                });
                            }
                        }
                        else {
                            console.log(err);
                        }
                    });
                    //------------------------------------------------------Purchase FOR DAY-------------------------------------------------------------//
                    Meteor.call('getNameByPin', x, function (err, data) {

                        var godownchoice = $("#godown").val();
                        if (!err) {
                            if (data[0].Name == "Admin") {
                                $(".table-purchase tbody").html('');
                                if (godownchoice == "All") {
                                    Meteor.call('getPurchaseForDay', date, function (err, data) {
                                        var bags = 0;
                                        var packets = 0;
                                        var kgs = 0;
                                        if (!err) {
                                            $scope.Purchase = data;
                                            var obj = "";
                                            for (i = 0; i < data.length; i++) {
                                                obj += '<tr class="' + data[i]._id + '">';
                                                obj += '<td>' + data[i]._id + '-Raw' + '</td>';
                                                obj += '<td>' + Math.floor(data[i].Kgs / 65) + '</td>';
                                                obj += '<td> ' + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65) + '</td>';
                                                obj += '<td>' + data[i].Kgs + '</td>';
                                                obj += '</tr>';

                                                bags = bags + Math.floor(data[i].Kgs / 65);
                                                packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                                kgs = kgs + data[i].Kgs;

                                            }
                                            $(".table-purchase tbody").append(obj);

                                        }
                                        else {
                                            console.log(err);
                                        }
                                        var ob = '';
                                        ob += '<tr class="' + "Total" + '">';
                                        ob += '<td>' + "Total" + '</td>';
                                        ob += '<td>' + bags + '</td>';
                                        ob += '<td> ' + packets + '</td>';
                                        ob += '<td>' + kgs + '</td>';
                                        ob += '</tr>';
                                        $(".table-purchase tbody").append(ob);
                                    });
                                }
                                else {
                                    $(".table-purchase tbody").html('');
                                    Meteor.call('getPurchaseForDayForGodown', date, godownchoice, function (err, data) {
                                        var bags = 0;
                                        var packets = 0;
                                        var kgs = 0;
                                        if (!err) {
                                            $scope.Purchases = data;
                                            var obj = "";
                                            for (i = 0; i < data.length; i++) {
                                                obj += '<tr class="' + data[i]._id + '">';
                                                obj += '<td>' + data[i]._id + '-Raw' + '</td>';
                                                obj += '<td>' + Math.floor(data[i].Kgs / 65) + '</td>';
                                                obj += '<td> ' + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65) + '</td>';
                                                obj += '<td>' + data[i].Kgs + '</td>';
                                                obj += '</tr>';

                                                bags = bags + Math.floor(data[i].Kgs / 65);
                                                packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                                kgs = kgs + data[i].Kgs;

                                            }
                                            $(".table-purchase tbody").append(obj);

                                        }
                                        else {
                                            console.log(err);
                                        }
                                        var ob = '';
                                        ob += '<tr class="' + "Total" + '">';
                                        ob += '<td>' + "Total" + '</td>';
                                        ob += '<td>' + bags + '</td>';
                                        ob += '<td> ' + packets + '</td>';
                                        ob += '<td>' + kgs + '</td>';
                                        ob += '</tr>';
                                        $(".table-purchase tbody").append(ob);
                                    });
                                }

                            }
                            else {
                                $(".table-purchase tbody").html('');
                                Meteor.call('getPurchaseForDayForGodown', date, data[0].Name, function (err, data) {
                                    var bags = 0;
                                    var packets = 0;
                                    var kgs = 0;
                                    if (!err) {
                                        $scope.Purchases = data;
                                        var obj = "";
                                        for (i = 0; i < data.length; i++) {
                                            obj += '<tr class="' + data[i]._id + '">';
                                            obj += '<td>' + data[i]._id + '-Raw' + '</td>';
                                            obj += '<td>' + Math.floor(data[i].Kgs / 65) + '</td>';
                                            obj += '<td> ' + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65) + '</td>';
                                            obj += '<td>' + data[i].Kgs + '</td>';
                                            obj += '</tr>';

                                            bags = bags + Math.floor(data[i].Kgs / 65);
                                            packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                            kgs = kgs + data[i].Kgs;

                                        }

                                        $(".table-purchase tbody").append(obj);

                                    }
                                    else {
                                        console.log(err);
                                    }
                                    var ob = '';
                                    ob += '<tr class="' + "Total" + '">';
                                    ob += '<td>' + "Total" + '</td>';
                                    ob += '<td>' + bags + '</td>';
                                    ob += '<td> ' + packets + '</td>';
                                    ob += '<td>' + kgs + '</td>';
                                    ob += '</tr>';
                                    $(".table-purchase tbody").append(ob);
                                });
                            }

                        }
                        else {
                            console.log(err);
                        }
                    });


                    //---------------------------------------Get SALES FOR DAY----------------------------------------------------------------------------//
                    Meteor.call('getNameByPin', x, function (err, data) {
                        var godownchoice = $("#godown").val();
                        if (!err) {
                            if (data[0].Name == "Admin") {
                                var bags = 0;
                                var packets = 0;
                                var kgs = 0;
                                $(".table-loading tbody").html('');
                                if (godownchoice == "All") {
                                    Meteor.call('getSalesForDay', date, function (err, data) {
                                        if (!err) {
                                            $scope.Sales = data;
                                            var obj = "";
                                            for (i = 0; i < data.length; i++) {
                                                obj += '<tr class="' + data[i]._id.name + '">';
                                                obj += '<td>' + data[i]._id.name + '-' + data[i]._id.detail + '-' + data[i]._id.type + '</td>';
                                                obj += '<td>' + Math.floor(data[i].Kgs / 65) + '</td>';
                                                obj += '<td> ' + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65) + '</td>';
                                                obj += '<td>' + data[i].Kgs + '</td>';
                                                obj += '</tr>';

                                                bags = bags + Math.floor(data[i].Kgs / 65);
                                                packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                                kgs = kgs + data[i].Kgs;

                                            }
                                            $(".table-loading tbody").append(obj);

                                        }
                                        else {
                                            console.log(err);
                                        }
                                        var ob = '';
                                        ob += '<tr class="' + "Total" + '">';
                                        ob += '<td>' + "Total" + '</td>';
                                        ob += '<td>' + bags + '</td>';
                                        ob += '<td> ' + packets + '</td>';
                                        ob += '<td>' + kgs + '</td>';
                                        ob += '</tr>';
                                        $(".table-loading tbody").append(ob);
                                    });
                                }
                                else {
                                    $(".table-loading tbody").html('');
                                    Meteor.call('getSalesForDayForGodown', date, godownchoice, function (err, data) {
                                        var bags = 0;
                                        var packets = 0;
                                        var kgs = 0;
                                        if (!err) {
                                            $scope.Sales = data;
                                            var obj = "";
                                            for (i = 0; i < data.length; i++) {
                                                obj += '<tr class="' + data[i]._id.name + '">';
                                                obj += '<td>' + data[i]._id.name + '-' + data[i]._id.detail + '-' + data[i]._id.type + '</td>';
                                                obj += '<td>' + Math.floor(data[i].Kgs / 65) + '</td>';
                                                obj += '<td> ' + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65) + '</td>';
                                                obj += '<td>' + data[i].Kgs + '</td>';
                                                obj += '</tr>';


                                                bags = bags + Math.floor(data[i].Kgs / 65);
                                                packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                                kgs = kgs + data[i].Kgs;

                                            }
                                            $(".table-loading tbody").append(obj);

                                        }
                                        else {
                                            console.log(err);
                                        }
                                        var ob = '';
                                        ob += '<tr class="' + "Total" + '">';
                                        ob += '<td>' + "Total" + '</td>';
                                        ob += '<td>' + bags + '</td>';
                                        ob += '<td> ' + packets + '</td>';
                                        ob += '<td>' + kgs + '</td>';
                                        ob += '</tr>';
                                        $(".table-loading tbody").append(ob);
                                    });
                                }

                            }
                            else {
                                $(".table-loading tbody").html('');
                                Meteor.call('getSalesForDayForGodown', date, data[0].Name, function (err, data) {
                                    var bags = 0;
                                    var packets = 0;
                                    var kgs = 0;
                                    if (!err) {
                                        $scope.Sales = data;
                                        var obj = "";
                                        for (i = 0; i < data.length; i++) {
                                            obj += '<tr class="' + data[i]._id.name + '">';
                                            obj += '<td>' + data[i]._id.name + '-' + data[i]._id.detail + '-' + data[i]._id.type + '</td>';
                                            obj += '<td>' + Math.floor(data[i].Kgs / 65) + '</td>';
                                            obj += '<td> ' + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65) + '</td>';
                                            obj += '<td>' + data[i].Kgs + '</td>';
                                            obj += '</tr>';

                                            bags = bags + Math.floor(data[i].Kgs / 65);
                                            packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                            kgs = kgs + data[i].Kgs;
                                        }
                                        $(".table-loading tbody").append(obj);

                                    }
                                    else {
                                        console.log(err);
                                    }
                                    var ob = '';
                                    ob += '<tr class="' + "Total" + '">';
                                    ob += '<td>' + "Total" + '</td>';
                                    ob += '<td>' + bags + '</td>';
                                    ob += '<td> ' + packets + '</td>';
                                    ob += '<td>' + kgs + '</td>';
                                    ob += '</tr>';
                                    $(".table-loading tbody").append(ob);
                                });
                            }
                        }
                        else {
                            console.log(err);
                        }
                    });

                    //---------------------------GET PROCESS FOR DAY-------------------------------------------------------------------//
                    Meteor.call('getNameByPin', x, function (err, data) {
                        var godownchoice = $("#godown").val();
                        if (!err) {
                            if (data[0].Name == "Admin") {
                                $(".table-process tbody").html('');
                                if (godownchoice == "All") {
                                    Meteor.call('getProcessForDay', date, function (err, data) {
                                        var bags = 0;
                                        var packets = 0;
                                        var kgs = 0;
                                        if (!err) {
                                            $scope.Process = data;
                                            var obj = "";
                                            for (i = 0; i < data.length; i++) {
                                                obj += '<tr class="' + data[i]._id.name + '">';
                                                obj += '<td>' + data[i]._id.name + '-' + data[i]._id.type + '</td>';
                                                obj += '<td>' + Math.floor(data[i].Kgs / 65) + '</td>';
                                                obj += '<td> ' + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65) + '</td>';
                                                obj += '<td>' + data[i].Kgs + '</td>';
                                                obj += '</tr>';

                                                bags = bags + Math.floor(data[i].Kgs / 65);
                                                packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                                kgs = kgs + data[i].Kgs;

                                            }
                                            $(".table-process tbody").append(obj);

                                        }
                                        else {
                                            console.log(err);
                                        }
                                        var ob = '';
                                        ob += '<tr class="' + "Total" + '">';
                                        ob += '<td>' + "Total" + '</td>';
                                        ob += '<td>' + bags + '</td>';
                                        ob += '<td> ' + packets + '</td>';
                                        ob += '<td>' + kgs + '</td>';
                                        ob += '</tr>';
                                        $(".table-process tbody").append(ob);
                                    });
                                }
                                else {
                                    $(".table-process tbody").html('');
                                    Meteor.call('getProcessForDayForGodown', date, godownchoice, function (err, data) {
                                        var bags = 0;
                                        var packets = 0;
                                        var kgs = 0;
                                        if (!err) {
                                            $scope.Process = data;
                                            var obj = "";
                                            for (i = 0; i < data.length; i++) {
                                                obj += '<tr class="' + data[i]._id.name + '">';
                                                obj += '<td>' + data[i]._id.name + '-' + data[i]._id.type + '</td>';
                                                obj += '<td>' + Math.floor(data[i].Kgs / 65) + '</td>';
                                                obj += '<td> ' + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65) + '</td>';
                                                obj += '<td>' + data[i].Kgs + '</td>';
                                                obj += '</tr>';

                                                bags = bags + Math.floor(data[i].Kgs / 65);
                                                packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                                kgs = kgs + data[i].Kgs;
                                            }
                                            $(".table-process tbody").append(obj);

                                        }
                                        else {
                                            console.log(err);
                                        }
                                        var ob = '';
                                        ob += '<tr class="' + "Total" + '">';
                                        ob += '<td>' + "Total" + '</td>';
                                        ob += '<td>' + bags + '</td>';
                                        ob += '<td> ' + packets + '</td>';
                                        ob += '<td>' + kgs + '</td>';
                                        ob += '</tr>';
                                        $(".table-process tbody").append(ob);
                                    });
                                }

                            }
                            else {
                                $(".table-process tbody").html('');
                                Meteor.call('getProcessForDayForGodown', date, data[0].Name, function (err, data) {
                                    var bags = 0;
                                    var packets = 0;
                                    var kgs = 0;
                                    if (!err) {
                                        $scope.Process = data;
                                        var obj = "";
                                        for (i = 0; i < data.length; i++) {
                                            obj += '<tr class="' + data[i]._id.name + '">';
                                            obj += '<td>' + data[i]._id.name + '-' + data[i]._id.type + '</td>';
                                            obj += '<td>' + Math.floor(data[i].Kgs / 65) + '</td>';
                                            obj += '<td> ' + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65) + '</td>';
                                            obj += '<td>' + data[i].Kgs + '</td>';
                                            obj += '</tr>';

                                            bags = bags + Math.floor(data[i].Kgs / 65);
                                            packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                            kgs = kgs + data[i].Kgs;

                                        }
                                        $(".table-process tbody").append(obj);

                                    }
                                    else {
                                        console.log(err);
                                    }
                                    var ob = '';
                                    ob += '<tr class="' + "Total" + '">';
                                    ob += '<td>' + "Total" + '</td>';
                                    ob += '<td>' + bags + '</td>';
                                    ob += '<td> ' + packets + '</td>';
                                    ob += '<td>' + kgs + '</td>';
                                    ob += '</tr>';
                                    $(".table-process tbody").append(ob);
                                });
                            }

                        }
                        else {
                            console.log(err);
                        }
                    });
                    setTimeout(function () {
                        for (i = 0; i < $(".table-balance tbody tr").length; i++) {
                            if ($(".table-balance").find("td:nth-child(4)").eq(i).text() < 0) {
                                $(".table-balance").find("td:nth-child(4)").eq(i).closest('tr').addClass('alertStock');
                            }
                        }
                        for (i = 0; i < $(".table-opening tbody tr").length; i++) {
                            if ($(".table-opening").find("td:nth-child(4)").eq(i).text() < 0) {
                                $(".table-opening").find("td:nth-child(4)").eq(i).closest('tr').addClass('alertStock');
                            }
                        }
                    }, 100);

                     setTimeout(function () {
                     for(i=0;i<$(".table-balance tbody tr").length;i++) {
                     if ($(".table-balance").find("td:nth-child(4)").eq(i).text() == 0) {
                     $(".table-balance").find("td:nth-child(4)").eq(i).closest('tr').hide();
                     }
                     }
                     for(i=0;i<$(".table-opening tbody tr").length;i++) {
                     if ($(".table-opening").find("td:nth-child(4)").eq(i).text() == 0) {
                     $(".table-opening").find("td:nth-child(4)").eq(i).closest('tr').hide();
                     }
                     }
                     }, 100);
                }
            }
        }
    });
