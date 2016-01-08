
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
		getAccounts: function () {
			//return AccountNames.find({});
			var result = AccountNames.find({},{fields: {'name':1,'_id':0}}).fetch();
			//result.foo = "Hello ";
			//result.bar = "World!";
			return result;
		}
	});
}