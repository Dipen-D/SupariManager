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
LoginDetails = new Mongo.Collection("LoginDetails");
Godowns = new Mongo.Collection("Godowns");
Stock = new Mongo.Collection("Stock");
OpeningStockForDay = new Mongo.Collection("OpeningStockForDay");

if (Meteor.isServer) {
    Meteor.startup(function () {
        console.log("-------started-------")
        process.env.MAIL_URL = 'smtp://postmaster%40sandbox7af40b8faa404edeac80024df30c445b.mailgun.org:e3d4aad4b53507080f05eec594a6ef18@smtp.mailgun.org:587';
            var sample = SalesAccountNames.find({},{fields:{'Name':1,'Tagad':1,'_id':0}}).fetch();
    });

    Meteor.methods({
        //This will fetch all account names
        getAccounts: function () {
            //return AccountNames.find({});
            var result = PurchaseAccountNames.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return result;
        },
        getProducts: function () {
            //This will fetch all product names
            var product = ProductNames.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return product;
        },
        getProductTypes: function () {
            //var producttypes = ProductTypes.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            //return producttypes;
            var sort_fields = {'Name':1};
            var projection = {'_id':0,'Name':1};
            return ProductTypes.find({},{fields:projection,sort:sort_fields}).fetch();
        },
        getProductMainTypes: function () {
            var productmaintypes = ProductMainTypes.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return productmaintypes;
        },
        getSupariTypes: function () {
            var suparitypes = SupariTypes.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return suparitypes;
        },
        getMariTypes: function () {
            var maritypes = MariTypes.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return maritypes;
        },
        getSalesAccountName: function () {
           // var salesaccoutname = SalesAccountNames.find({},{fields: {'Name': 1, '_id': 0}}).fetch();
            var sort_fields = {'Tagad':1};
            var projection = {'_id':1,'Tagad':1};
            return SalesAccountNames.find({},{fields: projection, sort:sort_fields}).fetch();
           // return salesaccoutname;
        },

        getSalesAccountNameAddParty: function () {
            var salesaccoutname = SalesAccountNames.find({}, {fields: {'Tagad':1, '_id': 1}}).fetch();
            return salesaccoutname;
        },
        getPurchaseAccountNameAddParty: function(){
            var purchaseaccountname = PurchaseAccountNames.find({},{fields: {'Name':1, '_id': 1}}).fetch();
            return purchaseaccountname;
        },
        DeleteSalesAccountParty: function(id){
            SalesAccountNames.remove({
                _id: id
            });
        },
        DeletePurchaseAccountparty: function(id){
            PurchaseAccountNames.remove({
                _id: id
            });
        },
        AddNewSalesAccountparty : function(tagad){
            SalesAccountNames.insert({
                "Tagad":tagad
            })
        },
        AddNewPurchaseAccountParty : function(name){
            PurchaseAccountNames.insert({
                "Name": name
            })
        },
        getBrandName: function () {
            var brandname = BrandTypes.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return brandname;
        },
        getTransportTypes: function () {
            //var transportname = TransportTypes.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
           // return transportname;
            var sort_fields = {'Name':1};
            var projection = {'Name':1,'_id':1};
            return TransportTypes.find({},{fields: projection, sort:sort_fields}).fetch();
        },
        getGodown: function () {
            var godown = Godowns.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return godown;
        },
        getStock : function(){
            var stock = Stock.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return stock;
        },

        purchaseEntry: function (data) {
            Counters.update({_id: "purchaseId"}, {$inc: {SequenceValue: 1}});
            var ret = Counters.findOne({_id: "purchaseId"});
            var id = ret.SequenceValue.toString();
            Purchase.insert({
                _id: id,
                CreatedDate: data.date,
                LastModifiedDate: data.date,
                MongoDate: new Date(data.mongoDate),
                PurchaseAccountName: data.account,
                Godown: data.godown,
                Type: data.product,
                ProductType: data.producttype,
                ProductTypeAlias: data.productTypeAlias,
                Bags: data.bags,
                Packets: data.packets,
                kgs: data.kgs,
                Memo: data.memo
            });

        },
        EditPurchaseEntry: function (data, id) {
            Purchase.update({_id: id},
                {
                    CreatedDate: data.date,
                    LastModifiedDate: data.mdate,
                    MongoDate: new Date(data.mongoDate),
                    PurchaseAccountName: data.account,
                    Godown: data.godown,
                    Type: data.product,
                    ProductType: data.producttype,
                    ProductTypeAlias: data.productTypeAlias,
                    Bags: data.bags,
                    Packets: data.packets,
                    kgs: data.kgs,
                    Memo: data.memo
                })

        },
        EditProcessEntry: function (data, datapro, id) {
            Process.update({_id: id},
                {
                    CreatedDate: datapro.date,
                    LastModifiedDate: datapro.mdate,
                    MongoDate: new Date(datapro.mongoDate),
                    Product: datapro.product,
                    Godown: datapro.godown,
                    Type: datapro.type,
                    Input: datapro.input,
                    Output: datapro.output,
                    Memo :datapro.memo,
                    Info: data
                })
        },
        process: function (data, datapro) {

            var _id;
            Counters.update({_id: "processId"}, {$inc: {SequenceValue: 1}});
            var ret = Counters.findOne({_id: "processId"});
            var id = ret.SequenceValue.toString();
            var object = {};
            var final = {
                _id: id,
                CreatedDate: datapro.date,
                LastModifiedDate: datapro.date,
                MongoDate:new Date(datapro.mongoDate),
                Product: datapro.product,
                Godown: datapro.godown,
                Type: datapro.type,
                Input: datapro.input,
                Output: datapro.output,
                Memo: datapro.memo,
                Info: data
            };
            Process.insert(final);

        },
        DayStock : function(data,datapro){
          var final = {
              Product: datapro.type,
              Godown: datapro.godown,
              Info: data
          }
          OpeningStockForDay.insert(final);
        },
        getPurchaseList: function () {
            var purchaselist = Purchase.find({}, {
                fields: {
                    'CreatedDate': 1,
                    'Type': 1,
                    'PurchaseAccountName': 1,
                    kgs: 1,
                    '_id': 1,
                    'ProductType': 1,
                    'MongoDate':1
                }
            }).fetch();
            return purchaselist;
        },
        deletePurchaseEntry: function (id) {
            Purchase.remove({
                _id: id
            });
        },
        getPurchaseEntry: function (id) {
            var x = Purchase.find({_id: id}).fetch();
            return x;
        },
        getProcessList: function () {
            var processlist = Process.find({}, {
                fields: {
                    'CreatedDate': 1,
                    'Type': 1,
                    'Product': 1,
                    Input: 1,
                    '_id': 1,
                    'Output': 1,
                    'MongoDate':1
                }
            }).fetch();
            return processlist;
        },
        deleteProcessEntry: function (id) {
            Process.remove({
                _id: id
            });
        },
        getProcessEntry: function (id) {
            var x = Process.find({_id: id}).fetch();
            return x;
        },

        EditSalesEntry: function (data, datapro, id) {
            Sales.update({_id: id},
                {
                    CreatedDate: datapro.CreatedDate,
                    LastModifiedDate: datapro.mdate,
                    MongoDate: new Date(datapro.mongoDate),
                    salesAccountName: datapro.salesAccountName,
                    TransportName: datapro.TransportName,
                    Product: datapro.Product,
                    Godown: datapro.Godown,
                    TotalBags: datapro.TotalBags,
                    Memo:datapro.memo,
                    Info: data
                })

        },
        SalesEntry: function (data, datapro) {
            var _id;
            Counters.update({_id: "salesId"}, {$inc: {SequenceValue: 1}});
            var ret = Counters.findOne({_id: "salesId"});
            var id = ret.SequenceValue.toString();
            var object = {};
            var final = {
                _id: id,
                CreatedDate: datapro.CreatedDate,
                LastModifiedDate: datapro.CreatedDate,
                MongoDate: new Date(datapro.mongoDate),
                salesAccountName: datapro.salesAccountName,
                TransportName: datapro.TransportName,
                Product: datapro.Product,
                Godown: datapro.Godown,
                TotalBags: datapro.TotalBags,
                Memo:datapro.memo,
                Info: data
            };
            Sales.insert(final);

        },
        getSalesList: function () {
            var sale = Sales.find({}, {
                fields: {
                    'CreatedDate': 1,
                    'salesAccountName': 1,
                    'TransportName': 1,
                    'TotalBags': 1,
                    '_id': 1,
                    'MongoDate':1,
                    'RealSalesAccountName':1
                }
            }).fetch();
            return sale;
        },
        deleteSaleEntry: function (id) {
            Sales.remove({
                _id: id
            });
        },
        getSalesEntry: function (id) {
            var x = Sales.find({_id: id}).fetch();
            return x;
        },
        getAccess: function (x) {
            var processlist = Login.findOne({"Pin": x}, {"_id": 0});
            if (processlist != null) {
                return true;
            }
            else {
                return false;
            }
        },

        LoginDetails: function (data) {
            LoginDetails.insert(data);
        },

        //Entering pin decode the go-down
        getNameByPin: function (x) {
            var name = Login.find({"Pin": x}, {fields: {'Name': 1}}).fetch();
            return name;
        },

        //Get purchase-list for particular go-down
        getPurchaseDataByGodown: function (x) {
            var purchaselist = Purchase.find({"Godown": x}, {
                fields: {
                    'CreatedDate': 1,
                    'Type': 1,
                    'PurchaseAccountName': 1,
                    kgs: 1,
                    '_id': 1,
                    'ProductType': 1
                }
            }).fetch();
            return purchaselist;
        },

        //Get sales-list for particular go-down
        getSalesDataByGodown: function (x) {
            var sale = Sales.find({"Godown": x}, {
                fields: {
                    'CreatedDate': 1,
                    'salesAccountName': 1,
                    'TransportName': 1,
                    'TotalBags': 1,
                    '_id': 1
                }
            }).fetch();
            return sale;
        },

        //Get process-list for particular go-down
        getProcessDataByGodown: function (x) {
            var processlist = Process.find({"Godown": x}, {
                fields: {
                    'CreatedDate': 1,
                    'Type': 1,
                    'Product': 1,
                    Input: 1,
                    '_id': 1,
                    'Output': 1
                }
            }).fetch();
            return processlist;
        },

        //Get Opening Stock for a particular go-down
        getOpeningStock: function (x) {
            var stock = OpeningStock.find({"Godown": x}).fetch();
            return stock;
        },

        //Get Total openingBalance
        getTotalOpeningBalance: function () {
            var stock = OpeningStock.find({}).fetch();
            return stock;
        },

        getPurchaseForDayForGodown: function (x, Godown) {
            var convertDate = function(usDate) {
                var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                return dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
            }
            var outDate = convertDate(x);
            if(Godown == ""){
                var Purchaseo = Purchase.aggregate([{
                    $match: {
                        Type: "Supari",
                        MongoDate : new Date(outDate)
                    }
                }, {$group: {_id: "$ProductTypeAlias", Kgs: {$sum: "$kgs"}}}]);
                return Purchaseo;
            }
            else{
                var Purchaseo = Purchase.aggregate([{
                    $match: {
                        Type: "Supari",
                        MongoDate : new Date(outDate),
                        Godown: Godown
                    }
                }, {$group: {_id: "$ProductTypeAlias", Kgs: {$sum: "$kgs"}}}]);
                return Purchaseo;
            }

        },
        getSalesForDayForGodown: function (x, Godown) {
            var convertDate = function(usDate) {
                var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                return dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
            }
            var outDate = convertDate(x);
            if(Godown == ""){
                var saleData = Sales.aggregate([{
                    $match: {
                        Product: "Supari",
                        MongoDate : new Date(outDate)
                    }
                }, {$unwind: '$Info'}, {
                    $group: {
                        _id: {
                            name: "$Info.Subtypename",
                            type: "$Info.detail",
                            detail: "$Info.brand"
                        }, Kgs: {$sum: "$Info.weight"}
                    }
                }]);
                return saleData;
            }
            else{
                var saleData = Sales.aggregate([{
                    $match: {
                        Product: "Supari",
                        MongoDate : new Date(outDate),
                        Godown: Godown
                    }
                }, {$unwind: '$Info'}, {
                    $group: {
                        _id: {
                            name: "$Info.Subtypename",
                            type: "$Info.detail",
                            detail: "$Info.brand"
                        }, Kgs: {$sum: "$Info.weight"}
                    }
                }]);
                return saleData;
            }

        },
        getProcessForDayForGodown: function (x, Godown) {
            var convertDate = function(usDate) {
                var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                return dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
            }
            var outDate = convertDate(x);
            if(Godown == ""){
                var processData = Process.aggregate([{
                    $match: {
                        Product: "Supari",
                        MongoDate : new Date(outDate)
                    }
                }, {$unwind: '$Info'}, {
                    $group: {
                        _id: {name: "$Type", type: "$Info.Subtypename"},
                        Kgs: {$sum: "$Info.value"}
                    }
                }]);
                return processData;
            }
            else{
                var processData = Process.aggregate([{
                    $match: {
                        Product: "Supari",
                        MongoDate : new Date(outDate),
                        Godown: Godown
                    }
                }, {$unwind: '$Info'}, {
                    $group: {
                        _id: {name: "$Type", type: "$Info.Subtypename"},
                        Kgs: {$sum: "$Info.value"}
                    }
                }]);
                return processData;
            }

        },
        getOpeningStockViaDateForGodown: function (x, Godown) {
            var convertDate = function(usDate) {
                var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                return dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
            }
            var outDate = convertDate(x);
            var Sums = function (obj, list) {
                var i;
                var found = false;
                for (i = 0; i < list.length; i++) {
                    if (list[i].Name === obj.Name) {
                        list[i].Kgs = parseInt(obj.Kgs) + parseInt(list[i].Kgs);
                        found = true;
                        //return true;
                    }
                }
                if (!found) {
                    list.push(obj);
                }
            };
            var deduce = function (obj, list) {
                var i;
                var found = false;
                for (i = 0; i < list.length; i++) {
                    if (list[i].Name === obj.Name) {
                        list[i].Kgs = parseInt(list[i].Kgs) - parseInt(obj.Kgs);
                        found = true;
                    }
                }
                if (!found) {
                    list.push(obj);
                }
            };
            var deduceminus = function (obj, list) {
                var i;
                var found = false;
                for (i = 0; i < list.length; i++) {
                    if (list[i].Name === obj.Name) {
                        list[i].Kgs = parseInt(list[i].Kgs) - parseInt(obj.Kgs);
                        found = true;
                    }
                }
                if (!found) {
                    obj.Kgs = -obj.Kgs;
                    list.push(obj);
                }
            };
            var Sumsminus = function (obj, list) {
                var i;
                var found = false;
                for (i = 0; i < list.length; i++) {
                    if (list[i].Name === obj.Name) {
                        list[i].Kgs = parseInt(list[i].Kgs) - parseInt(obj.Kgs);
                        found = true;
                        //return true;
                    }
                }
                if (!found) {
                    if (obj.Name == 'N-Raw' || obj.Name == 'DC-Raw' || obj.Name == 'C-Raw') {
                        obj.Kgs = -obj.Kgs;
                    }
                    list.push(obj);
                }
            };
            var temp = [];
            var temp1 = [];
            var sum = [];
            var sale = [];
            var result = [];
            var raw = [];
            var purchaseStock = [];
            if(Godown == ""){
                var salesObj = Sales.aggregate([{
                    $match: {
                        Product: "Supari",
                        MongoDate: {$lt: new Date(outDate)}
                    }
                }, {$unwind: '$Info'}, {
                    $group: {
                        _id: {name: "$Info.Subtypename", type: "$Info.detail"},
                        kgs: {$sum: "$Info.weight"}
                    }
                }]);
                var openingstock = OpeningStockForDay.aggregate([{$match: {Product: "Supari"}}, {$unwind: '$Info'}, {
                    $group: {
                        _id: {
                            type: "$Info.Subtypename"
                        }, kgs: {$sum: "$Info.value"}
                    }
                }]);
                var processObj = Process.aggregate([{
                    $match: {
                        Product: "Supari",
                        MongoDate: {$lt: new Date(outDate)}
                    }
                }, {$unwind: '$Info'}, {
                    $group: {
                        _id: {name: "$Type", type: "$Info.Subtypename"},
                        kgs: {$sum: "$Info.value"}
                    }
                }])
                var deductRaw = Process.aggregate([{
                    $match: {
                        Product: "Supari",
                        MongoDate: {$lt: new Date(outDate)}
                    }
                }, {$group: {_id: "$Type", Kgs: {$sum: "$Input"}}}]);
                var purchaseRaw = Purchase.aggregate([{
                    $match: {
                        Type: "Supari",
                        MongoDate: {$lt: new Date(outDate)}
                    }
                }, {$group: {_id: "$ProductTypeAlias", Kgs: {$sum: "$kgs"}}}]);
                purchaseStock.push(purchaseRaw);
                raw.push(deductRaw);
                temp.push(openingstock);
                temp1.push(processObj);
                //return temp;
                for (i = 0; i < temp.length; i++) {
                    for (j = 0; j < temp[i].length; j++) {
                        var type = (temp[i][j]._id.type);
                        var kgs = (temp[i][j].kgs);
                        var dataObj = {Name: type, Kgs: kgs};
                        Sums(dataObj, sum);
                    }
                }
                for (i = 0; i < purchaseStock.length; i++) {
                    for (j = 0; j < purchaseStock[i].length; j++) {
                        var name = (purchaseStock[i][j]._id);
                        var kgs = (purchaseStock[i][j].Kgs);
                        var dataObj = {Name: name + '-' + 'Raw', Kgs: kgs};
                        Sums(dataObj, sum);
                    }
                }
                for (i = 0; i < temp1.length; i++) {
                    for (j = 0; j < temp1[i].length; j++) {
                        var name = (temp1[i][j]._id.name);
                        var type = (temp1[i][j]._id.type);
                        var kgs = (temp1[i][j].kgs);
                        var dataObj = {Name: name + '-' + type, Kgs: kgs};
                        Sums(dataObj, sum);
                    }
                }
                sale.push(salesObj);
                for (i = 0; i < sale.length; i++) {
                    for (j = 0; j < sale[i].length; j++) {
                        var name = (sale[i][j]._id.name);
                        var type = (sale[i][j]._id.type);
                        var kgs = (sale[i][j].kgs);
                        var dataObj = {Name: name + '-' + type, Kgs: kgs};
                        deduceminus(dataObj, sum);
                    }
                }
                for (i = 0; i < raw.length; i++) {
                    for (j = 0; j < raw[i].length; j++) {
                        var name = (raw[i][j]._id);
                        var kgs = (raw[i][j].Kgs);
                        var dataObj = {Name: name + '-' + 'Raw', Kgs: kgs};
                        Sumsminus(dataObj, sum);
                    }
                }
                return sum;
            }
            else{
                var salesObj = Sales.aggregate([{
                    $match: {
                        Product: "Supari",
                        Godown: Godown,
                        MongoDate: {$lt: new Date(outDate)}
                    }
                }, {$unwind: '$Info'}, {
                    $group: {
                        _id: {name: "$Info.Subtypename", type: "$Info.detail"},
                        kgs: {$sum: "$Info.weight"}
                    }
                }])
                var openingstock = OpeningStockForDay.aggregate([{$match: {Product: "Supari", Godown: Godown}}, {$unwind: '$Info'}, {
                    $group: {
                        _id: {
                            type: "$Info.Subtypename"
                        }, kgs: {$sum: "$Info.value"}
                    }
                }]);
                var processObj = Process.aggregate([{
                    $match: {
                        Product: "Supari",
                        Godown: Godown,
                        MongoDate: {$lt: new Date(outDate)}
                    }
                }, {$unwind: '$Info'}, {
                    $group: {
                        _id: {name: "$Type", type: "$Info.Subtypename"},
                        kgs: {$sum: "$Info.value"}
                    }
                }])
                var deductRaw = Process.aggregate([{
                    $match: {
                        Product: "Supari",
                        Godown: Godown,
                        MongoDate: {$lt: new Date(outDate)}
                    }
                }, {$group: {_id: "$Type", Kgs: {$sum: "$Input"}}}]);
                var purchaseRaw = Purchase.aggregate([{
                    $match: {
                        Type: "Supari",
                        Godown: Godown,
                        MongoDate: {$lt: new Date(outDate)}
                    }
                }, {$group: {_id: "$ProductTypeAlias", Kgs: {$sum: "$kgs"}}}]);
                purchaseStock.push(purchaseRaw);
                raw.push(deductRaw);
                temp.push(openingstock);
                temp1.push(processObj);
                //return temp;

                for (i = 0; i < temp.length; i++) {
                    for (j = 0; j < temp[i].length; j++) {
                        /*  var name = (temp[i][j]._id.name);*/
                        var type = (temp[i][j]._id.type);
                        var kgs = (temp[i][j].kgs);
                        var dataObj = {Name: type, Kgs: kgs};
                        Sums(dataObj, sum);
                    }
                }
                for (i = 0; i < purchaseStock.length; i++) {
                    for (j = 0; j < purchaseStock[i].length; j++) {
                        var name = (purchaseStock[i][j]._id);
                        var kgs = (purchaseStock[i][j].Kgs);
                        var dataObj = {Name: name + '-' + 'Raw', Kgs: kgs};
                        Sums(dataObj, sum);
                    }
                }
                for (i = 0; i < temp1.length; i++) {
                    for (j = 0; j < temp1[i].length; j++) {
                        var name = (temp1[i][j]._id.name);
                        var type = (temp1[i][j]._id.type);
                        var kgs = (temp1[i][j].kgs);
                        var dataObj = {Name: name + '-' + type, Kgs: kgs};
                        Sums(dataObj, sum);
                    }
                }
                sale.push(salesObj);
                for (i = 0; i < sale.length; i++) {
                    for (j = 0; j < sale[i].length; j++) {
                        var name = (sale[i][j]._id.name);
                        var type = (sale[i][j]._id.type);
                        var kgs = (sale[i][j].kgs);
                        var dataObj = {Name: name + '-' + type, Kgs: kgs};
                        deduceminus(dataObj, sum);
                    }
                }
                for (i = 0; i < raw.length; i++) {
                    for (j = 0; j < raw[i].length; j++) {
                        var name = (raw[i][j]._id);
                        var kgs = (raw[i][j].Kgs);
                        var dataObj = {Name: name + '-' + 'Raw', Kgs: kgs};
                        Sumsminus(dataObj, sum);
                    }
                }
                return sum;
            }

        },

        getBalanceSheetViaDateForGodown: function (x, Godown) {
            var convertDate = function(usDate) {
                var dateParts = usDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                return dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
            }
            var outDate = convertDate(x);
            var Sums = function (obj, list) {
                var i;
                var found = false;
                for (i = 0; i < list.length; i++) {
                    if (list[i].Name === obj.Name) {
                        list[i].Kgs = parseInt(obj.Kgs) + parseInt(list[i].Kgs);
                        found = true;
                        //return true;
                    }
                }
                if (!found) {
                    list.push(obj);
                }
            };
            var deduce = function (obj, list) {
                var i;
                var found = false;
                for (i = 0; i < list.length; i++) {
                    if (list[i].Name === obj.Name) {
                        list[i].Kgs = parseInt(list[i].Kgs) - parseInt(obj.Kgs);
                        found = true;
                    }
                }
                if (!found) {
                    list.push(obj);
                }
            };
            var deduceminus = function (obj, list) {
                var i;
                var found = false;
                for (i = 0; i < list.length; i++) {
                    if (list[i].Name === obj.Name) {
                        list[i].Kgs = parseInt(list[i].Kgs) - parseInt(obj.Kgs);
                        found = true;
                    }
                }
                if (!found) {
                    obj.Kgs = -obj.Kgs;
                    list.push(obj);
                }
            };
            var Sumsminus = function (obj, list) {
                var i;
                var found = false;
                for (i = 0; i < list.length; i++) {
                    if (list[i].Name === obj.Name) {
                        list[i].Kgs = parseInt(list[i].Kgs) - parseInt(obj.Kgs);
                        found = true;
                        //return true;
                    }
                }
                if (!found) {
                    if (obj.Name == 'N-Raw' || obj.Name == 'DC-Raw' || obj.Name == 'C-Raw') {
                        obj.Kgs = -obj.Kgs;
                    }
                    list.push(obj);
                }
            };
            var temp = [];
            var temp1 = [];
            var sum = [];
            var sale = [];
            var result = [];
            var raw = [];
            var purchaseStock = [];
            if(Godown == "") {

                var salesObj = Sales.aggregate([{
                    $match: {
                        Product: "Supari",
                        MongoDate: {$lte: new Date(outDate)}
                    }
                }, {$unwind: '$Info'}, {
                    $group: {
                        _id: {name: "$Info.Subtypename", type: "$Info.detail"},
                        kgs: {$sum: "$Info.weight"}
                    }
                }])
                var openingstock = OpeningStockForDay.aggregate([{$match: {Product: "Supari"}}, {$unwind: '$Info'}, {
                    $group: {
                        _id: {
                            type: "$Info.Subtypename"
                        }, kgs: {$sum: "$Info.value"}
                    }
                }]);
                var processObj = Process.aggregate([{
                    $match: {
                        Product: "Supari",
                        MongoDate: {$lte: new Date(outDate)}
                    }
                }, {$unwind: '$Info'}, {
                    $group: {
                        _id: {name: "$Type", type: "$Info.Subtypename"},
                        kgs: {$sum: "$Info.value"}
                    }
                }])
                var deductRaw = Process.aggregate([{
                    $match: {
                        Product: "Supari",
                        MongoDate: {$lte: new Date(outDate)}
                    }
                }, {$group: {_id: "$Type", Kgs: {$sum: "$Input"}}}]);
                var purchaseRaw = Purchase.aggregate([{
                    $match: {
                        Type: "Supari",
                        MongoDate: {$lte: new Date(outDate)}
                    }
                }, {$group: {_id: "$ProductTypeAlias", Kgs: {$sum: "$kgs"}}}]);
                purchaseStock.push(purchaseRaw);
                raw.push(deductRaw);
                temp.push(openingstock);
                temp1.push(processObj);
                //return temp;
                for (i = 0; i < temp.length; i++) {
                    for (j = 0; j < temp[i].length; j++) {
                        var type = (temp[i][j]._id.type);
                        var kgs = (temp[i][j].kgs);
                        var dataObj = {Name: type, Kgs: kgs};
                        Sums(dataObj, sum);
                    }
                }
                for (i = 0; i < purchaseStock.length; i++) {
                    for (j = 0; j < purchaseStock[i].length; j++) {
                        var name = (purchaseStock[i][j]._id);
                        var kgs = (purchaseStock[i][j].Kgs);
                        var dataObj = {Name: name + '-' + 'Raw', Kgs: kgs};
                        Sums(dataObj, sum);
                    }
                }
                for (i = 0; i < temp1.length; i++) {
                    for (j = 0; j < temp1[i].length; j++) {
                        var name = (temp1[i][j]._id.name);
                        var type = (temp1[i][j]._id.type);
                        var kgs = (temp1[i][j].kgs);
                        var dataObj = {Name: name + '-' + type, Kgs: kgs};
                        Sums(dataObj, sum);
                    }
                }
                sale.push(salesObj);
                for (i = 0; i < sale.length; i++) {
                    for (j = 0; j < sale[i].length; j++) {
                        var name = (sale[i][j]._id.name);
                        var type = (sale[i][j]._id.type);
                        var kgs = (sale[i][j].kgs);
                        var dataObj = {Name: name + '-' + type, Kgs: kgs};
                        deduceminus(dataObj, sum);
                    }
                }
                for (i = 0; i < raw.length; i++) {
                    for (j = 0; j < raw[i].length; j++) {
                        var name = (raw[i][j]._id);
                        var kgs = (raw[i][j].Kgs);
                        var dataObj = {Name: name + '-' + 'Raw', Kgs: kgs};
                        Sumsminus(dataObj, sum);
                    }
                }
                return sum;
            }
            else{
                var salesObj = Sales.aggregate([{
                    $match: {
                        Product: "Supari",
                        Godown: Godown,
                        MongoDate: {$lte: new Date(outDate)}
                    }
                }, {$unwind: '$Info'}, {
                    $group: {
                        _id: {name: "$Info.Subtypename", type: "$Info.detail"},
                        kgs: {$sum: "$Info.weight"}
                    }
                }])
                var openingstocks = OpeningStockForDay.aggregate([{$match: {Product: "Supari", Godown: Godown}}, {$unwind: '$Info'}, {
                    $group: {
                        _id: {
                            type: "$Info.Subtypename"
                        }, kgs: {$sum: "$Info.value"}
                    }
                }]);
                var processObj = Process.aggregate([{
                    $match: {
                        Product: "Supari",
                        Godown: Godown,
                        MongoDate: {$lte: new Date(outDate)}
                    }
                }, {$unwind: '$Info'}, {
                    $group: {
                        _id: {name: "$Type", type: "$Info.Subtypename"},
                        kgs: {$sum: "$Info.value"}
                    }
                }])
                var deductRaw = Process.aggregate([{
                    $match: {
                        Product: "Supari",
                        Godown: Godown,
                        MongoDate: {$lte: new Date(outDate)}
                    }
                }, {$group: {_id: "$Type", Kgs: {$sum: "$Input"}}}]);
                var purchaseRaw = Purchase.aggregate([{
                    $match: {
                        Type: "Supari",
                        Godown: Godown,
                        MongoDate: {$lte: new Date(outDate)}
                    }
                }, {$group: {_id: "$ProductTypeAlias", Kgs: {$sum: "$kgs"}}}]);
                purchaseStock.push(purchaseRaw);
                raw.push(deductRaw);
                temp.push(openingstocks);
                temp1.push(processObj);
                for (i = 0; i < temp.length; i++) {
                    for (j = 0; j < temp[i].length; j++) {
                        /*  var name = (temp[i][j]._id.name);*/
                        var type = (temp[i][j]._id.type);
                        var kgs = (temp[i][j].kgs);
                        var dataObj = {Name: type, Kgs: kgs};
                        Sums(dataObj, sum);
                    }
                }
                for (i = 0; i < purchaseStock.length; i++) {
                    for (j = 0; j < purchaseStock[i].length; j++) {
                        var name = (purchaseStock[i][j]._id);
                        var kgs = (purchaseStock[i][j].Kgs);
                        var dataObj = {Name: name + '-' + 'Raw', Kgs: kgs};
                        Sums(dataObj, sum);
                    }
                }
                for (i = 0; i < temp1.length; i++) {
                    for (j = 0; j < temp1[i].length; j++) {
                        var name = (temp1[i][j]._id.name);
                        var type = (temp1[i][j]._id.type);
                        var kgs = (temp1[i][j].kgs);
                        var dataObj = {Name: name + '-' + type, Kgs: kgs};
                        Sums(dataObj, sum);
                    }
                }
                sale.push(salesObj);
                for (i = 0; i < sale.length; i++) {
                    for (j = 0; j < sale[i].length; j++) {
                        var name = (sale[i][j]._id.name);
                        var type = (sale[i][j]._id.type);
                        var kgs = (sale[i][j].kgs);
                        var dataObj = {Name: name + '-' + type, Kgs: kgs};
                        deduceminus(dataObj, sum);
                    }
                }
                for (i = 0; i < raw.length; i++) {
                    for (j = 0; j < raw[i].length; j++) {
                        var name = (raw[i][j]._id);
                        var kgs = (raw[i][j].Kgs);
                        var dataObj = {Name: name + '-' + 'Raw', Kgs: kgs};
                        Sumsminus(dataObj, sum);
                    }
                }
                return sum;
            }

        },
		deleteAllStock : function(){
			var sto = OpeningStockForDay.remove({});
			return true;
		},
        sendEmail: function (subject,message) {
            var email = {
                to: "harsh.makadia@marutitech.com",
                cc:"dipen.dedania@marutitech.com",
                from: "supari-manager@meteor.com",
                subject: "Meteor notification",
                text: subject+'\n'+message
            };
            Email.send(email);
        },
        decodeName :function(x){
            var name = SalesAccountNames.find({"Tagad":x}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return name;
        },
        CheckForDuplicateAccount:function(tagad){
            var x  = SalesAccountNames.find({Tagad:tagad}).fetch();
            return x ;

        },
        checkForDuplicatePurchaseAccount:function(name){
            var x  = PurchaseAccountNames.find({Name:name}).fetch();
            return x ;
        },
        CheckForTransactionBeforeDelete : function(tagad){
            var x = Sales.find({"salesAccountName":tagad}).fetch();
            return x;
        },
        CheckForTransactionBeforeDelete : function(name){
            var x = Purchase.find({"PurchaseAccountName":name}).fetch();
            return x;
        },
    });
}