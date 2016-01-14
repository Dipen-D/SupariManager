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
        EditPurchaseEntry : function(data){
            Purchase.update({
                CreatedDate:data.date,
                LastModifiedDate:data.date,
                PurchaseAccountName:data.account,
                Type:data.product,
                ProductType:data.producttype,
                Bags:data.bags,
                Packets:data.packets,
                kgs:data.kgs
            })

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
                            LastModifiedDate:datapro.date,
                            Product:datapro.product,
                            Type:datapro.type,
                            Input:datapro.input,
                            Output:datapro.output};
                    for(i=0;i<data.length;i++) {
                        var x = data[i].key;
                        x = get(data,x);
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
                                 Bags: found.bags,
                                 Packets: found.packets,
                                 Weight: found.value
                             };
                        }
                    return null;
                    }
                final[data[i].key] = (x);
            }
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
            var processlist = Purchase.find({},{fields: {'CreatedDate': 1,'Type':1,'Product':1,Input:1,'_id': 1,'Output':1}}).fetch();
            return processlist;
        }

    });
}