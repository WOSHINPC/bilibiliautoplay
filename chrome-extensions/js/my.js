/**
 * Created by luyj on 2017/3/29.
 */
(function () {

    var isAv = window.location.href.indexOf("http://www.bilibili.com/video/av") != -1;

    var getVideo = function () {
        var video;
        if (isAv) {
            video = document.getElementsByTagName("video")[0];
        } else {
            video = document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByTagName("video")[0];
        }
        return video;
    }
    // 初始化
    var init = function (param) {
        // 去除广告
        if (param.clearAd){
            $(".ad-f").remove();
        }
        // 播放初始位置
        if (param.playLocation){
            $(".viewbox .info").attr("id","playLocation");
            location.hash = "#playLocation";
        }
        var inter = window.setInterval(function () {
            var video = getVideo();
            if (video) {
                // 自动播放
                if (param.autoPlay) {
                    video.play();
                }
                // 自动宽屏
                if (param.wideScreen) {
                    $(video).parents(".bilibili-player-area").find('.bilibili-player-iconfont-widescreen').click();
                }
                // 自动宽屏
                if (param.barrage) {
                    $(video).parents(".bilibili-player-area").find('.bilibili-player-video-btn-danmaku').click();
                }
                window.clearInterval(inter);
            }
        }, 1000);
    }
    /** 自动跳过op ed*/
    if ($(".v-plist a").length > 0 || location.href.indexOf("bangumi.bilibili.com/anime/") != -1) {
        var skipFlag = false;

        var skip_start_time = getQueryString("skip_start_time") || 0, skip_end_time = getQueryString("skip_end_time") || 0, speed_val = getQueryString("speed_val") || 0;

        var auto_skip_html =
            "<style>" +
            ".skip{" +
            "float: left;" +
            "padding-top: 15px;" +
            "}" +
            ".skip>div{" +
            "margin: 0 auto;" +
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
            "<span>开始：</span><input type='text' id='skip_start' " +
            (skip_start_time ? "value='" + skip_start_time + "'" : "") +
            " placeholder='00:00'/> <br>" +
            "<span>结束：</span><input type='text' id='skip_end' " +
            (skip_end_time ? "value='" + skip_end_time + "'" : "") +
            "placeholder='00:00'/> " +
            "</span>" +
            "<button id='skip_on_off' style='width: 65px;height: 30px'>开启功能</button><br>" +
            "<button id='speed_btn' style='width: 50px;height: 30px'>快进</button> " +
            "<input id='speed_val' type='text' " +
            (speed_val ? "value='" + speed_val + "'" : "") +
            "placeholder='0'/><span>秒</span><br>" +
            "<span> *仅HTML5播放器有效</span>" +
            "</div>" +
            "</div>";

        $(".viewbox .info").after(auto_skip_html);

        var skipPlayFlag = false;
        var skipPlay = function () {
            // 不重复启动定时器
            if (skipPlayFlag) return;
            skipPlayFlag = true;
            //
            var skipInterval = window.setInterval(function () {
                // 等待video加载
                var video = getVideo();
                if (video.length > 0) {
                    window.clearInterval(skipInterval);
                    video = video[0];
                    skipInterval = window.setInterval(function () {
                        if (!video.paused && skipFlag) {
                            if (video.currentTime > 0.5 && video.currentTime <= 1.9 && skip_start_time) {
                                video.currentTime = skip_start_time;
                            } else if (skip_end_time && video.currentTime > skip_end_time && video.currentTime < (skip_end_time + 1)) {
                                window.clearInterval(skipInterval);
                                $(".v-plist span").length > 0 && $(".v-plist span").next()[0].click();// 成功直接页面转跳

                                $(".v1-bangumi-list-part .complete-list .cur").next()[0].click();
                                skipPlayFlag = false;
                                skipPlay();
                                init({autoPaly: true});
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
                    $("#plist").on("click", "a", function () {
                        var href = $(this).attr("href");
                        if (href && /^\/video\/av\d+\/index_\d.html$/.test(href)) {
                            speed_val = $("#speed_val").val() || 0;
                            window.location.href = href + "?skip=1&skip_start_time=" + skip_start_time + "&skip_end_time=" + skip_end_time + "&speed_val=" + speed_val;
                            return false;
                        }
                    });
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
            var video = getVideo();
            if (speedVal) {
                video.currentTime = video.currentTime ? video.currentTime + parseInt(speedVal) : parseInt(speedVal);
                video.play();
            }
        });
        // 输入框过滤
        $("#speed_val").on("input", function () {
            var val = $(this).val();
            $(this).val(val.replace(/[^0-9]/g, ""));
        });

        if (getQueryString("skip")) {
            $("#skip_on_off").click();
            init({autoPaly: true});
            location.hash = "#skip";
        }
    }
    // 初始化
    chrome.extension.sendRequest({greeting: "init"}, function (response) {
        init(response);
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