/**
 * Created by luyj on 2017/3/29.
 */
(function () {
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
            }
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
            if (!!this.currUrl) {
                var r = this.currUrl;
                this.currUrl = this.array[this.currUrl].next;
                localStorage.setItem("list-curr-url", this.array[this.currUrl].url);
                return r;
            } else {
                if (this.first) {
                    localStorage.setItem("list-curr-url", this.array[this.first].url);
                    return this.array[this.first].url;
                }
            }
        }
    }

    function refresh() {
        var $list = $("#list");
        var listStr = localStorage.getItem("favorite-list");
        var array = JSON.parse(listStr);
        for (var i = 0; i < array.length; i++) {
            var url = array[i].url;
            list.add(url, {"title": array[i].title});
            $list.append("<li id='" + url.substring(32) + "'>" + array[i].title + "</li>");
        }
    }

    refresh();
})();