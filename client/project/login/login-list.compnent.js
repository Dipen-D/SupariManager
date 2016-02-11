
 angular.module('supariApp').directive('loginList', function () {
        return {
            restrict: 'E',
             templateUrl: 'client/project/login/login-list.html',
            controllerAs: 'loginList',
            controller: function ($scope, $reactive, $meteor, $stateParams) {
                $(".navbar-toggle").hide();
                 $scope.submit = function () {
                    $("html").mask("");
                    var x = $("#pass").val();
                    Meteor.call('getAccess', x, function (err, data) {
                        if (!err) {
                            if (data == true) {
                                setCookie('LoginUser', x, 5000);
                                var nVer = navigator.appVersion;
                                var nAgt = navigator.userAgent;
                                var browserName = navigator.appName;
                                var fullVersion = '' + parseFloat(navigator.appVersion);
                                var majorVersion = parseInt(navigator.appVersion, 10);
                                var nameOffset, verOffset, ix;

                                // In Opera 15+, the true version is after "OPR/"
                                if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
                                    browserName = "Opera";
                                    fullVersion = nAgt.substring(verOffset + 4);
                                }
                                // In older Opera, the true version is after "Opera" or after "Version"
                                else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
                                    browserName = "Opera";
                                    fullVersion = nAgt.substring(verOffset + 6);
                                    if ((verOffset = nAgt.indexOf("Version")) != -1)
                                        fullVersion = nAgt.substring(verOffset + 8);
                                }
                                // In MSIE, the true version is after "MSIE" in userAgent
                                else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
                                    browserName = "Microsoft Internet Explorer";
                                    fullVersion = nAgt.substring(verOffset + 5);
                                }
                                // In Chrome, the true version is after "Chrome"
                                else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
                                    browserName = "Chrome";
                                    fullVersion = nAgt.substring(verOffset + 7);
                                }
                                // In Safari, the true version is after "Safari" or after "Version"
                                else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
                                    browserName = "Safari";
                                    fullVersion = nAgt.substring(verOffset + 7);
                                    if ((verOffset = nAgt.indexOf("Version")) != -1)
                                        fullVersion = nAgt.substring(verOffset + 8);
                                }
                                // In Firefox, the true version is after "Firefox"
                                else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
                                    browserName = "Firefox";
                                    fullVersion = nAgt.substring(verOffset + 8);
                                }
                                // In most other browsers, "name/version" is at the end of userAgent
                                else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
                                    (verOffset = nAgt.lastIndexOf('/'))) {
                                    browserName = nAgt.substring(nameOffset, verOffset);
                                    fullVersion = nAgt.substring(verOffset + 1);
                                    if (browserName.toLowerCase() == browserName.toUpperCase()) {
                                        browserName = navigator.appName;
                                    }
                                }
                                // trim the fullVersion string at semicolon/space if present
                                if ((ix = fullVersion.indexOf(";")) != -1)
                                    fullVersion = fullVersion.substring(0, ix);
                                if ((ix = fullVersion.indexOf(" ")) != -1)
                                    fullVersion = fullVersion.substring(0, ix);

                                majorVersion = parseInt('' + fullVersion, 10);
                                if (isNaN(majorVersion)) {
                                    fullVersion = '' + parseFloat(navigator.appVersion);
                                    majorVersion = parseInt(navigator.appVersion, 10);
                                }
                                var DateTime = Date().substring(0, 24);
                                var IP = ipConfig;
                                var details = {
                                    Pin: x,
                                    DateTime: DateTime,
                                    IP: IP,
                                    BrowserName: browserName,
                                    FullVersion: fullVersion
                                }
                                Meteor.call('LoginDetails', details, function (err, data) {
                                    if (!err) {
                                        console.log("success");
                                        var message ="Login Details";
                                        var detail = JSON.stringify(details);
                                        Meteor.call('sendEmail',message,detail);
                                    } else {
                                        console.log(err);
                                    }
                                });
                                $("html").mask("");
                                setTimeout(function () {
                                    window.location.href = "/purchase";
                                    //$("html").unmask("");
                                }, 299);

                            }
                            else {
                                window.location.href = "https://www.google.co.in/";
                            }
                        }

                    });
                }
            }
        }
    });