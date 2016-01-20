if (Meteor.isServer) {

    /*Meteor.publish("accounts", function () {
     return AccountNames.find({}, {fields: {name: 1}});
     });*/

    Meteor.startup(function () {
        console.log("-------started-------")
        //var a = AccountNames.find({},{fields: {'name':1}});
        //console.log(a);
    });

    Meteor.methods({
        //This will fetch all account names
        getAccounts: function () {
            //return AccountNames.find({});
            var result = PurchaseAccountNames.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            //result.foo = "Hello ";
            //result.bar = "World!";
            return result;
        },
        getProducts: function () {
            //This will fetch all product names
            var product = ProductNames.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return product;
        },
        getProductTypes: function () {
            var producttypes = ProductTypes.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return producttypes;
        },
        getProductMainTypes: function() {
            var productmaintypes = ProductMainTypes.find({}, {fields: {'Name':1, '_id': 0}}).fetch();
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
            var salesaccoutname = SalesAccountNames.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return salesaccoutname;
        },
        getBrandName: function () {
            var brandname = BrandTypes.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return brandname;
        },
        getTransportTypes : function() {
            var transportname = TransportTypes.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return transportname;
        },
        purchaseEntry: function(data) {
            Counters.update({_id: "purchaseId"}, {$inc: {SequenceValue: 1}});
            var ret = Counters.findOne({_id: "purchaseId"});
            var id = ret.SequenceValue.toString();
            console.log(id);
            console.log(data);
            Purchase.insert({
                _id:id,
                CreatedDate:data.date,
                LastModifiedDate:data.date,
                PurchaseAccountName:data.account,
                Type:data.product,
                ProductType:data.producttype,
                Bags:data.bags,
                Packets:data.packets,
                kgs:data.kgs
            });

        },
        EditPurchaseEntry : function(data,id){
            Purchase.update({_id:id},
            {
                CreatedDate:data.date,
                LastModifiedDate:data.mdate,
                PurchaseAccountName:data.account,
                Type:data.product,
                ProductType:data.producttype,
                Bags:data.bags,
                Packets:data.packets,
                kgs:data.kgs
            })

        },
        EditProcessEntry :function(data,datapro,id){
          Process.update({_id:id},
              {  CreatedDate:datapro.date,
              LastModifiedDate:datapro.mdate,
              Product:datapro.product,
              Type:datapro.type,
              Input:datapro.input,
              Output:datapro.output,
              Info:data
          })
            console.log(id);
        },
        process: function(data,datapro){

            var _id;
            Counters.update({_id: "processId"}, {$inc: {SequenceValue: 1}});
            var ret = Counters.findOne({_id: "processId"});
            var id = ret.SequenceValue.toString();
            var object ={};
            console.log(id);
            var final = {_id:id,
                CreatedDate:datapro.date,
                LastModifiedDate:datapro.mdate,
                Product:datapro.product,
                Type:datapro.type,
                Input:datapro.input,
                Output:datapro.output,
                Info:data
            };

            console.log(final);
            Process.insert(final);



        },
        getPurchaseList: function () {
            var purchaselist = Purchase.find({},{fields: {'CreatedDate': 1,'Type':1,'PurchaseAccountName':1,kgs:1,'_id': 1,'ProductType':1}}).fetch();
            return purchaselist;
        },
        deletePurchaseEntry : function(id) {
            Purchase.remove({
                _id:id
            });
        },
        getPurchaseEntry: function (id) {
            var x = Purchase.find({_id:id}).fetch();
            return x;
        },
        getProcessList: function() {
            var processlist = Process.find({},{fields: {'CreatedDate': 1,'Type':1,'Product':1,Input:1,'_id': 1,'Output':1}}).fetch();
            return processlist;
        },
        deleteProcessEntry : function(id) {
            Process.remove({
                _id:id
            });
        },
        getProcessEntry: function (id) {
            var x = Process.find({_id:id}).fetch();
            return x;
        },

        EditSalesEntry :function(data,datapro,id){
            Sales.update({_id:id},
                {
                    CreatedDate: datapro.CreatedDate,
                    LastModifiedDate:datapro.mdate,
                    salesAccountName: datapro.salesAccountName,
                    TransportName: datapro.TransportName,
                    Product: datapro.Product,
                    TotalBags: datapro.TotalBags,
                    Info:data
                })

        },
        SalesEntry : function(data,datapro) {
            var _id;
            Counters.update({_id: "salesId"}, {$inc: {SequenceValue: 1}});
            var ret = Counters.findOne({_id: "salesId"});
            var id = ret.SequenceValue.toString();
            var object ={};
            console.log(id);
            var final = {
                _id:id,
                CreatedDate: datapro.CreatedDate,
                salesAccountName: datapro.salesAccountName,
                TransportName: datapro.TransportName,
                Product: datapro.Product,
                TotalBags:datapro.TotalBags,
                Info:data
            };
            console.log(final);
            /*for (i = 0; i < data.length; i++) {
              var x = data[i].type;
                x = get(data, x);
                function get(array, pouch) {
                    var found;
                    array.some(function (entry) {
                        if (entry.type == pouch) {
                            found = entry;
                            return true;
                        }
                    });
                    if (found) {
                        // Found it, create an object with the properties we want
                        return {
                            Brand: found.brand,
                            DetailType: found.detail,
                            Bags: found.bags,
                            Packets: found.packets,
                            Weight: found.weight
                        };
                    }
                    return null;
                }
                final[data[i].type] = (x);
            }*/
            console.log(final);
            Sales.insert(final);

        },
        getSalesList: function() {
            var sale = Sales.find({},{fields: {'CreatedDate': 1,'salesAccountName':1,'TransportName':1,'TotalBags':1,'_id': 1}}).fetch();
            return sale;
        },
        deleteSaleEntry : function(id) {
            Sales.remove({
                _id:id
            });
        },
        getSalesEntry: function (id) {
            var x = Sales.find({_id:id}).fetch();
            return x;
        }
    });
}