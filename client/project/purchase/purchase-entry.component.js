 angular.module('supariApp').directive('purchaseEntry', function () {
        return {
            restrict: 'E',
			templateUrl: 'client/project/purchase/purchase-entry.html',
            controllerAs: 'purchaseEntry',
             controller: function ($scope, $reactive, $meteor, $stateParams) {
                $reactive(this).attach($scope);
                var convertDate = function (usDate) {
                    var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                    return dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
                }

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
                            $("#selectGodown").removeClass("hidden");
                            $(".stock").removeClass("hidden");
                            $(".salesparty").removeClass("hidden");

                        }
                        else {
                            var godown = data[0].Name;
                            $scope.Godowns = data;
                            $scope.godowns = data[0].Name;

                        }
                    }
                    else {
                        console.log(err);
                        var message = "Error in getNameByPin Method in Purchase Page";
                        var error = JSON.stringify(err);
                        Meteor.call('sendEmail',message,error);
                    }

                });
                Meteor.call('getAccounts', function (err, data) {
                    if (!err) {
                        $scope.PurchaseAccountNames = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    } else {
                        console.log(err);
                        var message = "Error in getAccounts Method in Purchase Page";
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
                        var message = "Error in getProducts Method in Purchase Page";
                        var error = JSON.stringify(err);
                        Meteor.call('sendEmail',message,error);
                    }
                });
                Meteor.call('getProductTypes', function (err, data) {
                    if (!err) {
                        $scope.ProductTypes = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    } else {
                        console.log(err);
                        var message = "Error in getProductTypes Method in Purchase Page";
                        var error = JSON.stringify(err);
                        Meteor.call('sendEmail',message,error);

                    }
                });
                var clearPurchaseFields = function () {
                    $("#selectAccount,#selectProductType,#bags,#packets").val('');
                    $("#selectType").val("Supari");
                };
                var IsValidInputs = function () {
                    if (ValidateInputField('selectAccount') && ValidateInputField('selectProductType') && (ValidateInputField('bags'))) {
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
                this.purchaseId = $stateParams.purchaseId;
                if (!!this.purchaseId) {
                    var id = this.purchaseId;
                    Meteor.call('getPurchaseEntry', this.purchaseId, function (err, data) {
                        if (!err) {
                            if (data.length != 0) {
                                console.log(data);
                                $scope.datePicker = data[0].CreatedDate;
                                var name = data[0].PurchaseAccountName;
                                $scope.AccountName = name;
                                $scope.memo = data[0].Memo;
                                $scope.type = data[0].ProductType
                                $("#selectType").val(data[0].Type);
                                $scope.godowns = data[0].Godown;
                                $scope.bagsinput = data[0].Bags;
                                $scope.packetsinput = data[0].Packets;
                                if (!$scope.$$phase) {
                                    $scope.$digest();
                                }
                            }
                        } else {
                            console.log(err);
                        }
                        $scope.yes = function () {
                            $(".modal-content").mask("");
                            var product = ($scope.purchaseEntry.product);
                            var producttype = ($scope.type);
                            var accountname = ($scope.AccountName);
                            var godowns = ($scope.godowns);
                            var bags = ($scope.bagsinput);
                            var packets = ($scope.packetsinput);
                            var kgs = bags * 65 + packets;
                            var date = ($scope.datePicker);
                          //----------------Date Conversion------------------------//
                            var convertDate = function(usDate) {
                                var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                                return dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
                            }
                            var outDate = convertDate(date);
                            var dates = new Date();
                            var datestring = ("0" + (dates.getMonth() + 1).toString()).substr(-2) + "/" + ("0" + dates.getDate().toString()).substr(-2) + "/" + (dates.getFullYear().toString()).substr(0);
                            var mdate = datestring;
                            if (producttype == "C2" || producttype == "C3" || producttype == "CX" || producttype == "CF") {
                                var productTypeAlias = "C";
                            }
                            else if (producttype == "DC2" || producttype == "DCX") {
                                var productTypeAlias = "DC";
                            }
                            else {
                                var productTypeAlias = "N";
                            }
                            var data = {
                                _id: id,
                                account: accountname,
                                product: product,
                                godown: godowns,
                                kgs: kgs,
                                date: date,
                                mongoDate:outDate,
                                bags: bags,
                                packets: packets,
                                producttype: producttype,
                                productTypeAlias: productTypeAlias,
                                mdate: mdate
                            }
                            Meteor.call('EditPurchaseEntry', data, id, function (err, data) {
                                if (!err) {
                                    $(".modal-content").unmask();
                                } else {
                                    console.log(err);
                                    var message = "Error in EditPurchaseEntry Method in Purchase Page";
                                    var error = JSON.stringify(err);
                                    Meteor.call('sendEmail',message,error);

                                }
                            });
                            clearPurchaseFields();
                            $("#summary-modal").modal('hide');
                                window.location.href = "/purchaselist";
                        }
                    });

                }
                this.product = "Supari";
                var x = $("#datePicker").datepicker({
                    autoclose: true,
                    format:"dd/mm/yyyy",
                    todayHighlight: true
                }).datepicker("setDate", new Date()).val();
                $scope.datePicker = x;

                $scope.getValidValue = function (val) {
                    val = (isNaN(val) || val == "" || val == null) ? 0 : parseInt(val);
                    return val;
                };
                this.calculateWeight = function () {
                    var weight = (this.getValidValue(this.bags) * 65) + this.getValidValue(this.packets);
                    return (isNaN(weight)) ? 0 : weight;
                }
                $scope.yes = function () {
                    $(".modal-content").mask("");
                    var product = ($scope.purchaseEntry.product);
                    var producttype = ($scope.type);
                    var accountname = ($scope.AccountName);
                    var godowns = ($scope.godowns);
                    var bags = $scope.getValidValue($scope.bagsinput);
                    var packets = $scope.getValidValue($scope.packetsinput);
                    var kgs = bags * 65 + packets;
                    var memo =$(".memo").val();
                    var ProductTypeAlias;
                    if (producttype == "C2" || producttype == "C3" || producttype == "CX") {
                        var productTypeAlias = "C";
                    }
                    else if (producttype == "DC2" || producttype == "DCX") {
                        var productTypeAlias = "DC";
                    }
                    else {
                        var productTypeAlias = "N";
                    }

                    var date = ($scope.datePicker);
                    var convertDate = function(usDate) {
                        var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                        return dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
                    }

                    var outDate = convertDate(date);
                    var data = {
                        _id: "0",
                        account: accountname,
                        product: product,
                        godown: godowns,
                        kgs: kgs,
                        date: date,
                        mongoDate:outDate,
                        bags: bags,
                        packets: packets,
                        producttype: producttype,
                        productTypeAlias: productTypeAlias,
                        memo:memo
                    }
                    Meteor.call('purchaseEntry', data, function (err, data) {
                        if (!err) {
                            $(".modal-content").unmask();
                        } else {
                            console.log(err);
                            var message = "Error in purchaseEntry Method in Purchase Page Unable to sabe Purchase Entry";
                            var error = JSON.stringify(err);
                            Meteor.call('sendEmail',message,error);
                        }
                    });
                    clearPurchaseFields();
                        window.location.href = "/purchaselist";
                }
                $(document).ready(function () {

                    $('select').on('change', function () {
                        $(this).removeClass("invalidInput");
                    });

                });
                $scope.savePurchaseEntry = function () {
                    if (IsValidInputs()) {
                        $("#summary-modal").modal('show');
                    }
                }
            }
        }
    });