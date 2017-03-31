/**
 * Created by luyj on 2017/3/29.
 */
(function () {
    var video = document.getElementById("video");
    video.addEventListener('ended', function () {
        playNext();
    }, false);
    var list;
    $("#next").click(function () {
        playNext();
    })
    $("#before").click(function () {
        playBefore();
    })
    $("#openbili").click(function () {
        chrome.tabs.create({"url": "http://www.bilibili.com/video/av" + list.currAid}, function (tab) {
        })
    })
    $("#list").sortable({
        axis: "y",
        cursor: "move",
        delay: 150,
        items: "> li",
        opacity: 0.5,
        revert: true,
        scroll: true,
        scrollSensitivity: 30,
        scrollSpeed: 40,
        update: function (event, ui) {
            var aid = $(ui.item).attr("id");
            // 连接移走前的前后俩个元素
            var oldBefore = list.aids[aid].before;
            var oldNext = list.aids[aid].next;
            if (oldBefore && oldNext) {
                // 俩个都存在
                list.aids[oldBefore].next = oldNext;
                list.aids[oldNext].before = oldBefore;
            } else if (oldBefore) {
                //仅前一个存在(列表最后一个)
                list.aids[oldBefore].next = undefined;
            } else if (oldNext) {
                //仅后一个存在(列表第一个)
                list.aids[oldNext].before = undefined;
            }
            // 插入新的元素之间
            var prev = $(ui.item).prev();
            var next = $(ui.item).next();
            if (prev && next) {
                //插入都俩个元素之间
                var prevAid = prev.attr("id");
                var nextAid = next.attr("id");
                list.aids[aid].before = prevAid;
                list.aids[aid].next = nextAid;
                list.aids[prevAid].next = aid;
                list.aids[nextAid].before = aid;
            } else if (prev) {
                //仅前一个存在(插入到列表最后一个)
                var prevAid = prev.attr("id");
                list.aids[aid].before = prevAid;
                list.aids[aid].next = undefined;
                list.aids[prevAid].next = aid;
            } else if (next) {
                //仅后一个存在(插入到列表第一个)
                var nextAid = next.attr("id");
                list.aids[aid].before = undefined;
                list.aids[aid].next = nextAid;
                list.aids[nextAid].before = aid;
            }
            list.save();
        }
    });
    function refresh() {
        var $list = $("#list");
        list = new List().init();
        if (!list.first) {
            return;
        }
        var next;
        var isLast = false;
        while (!isLast) {
            next = list.aids[next ? next.next : list.first];
            $list.append("<li id='" + next.aid + "' class='ui-state-default ui-corner-all'><span class='ui-icon ui-icon-close'></span> " + next.info.title + "</li>");
            if (!next.next) {
                isLast = true
            }
        }
        $("#list li .ui-icon-close").click(function (e) {
            selectAid = $(this).parent().attr("id");
            $('#dialog p').html("删除操作不可逆，确定删除?<br>" + $(this).parent().text());
            $('#dialog').dialog('open');
        });
        $("#list li").dblclick(function (e) {
            var aid = $(this).attr("id");
            list.move(aid);
            play(aid);
        });
    }

    // 删除
    var selectAid;
    $("#dialog").dialog({
        autoOpen: false,
        hide: true,
        width: 400,
        buttons: [
            {
                text: "确定",
                click: function () {
                    list.remove(selectAid);
                    list.save();
                    $(("#" + selectAid)).remove();
                    $(this).dialog("close");
                }
            },
            {
                text: "取消",
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });

    function play(aid) {
        if (!aid) return;
        var lis = $("#list li");
        lis.css("color", "black");
        //var aid = getAid(u);
        var li = "#" + aid;
        $(li).css("color", "red");
        $.ajax({
            async: false,
            url: 'http://api.bilibili.com/playurl',
            type: "GET",
            dataType: 'json',
            data: {"aid": aid, "page": 1, "platform": "html5", "quality": 1, "vtype": "mp4"},
            timeout: 5000,
            success: function (json) {
                if (json && json.durl && json.durl[0] && json.durl[0].url) {
                    video.src = json.durl[0].url;
                    video.play();
                    return;
                } else {
                    var u = "http://www.bilibili.com/video/av" + aid;
                    $.get(u, function (result) {
                        var mp3url = $(result).find("a:contains('请点击下载mp3')");
                        if (mp3url.length > 0) {
                            mp3url = mp3url[0].href;
                            video.src = mp3url;
                            video.play();
                            return;
                        }
                    })
                }
                // 没有找到资源，下一个
                playNext();
            }
        });
    }
    function playNext() {
        var aid = list.goNext();
        play(aid);
    }

    function playBefore() {
        var aid = list.goBefore();
        play(aid);
    }

    refresh();
    play(list.currAid);
})();

