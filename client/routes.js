
angular.module('supariApp').config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('processList', {
                resolve: {authenticate: authenticate},
                url: '/processlist',
                template: '<process-list></process-list>'

            })
            .state('processEntry', {
                resolve: {authenticate: authenticate},
                url: '/process',
                template: '<process-entry></process-entry>'

            })
            .state('salesEntry', {
                resolve: {authenticate: authenticate},
                url: '/sales',
                template: '<sales-entry></sales-entry>'
            })
            .state('salesList', {
                resolve: {authenticate: authenticate},
                url: '/saleslist',
                template: '<sales-list></sales-list>'
            })
            .state('purchaseEntry', {
				resolve: {authenticate: authenticate},
                url: '/purchase',
                template: '<purchase-entry></purchase-entry>'

            })
            .state('purchaseEditEntry', {
                resolve: {authenticate: authenticate},
                url: '/purchase/:purchaseId',
                template: '<purchase-entry></purchase-entry>'
            })
            .state('processEditEntry', {
                resolve: {authenticate: authenticate},
                url: '/process/:processId',
                template: '<process-entry></process-entry>'
            })
            .state('salesEditEntry', {
                resolve: {authenticate: authenticate},
                url: '/sales/:salesId',
                template: '<sales-entry></sales-entry>'
            })
            .state('purchaseList', {
                resolve: {authenticate: authenticate},
                url: '/purchaselist',
                template: '<purchase-list></purchase-list>'
            })
            .state('loginList', {
                url: '/birthdaycalculator',
                template: '<login-list></login-list>'
            })
             .state('Summary', {
				resolve: {authenticate: authenticate},
                url: '/summary',
                template: '<summary></summary>'
            })
            .state('stock', {
				resolve: {authenticate: authenticate},
                url: '/stock',
                template: '<stock></stock>'
            })
            .state('salesparty', {
                resolve: {authenticate: authenticate},
                url: '/salesparty',
                template: '<salesparty></salesparty>'
            })
            .state('purchaseparty', {
                resolve: {authenticate: authenticate},
                url: '/purchaseparty',
                template: '<purchaseparty></purchaseparty>'
            });

    $urlRouterProvider.otherwise("/birthdaycalculator");
    })
    function authenticate() {

                var x = getCookie("LoginUser");
                if (x == "") {
                    window.location.href = "/birthdaycalculator";
                    Meteor.call('getAccess', x, function (err, data) {
                        if (!err) {
                                if (!(data == true)) {
                                    //location.href.replace(/^(?:\/\/|[^\/]+)*\//, "") != "/loginlist";
                                    window.location.href = "/birthdaycalculator";
                                }
                        }
                    });
        }
    }