/**
 * Created by dell on 2017/3/30.
 */
/**
 * 定义list对象用于存放视频列表
 * @constructor
 */
function List() {
    this.currAid = localStorage.getItem("list-curr-aid");
    this.aids = {};
}
List.prototype.add = function (aid, obj) {
    // 不存在
    if (!this.aids[aid]) {
        this.aids[aid] = {
            "aid": aid,
            "before": this.last,
            "next": undefined,
            "info": obj
        }
        // 前一个的next
        if (this.last) {
            this.aids[this.last].next = aid;
        } else {
            // 第一个
            this.first = aid;
        }
        this.last = aid;
        return true;
    }
    return false;
};
List.prototype.remove = function (aid) {
    var o = this.aids[aid];
    if (o) {
        var b = this.aids[o.before];
        if (b) {
            this.aids[o.before].next = o.next;
            // remove的是最后一个
            if (!o.next) {
                this.last = o.before;
            }
        } else {
            // remove的是第一个
            var a = this.aids[o.next];
            if (a) {
                this.first = a.aid;
            } else {
                this.first = undefined;
            }
        }
        delete this.aids[aid];
    }
};
List.prototype.first = undefined;
List.prototype.last = undefined;
List.prototype.goNext = function () {
    if (!this.currAid || !this.aids[this.currAid] || !this.aids[this.currAid].next || !this.aids[this.aids[this.currAid].next]) {
        this.move(this.first);
        return this.first;
    } else {
        this.move(this.aids[this.currAid].next);
        return this.currAid;
    }
};
List.prototype.goBefore = function () {
    if (!this.currAid || !this.aids[this.currAid] || !this.aids[this.currAid].before || !this.aids[this.aids[this.currAid].before]) {
        this.move(this.last);
        return this.last;
    } else {
        this.move(this.aids[this.currAid].before);
        return this.currAid;
    }
}
List.prototype.move = function (aid) {
    if (this.aids[aid]) {
        this.currAid = aid;
        localStorage.setItem("list-curr-aid", aid);
    }
};
List.prototype.save = function () {
    localStorage.setItem("favorite-list", JSON.stringify(this));
}
List.prototype.clearAll = function () {
    localStorage.removeItem("favorite-list");
    localStorage.removeItem("list-curr-aid");
};
List.prototype.init = function () {
    var listStr = localStorage.getItem("favorite-list");
    if (listStr) {
        var l = JSON.parse(listStr);
        this.aids = l.aids ? l.aids : {};
        this.first = l.first;
        this.last = l.last;
        !this.currAid && (this.currAid = this.first);
    }
    return this;
}
List.prototype.loadData = function (data, run) {
    if (!data) throw "data is null";
    var list = this;
    if ($.isArray(data)) {
        $.each(data, function (i, e) {
            run(list.add(e.aid, {"title": e.title}), e);
        });
    } else {
        run(list.add(data.aid, {"title": data.title}), data);
    }
}

function getAid(url) {
    if (url.indexOf("www.bilibili.com/video/av") != -1) {
        var aid = url.substring(url.indexOf("/av") + "/av".length);
        if (aid.indexOf("/") != -1) {
            aid = aid.substring(0, aid.indexOf("/"));
        }
        return aid;
    }
}