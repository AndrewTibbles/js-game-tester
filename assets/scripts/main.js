"use strict";

function _classCallCheck(x, t) {
    if (!(x instanceof t)) throw new TypeError("Cannot call a class as a function")
}

function runAnimation(x) {
    function t(s) {
        var i = !1;
        if (null !== e) {
            var a = Math.min(s - e, 100) / 1e3;
            i = !1 === x(a)
        }
        e = s, i || requestAnimationFrame(t)
    }
    var e = null;
    requestAnimationFrame(t)
}

function trackKeys(x) {
    function t(t) {
        if (x.hasOwnProperty(t.keyCode)) {
            var s = "keydown" === t.type;
            "esc" === x[t.keyCode] ? s || (e.esc = !e.esc) : e[x[t.keyCode]] = s, t.preventDefault()
        }
    }
    var e = Object.create(null);
    return addEventListener("keydown", t), addEventListener("keyup", t), e
}

function runLevel(x, t, e) {
    var s = trackKeys({
            27: "esc",
            37: "left",
            65: "left",
            38: "up",
            87: "up",
            32: "up",
            39: "right",
            68: "right"
        }),
        i = new t(document.body, x);
    runAnimation(function(t) {
        if (!s.esc && (x.animate(t, s), i.drawFrame(t), x.isFinished())) return i.clear(), e && e(x.status), !1
    })
}

function runGame(x, t) {
    function e(s, i) {
        runLevel(new Level(x[s], i), t, function(t) {
            "lost" === t ? --i ? e(s, i) : (bgm.setAttribute("src", "assets/sound/smb_gameover.wav"), bgm.play(), e(0, 3)) : s < x.length - 1 ? e(s + 1, i) : (bgm.setAttribute("src", "assets/sound/smb_world_clear.wav"), bgm.play(), e(0, 3))
        })
    }
    e(0, 3)
}
var _createClass = function() {
        function x(x, t) {
            for (var e = 0; e < t.length; e++) {
                var s = t[e];
                s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(x, s.key, s)
            }
        }
        return function(t, e, s) {
            return e && x(t.prototype, e), s && x(t, s), t
        }
    }(),
    bgm = document.getElementById("bgm"),
    sound = document.getElementById("sound"),
    Vector = function() {
        function x(t, e) {
            _classCallCheck(this, x), this.x = t, this.y = e
        }
        return _createClass(x, [{
            key: "plus",
            value: function(t) {
                return new x(this.x + t.x, this.y + t.y)
            }
        }, {
            key: "times",
            value: function(t) {
                return new x(this.x * t, this.y * t)
            }
        }]), x
    }(),
    Score = function() {
        function x(t) {
            _classCallCheck(this, x), this.pos = t, this.size = new Vector(1, 1), this.type = "score"
        }
        return _createClass(x, [{
            key: "type",
            value: function() {
                return this.type
            }
        }, {
            key: "act",
            value: function() {}
        }]), x
    }(),
    Lives = function() {
        function x(t) {
            _classCallCheck(this, x), this.pos = t, this.size = new Vector(1, 1), this.type = "lives"
        }
        return _createClass(x, [{
            key: "type",
            value: function() {
                return this.type
            }
        }, {
            key: "act",
            value: function() {}
        }]), x
    }(),
    Player = function() {
        function x(t) {
            _classCallCheck(this, x), this.pos = t.plus(new Vector(0, -.5)), this.size = new Vector(.8, 1.5), this.speed = new Vector(0, 0), this.type = "player"
        }
        return _createClass(x, [{
            key: "type",
            value: function() {
                return this.type
            }
        }, {
            key: "moveX",
            value: function(x, t, e) {
                this.speed.x = 0, e.left && (this.speed.x -= 7), e.right && (this.speed.x += 7);
                var s = new Vector(this.speed.x * x, 0),
                    i = this.pos.plus(s),
                    a = t.obstacleAt(i, this.size);
                a ? t.playerTouched(a) : this.pos = i
            }
        }, {
            key: "moveY",
            value: function(x, t, e) {
                this.speed.y += 30 * x;
                var s = new Vector(0, this.speed.y * x),
                    i = this.pos.plus(s),
                    a = t.obstacleAt(i, this.size);
                a ? (t.playerTouched(a), e.up && this.speed.y > 0 ? (sound.setAttribute("src", "assets/sound/smb_jump-small.wav"), sound.play(), this.speed.y -= 17) : this.speed.y = 0) : this.pos = i
            }
        }, {
            key: "act",
            value: function(x, t, e) {
                this.moveX(x, t, e), this.moveY(x, t, e);
                var s = t.actorAt(this);
                s && t.playerTouched(s.type, s), "lost" === t.status && (this.pos.y += x, this.size.y -= x)
            }
        }]), x
    }(),
    Lava = function() {
        function x(t, e) {
            _classCallCheck(this, x), this.pos = t, this.size = new Vector(1, 1), this.type = "lava", "=" == e ? this.speed = new Vector(2, 0) : "|" == e ? this.speed = new Vector(0, 2) : "v" == e && (this.speed = new Vector(0, 3), this.repeatPos = t)
        }
        return _createClass(x, [{
            key: "type",
            value: function() {
                return this.type
            }
        }, {
            key: "act",
            value: function(x, t) {
                var e = this.pos.plus(this.speed.times(x));
                t.obstacleAt(e, this.size) ? this.repeatPos ? this.pos = this.repeatPos : this.speed = this.speed.times(-1) : this.pos = e
            }
        }]), x
    }(),
    Coin = function() {
        function x(t) {
            _classCallCheck(this, x), this.basePos = this.pos = t.plus(new Vector(.2, .1)), this.size = new Vector(.6, .6), this.wobble = Math.random() * Math.PI * 2, this.type = "coin"
        }
        return _createClass(x, [{
            key: "type",
            value: function() {
                return this.type
            }
        }, {
            key: "act",
            value: function(x) {
                this.wobble += 8 * x;
                var t = .07 * Math.sin(this.wobble);
                this.pos = this.basePos.plus(new Vector(0, t))
            }
        }]), x
    }(),
    Level = function() {
        function x(t, e) {
            _classCallCheck(this, x), this.width = t[0].length, this.height = t.length, this.grid = [], this.actors = [], this.zoomActors = [], this.status = this.finishDelay = null, this.lives = e;
            for (var s = {
                    "@": Player,
                    o: Coin,
                    "=": Lava,
                    "|": Lava,
                    v: Lava
                }, i = 0; i < this.height; i++) {
                for (var a = t[i], o = [], l = 0; l < this.width; l++) {
                    var r = a[l],
                        n = null,
                        c = s[r];
                    c ? this.actors.push(new c(new Vector(l, i), r)) : "x" == r ? n = "wall" : "!" == r && (n = "lava"), o.push(n)
                }
                this.grid.push(o)
            }
            this.player = this.actors.filter(function(x) {
                return "player" == x.type
            })[0], this.coins = this.actors.filter(function(x) {
                return "coin" == x.type
            }).length;
            for (var h = 0, u = 0; h < e; h++, u += 1.2) this.zoomActors.push(new Lives(new Vector(u + 1, 1)));
            this.zoomActors.push(new Score(new Vector(0, 1)))
        }
        return _createClass(x, [{
            key: "obstacleAt",
            value: function(x, t) {
                var e = Math.floor(x.x),
                    s = Math.ceil(x.x + t.x),
                    i = Math.floor(x.y),
                    a = Math.ceil(x.y + t.y);
                if (e < 0 || s > this.width || i < 0) return "wall";
                if (a > this.height) return "lava";
                for (var o = i; o < a; o++)
                    for (var l = e; l < s; l++) {
                        var r = this.grid[o][l];
                        if (r) return r
                    }
            }
        }, {
            key: "actorAt",
            value: function(x) {
                for (var t = 0; t < this.actors.length; t++) {
                    var e = this.actors[t];
                    if (e !== x && x.pos.x + x.size.x > e.pos.x && x.pos.x < e.pos.x + e.size.x && x.pos.y + x.size.y > e.pos.y && x.pos.y < e.pos.y + e.size.y) return e
                }
            }
        }, {
            key: "animate",
            value: function(x, t) {
                var e = this;
                null != this.status && (this.finishDelay -= x);
                for (; x > 0;) ! function() {
                    var s = Math.min(x, .05);
                    e.actors.forEach(function(x) {
                        x.act(s, e, t)
                    }), x -= s
                }()
            }
        }, {
            key: "playerTouched",
            value: function(x, t) {
                "lava" === x && null === this.status ? (bgm.setAttribute("src", "assets/sound/smb_mariodie.wav"), bgm.play(), this.status = "lost", this.finishDelay = 1) : "coin" === x && (sound.setAttribute("src", "assets/sound/smb_coin.wav"), sound.play(), this.actors = this.actors.filter(function(x) {
                    return x !== t
                }), this.actors.some(function(x) {
                    return "coin" === x.type
                }) || (bgm.setAttribute("src", "assets/sound/smb_stage_clear.wav"), bgm.play(), this.status = "won", this.finishDelay = 1))
            }
        }, {
            key: "isFinished",
            value: function() {
                return null !== this.status && this.finishDelay < 0
            }
        }]), x
    }(),
    DOMDisplay = function() {
        function x(t, e) {
            _classCallCheck(this, x), this.scale = 30, this.wrap = t.appendChild(this.elt("div", "game")), this.level = e, this.wrap.appendChild(this.drawBackground()), this.actorLayer = null, this.drawFrame()
        }
        return _createClass(x, [{
            key: "elt",
            value: function(x, t) {
                var e = document.createElement(x);
                return t && (e.className = t), e
            }
        }, {
            key: "drawBackground",
            value: function() {
                var x = this,
                    t = this.elt("table", "background");
                return t.style.width = this.level.width * this.scale + "px", this.level.grid.forEach(function(e) {
                    var s = t.appendChild(x.elt("tr"));
                    s.style.height = x.scale + "px", e.forEach(function(t) {
                        s.appendChild(x.elt("td", t))
                    })
                }), t
            }
        }, {
            key: "drawActors",
            value: function() {
                var x = this,
                    t = this.elt("div");
                return this.level.actors.forEach(function(e) {
                    var s = t.appendChild(x.elt("div", "actor " + e.type));
                    s.style.width = e.size.x * x.scale + "px", s.style.height = e.size.y * x.scale + "px", s.style.left = e.pos.x * x.scale + "px", s.style.top = e.pos.y * x.scale + "px"
                }), t
            }
        }, {
            key: "scrollPlayerIntoView",
            value: function() {
                var x = this.wrap.clientWidth,
                    t = this.wrap.clientHeight,
                    e = x / 3,
                    s = this.wrap.scrollLeft,
                    i = s + x,
                    a = this.wrap.scrollTop,
                    o = a + t,
                    l = this.level.player,
                    r = l.pos.plus(l.size.times(.5)).times(this.scale);
                r.x < s + e ? this.wrap.scrollLeft = r.x - e : r.x > i - e && (this.wrap.scrollLeft = r.x + e - x), r.y < a + e ? this.wrap.scrollTop = r.y - e : r.y > o - e && (this.wrap.scrollTop = r.y + e - t)
            }
        }, {
            key: "drawZoomActors",
            value: function(x) {
                var t = this,
                    e = this.wrap.clientWidth,
                    s = (this.wrap.clientHeight, this.wrap.scrollLeft),
                    i = s + e,
                    a = this.wrap.scrollTop;
                return this.level.zoomActors.forEach(function(o) {
                    var l = x.appendChild(t.elt("div", "actor " + o.type));
                    if (l.style.width = o.size.x * t.scale + "px", l.style.height = o.size.y * t.scale + "px", l.style.left = o.pos.x * t.scale + s + "px", l.style.top = o.pos.y * t.scale + a + "px", "score" === o.type) {
                        var r = t.level.coins - t.level.actors.filter(function(x) {
                            return "coin" == x.type
                        }).length;
                        l.style.left = o.pos.x * t.scale + i - e / 8 + "px", l.innerHTML = r + "/" + t.level.coins
                    }
                }), x
            }
        }, {
            key: "drawFrame",
            value: function() {
                this.actorLayer && this.wrap.removeChild(this.actorLayer), this.actorLayer = this.wrap.appendChild(this.drawActors()), this.wrap.className = "game " + (this.level.status || ""), this.scrollPlayerIntoView(), this.drawZoomActors(this.actorLayer)
            }
        }, {
            key: "clear",
            value: function() {
                this.wrap.parentNode.removeChild(this.wrap)
            }
        }]), x
    }(),
    CanvasDisplay = function() {
        function x(t, e) {
            _classCallCheck(this, x), this.scale = 20, this.canvas = document.createElement("canvas"), this.canvas.width = Math.min(800, e.width * this.scale), this.canvas.height = Math.min(550, e.height * this.scale), t.appendChild(this.canvas), this.cx = this.canvas.getContext("2d"), this.level = e, this.animationTime = 0, this.flipPlayer = !1, this.viewport = {
                left: 0,
                top: 0,
                width: this.canvas.width / this.scale,
                height: this.canvas.height / this.scale
            }, this.drawFrame(0)
        }
        return _createClass(x, [{
            key: "updateViewport",
            value: function() {
                var x = this.viewport,
                    t = x.width / 3,
                    e = this.level.player,
                    s = e.pos.plus(e.size.times(.5));
                s.x < x.left + t ? x.left = Math.max(s.x - t, 0) : s.x > x.left + x.width - t && (x.left = Math.min(s.x + t - x.width, this.level.width - x.width)), s.y < x.top + t ? x.top = Math.max(s.y - t, 0) : s.y > x.top + x.height - t && (x.top = Math.min(s.y + t - x.height, this.level.height - x.height))
            }
        }, {
            key: "clearDisplay",
            value: function() {
                "won" === this.level.status ? this.cx.fillStyle = "rgb(68, 191, 255)" : "lost" === this.level.status ? this.cx.fillStyle = "rgb(44, 136, 214)" : this.cx.fillStyle = "rgb(52, 166, 251)", this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            }
        }, {
            key: "drawBackground",
            value: function() {
                var x = document.createElement("img");
                x.src = "assets/img/sprites.png";
                for (var t = this.viewport, e = Math.floor(t.left), s = Math.ceil(t.left + t.width), i = Math.floor(t.top), a = Math.ceil(t.top + t.height), o = i; o < a; o++)
                    for (var l = e; l < s; l++) {
                        var r = this.level.grid[o][l];
                        if (null !== r) {
                            var n = (l - t.left) * this.scale,
                                c = (o - t.top) * this.scale,
                                h = "lava" === r ? this.scale : 0;
                            this.cx.drawImage(x, h, 0, this.scale, this.scale, n, c, this.scale, this.scale)
                        }
                    }
            }
        }, {
            key: "flipHorizontally",
            value: function(x, t) {
                x.translate(t, 0), x.scale(-1, 1), x.translate(-t, 0)
            }
        }, {
            key: "drawPlayer",
            value: function(x, t, e, s) {
                var i = document.createElement("img");
                i.src = "assets/img/player.png";
                var a = 8,
                    o = this.level.player;
                e += 8, x -= 4, 0 !== o.speed.x && (this.flipPlayer = o.speed.x < 0), 0 !== o.speed.y ? a = 9 : 0 !== o.speed.x && (a = Math.floor(12 * this.animationTime) % 8), this.cx.save(), this.flipPlayer && this.flipHorizontally(this.cx, x + e / 2), this.cx.drawImage(i, a * e, 0, e, s, x, t, e, s), this.cx.restore()
            }
        }, {
            key: "drawActors",
            value: function() {
                var x = this,
                    t = document.createElement("img");
                t.src = "assets/img/sprites.png", this.level.actors.forEach(function(e) {
                    var s = e.size.x * x.scale,
                        i = e.size.y * x.scale,
                        a = (e.pos.x - x.viewport.left) * x.scale,
                        o = (e.pos.y - x.viewport.top) * x.scale;
                    if ("player" === e.type) x.drawPlayer(a, o, s, i);
                    else {
                        var l = ("coin" === e.type ? 2 : 1) * x.scale;
                        x.cx.drawImage(t, l, 0, s, i, a, o, s, i)
                    }
                }), this.level.zoomActors.forEach(function(e) {
                    var s = e.size.x * x.scale,
                        i = e.size.y * x.scale,
                        a = e.pos.x * x.scale,
                        o = e.pos.y * x.scale;
                    if ("lives" === e.type) t.src = "assets/img/lives.png", x.cx.drawImage(t, 0, 0, s, i, a, o, s, i);
                    else if ("score" === e.type) {
                        var l = x.level.coins - x.level.actors.filter(function(x) {
                            return "coin" == x.type
                        }).length;
                        x.cx.font = "24px Monospace", x.cx.fillStyle = "white", x.cx.shadowColor = "lightgrey", x.cx.strokeText(l + "/" + x.level.coins, a + x.cx.canvas.clientWidth - 4 * x.scale, o + x.scale), x.cx.fillText(l + "/" + x.level.coins, a + x.cx.canvas.clientWidth - 4 * x.scale, o + x.scale)
                    }
                })
            }
        }, {
            key: "drawFrame",
            value: function(x) {
                this.animationTime += x, this.updateViewport(), this.clearDisplay(), this.drawBackground(), this.drawActors()
            }
        }, {
            key: "clear",
            value: function() {
                this.canvas.parentNode.removeChild(this.canvas)
            }
        }]), x
    }();
bgm.onended = function() {
    bgm.src = "assets/sound/201-overworld-bgm.mp3", bgm.play()
};

var GAME_LEVELS = [
    ["xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
     "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
     "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
     "xx                                                                            xx",
     "xx  o                                                                         xx",
     "xx                                                                            xx",
     "xx  x                                                             xxx         xx",
     "xx                                                 xx            xx!xx        xx",
     "xx                                  o o      xx             x    x!!!x        xx",
     "xx                                                         x     xx!xx        xx",
     "xx    x                            xxxxx                  x       xvx         xx",
     "xx                                                                          xxxx",
     "xxxx                                      o o                                xxx",
     "xxx    x                o                                                    xxx",
     "xxx           oo                         xxxxx                             o xxx",
     "xxx          xxxx       o       o                                            xxx",
     "xxx  @       xxxx                                                xxxxx       xxx",
     "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   xxxxxxxxxxxxxxxxxxxx     xxxxxxxxxxxxxxxxxxxxx",
     "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   xxxxxxxxxxxxxxxxxxxx     xxxxxxxxxxxxxxxxxxxxx",
     "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx!!!xxxxxxxxxxxxxxxxxxxx!!!!!xxxxxxxxxxxxxxxxxxxxx",
     "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx!!!xxxxxxxxxxxxxxxxxxxx!!!!!xxxxxxxxxxxxxxxxxxxxxx",
     "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
     "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
     "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"],
    ["                                      x!!x                        xxxxxxx                                    x!x  ",
     "                                      x!!x                     xxxx     xxxx                                 x!x  ",
     "                                      x!!xxxxxxxxxx           xx           xx                                x!x  ",
     "                                      xx!!!!!!!!!!xx         xx             xx                               x!x  ",
     "                                       xxxxxxxxxx!!x         x                                    o   o   o  x!x  ",
     "                                                xx!x         x     o   o                                    xx!x  ",
     "                                                 x!x         x                                xxxxxxxxxxxxxxx!!x  ",
     "                                                 xvx         x     x   x                        !!!!!!!!!!!!!!xx  ",
     "                                                             xx  |   |   |  xx            xxxxxxxxxxxxxxxxxxxxx   ",
     "                                                              xx!!!!!!!!!!!xx            v                        ",
     "                                                               xxxx!!!!!xxxx                                      ",
     "                                               x     x            xxxxxxx        xxx         xxx                  ",
     "                                               x     x                           x x         x x                  ",
     "                                               x     x                             x         x                    ",
     "                                               x     x                             xx        x                    ",
     "                                               xx    x                             x         x                    ",
     "                                               x     x      o  o     x   x         x         x                    ",
     "               xxxxxxx        xxx   xxx        x     x               x   x         x         x                    ",
     "              xx     xx         x   x          x     x     xxxxxx    x   x   xxxxxxxxx       x                    ",
     "             xx       xx        x o x          x    xx               x   x   x               x                    ",
     "     @       x         x        x   x          x     x               x   x   x               x                    ",
     "    xxx      x         x        x   x          x     x               x   xxxxx   xxxxxx      x                    ",
     "    x x      x         x       xx o xx         x     x               x     o     x x         x                    ",
     "!!!!x x!!!!!!x         x!!!!!!xx     xx!!!!!!!!xx    x!!!!!!!!!!     x     =     x x         x                    ",
     "!!!!x x!!!!!!x         x!!!!!xx       xxxxxxxxxx     x!!!!!!!xx!     xxxxxxxxxxxxx xx  o o  xx                    ",
     "!!!!x x!!!!!!x         x!!!!!x    o                 xx!!!!!!xx !                    xx     xx                     ",
     "!!!!x x!!!!!!x         x!!!!!x                     xx!!!!!!xx  !                     xxxxxxx                      ",
     "!!!!x x!!!!!!x         x!!!!!xx       xxxxxxxxxxxxxx!!!!!!xx   !                                                  ",
     "!!!!x x!!!!!!x         x!!!!!!xxxxxxxxx!!!!!!!!!!!!!!!!!!xx    !                                                  ",
     "!!!!x x!!!!!!x         x!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!xx     !                                                  "],
    ["                                                                                                              ",
     "                                                                                                              ",
     "                                                                                                              ",
     "                                                                                                              ",
     "                                                                                                              ",
     "                                        o                                                                     ",
     "                                                                                                              ",
     "                                        x                                                                     ",
     "                                        x                                                                     ",
     "                                        x                                                                     ",
     "                                        x                                                                     ",
     "                                       xxx                                                                    ",
     "                                       x x                 !!!        !!!  xxx                                ",
     "                                       x x                 !x!        !x!                                     ",
     "                                     xxx xxx                x          x                                      ",
     "                                      x   x                 x   oooo   x       xxx                            ",
     "                                      x   x                 x          x      x!!!x                           ",
     "                                      x   x                 xxxxxxxxxxxx       xxx                            ",
     "                                     xx   xx      x   x      x                                                ",
     "                                      x   xxxxxxxxx   xxxxxxxx              x x                               ",
     "                                      x   x           x                    x!!!x                              ",
     "                                      x   x           x                     xxx                               ",
     "                                     xx   xx          x                                                       ",
     "                                      x   x= = = =    x            xxx                                        ",
     "                                      x   x           x           x!!!x                                       ",
     "                                      x   x    = = = =x     o      xxx       xxx                              ",
     "                                     xx   xx          x                     x!!!x                             ",
     "                              o   o   x   x           x     x                xxv        xxx                   ",
     "                                      x   x           x              x                 x!!!x                  ",
     "                             xxx xxx xxx xxx     o o  x!!!!!!!!!!!!!!x                   vx                   ",
     "                             x xxx x x xxx x          x!!!!!!!!!!!!!!x                                        ",
     "                             x             x   xxxxxxxxxxxxxxxxxxxxxxx                                        ",
     "                             xx           xx                                         xxx                      ",
     "  xxx                         x     x     x                                         x!!!x                xxx  ",
     "  x x                         x    xxx    x                                          xxx                 x x  ",
     "  x                           x    xxx    xxxxxxx                        xxxxx                             x  ",
     "  x                           x           x                              x   x                             x  ",
     "  x                           xx          x                              x x x                             x  ",
     "  x                                       x       |xxxx|    |xxxx|     xxx xxx                             x  ",
     "  x                xxx             o o    x                              x         xxx                     x  ",
     "  x               xxxxx       xx          x                             xxx       x!!!x          x         x  ",
     "  x               oxxxo       x    xxx    x                             x x        xxx          xxx        x  ",
     "  x                xxx        xxxxxxxxxxxxx  x oo x    x oo x    x oo  xx xx                    xxx        x  ",
     "  x      @          x         x           x!!x    x!!!!x    x!!!!x    xx   xx                    x         x  ",
     "  xxxxxxxxxxxxxxxxxxxxxxxxxxxxx           xxxxxxxxxxxxxxxxxxxxxxxxxxxxx     xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  ",
     "                                                                                                              ",
     "                                                                                                              "],
    ["                                                                                                  xxx x       ",
     "                                                                                                      x       ",
     "                                                                                                  xxxxx       ",
     "                                                                                                  x           ",
     "                                                                                                  x xxx       ",
     "                          o                                                                       x x x       ",
     "                                                                                             o o oxxx x       ",
     "                   xxx                                                                                x       ",
     "       !  o  !                                                xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxx       ",
     "       x     x                                                x   x x   x x   x x   x x   x x   x x           ",
     "       x= o  x            x                                   xxx x xxx x xxx x xxx x xxx x xxx x xxxxx       ",
     "       x     x                                                  x x   x x   x x   x x   x x   x x     x       ",
     "       !  o  !            o                                  xxxx xxxxx xxxxx xxxxx xxxxx xxxxx xxxxxxx       ",
     "                                                                                                              ",
     "          o              xxx                              xx                                                  ",
     "                                                                                                              ",
     "                                                                                                              ",
     "                                                      xx                                                      ",
     "                   xxx         xxx                                                                            ",
     "                                                                                                              ",
     "                          o                                                     x      x                      ",
     "                                                          xx     xx                                           ",
     "             xxx         xxx         xxx                                 x                  x                 ",
     "                                                                                                              ",
     "                                                                 ||                                           ",
     "  xxxxxxxxxxx                                                                                                 ",
     "  x         x o xxxxxxxxx o xxxxxxxxx o xx                                                x                   ",
     "  x         x   x       x   x       x   x                 ||                  x     x                         ",
     "  x  @      xxxxx   o   xxxxx   o   xxxxx                                                                     ",
     "  xxxxxxx                                     xxxxx       xx     xx     xxx                                   ",
     "        x=                  =                =x   x                     xxx                                   ",
     "        xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   x!!!!!!!!!!!!!!!!!!!!!xxx!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
     "                                                  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
     "                                                                                                              "]
  ];
  
  if (typeof module !== "undefined" && module.exports)
    module.exports = GAME_LEVELS;
  