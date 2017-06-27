/**
 * Created by luyj on 2017/3/29.
 */
(function () {
    chrome.extension.onRequest.addListener(
        function (request, sender, sendResponse) {
            if (request.greeting == "init") {
                var res = new Object();
                let off;
                off = localStorage.getItem("autoPlay");
                if (off && off == "true") {
                    res.autoPaly = true;
                }
                off = localStorage.getItem("wideScreen");
                if (off && off == "true") {
                    res.wideScreen = true;
                }
                off = localStorage.getItem("clearAd");
                if (off && off == "true") {
                    res.clearAd = true;
                }
                off = localStorage.getItem("playLocation");
                if (off && off == "true") {
                    res.playLocation = true;
                }
                off = localStorage.getItem("barrage");
                if (off && off == "true") {
                    res.barrage = true;
                }
                sendResponse(res);
                return;
            }
            sendResponse({"code": -1});
        });

})();