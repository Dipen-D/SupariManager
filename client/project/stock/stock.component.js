 angular.module('supariApp').directive('stock', function () {
        return {
            restrict: 'E',
			templateUrl: 'client/project/stock/stock.html',
            controllerAs: 'stock',
            controller: function ($scope, $reactive, $meteor, $stateParams) {
                $reactive(this).attach($scope);
				
				$scope.delstock = function () {
					$("#delete-modals").modal("show");
				};
				$scope.delall = function(){
					Meteor.call('deleteAllStock', function (err, data) {
                                if (!err) {
                                    var message = "Opening Stock was Deleted";
                                    var error = new Date();
                                    Meteor.call('sendEmail',message,error);
                                    
                                } else {
                                    console.log(err);

                                }
                            });
				}
                var data = [];
                var processDetails = [];
                this.product = "Supari";
                $scope.SupariTypes = "";
                var x = getCookie("LoginUser");
                Meteor.call('getNameByPin', x, function (err, data) {
                    if (!err) {
                        if (data[0].Name == "Admin") {
                            Meteor.call('getGodown', function (err, data) {
                                if (!err) {
                                    $scope.Godowns = data;
                                } else {
                                    console.log(err);
                                }
                            });
                            $("#godown").removeClass("hidden");
                            $(".stock").removeClass("hidden");
                        }
                        else {
                            var godown = data[0].Name;
                            $scope.Godowns = data;
                            $scope.Stock.godown = data[0].Name;

                        }
                    }
                    else {
                        console.log(err);
                        var message = " Error in getNameByPin Method on Stock page";
                        var error = new Date();
                        Meteor.call('sendEmail',message,error);
                    }

                });

                Meteor.call('getStock', function (err, data) {
                    if (!err) {
                        $scope.Stock = data;
                    } else {
                        console.log(err);
                        var message = " Error in getStock Method on Stock page";
                        var error = new Date();
                        Meteor.call('sendEmail',message,error);
                    }
                });
                Meteor.call('getProducts', function (err, data) {
                    if (!err) {
                        $scope.ProductNames = data;
                    } else {
                        console.log(err);
                        var message = " Error in getProducts Method on Stock page";
                        var error = new Date();
                        Meteor.call('sendEmail',message,error);
                    }
                });
                Meteor.call('getProductMainTypes', function (err, data) {
                    if (!err) {
                        $scope.ProductMainTypes = data;
                    } else {
                        console.log(err);
                        var message = " Error in getProductMainTypes Method on Stock page";
                        var error = new Date();
                        Meteor.call('sendEmail',message,error);
                    }
                });
				 var type = $("#product").val();
                    var godown = $("#godown").val();
			
                this.getTotalWeights = function () {
                    var total = 0;
                    var data = (this.product == 'Supari') ? $scope.Stock : $scope.MariTypes;
                    $.each(data, function (index, value) {
                        var weight = getTotalWeightForProduct(value.Name);
                        total += weight;
                    });
                    return total;
                };
                this.getAdjustment = function () {
                    var rawMaterialBags = (isNaN(this.rawMaterialBags)) ? 0 : this.rawMaterialBags;
                    var rawMaterialPackets = (isNaN(this.rawMaterialPackets)) ? 0 : this.rawMaterialPackets;
                    adjustment = this.getTotalWeights() - ((rawMaterialBags * 65) + rawMaterialPackets)
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
                    if (ValidateInputField('type') && ValidateInputField('godown') && ValidateInputField('subtype')) {
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
                    var data = ($('#product').val() == 'Supari') ? $scope.Stock : $scope.MariTypes;
                    var type = $("#product").val();
                    var godown = $("#godown").val();
                    var subtype = $("#type").val();
                    if (type != "") {
                        obj += "<tr>";
                        obj += "<th scope='row'>Type</th>";
                        obj += "<td>" + type + "</td>";
                        obj += "</tr>";
                        obj += "<tr>";
                        obj += "<tr>";
                        obj += "<th scope='row'>Sub Type</th>";
                        obj += "<td>" + subtype + "</td>";
                        obj += "</tr>";
                        obj += "<tr>";
                        obj += "<th scope='row'>Godown</th>";
                        obj += "<td>" + godown + "</td>";
                        obj += "</tr>";

                    }

                    $.each(data, function (index, value) {
                        var weight = getTotalWeightForProduct(value.Name);
                        var dataObj = {
                            Subtypename: subtype+'-'+value.Name,
                            bags: Math.floor(weight / 65),
                            packets: weight - Math.floor(65 * Math.floor(weight / 65)),
                            value: weight
                        };

                        if (weight > 0) {
                            totalWeight += weight;
                            obj += "<tr>";
                            obj += "<th scope='row'>" + subtype+'-'+value.Name + "</th>";
                            obj += "<td>" + weight + " KG</td>";
                            obj += "</tr>";
                            processDetails.push(dataObj);
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
                    $("#godown").val('');
                    $("#rawMaterialBags,#rawMaterialPackets,#RawBags").val('');
                    $("#Mari1Bags,#Mari2Bags,#Mari2Packets,#Mari1Packets").val('');
                    $("#GFBags,#GFPackets,#JFBags,#JFPackets,#JamBags,#JamPackets,#JiniBags,#JiniPackets,#LindiBags,#LindiPackets,#MFBags,#MFPackets,#MMFBags,#MMFPackets,#MoroBags,#MoroPackets,#MotiBags,#MotiPackets,#RFBags,#RFPackets,#SFBags,#SFPackets,#SevarBags,#SevarPackets").val('');

                }


                $scope.processsave = function () {
                    var x = {};
                    var x1 = [];
                    $(".modal-content").mask("");
                    var godown = $("#godown").val();
                    var type = $("#product").val();
                    var pro = {
                        _id: "0",
                        type: type,
                        godown: godown
                    }
                   Meteor.call('DayStock', processDetails, pro, function (err, data) {
                        if (!err) {
                            $(".modal-content").unmask();
                        } else {
                            console.log(err);
                            var message = " Error in DayStock Method on Stock page While saving opening stock";
                            var error = new Date();
                            Meteor.call('sendEmail',message,error);
                        }
                    });
                    resetprocess();

                }
                $(document).ready(function () {


                    $('select').on('change', function () {
                        $(this).removeClass("invalidInput");
                    });
                });
                $scope.getValidValue = function (val) {
                    val = (isNaN(val) || val == "" || val == null) ? 0 : parseInt(val);
                    return val;
                };
            }
        }
    });