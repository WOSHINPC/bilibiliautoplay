/**
 * Created by luyj on 2017/3/29.
 */

(function () {
    $("#openFavorite").click(function () {
        chrome.tabs.create({"url": "http://www.bilibili.com"}, function (tab) {
        });
    })
    $("#openPlayPage").click(function () {
        chrome.tabs.create({"url": "/play.html"}, function (tab) {
        });
    })

    $(".auto-play ul li a").click(function () {
        var autoPalyType = $(this).attr("type");
        localStorage.setItem("autoPalyType", autoPalyType);
        if (autoPalyType == "play") {
            $("#select").text("自动播放");
        } else {
            $("#select").text("禁用");
        }
    });
    var autoPalyType = localStorage.getItem("autoPalyType");
    if (autoPalyType == "play") {
        $("#select").text("自动播放");
    } else if (autoPalyType == "enforcement") {
        $("#select").text("强制播放");
    } else {
        $("#select").text("禁用");
    }

    $(".auto-play ul").hide().menu();
    $("#select").click(function () {
        var menu = $(".auto-play ul").show().position({
            my: "left top",
            at: "left bottom",
            of: this
        });
        $(document).one("click", function () {
            menu.hide();
        });
        return false;
    });
    $(".search-text").on("keypress", function (e) {
        if (e.keyCode == 13) {
            var url = "";
            var val = $(this).val();
            if (val.length == 0) return;
            if (/\d+/.test(val)) {
                url = "http://www.bilibili.com/video/av" + val;
            } else {
                url = "http://search.bilibili.com/all?from_source=banner_search&keyword=" + val;
            }
            chrome.tabs.create({"url": url}, function (tab) {
            })
        }
    })

    $("#record").click(function () {
        console.log("record");
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.sendRequest(tab.id, {greeting: "record"}, function (response) {
                var list = new List().init();
                var ol = $("#recordList ol");
                ol.html("");
                list.loadData(response, function (isSuccess, e) {
                    if (isSuccess) {
                        ol.append("<li>" + e.title + "</li>");
                    } else {
                        ol.append("<li><del>" + e.title + "</del></li>");
                    }
                });
                list.save();
                $("#recordList").css("display", "");

                //localStorage.setItem("favorite-list",JSON.stringify(response));
            });
        });
    })
})();