angular.module('supariApp').directive('processEntry', function () {
        return {
            restrict: 'E',
			templateUrl: 'client/project/process/process-entry.html',
            controllerAs: 'processEntry',
             controller: function ($scope, $reactive, $meteor, $stateParams) {
                $reactive(this).attach($scope);
                var processDetail = [];
                var p = [];
                this.product = "Supari";
                $scope.SupariTypes = "";
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
                            $(".salesparty").removeClass("hidden");
                        }
                        else {
                            var godown = data[0].Name;
                            $scope.Godowns = data;
                            $scope.processEntry.godown = data[0].Name;
                        }
                    }
                    else {
                        console.log(err);
                        var error = JSON.stringify(err);
                        var message = "Error in fetching values for Process Entry";
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
                        var error = JSON.stringify(err);
                        var message = "Supari Types not found";
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
                        var message = "Error in getProducts Method";
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
                        var message = "Error in getProductMainTypes Method";
                        var error = JSON.stringify(err);
                        Meteor.call('sendEmail',message,error);
                    }
                });
                var x = $("#datePicker").datepicker({
                    autoclose: true,
                    format:"dd/mm/yyyy",
                    todayHighlight: true
                }).datepicker("setDate", new Date()).val();
                $scope.datePicker = x;

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
                setInterval(function () {
                    $scope.$apply();
                }, 100);

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
                    var rawMaterialBags = (isNaN($('#rawMaterialBags').val()) || $('#rawMaterialBags').val() == "" || $('#rawMaterialBags').val() == null ) ? 0 : $('#rawMaterialBags').val();
                    var rawMaterialPackets = (isNaN($('#rawMaterialPackets').val()) || $('#rawMaterialPackets').val() == "" || $('#rawMaterialPackets').val() == null   ) ? 0 : $('#rawMaterialPackets').val();
                    var rawMaterial = (parseInt(rawMaterialBags * 65) + parseInt(rawMaterialPackets));
                    obj += "<tr class='info'>";
                    obj += "<th scope='row'>Product</th>";
                    obj += "<td>" + $('#product').val() + "</td>";
                    obj += "</tr>";
                    var godown = $("#godown").val();
                    var type = $('#type').val();
                    if (type != "") {
                        obj += "<tr>";
                        obj += "<th scope='row'>Type</th>";
                        obj += "<td>" + type + "</td>";
                        obj += "</tr>";
                        obj += "<tr>";
                        obj += "<th scope='row'>Godown</th>";
                        obj += "<td>" + godown + "</td>";
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

                }
                this.processId = $stateParams.processId;
                if (!!this.processId) {
                    var id = this.processId;
                    Meteor.call('getProcessEntry', this.processId, function (err, data) {
                        if (!err) {
                            for (i = 0; i < data.length; i++) {
                                $("#product").val(data[0].Product).change();
                                $scope.processEntry.godown = data[0].Godown;
                                $("#type").val(data[0].Type);
                                $("#rawMaterialBags").val(Math.floor(data[0].Input / 65)).change();
                                $("#rawMaterialPackets").val(data[0].Input - parseInt(Math.floor(data[0].Input / 65) * 65)).change();
                                $("#datePicker").val(data[0].CreatedDate);
                                for (j = 0; j < data[i].Info.length; j++) {
                                    var name = (data[i].Info[j].Subtypename);
                                    $("html").find('#' + data[i].Info[j].Subtypename + 'Bags').val(data[i].Info[j].bags).change();
                                    $("html").find('#' + data[i].Info[j].Subtypename + 'Packets').val(data[i].Info[j].packets).change();
                                    $("#output").change();
                                }
                            }
                            $scope.processsave = function () {
                                $(".modal-content").mask("");
                                var date = $("#datePicker").val();
                                var convertDate = function(usDate) {
                                    var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                                    return dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
                                }
                                var outDate = convertDate(date);
                                var product = $("#product").val();
                                var godown = $("#godown").val();
                                var type = $("#type").val();
                                var input = parseInt($("#rawMaterialBags").val()) * 65 + parseInt($("#rawMaterialPackets").val());
                                var preoutput = $("#output").text();
                                var outputkgs = preoutput.replace(/[^[+-A-Z]/g, '');
                                var output = parseInt($("#rawMaterialBags").val()) * 65 + parseInt($("#rawMaterialPackets").val()) + parseInt(outputkgs);
                                var dates = new Date();
                                var datestring = ("0" + (dates.getMonth() + 1).toString()).substr(-2) + "/" + ("0" + dates.getDate().toString()).substr(-2) + "/" + (dates.getFullYear().toString()).substr(0);
                                var mdate = datestring;
                                var po = {
                                    id: id,
                                    date: date,
                                    mdate: mdate,
                                    mongoDate:outDate,
                                    product: product,
                                    godown: godown,
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
                                    window.location.href = "/processlist";
                            }
                        } else {
                            console.log(err);
                            var message = "Error in While saving edited record in process";
                            var error = JSON.stringify(err);
                            Meteor.call('sendEmail',message,error);
                        }
                    });

                }
                $scope.processsave = function () {
                    var x = {};
                    var x1 = [];
                    $(".modal-content").mask("");
                    var date = $("#datePicker").val();
                    var convertDate = function(usDate) {
                        var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                        return dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
                    }
                    var outDate = convertDate(date);
                    var product = $("#product").val();
                    var godown = $("#godown").val();
                    var type = $("#type").val();
                    var input = $scope.getValidValue(parseInt($("#rawMaterialBags").val())) * 65 + $scope.getValidValue(parseInt($("#rawMaterialPackets").val()));
                    var preoutput = $("#output").text();
                    var outputkgs = preoutput.replace(/[^[+-A-Z]/g, '');
                    var output = $scope.getValidValue(parseInt($("#rawMaterialBags").val())) * 65 + $scope.getValidValue(parseInt($("#rawMaterialPackets").val())) + $scope.getValidValue(parseInt(outputkgs));
                    var pro = {
                        _id: "0",
                        date: date,
                        mongoDate:outDate,
                        product: product,
                        godown: godown,
                        type: type,
                        input: input,
                        output: output
                    }
                    Meteor.call('process', processDetail, pro, function (err, data) {
                        if (!err) {
                            $(".modal-content").unmask();
                        } else {
                            console.log(err);
                            var message = "Error in While Saving Record in Process Page";
                            var error = JSON.stringify(err);
                            Meteor.call('sendEmail',message,error);
                        }
                    });

                        window.location.href = "/processlist";
                }
                $(document).ready(function () {
                    $('select').on('change', function () {
                        $(this).removeClass("invalidInput");
                    });
                    $('#datePicker').datepicker({
                        autoclose: true,
                        format: "dd/mm/yyyy",
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
