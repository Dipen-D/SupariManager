SupariTypes = new Mongo.Collection("SupariTypeMaster");

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
      controller: function ($scope, $reactive) {
	    $reactive(this).attach($scope);
		this.product = "Supari";
		
		this.supariComtrollers = {};
		
		this.helpers({
          supariTypes: () => {
            return SupariTypes.find({}, {fields: {'name':1}});
          }
        });
		//console.log(this.supariTypes);
		this.supariType = _.chain(this.supariTypes)
		  .pluck('name')
		  .flatten()
		  .value();
		//console.log(this.supariType);
		
		//this.supariType = SupariTypes.find({}, {name:1, _id:0});//["Moro","Moti","Sevar","Jam","Jini","Lindi","MMF","MF","S.F.","J.F.","G.F.","R.F."];
		this.mariType = ["Mari1","Mari2"];
		this.getTotalWeight = function(){
			var total = 0;
			var data = (this.product == 'Supari') ? this.supariType : this.mariType;
			$.each(data, function(index, value){
				var weight = getTotalWeightForProduct(value);
				total+= weight;
			});
			return total;
		};
		this.getAdjustment = function(){
			var rawMaterialBags = (isNaN(this.rawMaterialBags))? 0 : this.rawMaterialBags;
			var rawMaterialPackets = (isNaN(this.rawMaterialPackets))? 0 : this.rawMaterialPackets;
			adjustment = this.getTotalWeight() - ((rawMaterialBags * 65) + rawMaterialPackets)
			return (isNaN(adjustment))? 0 : adjustment;
		};
		$('#entryFields').on('blur','input',function(){
			this.$apply();
		});
		$('#saveBtn').click(function(){
			$('#summary-modal').modal('show');
			fillModalHtml();
		});
      }
    }
  });
  
    angular.module('supariApp').directive('purchaseEntry', function () {
    return {
      restrict: 'E',
      templateUrl: 'purchase-entry.html',
      controllerAs: 'purchaseEntry',
      controller: function ($scope, $stateParams) {
		this.product = "Supari";
		this.datePicker  = "24/11/2015";
		this.getValidValue = function(val){
			val = (isNaN(val) || val =="" || val == null)? 0 : parseInt(val);
			return val;
		};
		this.calculateWeight = function(){
			var weight = (this.getValidValue(this.bags) * 65) + this.getValidValue(this.packets);
			return (isNaN(weight))? 0 : weight;
		}
      }
    }
  });
  
   angular.module('supariApp').directive('salesEntry', function () {
    return {
      restrict: 'E',
      templateUrl: 'sales-entry.html',
      controllerAs: 'salesEntry',
      controller: function ($scope, $stateParams) {
		  this.product = "Supari";
      }
    }
  });
  
  angular.module('supariApp').directive('processList', function () {
    return {
      restrict: 'E',
      templateUrl: 'process-list.html',
      controllerAs: 'processList',
      controller: function ($scope, $reactive) {
       
      }
    }
  });

  angular.module('supariApp').directive('purchaseList', function () {
    return {
      restrict: 'E',
      templateUrl: 'purchase-list.html',
      controllerAs: 'purchaseList',
      controller: function ($scope, $reactive) {
		this.weight = function(nStr) { 
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
		[{date:"12/16", product: "supari", account: "Mallaya",weight:"6500"},
		{date:"12/15", product: "Mari", account: "M.M",weight:"660"},
		{date:"12/14", product: "supari", account: "Sudesh",weight:"6700"},
		{date:"12/13", product: "Mari", account: "G.K.S",weight:"6800"},
		{date:"12/12", product: "supari", account: "M.M",weight:"650"},
		{date:"12/11", product: "Mari", account: "Sudesh",weight:"650"}];
			
		this.predicate = 'date';
		this.reverse = true;
		this.order = function(predicate) {
			this.reverse = (this.predicate === predicate) ? !(this.reverse) : false;
			this.predicate = predicate;
		  }
	}
	}
  });
  
   angular.module('supariApp').directive('salesList', function () {
    return {
      restrict: 'E',
      templateUrl: 'sales-list.html',
      controllerAs: 'salesList',
      controller: function ($scope, $stateParams) {
		this.bags = function(nStr) { //regulerExpression function add coma(,) in price range
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
		[{date:"12/16", account: "M.S.A", transport: "V.T.Co",bags:"1000"},
		{date:"12/15", account: "M.M", transport: "N.P.T",bags:"20"},
		{date:"12/14", account: "Sudesh", transport: "V.T.Co",bags:"70"},
		{date:"12/13", account: "R.S.A", transport: "N.P.T",bags:"68"},
		{date:"12/12", account: "Sudesh", transport: "V.T.Co",bags:"6000"},
		{date:"12/11", account: "M.M", transport: "N.P.T",bags:"50"}];
		
		this.predicate = 'date';
		this.reverse = true;
		this.order = function(predicate) {
			this.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
			this.predicate = predicate;
		  }
	  }
    }
  });
}

if (Meteor.isClient) {
	$(function() {
		$('.item-swipe').swipeTo({
        
			//default options
			minSwipe: 100,
			angle: 10,
			binder: true,
			//callback functions
			swipeStart: function() {
			 // console.log('start');
			},
			swipeMove: function() {
			//  console.log('move');
			},
			swipeEnd: function() {
			//  console.log('end');
			},
		
		}); 
		close();
		deleteItem();
		editItem();
		editItemDesktop();
		deleteItemDesktop();
		//$('[data-toggle="popover"]').popover();
		//$('body').on('click', function (e) {
		//	$('[data-toggle="popover"]').each(function () {
		//		//the 'is' for buttons that trigger popups
		//		//the 'has' for icons within a button that triggers a popup
		//		if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
		//			$(this).popover('hide');
		//		}
		//	});
		//});
	});
		
	//Function to close item
	var close = function()
	{
		 var closeFnc = $('body').on('click tap', '.open', function(e) {
			$('.popover').hide();
		});
	}
	// function to delete items
	var deleteItem = function() {
	   $('body').on('click tap', '.btn-delete', function(e) {
		e.preventDefault();
		var that = $(this);
		that.parent().parent().fadeOut('500');
	  });
	}
	//Function to edit item
	var editItem = function() {
		$('body').on('click tap', '.btn-check', function(e) {
			e.preventDefault();
			window.location= '/sales.html';
		});
	}
	var deleteItemDesktop = function() {
		$('body').on('click tap', '.delete', function(e) {
		e.preventDefault();
		var that = $(this);
		that.parent().parent().parent().parent().fadeOut('500');
		});
	}

	var editItemDesktop = function() {
		$('body').on('click tap', '.redirect', function(e) {
		e.preventDefault();
		window.location= '/sales.html';
		});
	}
	
	var getTotalWeightForProduct = function(_this){
	
		var find = '\\.';
		var re = new RegExp(find, 'g');
		_this = _this.replace(re, '\\.');
		
		var totalBags = $('#'+ _this + 'Bags').val();
		if(totalBags == ""){
			totalBags = 0;
		}
		var totalPackets = $('#'+ _this + 'Packets').val();
		if(totalPackets == ""){
			totalPackets = 0;
		}
		var weight = parseInt(totalBags * 65) + parseInt(totalPackets);
		return (isNaN(weight))? 0 : weight;
	};
	
	var fillModalHtml = function(){
		var obj = "";
		var totalWeight = 0;
		var data = ($('#product').val() == 'Supari') ? supariType : mariType;
		
		var rawMaterialBags = (isNaN($('#rawMaterialBags').val()))? 0 : $('#rawMaterialBags').val();
		var rawMaterialPackets = (isNaN($('#rawMaterialPackets').val()))? 0 : $('#rawMaterialPackets').val();
		var rawMaterial = parseInt(rawMaterialBags * 65) + parseInt(rawMaterialPackets);
		obj += "<tr class='info'>";
		obj += "<td scope='row'>Product</td>";
		obj += "<td>" + $('#product').val() +"</td>";
		obj += "</tr>";	

		var type =  $('#type').val();
		if(type !=""){
			obj += "<tr>";
			obj += "<td scope='row'>Type</td>";
			obj += "<td>" + type +"</td>";
			obj += "</tr>";	
		}
		obj += "<tr>";
		obj += "<td scope='row'>Raw Material</td>";
		obj += "<td>" + rawMaterial +" KG</td>";
		obj += "</tr>";
		$.each(data, function(index, value){
			var weight = getTotalWeightForProduct(value);
			if(weight > 0){
				totalWeight+= weight;
				obj += "<tr>";
				obj += "<td scope='row'>"+value+"</td>";
				obj += "<td>" + weight +" KG</td>";
				obj += "</tr>";	
			}
		});
		var adjustmentClass = (adjustment >= 0 ) ? "text-success": "text-danger";
		obj += "<tr class='info'>";
		obj += "<td scope='row'>Total KG</td>";
		obj += "<td>" + totalWeight +" KG</td>";
		obj += "</tr>";	
		$('#recieptContainer').html(obj);
	};
}