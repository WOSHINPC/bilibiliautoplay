/**
 * Created by luyj on 2017/3/29.
 */
(function () {
    chrome.extension.onRequest.addListener(
        function (request, sender, sendResponse) {
            if (request.greeting == "init") {
                let s = localStorage.getItem("On-Off-Event");
                let json;
                if (s && s.length > 0){
                    json = JSON.parse(s);
                }else{
                    json = {};
                }
                sendResponse(json);
                return;
            }
            sendResponse({"code": -1});
        });

})();