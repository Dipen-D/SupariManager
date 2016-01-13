PurchaseAccountNames = new Mongo.Collection("PurchaseAccountName");
SalesAccountNames = new Mongo.Collection("SalesAccountName");
SupariTypes = new Mongo.Collection("SupariTypeMaster");
MariTypes = new Mongo.Collection("MariTypeMaster");
ProductNames = new Mongo.Collection("ProductNameMaster");
ProductMainTypes = new Mongo.Collection("ProductMainType");
ProductTypes = new Mongo.Collection("ProductTypeMaster");
BrandTypes = new Mongo.Collection("BrandName");
TransportTypes = new Mongo.Collection("TransportType");
Counters = new Mongo.Collection("Counters");
Purchase = new Mongo.Collection("Purchase");
ProcessDetail = new Mongo.Collection("ProcessDetail");
ProcessList = new Mongo.Collection("ProcessList");

if (Meteor.isClient) {
    angular.module('supariApp', [
        'angular-meteor',
        'ui.router'
    ]);

    angular.module('supariApp').config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('processList', {
                url: '/processlist',
                template: '<process-list></process-list>'
            })
            .state('processEntry', {
                url: '/process',
                template: '<process-entry></process-entry>'
            })
            .state('salesEntry', {
                url: '/sales',
                template: '<sales-entry></sales-entry>'
            })
            .state('salesList', {
                url: '/saleslist',
                template: '<sales-list></sales-list>'
            })
            .state('purchaseEntry', {
                url: '/purchase',
                template: '<purchase-entry></purchase-entry>'
            })
            .state('purchaseEditEntry', {
                url: '/purchase/:purchaseId',
                template: '<purchase-entry></purchase-entry>'
            })
            .state('purchaseList', {
                url: '/purchaselist',
                template: '<purchase-list></purchase-list>'
            });
        $urlRouterProvider.otherwise("/saleslist");
    });

    angular.module('supariApp').directive('processEntry', function () {
        return {
            restrict: 'E',
            templateUrl: 'process-entry.html',
            controllerAs: 'processEntry',
            controller: function ($scope, $reactive, $meteor) {
                $reactive(this).attach($scope);
                // var data = [];
                var processDetail = [];
                var p = [];
                this.product = "Supari";
                $scope.SupariTypes = "";
                //$scope.MariTypes = "";
                Meteor.call('getSupariTypes', function (err, data) {
                    if (!err) {
                        $scope.SupariTypes = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    } else {
                        console.log(err);
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
                    }
                });
                Meteor.call('getMariTypes', function (err, data) {
                    if (!err) {
                        $scope.MariTypes = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    } else {
                        console.log(err);
                    }
                });

                //this.mariType = ["Mari1","Mari2"];
                this.getTotalWeight = function () {
                    var total = 0;
                    var data = (this.product == 'Supari') ? $scope.SupariTypes : $scope.MariTypes;
                    $.each(data, function (index, value) {
                        var weight = getTotalWeightForProduct(value.Name);
                        total += weight;
                    });
                    return total;
                };
                this.getAdjustment = function () {
                    var rawMaterialBags = (isNaN(this.rawMaterialBags)) ? 0 : this.rawMaterialBags;
                    var rawMaterialPackets = (isNaN(this.rawMaterialPackets)) ? 0 : this.rawMaterialPackets;
                    adjustment = this.getTotalWeight() - ((rawMaterialBags * 65) + rawMaterialPackets)
                    return (isNaN(adjustment)) ? 0 : adjustment;
                };
                $('#entryFields').on('blur', 'input', function () {
                    $scope.$apply();
                });

                var getTotalWeightForProduct = function (_this) {
                    var find = '\\.';
                    var re = new RegExp(find, 'g');
                    _this = _this.replace(re, '\\.');

                    var totalBags = $('#' + _this + 'Bags').val();
                    if (totalBags == "") {
                        totalBags = 0;
                    }
                    var totalPackets = $('#' + _this + 'Packets').val();
                    if (totalPackets == "") {
                        totalPackets = 0;
                    }

                    var weight = parseInt(totalBags * 65) + parseInt(totalPackets);
                    return (isNaN(weight)) ? 0 : weight;
                };

                this.fillModalHtml = function () {
                    var obj = "";
                    var data1;
                    var totalWeight = 0;
                    var data = ($('#product').val() == 'Supari') ? $scope.SupariTypes : $scope.MariTypes;
                    //console.log(data);
                    var rawMaterialBags = (isNaN($('#rawMaterialBags').val())) ? 0 : $('#rawMaterialBags').val();
                    var rawMaterialPackets = (isNaN($('#rawMaterialPackets').val())) ? 0 : $('#rawMaterialPackets').val();
                    var rawMaterial = parseInt(rawMaterialBags * 65) + parseInt(rawMaterialPackets);
                    obj += "<tr class='info'>";
                    obj += "<th scope='row'>Product</th>";
                    obj += "<td>" + $('#product').val() + "</td>";
                    obj += "</tr>";

                    var type = $('#type').val();
                    if (type != "") {
                        obj += "<tr>";
                        obj += "<th scope='row'>Type</th>";
                        obj += "<td>" + type + "</td>";
                        obj += "</tr>";
                    }
                    obj += "<tr>";
                    obj += "<th scope='row'>Raw Material</th>";
                    obj += "<td>" + rawMaterial + " KG</td>";
                    obj += "</tr>";

                    $.each(data, function (index, value) {
                        var weight = getTotalWeightForProduct(value.Name);
                        var dataObj = {
                            key:value.Name,
                            bags:Math.round(weight/65),
                            packets:weight-Math.round(65*Math.round(weight/65)),
                            value:weight
                        };


                        if (weight > 0) {
                            totalWeight += weight;
                            obj += "<tr>";
                            obj += "<th scope='row'>" + value.Name + "</th>";
                            obj += "<td>" + weight + " KG</td>";
                            obj += "</tr>";
                            processDetail.push(dataObj);
                        }

                    });
                    var adjustmentClass = (adjustment >= 0 ) ? "text-success" : "text-danger";
                    obj += "<tr class='info'>";
                    obj += "<th scope='row'>Total KG</th>";
                    obj += "<td>" + totalWeight + " KG</td>";
                    obj += "</tr>";
                    $('#recieptContainer').html(obj);
                };
                $scope.processcancel = function () {
                    console.log("No");
                }
                $scope.processsave = function () {
                    console.log("Yes");
                    var x = {};
                    var x1 = [];
                    $(".modal-content").mask("");


                    for(i=0;i<processDetail.length;i++){
                        x1.push(processDetail[i].key);
                    }
                    console.log(processDetail);
                    console.log(x);
                   /* var final = {};
                    for(i=0;i<processDetail.length;i++) {

                        var x = processDetail[i].key;
                        x = get(processDetail,x);
                        function get(array, pouch) {

                            var found;
                            array.some(function (entry) {
                                if (entry.key == pouch) {
                                    found = entry;
                                    return true;
                                }
                            });
                            if (found) {
                                // Found it, create an object with the properties we want
                                return {
                                    bags: found.bags,
                                    packets: found.packets,
                                    weight: found.value
                                };
                            }
                            return null;
                        }
                      // console.log(processDetail[i].key + JSON.stringify(x));
                        final[processDetail[i].key] = (x);
                    }
                        console.log(final);*/
                    Meteor.call('processDetail',processDetail, function (err, data) {
                        if (!err) {
                            console.log("sucess");
                            $(".modal-content").unmask();
                        } else {
                            console.log(err);
                        }
                    });

                }
            }
        }
    });


    angular.module('supariApp').directive('purchaseEntry', function () {
        return {
            restrict: 'E',
            templateUrl: 'purchase-entry.html',
            controllerAs: 'purchaseEntry',
            controller: function ($scope, $reactive, $meteor, $stateParams) {
                $reactive(this).attach($scope);

                //Meteor.subscribe("accounts");
                //var data = Meteor.call("getAccounts");

                Meteor.call('getAccounts', function (err, data) {
                    if (!err) {
                        $scope.PurchaseAccountNames = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                        //Session.set("accounts", data);
                    } else {
                        console.log(err);
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
                    }
                });

                this.purchaseId = $stateParams.purchaseId;
                if (!!this.purchaseId){
                    console.log(this.purchaseId);
                    console.log("Fetch data...");
                    Meteor.call('getPurchaseEntry',this.purchaseId, function (err, data) {
                        if (!err) {
                           console.log(data);
                            $("#selectAccount").val(data[0].PurchaseAccountName);
                            $("#selectType").val(data[0].Type);
                            $("#selectProductType").val(data[0].ProductType);
                            $("#bags").val(data[0].Bags);
                            $("#packets").val(data[0].Packets);

                        } else {
                            console.log(err);
                        }
                    });
                    $scope.no = function () {
                        console.log("No");
                    }
                    $scope.yes = function () {
                        console.log("Yes");
                        $(".modal-content").mask("");
                        var product = ($scope.purchaseEntry.product);
                        var producttype = ($scope.purchaseEntry.type);
                        var accountname = ($scope.purchaseEntry.PurchaseAccountNames);
                        var bags = ($scope.purchaseEntry.bags);
                        var packets = ($scope.purchaseEntry.packets);
                        var kgs = bags * 65 + packets;
                        var date = ($scope.purchaseEntry.datePicker);
                        var data = { _id:"0",account:accountname,product:product,kgs:kgs,date:date,bags:bags,packets:packets,producttype:producttype}
                        console.log(data);
                        Meteor.call('EditPurchaseEntry',data, function (err, data) {
                            if (!err) {
                                console.log("sucess");
                                $(".modal-content").unmask();
                            } else {
                                console.log(err);
                            }
                        });
                    }

                }
                else
                {


                }
                this.product = "Supari";
                this.datePicker = "24/11/2015";


                /*Meteor.autorun(function(){
                 $scope.AccountNames = Session.get('accounts');
                 console.log($scope.AccountNames);
                 if (!$scope.$$phase){
                 $scope.$digest();
                 }
                 });*/


                this.getValidValue = function (val) {
                    val = (isNaN(val) || val == "" || val == null) ? 0 : parseInt(val);
                    return val;
                };
                this.calculateWeight = function () {
                    var weight = (this.getValidValue(this.bags) * 65) + this.getValidValue(this.packets);
                    return (isNaN(weight)) ? 0 : weight;
                }

                $scope.no = function () {
                    console.log("No");
                }
                $scope.yes = function () {
                    console.log("Yes");
                    $(".modal-content").mask("");
                    var product = ($scope.purchaseEntry.product);
                    var producttype = ($scope.purchaseEntry.type);
                    var accountname = ($scope.purchaseEntry.PurchaseAccountNames);
                    var bags = ($scope.purchaseEntry.bags);
                    var packets = ($scope.purchaseEntry.packets);
                    var kgs = bags * 65 + packets;
                    var date = ($scope.purchaseEntry.datePicker);
                    var data = { _id:"0",account:accountname,product:product,kgs:kgs,date:date,bags:bags,packets:packets,producttype:producttype}
                    console.log(data);
                    Meteor.call('purchaseEntry',data, function (err, data) {
                        if (!err) {
                            console.log("sucess");
                            $(".modal-content").unmask();
                        } else {
                            console.log(err);
                        }
                    });
                }

            }
        }
    });

    angular.module('supariApp').directive('salesEntry', function () {
        return {
            restrict: 'E',
            templateUrl: 'sales-entry.html',
            controllerAs: 'salesEntry',
            controller: function ($scope, $reactive, $meteor) {
                    $reactive(this).attach($scope);

                Meteor.call('getProductMainTypes', function (err, data) {
                    if (!err) {
                        $scope.ProductMainTypes = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    } else {
                        console.log(err);
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
                    }
                });
                this.product = "Supari";
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
                        obj += add_commasInAmount(value[3]) + ' X 65 + ' + value[4] + '<br/> = ' + add_commasInAmount(weight) + ' k.g.';
                        //obj += "<span class='glyphicon glyphicon-remove-circle clearIcon'></span>";
                        obj += "</td>";
                        obj += "</tr>";
                    });
                    if (data.length > 0) {
                        obj += "<tr class=''>";
                        obj += "<td scope='row'>Total Bags</td>";
                        obj += "<td>" + add_commasInAmount(totalBags) + "</td>";
                        obj += "</tr>";
                        obj += "<tr class='info'>";
                        obj += "<td scope='row'>Total</td>";
                        obj += "<td>" + add_commasInAmount(totalWeight) + " k.g.</td>";
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
                        obj += '<div class="receipt row">';
                        obj += '<div class="recieptHeader col-lg-1 hidden-xs hidden-md hidden-sm">Edit</div>';
                        obj += '<div class="recieptHeader col-lg-10">';
                        obj += '<span scope="row">ITEM</span>';
                        obj += '<span class="flRight">Weight</span>';
                        obj += '</div>';
                        obj += '<div class="recieptHeader col-lg-1 hidden-xs hidden-md hidden-sm">Delete</div>';
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
                        obj += '<div class="row">';
                        obj += '<div class="item edit-del col-lg-1 hidden-sm hidden-md hidden-xs">';
                        obj += '<a class="redirect" href="/sales.html" ><span class="glyphicon glyphicon-edit"></span></a>';
                        obj += '</div>';

                        obj += '<div class="item col-lg-10  hidden-sm hidden-md row-wise">';
                        obj += '<div class="item-swipe swipefix">';
                        obj += '<span>' + value[1] + ' ' + value[0] + ' ' + value[2] + '</span>';
                        obj += '<span class="flRight">' + add_commasInAmount(value[3]) + ' X 65 + ' + getValidValue(value[4]) + ' = ' + add_commasInAmount(weight) + '</span>';
                        obj += '</div>';
                        obj += '<div class="item-back">';
                        obj += '<button class="action first btn-delete" type="button"><i class="fa fa-trash-o"></i></button>';
                        obj += '</div>';
                        obj += '</div>';

                        obj += '<div class="item edit-del col-lg-1 hidden-sm hidden-md hidden-xs">';
                        obj += '<a class="delete-salesEntry" href="#" ><span class="glyphicon glyphicon-trash"></span></a>';
                        obj += '</div>';
                        obj += '</div>';
                        obj += '</div>';


                    });
                    if (data.length > 0) {
                        obj += "<div class='totalBagsContainer col-lg-12'>";
                        obj += "<span scope='row'>Total Bags</span>";
                        obj += "<span class='flRight'>" + add_commasInAmount(totalBags) + "</span>";
                        obj += "</div>";
                        obj += "<div class='recieptFooter col-lg-12'>";
                        obj += "<span scope='row'>Total</span>";
                        obj += "<span class='flRight'>" + add_commasInAmount(totalWeight) + " k.g.</span>";
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
                    if (ValidateInputField('type') && ValidateInputField('brand') && ValidateInputField('subType') && ValidateInputField('bags') && ValidateInputField('product') && ValidateInputField('transportName') && ValidateInputField('accountName')) {
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
                    val = (isNaN(val) || val == "") ? 0 : parseInt(val);
                    return val;
                };

                var resetAll = function () {
                    data = [];
                    fillModalHtml();
                    fillRecieptHtml();
                    clearInputs();
                };

                var deleteItemDesktopsalesEntry = function () {
                    $('body').on('click tap', '.delete-salesEntry', function (e) {
                        e.preventDefault();
                        var that = $(this);
                        var index = $(this).parent().parent().index();
                        console.log(index);
                        if (index > -1) {
                            data.splice(index, 1);
                        }
                        if ($('.row').length > 5) {
                            that.parent().parent().closest('.row').remove();
                        }
                        else {
                            that.parent().parent().closest('.row').remove();
                            $('.recieptContainer').hide();
                            $('#saveBtnsales').hide();
                        }
                    });
                }
                $scope.salecancel = function () {
                    console.log("No");
                }
                $scope.salesave = function () {
                    console.log("Yes");
                    var salesAccountName =  $('#accountName').val() ;
                    var  transportName = $('#transportName').val();
                    var product = $('#product').val();
                    var brand = $('#brand').val();
                    var type = $('#type').val();
                    var subType = $('#subType').val();
                    var bags = $('#bags').val();
                    var packet = $('#packet').val();

                }

                $(document).ready(function () {
                    $('#add').click(function () {
                        if (IsValidInputs()) {
                            updateEntry();
                            console.log(data);
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
                        console.log(index);
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
                    $('body').on('click tap', '.btn-delete', function (e) {
                        e.preventDefault();
                        var that = this;
                        var index = ($(this).parent().parent().index()) - 1;
                        if (index > -1) {
                            data.splice(index, 1);
                        }
                        //fillRecieptHtml();
                        $(this).parent().parent().remove();
                    })
                });

            }
        }
    });
    angular.module('supariApp').directive('salesList', function () {
        return {
            restrict: 'E',
            templateUrl: 'sales-list.html',
            controllerAs: 'salesList',
            controller: ['$scope', function ($scope, $stateParams) {
                this.bags = function (nStr) { //regulerExpression function add coma(,) in price range
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
                this.users =
                    [{date: "12/16", account: "M.S.A", transport: "V.T.Co", bags: 1000},
                        {date: "12/15", account: "M.M", transport: "N.P.T", bags: 20},
                        {date: "12/14", account: "Sudesh", transport: "V.T.Co", bags: 70},
                        {date: "12/13", account: "R.S.A", transport: "N.P.T", bags: 68},
                        {date: "12/12", account: "Sudesh", transport: "V.T.Co", bags: 6000},
                        {date: "12/11", account: "M.M", transport: "N.P.T", bags: 50}];
                this.predicate = 'date';
                this.reverse = true;
                this.order = function (predicate) {
                    this.reverse = (this.predicate === predicate) ? !this.reverse : false;
                    this.predicate = predicate;
                }
            }]
        }
    });

    angular.module('supariApp').directive('purchaseList', function () {
        return {
            restrict: 'E',
            templateUrl: 'purchase-list.html',
            controllerAs: 'purchaseList',
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
                $scope.predicate = 'date';
                $scope.reverse = true;
                $scope.order = function (predicate) {
                    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                    $scope.predicate = predicate;
                }
                Meteor.call('getPurchaseList', function (err, data) {
                    if (!err) {
                        $scope.Purchase = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                    } else {
                        console.log(err);
                    }
                });

                $scope.delete = function (id) {
                    console.log(id);
                    Meteor.call('deletePurchaseEntry',id, function (err, data) {
                        if (!err) {
                            console.log("delete");
                        } else {
                            console.log(err);
                        }
                    });
                }

            }]
        }
    });
    angular.module('supariApp').directive('processList', function () {
        return {
            restrict: 'E',
            templateUrl: 'process-list.html',
            controllerAs: 'processList',
            controller: ['$scope', function ($scope, $stateParams) {
                this.weight = function (nStr) { //regulerExpression function add coma(,) in price range
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
                this.users =
                    [
                        {date: "12/16", type: "DC", product: "supari", input: 6000, output: "6500"},
                        {date: "12/15", type: "N", product: "Mari", input: 660, output: "660"},
                        {date: "12/14", type: "N", product: "supari", input: 660, output: "670"},
                        {date: "12/13", type: "C", product: "Mari", input: 6900, output: "6800"},
                        {date: "12/12", type: "DC", product: "supari", input: 650, output: "650"},
                        {date: "12/11", type: "N", product: "Mari", input: 650, output: "650"}];
                this.predicate = 'date';
                this.reverse = true;
                this.order = function (predicate) {
                    this.reverse = (this.predicate === predicate) ? !this.reverse : false;
                    this.predicate = predicate;
                }
            }]
        }
    });


    $(function () {
        $("body").hide();
        $("html").mask("");
        $('.item-swipe').swipeTo({

            //default options
            minSwipe: 100,
            angle: 10,
            binder: true,
            swipeStart: function () {
            },
            swipeMove: function () {
            },
            swipeEnd: function () {
            },

        });
        $('[data-toggle="popover"]').popover();
        $('body').on('click', function (e) {
            $('[data-toggle="popover"]').each(function () {
                //the 'is' for buttons that trigger popups
                //the 'has' for icons within a button that triggers a popup
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });
        close();
        deleteItem();
        editItem();
        editItemDesktop();
        deleteItemDesktop();

        window.onload = function () {
            $("html").unmask();
            $("body").show();
        };
    });

    //Function to close item
    var close = function () {
        var closeFnc = $('body').on('click tap', '.open', function (e) {
            $('.popover').hide();
        });
    }
    // function to delete items
    var deleteItem = function () {
        $('body').on('click tap', '.btn-delete', function (e) {
            e.preventDefault();
            var that = $(this);
            that.parent().parent().remove();
            checkitem();
        });
    }
    //Function to edit item
    var editItem = function () {
        $('body').on('click tap', '.btn-check', function (e) {
            var href = $(".redirect").attr("href");
            window.location = href;
        });
    }
    var deleteItemDesktop = function () {
        $('body').on('click tap', '.delete', function (e) {
            e.preventDefault();
            var that = $(this);
            that.parent().parent().parent().parent().remove();
            checkitem();
        });
    }

    var editItemDesktop = function () {
        $('body').on('click tap', '.redirect', function (e) {
            e.preventDefault();
            window.location = '/sales';
        });
    }
    var checkitem = function () {
        if ($(".item").length === 1) {
            $(".item").hide();
            $("body").append("<br><div class='container'><div class='alert alert-info'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>No Records! </div></div>");
        }
    }

}