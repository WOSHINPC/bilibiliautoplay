/**
 * Created by luyj on 2017/3/29.
 */
(function () {
    console.log("loading......");
    chrome.extension.sendRequest({greeting: "autoplay"}, function (response) {
        console.log(response);
        if (response.code == "play"){
            var inter = window.setInterval(function () {
                var a = $(".bilibili-player-video-btn-start");
                if (a.hasClass("video-state-pause")) {
                    a.click();
                } else {
                    window.clearInterval(inter);
                }
            }, 500);
        }
    });
    chrome.extension.onRequest.addListener(
        function (request, sender, sendResponse) {
            if (request.greeting == "record") {
                var aid = getAid(window.location.href);
                if (aid) {
                    var title = $(".main-inner .v-title h1").text();
                    sendResponse([{"aid": aid, "title": title}]);
                } else {
                    var $videos = $("#video-list-style .small-item .title");
                    var obj = [];
                    $videos.each(function (index, e) {
                        obj[index] = {};
                        obj[index].aid = getAid(e.href);
                        obj[index].title = e.title;
                    });
                    sendResponse(obj);
                }
            } else {
                sendResponse({"unkown": "fail"});
            }
        });

    // var inter = window.setInterval(function () {
    //     var a = $(".bilibili-player-video-btn-start");
    //     if (a.hasClass("video-state-pause")) {
    //         a.click();
    //     } else {
    //         window.clearInterval(inter);
    //     }
    // }, 1000);
    // console.log(chrome.extension.getBackgroundPage().list);
})();