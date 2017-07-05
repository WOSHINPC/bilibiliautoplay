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

    /** 搜索 */
    $(".search-text").on("keypress", function (e) {
        if (e.keyCode == 13) {
            var url = "";
            var val = $(this).val();
            if (val.length == 0) return;
            if (/^\d{6,}$/.test(val)) {
                url = "http://www.bilibili.com/video/av" + val;
            } else {
                url = "http://search.bilibili.com/all?from_source=banner_search&keyword=" + val;
            }
            chrome.tabs.create({"url": url}, function (tab) {
            })
        }
    })
    let s = localStorage.getItem("On-Off-Event");
    let json;
    if (s && s.length > 0){
        json = JSON.parse(s);
    }else{
        json = {};
    }
    /** 开关类型的事件绑定 */
    let buildOff = function (select, itemName, mame) {
        if (json[itemName]) {
            $(select).text(mame + "(开)");
        } else {
            $(select).text(mame + "(关)");
        }
        $(select).on("click", function () {
            var off = !(json[itemName]);
            if (off) {
                $(select).text(mame + "(开)");
            } else {
                $(select).text(mame + "(关)");
            }
            json[itemName] = off;
            localStorage.setItem("On-Off-Event", JSON.stringify(json));
        });
    };
    buildOff("#autoPlay", "autoPlay", "自动播放");
    buildOff("#wideScreen", "wideScreen", "宽屏");
    buildOff("#clearAd", "clearAd", "去广告");
    buildOff("#playLocation", "playLocation", "移至标题");
    buildOff("#barrage", "barrage", "关闭弹幕");

    /** 收录 */
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