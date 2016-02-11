 angular.module('supariApp').directive('salesEntry', function () {
        return {
            restrict: 'E',
			templateUrl: 'client/project/sales/sales-entry.html',
            controllerAs: 'salesEntry',
            controller: function ($scope, $reactive, $meteor, $stateParams) {
                $reactive(this).attach($scope);
                var salesDetail = [];
                var x = getCookie("LoginUser");
                Meteor.call('getNameByPin', x, function (err, data) {
                    if (!err) {
                        if (data[0].Name == "Admin") {
                            Meteor.call('getGodown', function (err, data) {
                                if (!err) {
                                    $scope.Godowns = data;
                                    if (!$scope.$$phase) {
                                        $scope.$digest();
                                    }
                                } else {
                                    console.log(err);
                                }
                            });
                            $("#godown").removeClass("hidden");
                            $(".stock").removeClass("hidden");
                        }
                        else {
                            var godown = data[0].Name;
                            $scope.salesEntry.godown = data[0].Name;
                            $scope.Godowns = data;
                        }
                    }
                    else {
                        console.log(err);
                        var message = "Error in getNameByPin Method on Sales Page";
                        var error = JSON.stringify(err);
                        Meteor.call('sendEmail',message,error);
                    }
                });
                Meteor.call('getProductMainTypes', function (err, data) {
                    if (!err) {
                        $scope.ProductMainTypes = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    } else {
                        console.log(err);
                        var message = "Error in getProductMainTypes Method on Sales Page";
                        var error = JSON.stringify(err);
                        Meteor.call('sendEmail',message,error);
                    }
                });
                Meteor.call('getSalesAccountName', function (err, data) {
                    if (!err) {
                        $scope.SalesAccountNames = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    } else {
                        console.log(err);
                        var message = "Error in getSalesAccountName Method on Sales Page";
                        var error = JSON.stringify(err);
                        Meteor.call('sendEmail',message,error);
                    }
                });
                Meteor.call('getBrandName', function (err, data) {
                    if (!err) {
                        $scope.BrandTypes = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    } else {
                        console.log(err);
                        var message = "Error in getBrandName Method on Sales Page";
                        var error = JSON.stringify(err);
                        Meteor.call('sendEmail',message,error);
                    }
                });
                Meteor.call('getTransportTypes', function (err, data) {
                    if (!err) {
                        $scope.TransportTypes = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    } else {
                        console.log(err);
                        var message = "Error in getTransportTypes Method on Sales Page";
                        var error = JSON.stringify(err);
                        Meteor.call('sendEmail',message,error);
                    }
                });
                Meteor.call('getProducts', function (err, data) {
                    if (!err) {
                        $scope.ProductNames = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    } else {
                        console.log(err);
                        var message = "Error in getProducts Method on Sales Page";
                        var error = JSON.stringify(err);
                        Meteor.call('sendEmail',message,error);
                    }
                });
                Meteor.call('getSupariTypes', function (err, data) {
                    if (!err) {
                        $scope.SupariTypes = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    } else {
                        console.log(err);
                        var message = "Error in getSupariTypes Method on Sales Page";
                        var error = JSON.stringify(err);
                        Meteor.call('sendEmail',message,error);

                    }
                });
                this.product = "Supari";
                var x = $("#datePicker").datepicker({
                    autoclose: true,
                    todayHighlight: true
                }).datepicker("setDate", new Date()).val();
                $scope.datePicker = x;

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
                var fillModalHtml = function () {
                    var obj = "";
                    var totalWeight = 0;
                    var totalBags = 0;
                    var totalPackets = 0;
                    if (data.length > 0) {
                        obj += "<tr class='info'>";
                        obj += "<td scope='row'>Account</td>";
                        obj += "<td>" + $('#accountName').val() + "</td>";
                        obj += "</tr>";
                        obj += "<tr class=''>";
                        obj += "<td scope='row'>Transport</td>";
                        obj += "<td>" + $('#transportName').val() + "</td>";
                        obj += "</tr>";
                        obj += "<tr class=''>";
                        obj += "<td scope='row'>Product</td>";
                        obj += "<td>" + $('#product').val() + "</td>";
                        obj += "</tr>";
                        obj += "<td scope='row'>Godown</td>";
                        obj += "<td>" + $('#godown').val() + "</td>";
                        obj += "</tr>";
                    }
                    $.each(data, function (index, value) {

                        var weight = calculateWeight(value[3], value[4]);
                        totalWeight += weight;
                        totalBags += getValidValue(value[3]);
                        if (getValidValue(value[4]) > 0) {
                            totalBags += 1;
                        }
                        obj += "<tr>";
                        obj += "<td scope='row'>" + value[1] + " - " + value[0] + " - " + value[2] + "</td>";
                        obj += "<td>";
                        if (getValidValue(value[4]) > 0) {
                            obj += add_commasInAmount(getValidValue(value[3])) + ' X 65 + ' + getValidValue(value[4]) + '<br/> = ' + add_commasInAmount(weight) + ' k.G';
                        }
                        else
                            obj += add_commasInAmount(getValidValue(value[3])) + ' X 65 ' + '<br/> = ' + add_commasInAmount(weight) + ' k.G';
                        obj += "</td>";
                        obj += "</tr>";
                        var dataObjSales = {
                            Subtypename: value[1],
                            brand: value[0],
                            detail: value[2],
                            weight: weight,
                            bags: getValidValue(value[3]),
                            packets: getValidValue(value[4]),
                            totalBags: totalBags
                        };
                        salesDetail.push(dataObjSales);
                    });
                    if (data.length > 0) {
                        obj += "<tr class=''>";
                        obj += "<td scope='row'>Total Bags</td>";
                        obj += "<td>" + add_commasInAmount(totalBags) + "</td>";
                        obj += "</tr>";
                        obj += "<tr class='info'>";
                        obj += "<td scope='row'>Total</td>";
                        obj += "<td>" + add_commasInAmount(totalWeight) + " k.G</td>";
                        obj += "</tr>";
                    }
                    $('.recieptContainerModal').html(obj);
                };
                var fillRecieptHtml = function () {
                    var obj = "";
                    var totalWeight = 0;
                    var totalBags = 0;
                    var totalPackets = 0;
                    if (data.length > 0) {
                        obj += '<div class="receipt recieptHeader row tableHeader">';
                        obj += '<div class=" col-lg-11">';
                        obj += '<span scope="row">ITEM</span>';
                        obj += '<span class="flRight">Weight</span>';
                        obj += '</div>';
                        obj += '<div class="col-lg-1 hidden-xs hidden-md hidden-sm text-right">Delete</div>';
                        obj += '</div>';
                    }
                    $.each(data, function (index, value) {
                        var weight = calculateWeight(value[3], value[4]);
                        totalWeight += weight;
                        totalBags += getValidValue(value[3]);
                        if (getValidValue(value[4]) > 0) {
                            totalBags += 1;
                        }
                        totalPackets += getValidValue(value[4]);

                        obj += '<div class="del-row">';
                        obj += '<div class="list">';
                        obj += '<div class="item col-lg-11 row-wise">';
                        obj += '<div class="item-swipe swipefix">';
                        obj += '<div class="marginTop18 paddingLeft10">';
                        obj += '<span>' + value[1] + ' ' + value[0] + ' ' + value[2] + '</span>';
                        if (getValidValue(value[4]) > 0) {
                            obj += '<span class="flRight">' + add_commasInAmount(value[3]) + ' X 65 + ' + getValidValue(value[4]) + ' = ' + add_commasInAmount(weight) + '</span>';
                        }
                        else
                            obj += '<span class="flRight">' + add_commasInAmount(value[3]) + ' X 65  ' + ' = ' + add_commasInAmount(weight) + '</span>';
                        obj += '</div>';
                        obj += '</div>';
                        obj += '<div class="item-back">';
                        obj += '<button class="action first  mobile-sales-delete" type="button"><i class="fa fa-trash-o"></i></button>';
                        obj += '</div>';
                        obj += '</div>';

                        obj += '<div class="item edit-del col-lg-1 hidden-sm hidden-md hidden-xs text-right">';
                        obj += '<a class="delete-salesEntry" href="#" ><span class="glyphicon glyphicon-trash"></span></a>';
                        obj += '</div>';
                        obj += '</div>';
                        obj += '</div>';
                    });
                    if (data.length > 0) {
                        obj += "<div class='totalBagsContainer col-lg-12'>";
                        obj += "<span scope='row'>Total Bags</span>";
                        obj += "<span class='flRight' id='tbags'>" + add_commasInAmount(totalBags) + "</span>";
                        obj += "</div>";
                        obj += "<div class='recieptFooter col-lg-12 tableHeader'>";
                        obj += "<span scope='row'>Total</span>";
                        obj += "<span class='flRight'>" + add_commasInAmount(totalWeight) + " k.G</span>";
                        obj += "</div>";
                        $('.recieptContainer').show();
                    }
                    if (data.length > 0) {
                        $('.recieptContainer').show();
                        $('#saveBtnsales').show();
                    } else {
                        $('.recieptContainer').hide();
                        $('#saveBtnsales').hide();
                    }

                    $('.recieptContainer .list').html(obj);
                };

                var updateEntry = function () {
                    var brand = $('#brand').val();
                    var type = $('#type').val();
                    var subType = $('#subType').val();
                    var bags = $('#bags').val();
                    var packet = $('#packet').val();
                    var record = [brand, type, subType, bags, packet];
                    data.push(record);
                    clearInputs();
                };

                var clearInputs = function () {
                    $('#entryFields input').val("");
                    $('#entryFields select').val("");
                };

                var calculateWeight = function (bags, packet) {
                    var kgInBags = 65;
                    var totalWeight = (getValidValue(bags) * kgInBags) + getValidValue(packet);
                    return totalWeight;
                };

                var IsValidInputs = function () {
                    if (ValidateInputField('transportName') && ValidateInputField('accountName') && ValidateInputField('godown') && ValidateInputField('type') && ValidateInputField('brand') && ValidateInputField('subType') && ValidateInputField('bags') && ValidateInputField('product')) {
                        return true;
                    }
                    return false;
                };
                var ValidateInputField = function (_this) {
                    if (IsEmpty(_this)) {
                        $('#' + _this).addClass("invalidInput");
                        return false;
                    } else {
                        $('#' + _this).removeClass("invalidInput");
                        return true;
                    }
                };
                var IsEmpty = function (_this) {
                    return ($('#' + _this).val() == "");
                };

                var getValidValue = function (val) {
                    val = (isNaN(val) || val == "" || val == "null") ? 0 : parseInt(val);
                    return val;
                };
                var clearAllFields = function () {
                    $("#accountName,#transportName,#type,#brand,#subType,#bags,#packet").val('');
                };
                var resetAll = function () {
                    data = [];
                    fillModalHtml();
                    fillRecieptHtml();
                    clearInputs();
                };

                var deleteItemDesktopsalesEntry = function () {
                    $('body').on('click tap', '.delete-salesEntry', function (e) {
                        // e.preventDefault();
                        var that = $(this);
                        var index = $(this).parent().parent().index();
                        if (index > -1) {
                            data.splice(index, 1);
                        }
                        if ($('.list').length > 2) {
                            that.parent().parent().remove();
                        }
                        else {
                            that.parent().parent().remove();
                            $('.recieptContainer').hide();
                            $('#saveBtnsales').hide();
                        }
                        fillRecieptHtml();
                    });
                }

                var data = [];
                var fill = [];
                this.salesId = $stateParams.salesId;
                if (!!this.salesId) {
                    var id = this.salesId;
                    Meteor.call('getSalesEntry', this.salesId, function (err, salesData) {
                        if (!err) {
                            for (i = 0; i < salesData.length; i++) {
                                $("#accountName").val(salesData[i].salesAccountName);
                                $("#transportName").val(salesData[i].TransportName);
                                $("#product").val(salesData[i].Product);
                                $scope.salesEntry.godown = salesData[i].Godown;
                                $("#datePicker").val(salesData[i].CreatedDate);
                                for (j = 0; j < salesData[i].Info.length; j++) {
                                    var brand = salesData[i].Info[j].brand;
                                    var type = salesData[i].Info[j].Subtypename;
                                    var subType = salesData[i].Info[j].detail;
                                    var bags = salesData[i].Info[j].bags;
                                    var packet = salesData[i].Info[j].packets;
                                    var record = [brand, type, subType, bags, packet];
                                    data.push(record);
                                }


                            }
                            console.log(salesData);
                            fillRecieptHtml();
                            $scope.salesave = function () {
                                var date = $("#datePicker").val();
                                var convertDate = function(usDate) {
                                    var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                                    return dateParts[3] + "-" + dateParts[1] + "-" + dateParts[2];
                                }
                                var outDate = convertDate(date);
                                var salesAccountName = $('#accountName').val();
                                var transportName = $('#transportName').val();
                                var product = $('#product').val();
                                var godown = $("#godown").val();
                                var totalbags = parseInt($('#tbags').text());
                                var dates = new Date();
                                var datestring = ("0" + (dates.getMonth() + 1).toString()).substr(-2) + "/" + ("0" + dates.getDate().toString()).substr(-2) + "/" + (dates.getFullYear().toString()).substr(0);
                                var mdate = datestring;
                                var po = {
                                    _id: id,
                                    CreatedDate: date,
                                    mongoDate: outDate,
                                    salesAccountName: salesAccountName,
                                    TransportName: transportName,
                                    Product: product,
                                    Godown: godown,
                                    TotalBags: totalbags,
                                    mdate: mdate
                                }
                                Meteor.call('EditSalesEntry', salesDetail, po, id, function (err, data) {
                                    if (!err) {
                                        $(".modal-content").unmask();
                                    } else {
                                        console.log(err);
                                    }
                                });
                                resetAll();
                                clearAllFields();
                                $("html").mask("");
                                setTimeout(function () {
                                    window.location.href = "/saleslist";
                                    $("html").unmask("");
                                }, 199);
                            }

                        } else {
                            console.log(err);
                            var message = "Error in EditSalesEntry Method on Sales Page Unable to save edited record";
                            var error = JSON.stringify(err);
                            Meteor.call('sendEmail',message,error);
                        }
                    });
                }
                $scope.salesave = function () {
                    var date = $("#datePicker").val();
                    var convertDate = function(usDate) {
                        var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                        return dateParts[3] + "-" + dateParts[1] + "-" + dateParts[2];
                    }
                    var outDate = convertDate(date);
                    var salesAccountName = $('#accountName').val();
                    var transportName = $('#transportName').val();
                    var product = $('#product').val();
                    var godown = $("#godown").val();
                    var totalbags = parseInt($('#tbags').text());
                    var data = {
                        _id: "0",
                        CreatedDate: date,
                        mongoDate : outDate,
                        salesAccountName: salesAccountName,
                        TransportName: transportName,
                        Product: product,
                        Godown: godown,
                        TotalBags: totalbags
                    }
                    Meteor.call('SalesEntry', salesDetail, data, function (err, data) {
                        if (!err) {
                            $(".modal-content").unmask();
                        } else {
                            console.log(err);
                            var message = "Error in SalesEntry Method on Sales Page Unable to save record";
                            var error = JSON.stringify(err);
                            Meteor.call('sendEmail',message,error);
                        }
                    });
                    resetAll();
                    clearAllFields();
                    $("html").mask("");
                    setTimeout(function () {
                        window.location.href = "/saleslist";
                        $("html").unmask("");
                    }, 199);
                }
                $(document).ready(function () {
                    $('#add').click(function () {
                        if (IsValidInputs()) {
                            updateEntry();
                        }
                        fillRecieptHtml();
                    });
                    $('#saveBtnsales').click(function () {
                        fillModalHtml();
                    });
                    $('select').on('change', function () {
                        $(this).removeClass("invalidInput");
                    });
                    $('#entryFields input').on('focus', function () {
                        $('#entryFields input').removeClass("invalidInput");
                    });
                    //Clicking on clear icon of modal - remove data
                    $(".recieptContainer").on("click", ".clearIcon", function () {
                        var index = $(this).parent().parent().index();
                        if (index > -1) {
                            data.splice(index, 1);
                        }
                        fillModalHtml();
                    });
                    deleteItemDesktopsalesEntry();

                    $('#accountName').on('change', function () {
                        resetAll();
                    });
                    //Swipe to delete
                    $('.item-swipe').swipeTo({
                        minSwipe: 50,
                        angle: 10,
                        wrapScroll: 'body',
                        binder: true,
                        swipeStart: function () {
                        },
                        swipeMove: function () {
                        },
                        swipeEnd: function () {
                        },
                    });
                    $('body').on('click tap', '.mobile-sales-delete', function (e) {
                        // e.preventDefault();
                        var that = $(this);
                        var index = $(this).parent().parent().parent().index();
                        if (index > -1) {
                            data.splice(index, 1);
                        }
                        if ($('.list').length > 2) {
                            that.parent().parent().parent().remove()
                        }
                        else {
                            that.parent().parent().parent().remove()
                            $('.recieptContainer').hide();
                            $('#saveBtnsales').hide();
                        }
                        fillRecieptHtml();
                    });

                });

            }
        }
    });