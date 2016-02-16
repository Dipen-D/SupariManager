angular.module('supariApp').directive('summary', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/project/summary/summary.html',
        controllerAs: 'summary',
        controller: function ($scope, $reactive, $meteor, $stateParams) {
            var date = $("#datePicker").val();
            var convertDate = function (usDate) {
                var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                return dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
            }
            var outDate = convertDate(date);
            function fill(x,date,godownchoice) {
                Meteor.call('getNameByPin', x, function (err, data) {
                    if (!err) {
                        // var godownchoice = $("#godown").val();
                        $(".table-opening tbody").html('');
                        if ($("#godown").is(":visible") == false) {
                            godownchoice = data[0].Name;
                        }
                        else if ($("#godown").is(":visible") == true && $("#godown").val() == "All" && data[0].Name =="Admin") {
                            godownchoice = '';
                        }
                        else if($("#godown").is(":visible") == true && data[0].Name =="Admin"){
                            if($("#godown").val() == "Balaji"||$("#godown").val() == "Vittal"||$("#godown").val() == "Moodabidri"){
                                godownchoice = $("#godown").val();
                            }

                        }
                        else
                        {
                            godownchoice = data[0].Name;
                        }

                        //-----------GET OPENING STOCK VIA DATE -------------------------------------------------------------------------//
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
                                    obj += '<td>' + add_commasInAmount(data[i].Kgs) + '</td>';
                                    obj += '</tr>';

                                    bags = bags + Math.floor(data[i].Kgs / 65);
                                    packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                    kgs = kgs + data[i].Kgs;

                                }
                                $(".table-opening tbody").append(obj);
                            }
                            else {
                                console.log(err);
                                var message = "Error in getOpeningStockViaDateForGodown method on Summary Page";
                                var error = JSON.stringify(err);
                                Meteor.call('sendEmail', message, error);
                            }
                            var ob = '';
                            ob += '<tr class="' + "Total" + '">';
                            ob += '<td>' + "Total" + '</td>';
                            ob += '<td>' + bags + '</td>';
                            ob += '<td> ' + packets + '</td>';
                            ob += '<td>' + add_commasInAmount(kgs) + '</td>';
                            ob += '</tr>';
                            $(".table-opening tbody").append(ob);
                            for (i = 0; i < $(".table-opening tbody tr").length; i++) {
                                if (parseInt($(".table-opening").find("td:nth-child(4)").eq(i).text()) < 0) {
                                    $(".table-opening").find("td:nth-child(4)").eq(i).closest('tr').addClass('alertStock');
                                }
                                else if (parseInt($(".table-opening").find("td:nth-child(4)").eq(i).text()) == 0) {
                                    $(".table-opening").find("td:nth-child(4)").eq(i).closest('tr').hide();
                                }
                            }
                            $('#open')
                                .unbind('appendCache applyWidgetId applyWidgets sorton update updateCell')
                                .removeClass('tablesorter')
                                .find('thead th')
                                .unbind('click mousedown')
                                .removeClass('header headerSortDown headerSortUp');
                            $("#open").tablesorter({sortList: [[0,0]]});

                        });

                        $(".table-balance tbody").html('');

                        //-----------GET BALANCE SHEET VIA DATE -------------------------------------------------------------------------//
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
                                    obj += '<td>' + add_commasInAmount(data[i].Kgs) + '</td>';
                                    obj += '</tr>';

                                    bags = bags + Math.floor(data[i].Kgs / 65);
                                    packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                    kgs = kgs + data[i].Kgs;

                                }
                                $(".table-balance tbody").append(obj);
                            }
                            else {
                                console.log(err);
                                var message = "Error in getBalanceSheetViaDateForGodown Method";
                                var error = JSON.stringify(err);
                                Meteor.call('sendEmail', message, error);
                            }
                            var ob = '';
                            ob += '<tr class="' + "Total" + '">';
                            ob += '<td>' + "Total" + '</td>';
                            ob += '<td>' + bags + '</td>';
                            ob += '<td> ' + packets + '</td>';
                            ob += '<td>' + add_commasInAmount(kgs) + '</td>';
                            ob += '</tr>';
                            $(".table-balance tbody").append(ob);

                            for (i = 0; i < $(".table-balance tbody tr").length; i++) {
                                if (parseInt($(".table-balance").find("td:nth-child(4)").eq(i).text()) < 0) {
                                    $(".table-balance").find("td:nth-child(4)").eq(i).closest('tr').addClass('alertStock');
                                }
                                else if (parseInt($(".table-balance").find("td:nth-child(4)").eq(i).text()) == 0) {
                                    $(".table-balance").find("td:nth-child(4)").eq(i).closest('tr').hide();
                                }
                            }
                            $('#balance')
                                .unbind('appendCache applyWidgetId applyWidgets sorton update updateCell')
                                .removeClass('tablesorter')
                                .find('thead th')
                                .unbind('click mousedown')
                                .removeClass('header headerSortDown headerSortUp');
                            $("#balance").tablesorter({sortList: [[0,0]]});

                        });

                        $(".table-process tbody").html('');
                        //-----------GET PROCESS  VIA DATE -------------------------------------------------------------------------//
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
                                    obj += '<td>' + add_commasInAmount(data[i].Kgs) + '</td>';
                                    obj += '</tr>';

                                    bags = bags + Math.floor(data[i].Kgs / 65);
                                    packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                    kgs = kgs + data[i].Kgs;
                                }
                                $(".table-process tbody").append(obj);

                            }
                            else {
                                console.log(err);
                                var message = "Error in getProcessForDayForGodown on summary page";
                                var error = JSON.stringify(err);
                                Meteor.call('sendEmail', message, error);
                            }
                            var ob = '';
                            ob += '<tr class="' + "Total" + '">';
                            ob += '<td>' + "Total" + '</td>';
                            ob += '<td>' + bags + '</td>';
                            ob += '<td> ' + packets + '</td>';
                            ob += '<td>' + add_commasInAmount(kgs) + '</td>';
                            ob += '</tr>';
                            $(".table-process tbody").append(ob);
                        });

                        $(".table-purchase tbody").html('');
                        //-----------GET PURCHASE  VIA DATE -------------------------------------------------------------------------//
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
                                    obj += '<td>' + add_commasInAmount(data[i].Kgs) + '</td>';
                                    obj += '</tr>';

                                    bags = bags + Math.floor(data[i].Kgs / 65);
                                    packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                    kgs = kgs + data[i].Kgs;

                                }
                                $(".table-purchase tbody").append(obj);

                            }
                            else {
                                console.log(err);
                                var message = "Error in getPurchaseForDayForGodown Method on summary page";
                                var error = JSON.stringify(err);
                                Meteor.call('sendEmail', message, error);
                            }
                            var ob = '';
                            ob += '<tr class="' + "Total" + '">';
                            ob += '<td>' + "Total" + '</td>';
                            ob += '<td>' + bags + '</td>';
                            ob += '<td> ' + packets + '</td>';
                            ob += '<td>' + add_commasInAmount(kgs) + '</td>';
                            ob += '</tr>';
                            $(".table-purchase tbody").append(ob);
                        });

                        $(".table-loading tbody").html('');
                        //-----------GET SALES  VIA DATE -------------------------------------------------------------------------//
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
                                    obj += '<td>' + add_commasInAmount(data[i].Kgs) + '</td>';
                                    obj += '</tr>';


                                    bags = bags + Math.floor(data[i].Kgs / 65);
                                    packets = packets + (data[i].Kgs - Math.floor(data[i].Kgs / 65) * 65);
                                    kgs = kgs + data[i].Kgs;

                                }
                                $(".table-loading tbody").append(obj);

                            }
                            else {
                                console.log(err);
                                var message = "Error in getSalesForDayForGodown on summary page";
                                var error = JSON.stringify(err);
                                Meteor.call('sendEmail', message, error);
                            }
                            var ob = '';
                            ob += '<tr class="' + "Total" + '">';
                            ob += '<td>' + "Total" + '</td>';
                            ob += '<td>' + bags + '</td>';
                            ob += '<td> ' + packets + '</td>';
                            ob += '<td>' + add_commasInAmount(kgs) + '</td>';
                            ob += '</tr>';
                            $(".table-loading tbody").append(ob);
                        });
                    }
                    else {
                        console.log(err);
                        var message = "Error in fetching values in Summary page";
                        var error = JSON.stringify(err);
                        Meteor.call('sendEmail', message, error);
                    }

                });
            }

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
                format: "dd/mm/yyyy",
                todayHighlight: true
            });

            var x = getCookie("LoginUser");
            Meteor.call('getNameByPin', x, function (err, data) {
                if (!err) {
                    var loadedDate = $("#datePicker").datepicker({
                        autoclose: true,
                        format:"dd/mm/yyyy",
                        todayHighlight: true
                    }).datepicker("setDate", new Date()).val();
                    var x = getCookie("LoginUser");
                    fill(x,loadedDate,data[0].Name);
                    if(data[0].Name == "Admin"){
                        $("#godown").removeClass("hidden");
                        $(".stock").removeClass("hidden");
                        $(".salesparty").removeClass("hidden");
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
                var x = getCookie("LoginUser");
                var date = $("#datePicker").val();
                var godownchoice = $("#godown").val();
                fill(x,date,godownchoice);
            }
        }

    }
});