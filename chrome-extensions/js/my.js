/**
 * Created by luyj on 2017/3/29.
 */
(function () {
    // 自动播放
    var autoPlay = function (f) {
        var inter = window.setInterval(function () {
            var a = document.getElementsByTagName("iframe");
            if (a.length > 1) {
                a = $(document.getElementsByTagName("iframe")[0].contentWindow.document).find(".bilibili-player-video-btn-start");
            } else {
                a = $(".bilibili-player-video-btn-start");
            }
            if (a.length == 0) return;
            if (a.hasClass("video-state-pause")) {
                var r = a.click();
                if (!r.hasClass("video-state-pause")) {
                    window.clearInterval(inter);
                    f && f();
                }
            } else {
                window.clearInterval(inter);
            }
        }, 1000);
    }

    /** 自动跳过op ed*/
    if ($(".v-plist a").length > 0 || location.href.indexOf("bangumi.bilibili.com/anime/") != -1) {
        var skipFlag = false;
        var video;
        var skip_start_time = getQueryString("skip_start_time") || 0, skip_end_time = getQueryString("skip_end_time") || 0, speed_val = getQueryString("speed_val") || 0;

        var auto_skip_html =
            "<style>" +
            ".skip>div{" +
            "margin: 0 auto;" +
            "width: 800px;" +
            "}" +
            ".skip span{" +
            "font-size: 16px" +
            "}" +
            ".skip input{" +
            "width: 70px;height: 24px; border-radius: 4px;margin: 0px;" +
            "}" +
            "</style>" +
            "<div class='skip'> " +
            "<div id='skip'>" +
            "<span class='skip_auto'>" +
            "<span>开始跳到</span><input type='text' id='skip_start' " +
            (skip_start_time ? "value='" + skip_start_time + "'" : "") +
            " placeholder='00:00'/> " +
            "<span>到</span><input type='text' id='skip_end' " +
            (skip_end_time ? "value='" + skip_end_time + "'" : "") +
            "placeholder='00:00'/><span>时自动下一集</span> " +
            "</span>" +
            "<button id='skip_on_off' style='width: 65px;height: 30px'>开启功能</button> &nbsp;&nbsp;&nbsp;&nbsp;" +
            "<button id='speed_btn' style='width: 50px;height: 30px'>快进</button> " +
            "<input id='speed_val' type='text' " +
            (speed_val ? "value='" + speed_val + "'" : "") +
            "placeholder='0'/><span>秒</span>" +
            "</div>" +
            "</div>";
        $("#bofqi").before(auto_skip_html);

        var isAv = window.location.href.indexOf("http://www.bilibili.com/video/av") != -1;
        var skipPlay = function () {
            var skipInterval = window.setInterval(function () {
                // 等待video加载
                if (isAv) {
                    video = document.getElementsByTagName("video");
                } else {
                    video = document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByTagName("video");
                }
                if (video.length > 0) {
                    window.clearInterval(skipInterval);
                    video = video[0];
                    skipInterval = window.setInterval(function () {
                        if (!video.paused && skipFlag) {
                            if (video.currentTime >0.5 && video.currentTime <= 1.9 && skip_start_time) {
                                video.currentTime = skip_start_time;
                            } else if (skip_end_time && video.currentTime > skip_end_time && video.currentTime < (skip_end_time + 1)) {
                                window.clearInterval(skipInterval);
                                $(".v-plist span").length > 0 && $(".v-plist span").next()[0].click();// 成功直接页面转跳

                                $(".v1-bangumi-list-part .complete-list .cur").next()[0].click();
                                skipPlay();
                                autoPlay();
                            }
                        }
                    }, 900);
                }
            }, 900);
        }

        //开启功能按钮
        $("#skip_on_off").on("click", function () {
            skipFlag = !skipFlag;
            $("#skip_on_off").html(skipFlag ? "关闭功能" : "开启功能");
            $(".skip_auto input").attr("disabled", skipFlag);
            if (skipFlag) {
                // 跳过开头的时间
                var skip_time = $("#skip_start").val();
                if (skip_time) {
                    var times = skip_time.split(":");
                    if (times.length == 1) {
                        skip_start_time = parseInt(times[0]);
                    } else if (times.length == 2) {
                        skip_start_time = parseInt(times[0]) * 60 + parseInt(times[1]);
                    }
                }
                // 进入下一集的时间
                skip_time = $("#skip_end").val();
                if (skip_time) {
                    var times = skip_time.split(":");
                    if (times.length == 1) {
                        skip_end_time = parseInt(times[0]);
                    } else if (times.length == 2) {
                        skip_end_time = parseInt(times[0]) * 60 + parseInt(times[1]);
                    }
                }
                if (isAv) {
                    $("#plist").on("click","a" ,function () {
                        var href = $(this).attr("href");
                        if (href && /^\/video\/av\d+\/index_\d.html$/.test(href)) {
                            speed_val = $("#speed_val").val() || 0;
                            window.location.href = href + "?skip=1&skip_start_time=" + skip_start_time + "&skip_end_time=" + skip_end_time + "&speed_val=" + speed_val;
                            return false;
                        }
                    });
                    // $("#plist a").each(function (i, e) {
                    //     var href = $(e).attr("href");
                    //     if (href && /^www.bilibili.com\/video\/av\d+\/index_\d.html$/.test(href)) {
                    //         speed_val = $("#speed_val").val() || 0;
                    //         $(e).attr("href", href + "?skip_start_time=" + skip_start_time + "&skip_end_time=" + skip_end_time + "&speed_val=" + speed_val);
                    //     }
                    // });
                }
                // 启动定时器
                skipPlay();
            }
        });

        // 输入框过滤
        $(".skip input").on("input", function () {
            var val = $(this).val();
            $(this).val(val.replace(/[^0-9\:]/g, ""));
        });
        // 快进按钮
        $("#speed_btn").on("click", function () {
            var speedVal = $("#speed_val").val();
            speedVal && (video.currentTime += parseInt(speedVal));
        });
        // 输入框过滤
        $("#speed_val").on("input", function () {
            var val = $(this).val();
            $(this).val(val.replace(/[^0-9]/g, ""));
        });

        if (getQueryString("skip")){
            $("#skip_on_off").click();
            autoPlay();
            location.hash="#skip";
        }
    }

    /** 是否自动播放 */
    chrome.extension.sendRequest({greeting: "autoplay"}, function (response) {
        if (response.code == "play") {
            autoPlay();
        }
    });


    /** 收录当前页*/
    chrome.extension.onRequest.addListener(
        function (request, sender, sendResponse) {
            if (request.greeting == "record") {
                var aid = getAid(window.location.href);
                if (aid) {
                    var title = $(".main-inner .v-title h1").text();
                    sendResponse([{"aid": aid, "title": title}]);
                } else {
                    var $videos = $(".small-item .title");
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
})();