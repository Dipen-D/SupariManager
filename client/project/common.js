
if (Meteor.isClient) {
    setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    };

    getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    };
     
    
    $(function () {

        $("body").hide();
        $("html").mask("");
        $('.item-swipe').swipeTo({

            //default options
            minSwipe: 100,
            angle: 10,
            binder: true,
            swipeStart: function () {
            },
            swipeMove: function () {
            },
            swipeEnd: function () {
            },

        });
        $('[data-toggle="popover"]').popover();
        $('body').on('click', function (e) {
            $('[data-toggle="popover"]').each(function () {
                //the 'is' for buttons that trigger popups
                //the 'has' for icons within a button that triggers a popup
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });
        close();
        // deleteItem();
        editItem();
        editItemDesktop();
        //  deleteItemDesktop();

        window.onload = function () {
            $("html").unmask();
            $("body").show();
        };
        $("#logout").click(function () {
            setCookie("LoginUser", "", -1);
        })
    });

    //Function to close item
    var close = function () {
        var closeFnc = $('body').on('click tap', '.open', function (e) {
            $('.popover').hide();
        });
    }

    var editItem = function () {
        $('body').on('click tap', '.btn-check', function (e) {
            $("html").mask("");
            var href = $(".redirect").attr("href");
            window.location = href;
        });
    }

    var editItemDesktop = function () {
        $('body').on('click tap', '.redirect', function (e) {
            $("html").mask("");
            e.preventDefault();
            window.location = '/sales';
        });
    }
}