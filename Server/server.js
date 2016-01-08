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
        getSupariTypes: function (){
            var suparitypes = SupariTypes.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return suparitypes;
        },
        getMariTypes: function () {
            var maritypes = MariTypes.find({}, {fields: {'Name': 1, '_id': 0}}).fetch();
            return maritypes;
        }
    });
}