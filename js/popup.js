/**
 * Created by luyj on 2017/3/29.
 */

(function () {
    $("#openFavorite").click(function () {
        chrome.tabs.create({"url": "http://www.bilibili.com"}, function (tab) {
        })
    })
    $("#openPlayPage").click(function () {
        chrome.tabs.create({"url": "/play.html"}, function (tab) {
        })
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