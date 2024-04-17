/**
 * 基于 mengkun(https://mkblog.cn) 的 https://github.com/mengkunsoft/lmbtfy 修改而成
 * 转载或使用时，还请保留以上信息，谢谢！
 */ 

/* Low version IE polyfill */ 
if(!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

/* Extending a getUrlParam method */
$.getUrlParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]); return null;
};

$(function() {
    var $kw = $('#kw'),
        $searchSubmit = $('#search'),
        $urlOutput = $('#url-output'),
        $tips = $('#tips'),
        $stop = $('#stop'),
        $arrow = $('#arrow');
    
    var stepTimeout, typeInterval;

    /* Get and parse the query parameters. The Base64 encoding of the parameters prevents people from guessing the result directly from the link and refusing to click on it. */ 
    var query = $.getUrlParam('q');
    if(!!query) {
        try {
            query = Base64.decode(query);
        } catch(e) {
            console.log(e);
        }
    }

    /* Parameters available, start tutorial */
    if(!!query) {
        $tips.html('<strong>Time for a lesson in Mojeeking</strong>');
        $stop.fadeIn();

        stepTimeout = setTimeout(function() {
            $tips.html('1. Click in the search box');

            $arrow.removeClass('active').show().animate({
                left: $kw.offset().left + 20 + 'px',
                top: ($kw.offset().top + $kw.outerHeight() / 2) + 'px'
            }, 2000, function () {
                $tips.html('2. Type in the query');
                $arrow.addClass('active');

                stepTimeout = setTimeout(function() {
                    $arrow.fadeOut();

                    var i = 0;
                    typeInterval = setInterval(function () {
                        $kw.val(query.substr(0, i));
                        if (++i > query.length) {
                            clearInterval(typeInterval);
                            $tips.html('3. And then we click to search on MOJEEK');

                            $arrow.removeClass('active').fadeIn().animate({
                                left: $searchSubmit.offset().left + $searchSubmit.width()  / 2 + 'px',
                                top:  $searchSubmit.offset().top  + $searchSubmit.height() / 2 + 'px'
                            }, 1000, function () {
                                $tips.html("<strong>Breaking out of Big Tech isn't so hard is it？</strong>");
                                $arrow.addClass('active');

                                stepTimeout = setTimeout(function () {
                                    if ($(".search-text").attr("data-site") == "google") {
                                        window.location = 'https://www.mojeek.com/search?q=' + encodeURIComponent(query);
                                    } else {
                                        window.location = 'https://www.mojeek.com/search?q=' + encodeURIComponent(query);
                                    }
                                }, 1000);
                            });
                        }
                    }, 200);
                }, 500);
            });
        }, 1000);
    }

    /* The button for exiting the process */ 
    $stop.click(function() {
        clearTimeout(stepTimeout);
        clearInterval(typeInterval);
        $stop.hide();
        $arrow.stop().hide();
        $kw.val(query);
        query = false;
        $tips.html('Enter a question and press Mojeek to Search');
    });

    /* Submit */
    $('#search').on('click', function() {
        if(!!query) return false;

        var question = $.trim($kw.val());
        if(!question) {
            $tips.html('<span style="color: red">Looking for something？</span>');
            $kw.val('');
        } else {
            $tips.html("↓↓↓ Copy this and send it to the person you''re Mojeek'ing for");
            $('#output').fadeIn();
            $urlOutput.val(window.location.origin + window.location.pathname + '?q=' + Base64.encode(question)).focus().select();
        }
        return false;
    });

    /* Get results */ 
    var clipboard = new ClipboardJS('[data-clipboard-target]');
    clipboard.on('success', function(e) {
        $tips.html('<span style="color: #4caf50">Copied to clipboard, now send it to the seeker!</span>');
    });
    clipboard.on('error', function(e) {
        $tips.html('<span style="color: red">That did not work, sorry!</span>');
    });

    /* Preview */ 
    $('#preview').click(function() {
        var link = $urlOutput.val();
        if (!!link) {
            window.open(link);
        }
    });

    /* Search function */ 
    $('#search2').on('click', function(){
        if ($(".search-text").attr("data-site") == "google") {
            window.location = 'https://www.mojeek.com/search?q=' + encodeURIComponent($('#kw').val());
        } else {
            window.location = 'https://www.mojeek.com/search?q=' + encodeURIComponent($('#kw').val());
        }
    });
});

/* Over */
function showAbout(){
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var popupHeight = $("#msgbox").height();       
    var popupWidth = $("#msgbox").width(); 
    $("#mask").width(windowWidth).height(windowHeight).click(function(){hideAbout();}).fadeIn(200); 
    $("#msgbox").css({"position": "absolute","left":windowWidth/2-popupWidth/2,"top":windowHeight/2-popupHeight/2}).fadeIn(200); 
}
function hideAbout(){
    $("#mask").fadeOut(200);
    $("#msgbox").fadeOut(200); 
}

/* Google Test */
function gtest(){
    var img = new Image();
    var timeout = setTimeout(function(){
        img.onerror = img.onload = null;
        $(".search-text").attr("data-site","google2");
    },3000);
    img.onerror = function(){
        clearTimeout(timeout);
        $(".search-text").attr("data-site","google2");
    };
    img.onload = function () {
        clearTimeout(timeout);
        $(".search-text").attr("data-site","google");
    };
    img.src = "https://www.google.com.hk/favicon.ico?"+ +new Date();
}
window.onload = function(){gtest();window.setInterval("gtest()",10000);}