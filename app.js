
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
Process = new Mongo.Collection("Process");
Sales = new Mongo.Collection("Sales");
Login = new Mongo.Collection("Login");
Cookie = new Mongo.Collection("Cookie");
LoginDetails = new Mongo.Collection("LoginDetails");

if (Meteor.isClient) {
    setCookie = function(cname,cvalue,exdays){
        var d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };

    getCookie = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    };
    angular.module('supariApp', [
        'angular-meteor',
        'ui.router'
    ]);
    angular.module('supariApp').config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('processList', {
                resolve: { authenticate:authenticate},
                url: '/processlist',
                template: '<process-list></process-list>'

            })
            .state('processEntry', {
                resolve: { authenticate:authenticate},
                url: '/process',
                template: '<process-entry></process-entry>'

            })
            .state('salesEntry', {
                resolve: { authenticate:authenticate},
                url: '/sales',
                template: '<sales-entry></sales-entry>'
            })
            .state('salesList', {
                resolve: { authenticate:authenticate},
                url: '/saleslist',
                template: '<sales-list></sales-list>'
            })
            .state('purchaseEntry', {
                resolve: { authenticate:authenticate},
                url: '/purchase',
                template: '<purchase-entry></purchase-entry>'

            })
            .state('purchaseEditEntry', {
                resolve: { authenticate:authenticate},
                url: '/purchase/:purchaseId',
                template: '<purchase-entry></purchase-entry>'
            })
            .state('processEditEntry', {
                resolve: { authenticate:authenticate},
                url: '/process/:processId',
                template: '<process-entry></process-entry>'
            })
            .state('salesEditEntry', {
                resolve: { authenticate:authenticate},
                url: '/sales/:salesId',
                template: '<sales-entry></sales-entry>'
            })
            .state('purchaseList', {
                resolve: { authenticate:authenticate},
                url: '/purchaselist',
                template: '<purchase-list></purchase-list>'
            })
            .state('loginList', {
                url: '/loginlist',
                template: '<login-list></login-list>'
            });
        $urlRouterProvider.otherwise("/loginlist");
    })
    function authenticate() {
        var x = getCookie("Meteor");
        if(x=="")
        {
            window.location.href = "/loginlist";
            Meteor.call('getAccess', x, function (err, data) {
                if (!err) {
                    if (!(data == true)) {
                        //location.href.replace(/^(?:\/\/|[^\/]+)*\//, "") != "/loginlist";
                        window.location.href = "/loginlist";
                    }
                }
            });
        }
    }

       /* if (!(getCookie('Meteor') == 1478) && (location.href.replace(/^(?:\/\/|[^\/]+)*\//, "") != "loginlist")) {
            window.location.href = "/loginlist";
        }*/

    /*function authenticate($q, $state, $timeout) {

        //Session.set("allowed","yes");
        Meteor.call('getAccessVal',function (err, data) {
            if (!err) {
                if (data == true) {
                    Session.set("allowed","yes");

                }
                if(Session.equals("allowed","yes")){
                    return $q.when()
                }
                else {
                    // The next bit of code is asynchronously tricky.

                    $timeout(function() {
                        // This code runs after the authentication promise has been rejected.
                        // Go to the log-in page
                        $state.go('loginList')
                    })

                    // Reject the authentication promise to prevent the state from loading
                    return $q.reject()
                }
            }
        });
       // if (user.isAuthenticated()) {
            // Resolve the promise successfully
    }*/

   //Session.set("allowed","yes");

   angular.module('supariApp').directive('loginList', function () {
        return {
            restrict: 'E',
            templateUrl: 'login-list.html',
            controllerAs: 'loginList',
            controller: function ($scope, $reactive, $meteor, $stateParams) {

                $scope.submit = function () {
                    var x = $("#pass").val();
                    Meteor.call('getAccess', x, function (err, data) {
                        if (!err) {
                            if (data == true) {
                                setCookie('Meteor', x, 5000);
                               // var Date1 = new Date();
                                var nVer = navigator.appVersion;
                                var nAgt = navigator.userAgent;
                                var browserName  = navigator.appName;
                                var fullVersion  = ''+parseFloat(navigator.appVersion);
                                var majorVersion = parseInt(navigator.appVersion,10);
                                var nameOffset,verOffset,ix;

                                // In Opera 15+, the true version is after "OPR/"
                                if ((verOffset=nAgt.indexOf("OPR/"))!=-1) {
                                    browserName = "Opera";
                                    fullVersion = nAgt.substring(verOffset+4);
                                }
                                // In older Opera, the true version is after "Opera" or after "Version"
                                else if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
                                    browserName = "Opera";
                                    fullVersion = nAgt.substring(verOffset+6);
                                    if ((verOffset=nAgt.indexOf("Version"))!=-1)
                                        fullVersion = nAgt.substring(verOffset+8);
                                }
                                // In MSIE, the true version is after "MSIE" in userAgent
                                else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
                                    browserName = "Microsoft Internet Explorer";
                                    fullVersion = nAgt.substring(verOffset+5);
                                }
                                // In Chrome, the true version is after "Chrome"
                                else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
                                    browserName = "Chrome";
                                    fullVersion = nAgt.substring(verOffset+7);
                                }
                                // In Safari, the true version is after "Safari" or after "Version"
                                else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
                                    browserName = "Safari";
                                    fullVersion = nAgt.substring(verOffset+7);
                                    if ((verOffset=nAgt.indexOf("Version"))!=-1)
                                        fullVersion = nAgt.substring(verOffset+8);
                                }
                                // In Firefox, the true version is after "Firefox"
                                else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
                                    browserName = "Firefox";
                                    fullVersion = nAgt.substring(verOffset+8);
                                }
                                // In most other browsers, "name/version" is at the end of userAgent
                                else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
                                    (verOffset=nAgt.lastIndexOf('/')) )
                                {
                                    browserName = nAgt.substring(nameOffset,verOffset);
                                    fullVersion = nAgt.substring(verOffset+1);
                                    if (browserName.toLowerCase()==browserName.toUpperCase()) {
                                        browserName = navigator.appName;
                                    }
                                }
                                // trim the fullVersion string at semicolon/space if present
                                if ((ix=fullVersion.indexOf(";"))!=-1)
                                    fullVersion=fullVersion.substring(0,ix);
                                if ((ix=fullVersion.indexOf(" "))!=-1)
                                    fullVersion=fullVersion.substring(0,ix);

                                majorVersion = parseInt(''+fullVersion,10);
                                if (isNaN(majorVersion)) {
                                    fullVersion  = ''+parseFloat(navigator.appVersion);
                                    majorVersion = parseInt(navigator.appVersion,10);
                                }

                               /* document.write(''
                                    +'Browser name  = '+browserName+'<br>'
                                    +'Full version  = '+fullVersion+'<br>'
                                    +'Major version = '+majorVersion+'<br>'
                                    +'navigator.appName = '+navigator.appName+'<br>'
                                    +'navigator.userAgent = '+navigator.userAgent+'<br>'
                                )*/

                                var DateTime = Date().substring(0,24);

                                var IP = ipConfig;
                                var details = {
                                    Pin:x,
                                    DateTime:DateTime,
                                    IP:IP,
                                    BrowserName:browserName,
                                    FullVersion:fullVersion
                                }
                                Meteor.call('LoginDetails',details, function (err, data) {
                                    if (!err) {
                                        console.log("success");
                                    } else {
                                        console.log(err);
                                    }
                                });
                                window.location.href="/process";

                            }
                            else {
                                alert("Sorry");
                            }
                        }

                    });
                }
            }
        }
    });
    angular.module('supariApp').directive('processEntry', function () {
        return {
            restrict: 'E',
            templateUrl: 'process-entry.html',
            controllerAs: 'processEntry',
            controller: function ($scope, $reactive, $meteor, $stateParams) {
                $reactive(this).attach($scope);

                // var data = [];
                var processDetail = [];
                var p = [];
                this.product = "Supari";
                $scope.SupariTypes = "";
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
                var x = $("#datePicker").datepicker({autoclose: true,
                    todayHighlight: true}).datepicker("setDate", new Date()).val();
                $scope.datePicker =  x;


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
                setInterval(function(){
                    $scope.$apply();
                }, 1000);

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
                var IsValidInputs = function () {
                    if (ValidateInputField('type') && ValidateInputField('rawMaterialBags')) {
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


                this.fillModalHtml = function () {
                    if (IsValidInputs()) {
                        $("#summary-modal").modal('show');
                    }
                    var obj = "";
                    var data1;
                    var totalWeight = 0;
                    var data = ($('#product').val() == 'Supari') ? $scope.SupariTypes : $scope.MariTypes;
                    var rawMaterialBags = (isNaN($('#rawMaterialBags').val()) || $('#rawMaterialBags').val() == "" ||$('#rawMaterialBags').val()== null ) ? 0 : $('#rawMaterialBags').val();
                    var rawMaterialPackets = (isNaN($('#rawMaterialPackets').val()) || $('#rawMaterialPackets').val()== "" ||$('#rawMaterialPackets').val()== null   ) ? 0 : $('#rawMaterialPackets').val();
                    var rawMaterial =(parseInt(rawMaterialBags * 65) + parseInt(rawMaterialPackets));
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
                    obj += "<td>" + $scope.getValidValue(rawMaterial) + " KG</td>";
                    obj += "</tr>";

                    $.each(data, function (index, value) {
                        var weight = getTotalWeightForProduct(value.Name);
                        var dataObj = {
                            Subtypename: value.Name,
                            bags: Math.floor(weight / 65),
                            packets: weight - Math.floor(65 * Math.floor(weight / 65)),
                            value: weight
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
                var resetprocess = function () {
                    $("#type").val('');
                    $("#rawMaterialBags,#rawMaterialPackets").val('');
                    $("#Mari1Bags,#Mari2Bags,#Mari2Packets,#Mari1Packets").val('');
                    $("#GFBags,#GFPackets,#JFBags,#JFPackets,#JamBags,#JamPackets,#JiniBags,#JiniPackets,#LindiBags,#LindiPackets,#MFBags,#MFPackets,#MMFBags,#MMFPackets,#MoroBags,#MoroPackets,#MotiBags,#MotiPackets,#RFBags,#RFPackets,#SFBags,#SFPackets,#SevarBags,#SevarPackets").val('');
                   // $("#output").text("0 KG");

                }
                this.processId = $stateParams.processId;
                if (!!this.processId) {
                    var id = this.processId;
                    Meteor.call('getProcessEntry', this.processId, function (err, data) {
                        if (!err) {
                            for (i = 0; i < data.length; i++) {
                                $("#product").val(data[0].Product).change();
                                $("#type").val(data[0].Type);
                                $("#rawMaterialBags").val(Math.floor(data[0].Input / 65)).change();
                                $("#rawMaterialPackets").val(data[0].Input - parseInt(Math.floor(data[0].Input / 65) * 65)).change();
                                $("#datePicker").val(data[0].CreatedDate);

                                for (j = 0; j < data[i].Info.length; j++) {
                                    var name = (data[i].Info[j].Subtypename);
                                    //  var x =    $("[data-name='data[i].Info[j].Subtypename']").find('#' + name + 'Bags').val("5");
                                    $("html").find('#' + data[i].Info[j].Subtypename + 'Bags').val(data[i].Info[j].bags).change();
                                    $("html").find('#' + data[i].Info[j].Subtypename + 'Packets').val(data[i].Info[j].packets).change();
                                    $("#output").change();
                                }
                            }
                            $scope.processsave = function () {
                                $(".modal-content").mask("");
                                var date = $("#datePicker").val();
                                var product = $("#product").val();
                                var type = $("#type").val();
                                var input = parseInt($("#rawMaterialBags").val()) * 65 + parseInt($("#rawMaterialPackets").val());
                                var preoutput = $("#output").text();
                                var outputkgs = preoutput.replace(/[^[+-A-Z]/g, '');
                                var output = parseInt($("#rawMaterialBags").val()) * 65 + parseInt($("#rawMaterialPackets").val()) + parseInt(outputkgs);
                                var dates = new Date();
                                var datestring = ("0" + (dates.getMonth() + 1).toString()).substr(-2) + "/" + ("0" + dates.getDate().toString()).substr(-2)  + "/" + (dates.getFullYear().toString()).substr(0);
                                var mdate = datestring;
                                var po = {
                                    id: id,
                                    date: date,
                                    mdate:mdate,
                                    product: product,
                                    type: type,
                                    input: input,
                                    output: output
                                };
                                Meteor.call('EditProcessEntry', processDetail, po, id, function (err, data) {
                                    if (!err) {
                                        $(".modal-content").unmask();
                                    } else {
                                        console.log(err);
                                    }
                                });
                                resetprocess();
                                $("html").mask("");
                                window.location.href = "/processlist";
                            }
                        } else {
                            console.log(err);
                        }
                    });

                }

                $scope.processsave = function () {
                    var x = {};
                    var x1 = [];
                    $(".modal-content").mask("");
                    var date = $("#datePicker").val();
                    var product = $("#product").val();
                    var type = $("#type").val();
                    var input = $scope.getValidValue(parseInt($("#rawMaterialBags").val())) * 65 + $scope.getValidValue(parseInt($("#rawMaterialPackets").val()));
                    var preoutput = $("#output").text();
                    var outputkgs = preoutput.replace(/[^[+-A-Z]/g, '');
                    var output = $scope.getValidValue(parseInt($("#rawMaterialBags").val())) * 65 + $scope.getValidValue(parseInt($("#rawMaterialPackets").val())) + $scope.getValidValue(parseInt(outputkgs));
                    var pro = {_id: "0", date: date, product: product, type: type, input: input, output: output}

                    Meteor.call('process', processDetail, pro, function (err, data) {
                        if (!err) {
                            $(".modal-content").unmask();
                        } else {
                            console.log(err);
                        }
                    });
                    resetprocess();
                    $("html").mask("");
                    window.location.href = "/processlist";
                }
                $(document).ready(function () {



                    $('select').on('change', function () {
                        $(this).removeClass("invalidInput");
                    });
                    $('#datePicker').datepicker({
                        calendarWeeks: true,
                        todayHighlight: true
                    });
                });
                $scope.getValidValue = function (val) {
                    val = (isNaN(val) || val == "" || val == null) ? 0 : parseInt(val);
                    return val;
                };
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
                Meteor.call('getAccounts', function (err, data) {
                    if (!err) {
                        $scope.PurchaseAccountNames = data;
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
                    var clearPurchaseFields = function () {
                        $("#selectAccount,#selectProductType,#bags,#packets").val('');
                        $("#selectType").val("Supari");

                    };
                    var IsValidInputs = function () {
                        if (ValidateInputField('selectAccount')  && ValidateInputField('selectProductType') && (ValidateInputField('bags'))) {
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
                                if(data.length!=0) {
                                    $scope.datePicker = data[0].CreatedDate;
                                    var name = data[0].PurchaseAccountName;
                                    $scope.AccountName = name;
                                    $scope.type = data[0].ProductType
                                    $("#selectType").val(data[0].Type);
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
                                var bags = ($scope.bagsinput);
                                var packets = ($scope.packetsinput);
                                var kgs = bags * 65 + packets;
                                var date = ($scope.datePicker);
                                var dates = new Date();
                                var datestring = ("0" + (dates.getMonth() + 1).toString()).substr(-2) + "/" + ("0" + dates.getDate().toString()).substr(-2)  + "/" + (dates.getFullYear().toString()).substr(0);
                                var mdate = datestring;
                                var data = {
                                    _id: id,
                                    account: accountname,
                                    product: product,
                                    kgs: kgs,
                                    date: date,
                                    bags: bags,
                                    packets: packets,
                                    producttype: producttype,
                                    mdate:mdate
                                }
                                console.log(data);
                                Meteor.call('EditPurchaseEntry', data, id, function (err, data) {
                                    if (!err) {
                                        $(".modal-content").unmask();
                                    } else {
                                        console.log(err);
                                    }
                                });
                                clearPurchaseFields();
                                $("#summary-modal").modal('hide');
                                $("html").mask("");
                                window.location.href = "/purchaselist";
                            }
                        });

                    }
                    this.product = "Supari";
                    var x = $("#datePicker").datepicker({autoclose: true,
                        todayHighlight: true}).datepicker("setDate", new Date()).val();
                    $scope.datePicker =  x;


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
                        var bags = $scope.getValidValue($scope.bagsinput);
                        var packets = $scope.getValidValue($scope.packetsinput);
                        var kgs = bags * 65 + packets;
                        var date = ($scope.datePicker);
                        var data = {
                            _id: "0",
                            account: accountname,
                            product: product,
                            kgs: kgs,
                            date: date,
                            bags: bags,
                            packets: packets,
                            producttype: producttype
                        }
                        console.log(date);
                        Meteor.call('purchaseEntry', data, function (err, data) {
                            if (!err) {
                                $(".modal-content").unmask();
                            } else {
                                console.log(err);
                            }
                        });
                        clearPurchaseFields();
                        $("html").mask("");
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

    angular.module('supariApp').directive('salesEntry', function () {
        return {
            restrict: 'E',
            templateUrl: 'sales-entry.html',
            controllerAs: 'salesEntry',
            controller: function ($scope, $reactive, $meteor, $stateParams) {
                $reactive(this).attach($scope);
                var salesDetail = [];

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
                var x = $("#datePicker").datepicker({autoclose: true,
                    todayHighlight: true}).datepicker("setDate", new Date()).val();
                $scope.datePicker =  x;

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
                        if (getValidValue(value[4]) > 0) {
                            obj += add_commasInAmount(getValidValue(value[3])) + ' X 65 + ' + getValidValue(value[4]) + '<br/> = ' + add_commasInAmount(weight) + ' k.G';
                            //obj += "<span class='glyphicon glyphicon-remove-circle clearIcon'></span>";
                        }
                        else
                        obj += add_commasInAmount(getValidValue(value[3])) + ' X 65 '  + '<br/> = ' + add_commasInAmount(weight) + ' k.G';
                        obj += "</td>";
                        obj += "</tr>";
                        var dataObjSales = {
                            Subtypename: value[1],
                            brand: value[0],
                            detail: value[2],
                            weight: weight,
                            bags: value[3],
                            packets: value[4],
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
                        if(getValidValue(value[4]) > 0) {
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
                                var salesAccountName = $('#accountName').val();
                                var transportName = $('#transportName').val();
                                var product = $('#product').val();
                                var totalbags = parseInt($('#tbags').text());
                                var dates = new Date();
                                var datestring = ("0" + (dates.getMonth() + 1).toString()).substr(-2) + "/" + ("0" + dates.getDate().toString()).substr(-2)  + "/" + (dates.getFullYear().toString()).substr(0);
                                var mdate = datestring;
                                var po = {
                                    _id: id,
                                    CreatedDate: date,
                                    salesAccountName: salesAccountName,
                                    TransportName: transportName,
                                    Product: product,
                                    TotalBags: totalbags,
                                    mdate:mdate
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
                                window.location.href = "/saleslist";
                            }

                        } else {
                            console.log(err);
                        }
                    });
                }
                $scope.salesave = function () {
                    var date = $("#datePicker").val();
                    var salesAccountName = $('#accountName').val();
                    var transportName = $('#transportName').val();
                    var product = $('#product').val();
                    var totalbags = parseInt($('#tbags').text());
                    var data = {
                        _id: "0",
                        CreatedDate: date,
                        salesAccountName: salesAccountName,
                        TransportName: transportName,
                        Product: product,
                        TotalBags: totalbags
                    }
                    Meteor.call('SalesEntry', salesDetail, data, function (err, data) {
                        if (!err) {
                            console.log("sucess");
                            $(".modal-content").unmask();
                        } else {
                            console.log(err);
                        }
                    });
                    resetAll();
                    clearAllFields();
                    $("html").mask("");
                    window.location.href = "/saleslist";
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
    angular.module('supariApp').directive('salesList', function () {
        return {
            restrict: 'E',
            templateUrl: 'sales-list.html',
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
                $scope.SaleEntry = function(){
                    $("html").mask('');
                    window.location.href="/sales";
                }
                $scope.trim = function(x){
                    x = x.substring(0,5);
                    return x;
                };
                $scope.load = function(id){
                    $("html").mask('');
                    window.location.href = '/sales/' + id;

                };
                $scope.pop = function(x){
                    var bags = Math.floor(x/65);
                    var packets = x -  Math.floor(x/65) * 65;
                    var stringObj = bags + ' * 65 ';
                    var packetObj =  packets;

                    if(packets == 0){
                        return stringObj + ' = ' +  x;
                    }
                    else{
                        return stringObj + packetObj + ' = ' +  x;
                    }
                };
                $scope.predicate = 'date';
                $scope.reverse = true;
                $scope.order = function (predicate) {
                    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                    $scope.predicate = predicate;
                }
                $(".tableHeader,.listShadow").hide();
                Meteor.call('getSalesList', function (err, data) {
                    if (!err) {
                        $scope.Sales = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                        if(data.length == 0){
                            $(".tableHeader,.listShadow").hide();
                            $("body").append("<br><div class='container'><div class='alert alert-info'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>No Records! </div></div>");
                        }
                        else {
                            $(".tableHeader").show();
                        }
                        $('[data-toggle="popover"]').popover();
                    } else {
                        console.log(err);
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
                            }
                        });
                    });
                }
                $scope.updateProcessObj = function(id){
                    for (var i= 0; i< $scope.Sales.length; i++) {
                        if ($scope.Sales[i]._id == id) {
                            $scope.Sales.splice(i,1);
                        }
                    }
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                    if($(".item").length === 1){
                        $(".tableHeader").hide();
                        $("body").append("<br><div class='container'><div class='alert alert-info'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>No Records! </div></div>");
                    }
                };

            }]
        }
    });

    angular.module('supariApp').directive('purchaseList', function () {
        return {
            restrict: 'E',
            templateUrl: 'purchase-list.html',
            controllerAs: 'purchaseList',
            controller: ['$scope', function ($scope, $stateParams) {
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
                $scope.Purchase1 = function(){
                    $("html").mask('');
                    window.location.href = "/purchase";
                }
               $scope.loader = function(id){
                   alert(id);
                //   window.location.href = "http://stackoverflow.com";
                   // $("html").mask('');


                }

                 $scope.pop = function(x){
                    var bags = Math.floor(x/65);
                    var packets = x -  Math.floor(x/65) * 65;
                    var stringObj = bags + ' * 65 ';
                    var packetObj =  packets;

                    if(packets == 0){
                        return stringObj + ' = ' +  x;
                    }
                    else{
                        return stringObj + packetObj + ' = ' +  x;
                    }
                };
                $scope.trim = function(x){
                    x = x.substring(0,5);
                    return x;
                };
                $scope.predicate = 'date';
                $scope.reverse = true;
                $scope.order = function (predicate) {
                    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                    $scope.predicate = predicate;
                }
                $(".tableHeader,.listShadow").hide();
                Meteor.call('getPurchaseList', function (err, data) {

                    if (!err) {
                        $scope.Purchase = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                        if(data.length == 0){
                            $(".tableHeader,.listShadow").hide();
                            $("body").append("<br><div class='container'><div class='alert alert-info'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>No Records! </div></div>");
                        }
                        else {
                            $(".tableHeader").show();
                        }
                        $('[data-toggle="popover"]').popover();
                    } else {
                        console.log(err);
                    }


                });


                $scope.delete = function (id) {
                    $("#delete-modal").modal('show');
                        var that = $(this);
                    $(".yes").click(function(){
                        that.parent().parent().parent().parent().remove();
                        $("html").unmask();
                        Meteor.call('deletePurchaseEntry', id, function (err, data) {
                            if (!err) {
                                $("html").mask("");
                                $scope.updateProcessObj(id);
                            } else {
                                console.log(err);
                            }
                            $("html").unmask();
                        });
                    });
                };

                $scope.deleteMobile = function (id) {
                    $("#delete-modal").modal('show');
                    var that = $(this);
                    $(".yes").click(function(){
                        that.parent().parent().parent().parent().remove();
                        $("html").unmask();
                        Meteor.call('deletePurchaseEntry', id, function (err, data) {
                            if (!err) {
                                $("html").mask("");
                                $scope.updateProcessObj(id);
                            } else {
                                console.log(err);
                            }
                            $("html").unmask();
                        });
                    });

                };


                $scope.updateProcessObj = function(id){
                    for (var i= 0; i< $scope.Purchase.length; i++) {
                        if ($scope.Purchase[i]._id == id) {
                            $scope.Purchase.splice(i,1);
                        }
                    }
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                    if($scope.Purchase.length == 0){
                        $(".tableHeader").hide();
                        $("body").append("<br><div class='container'><div class='alert alert-info'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>No Records! </div></div>");
                    }
                };

            }]
        }
    });
    angular.module('supariApp').directive('processList', function () {
        return {
            restrict: 'E',
            templateUrl: 'process-list.html',
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
                $scope.ProcessEntry = function(){
                    $("html").mask("");
                    window.location.href="/process";
                }
                $scope.trim = function(x){
                    x = x.substring(0,5);
                    return x;
                };
                /*$scope.mobileEdit = function(id){
                    $("html").mask('');
                    window.location.href = '/process/' + id;

                };*/
                $scope.pop = function(x){
                    var bags = Math.floor(x/65);
                    var packets = x -  Math.floor(x/65) * 65;
                    var stringObj = bags + ' * 65 ';
                    var packetObj =  packets;

                    if(packets == 0){
                        return stringObj + ' = ' +  x;
                    }
                    else{
                        return stringObj + packetObj + ' = ' +  x;
                    }
                };
                $(".tableHeader,.listShadow").hide();
                Meteor.call('getProcessList', function (err, data) {
                    if (!err) {
                        $scope.Process = data;
                        if (!$scope.$$phase) {
                            $scope.$digest();
                        }
                        if(data.length == 0){
                            $(".tableHeader,.listShadow").hide();
                            $("body").append("<br><div class='container'><div class='alert alert-info'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>No Records! </div></div>");
                        }
                        else {
                            $(".tableHeader").show();
                        }
                        $('[data-toggle="popover"]').popover();
                    } else {
                        console.log(err);
                    }
                });
                $scope.delete = function (id) {
                    $("#delete-modal").modal('show');
                    var that = $(this);
                    $(".yes").click(function(){
                        that.parent().parent().parent().parent().remove();
                        $("html").unmask();
                    Meteor.call('deleteProcessEntry', id, function (err, data) {
                        if (!err) {
                            $scope.updateProcessObj(id);
                        } else {
                            console.log(err);
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
                $scope.updateProcessObj = function(id){
                    for (var i= 0; i< $scope.Process.length; i++) {
                        if ($scope.Process[i]._id == id) {
                            $scope.Process.splice(i,1);
                        }
                    }
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                    if($(".item").length === 1){
                        $(".tableHeader").hide();
                        $("body").append("<br><div class='container'><div class='alert alert-info'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>No Records! </div></div>");
                    }
                };

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
       // deleteItem();
        editItem();
        editItemDesktop();
      //  deleteItemDesktop();

        window.onload = function () {
            $("html").unmask();
            $("body").show();
        };
        $("#logout").click(function(){
            setCookie("Meteor","",-1);
        })
    });

    //Function to close item
    var close = function () {
        var closeFnc = $('body').on('click tap', '.open', function (e) {
            $('.popover').hide();
        });
    }
    // function to delete items
  /*  var deleteItem = function () {
        $('body').on('click tap', '.btn-delete', function (e) {
            var that = $(this);
                $(this).parent().parent().parent().remove()
            $("html").unmask();
            checkitem();
        });
    }*/
    //Function to edit item
    var editItem = function () {
        $('body').on('click tap', '.btn-check', function (e) {
            $("html").mask("");
            var href = $(".redirect").attr("href");
            window.location = href;
        });
    }
  /*var deleteItemDesktop = function () {

        $('body').on('click tap', '.delete', function (e) {
            var that = $(this);
            $("#delete-modal").modal('show');
            $(".yes").click(function(){
                that.parent().parent().parent().parent().remove();
                $("html").unmask();
                checkitem();
            })

        });
    }*/

    var editItemDesktop = function () {
        $('body').on('click tap', '.redirect', function (e) {
            $("html").mask("");
            e.preventDefault();
            window.location = '/sales';
        });
    }
   /* var checkitem = function () {
        if(($('.item-swipe').length) === 0){
            $(".tableHeader").hide();
        }
        if ($(".item").length === 1) {
            $(".item").hide();
            $("body").append("<br><div class='container'><div class='alert alert-info'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>No Records! </div></div>");
        }

    }*/

}