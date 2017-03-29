/**
 * Created by luyj on 2017/3/29.
 */
(function () {
    var video = document.getElementById("video");
    video.addEventListener('ended', function () {
        playNext();
    }, false);


    // $("#refresh").click(function () {
    //     refresh();
    // })
    var list = {
        "array": {},
        "add": function (url, obj) {
            // 不存在
            if (!this.array[url]) {
                this.array[url] = {
                    "url": url,
                    "before": this.last,
                    "next": undefined,
                    "info": obj
                }
                // 前一个的next
                if (this.last) {
                    this.array[this.last].next = url;
                } else {
                    // 第一个
                    this.first = url;
                }
                this.last = url;
                return true;
            }
            return false;
        },
        "remove": function (url) {
            var o = this.array[url];
            if (o) {
                var b = this.array[o.before];
                if (b) {
                    this.array[o.before].next = o.next;
                    // remove的是最后一个
                    if (!o.next) {
                        this.last = o.before;
                    }
                } else {
                    // remove的是第一个
                    var a = this.array[o.next];
                    if (a) {
                        this.first = a.url;
                    } else {
                        this.first = undefined;
                    }
                }
                delete this.array[url];
            }
        },
        "first": undefined,
        "last": undefined,
        "currUrl": localStorage.getItem("list-curr-url"),
        "getNext": function () {
            if (this.currUrl) {
                if (!this.array[this.currUrl]) {
                    this.currUrl = this.first;
                    return this.currUrl;
                }else{
                    var r = this.currUrl;
                    localStorage.setItem("list-curr-url", this.array[this.currUrl].url);
                    this.currUrl = this.array[this.currUrl].next;
                    if (!this.currUrl) {
                        this.currUrl = this.first;
                    }
                    return r;
                }

            } else {
                if (this.first) {
                    localStorage.setItem("list-curr-url", this.array[this.first].url);
                    this.currUrl = this.first;
                    return this.array[this.first].url;
                }
            }
        }
    }

    function refresh() {
        var $list = $("#list");
        var listStr = localStorage.getItem("favorite-list");
        var array = JSON.parse(listStr);
        if (!array)return;
        for (var i = 0; i < array.length; i++) {
            var url = array[i].url;
            var isSuccess = list.add(url, {"title": array[i].title});
            if (isSuccess){
                $list.append("<li id='" + url.substring(32) + "'>" + array[i].title + "</li>");
            }
        }
    }

    function playNext() {
        var u = list.getNext();
        if (!u) return;
        var lis = $("#list li");
        lis.css("color", "black");
        var aid = u.substring(32);
        var urlid = "#" + aid;
        $(urlid).css("color", "red");
        $.ajax({
            async: false,
            url: 'http://api.bilibili.com/playurl',
            type: "GET",
            dataType: 'json',
            data: {"aid": aid, "page": 1, "platform": "html5", "quality": 1, "vtype": "mp4"},
            timeout: 5000,
            success: function (json) {//客户端jquery预先定义好的callback函数,成功获取跨域服务器上的json数据后,会动态执行这个callback函数
                if (json && json.durl && json.durl[0]) {
                    video.src = json.durl[0].url;
                    video.play();
                    return;
                } else {
                    var u = u.replace(".bilibili.", ".ibilibili.");
                    $.get(u, function (result) {
                        var mp3url = $(result).find("a:contains('请点击下载mp3')");
                        if (mp3url.length > 0) {
                            mp3url = mp3url[0].href;
                            video.src = mp3url;
                            video.play();
                            return;
                        }
                        playNext();
                    })
                }
            }
        });
    }

    refresh();
    playNext();
})();

