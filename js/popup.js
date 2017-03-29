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
                localStorage.setItem("favorite-list",JSON.stringify(response));
            });
        });
    })
})();