/**
 * Created by luyj on 2017/3/29.
 */
(function () {
    chrome.extension.onRequest.addListener(
        function (request, sender, sendResponse) {
            if (request.greeting == "autoplay") {
                var autoPalyType = localStorage.getItem("autoPalyType");
                if (autoPalyType && autoPalyType == "play") {
                    sendResponse({"code": "play"});
                    return;
                }
            }
            sendResponse({"code": -1});
        });
})();