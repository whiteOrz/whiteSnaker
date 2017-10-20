var UNIT = 20;
var DIR = {
    U: 38,
    D: 40,
    L: 37,
    R: 39
};

function Game(selector) {
    var canvas = document.querySelector(selector);
    canvas.width = 800;
    canvas.height = 600;

    this.ctx = canvas.getContext("2d");
    this.ctx.fillStyle = "red";

    this.dir = 0;
    this.timer = null;

    this.snakes = [];
    for (var i = 0; i < 5; i++) {
        var snake = new Snake(UNIT * i, 0);
        this.snakes.push(snake);
        this.ctx.fillRect(snake.left, snake.top, UNIT, UNIT);
    }
}

Game.prototype.reset = function () {
    this.ctx.fillStyle = "#ddd";
    this.ctx.fillRect(0, 0, 800, 600);
    this.dir = 0;
    this.timer = null;

    this.ctx.fillStyle = "red";
    this.snakes = [];
    for (var i = 0; i < 5; i++) {
        var snake = new Snake(UNIT * i, 0);
        this.snakes.push(snake);
        this.ctx.fillRect(snake.left, snake.top, UNIT, UNIT);
    }

    this.food();
}

Game.prototype.start = function () {
    this.food();

    var self = this;
    document.body.onkeydown = function (e) {
        if (e.keyCode < 37 || e.keyCode > 40) {
            return;
        }

        if (!self.checkDir(e.keyCode)) {
            return;
        }

        self.dir = e.keyCode;
        clearInterval(self.timer);

        if (!self.move()) {
            alert("GAME OVER");
            self.reset();
            return;
        }

        self.timer = setInterval(function () {
            if (!this.move()) {
                alert("GAME OVER");
                clearInterval(this.timer);
                self.reset();
            }
        }.bind(self), 130);
    }
}

Game.prototype.move = function () {
    var len = this.snakes.length;
    var top = this.snakes[len - 1].top;
    var left = this.snakes[len - 1].left;

    switch (this.dir) {
        case DIR.U:
            top -= UNIT;
            break;
        case DIR.D:
            top += UNIT;
            break;
        case DIR.L:
            left -= UNIT;
            break;
        case DIR.R:
            left += UNIT;
            break;
    }

    if (top < 0 || left < 0 || top > 600 - UNIT || left > 800 - UNIT) {
        return false;
    }

    var lx, ly;
    for (var i = 0; i < len; i++) {
        var current = this.snakes[i];
        var next = this.snakes[i + 1];

        if (i == 0) {
            this.ctx.fillStyle = "#ddd";
            this.ctx.fillRect(current.left, current.top, UNIT, UNIT);
            this.ctx.fillStyle = "red";
            lx = current.left;
            ly = current.top;
        }

        if (next) {
            current.left = next.left;
            current.top = next.top;
        } else {
            current.left = left;
            current.top = top;
        }
        this.ctx.fillRect(current.left, current.top, UNIT, UNIT);
    }

    this.hitTest(lx, ly);
    return true;
}

Game.prototype.food = function () {
    var x = Math.ceil(Math.random() * 40) * UNIT;
    var y = Math.ceil(Math.random() * 30) * UNIT;
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(x, y, UNIT, UNIT);
    this.fx = x;
    this.fy = y;
}

Game.prototype.hitTest = function (lx, ly) {
    var last = this.snakes[this.snakes.length - 1];

    if (last.left == this.fx && last.top == this.fy) {
        // this.ctx.fillStyle = "#ddd";
        // this.ctx.fillRect(this.fx, this.fy, UNIT, UNIT);

        var snake = new Snake(lx, ly);
        this.snakes.unshift(snake);

        this.ctx.fillRect(lx, ly, UNIT, UNIT);

        this.food();
    }
}

Game.prototype.checkDir = function (dirCode) {
    if (this.dir == 0 && dirCode == DIR.L) {
        return false;
    }

    if (this.dir == DIR.D && dirCode == DIR.U) {
        return false;
    }

    if (this.dir == DIR.U && dirCode == DIR.D) {
        return false;
    }

    if (this.dir == DIR.L && dirCode == DIR.R) {
        return false;
    }

    if (this.dir == DIR.R && dirCode == DIR.L) {
        return false;
    }

    return true;
}

function Snake(left, top) {
    this.top = top;
    this.left = left;
}