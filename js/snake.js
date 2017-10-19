var DIR = {
    U: 38,
    D: 40,
    L: 37,
    R: 39
};

function Game() {
    this.gameover = false;
}

Game.prototype.load = function () {
    var map = new Map();
    map.load();

    var food = new Food();
    food.add();

    var snake = new Snake(food);
    snake.load();

    var timer = null;
    var _this = this;
    document.body.onkeydown = function (e) {
        if (e.keyCode == 32) {
            clearInterval(timer);
            return;
        }

        if (_this.gameover) {
            return;
        }

        if (!snake.canMove(e.keyCode)) {
            return;
        }

        snake.dir = e.keyCode;
        clearInterval(timer);

        snake.move();
        timer = setInterval(function () {
            if (!snake.move()) {
                clearInterval(timer);
                alert("GAME OVER");
                _this.gameover = true;
            }
        }, 200);
    }
}

function Map() {

}

Map.prototype.load = function () {
    var mapNode = document.createElement("div");
    mapNode.classList.add("map");
    document.body.appendChild(mapNode);
}

function Snake(food) {
    this.startLen = 5;
    this.dir = 0;
    this.head = null;
    this.moveUnit = 20;
    this.food = food;
    this.items;
}

Snake.prototype.load = function () {
    var map = document.querySelector(".map");
    for (var i = 0; i < this.startLen; i++) {
        var snakeNode = document.createElement("div");
        snakeNode.classList.add("snake");
        snakeNode.style.top = "0px";
        snakeNode.style.left = i * 20 + "px";
        map.appendChild(snakeNode);
    }

    this.items = document.querySelectorAll(".snake");
    this.head = this.items[i - 1];
}

Snake.prototype.canMove = function (dircode) {
    if (dircode < 37 || dircode > 40) {
        return false;
    }

    if (this.dir == 0 || this.dir == DIR.R) {
        if (dircode == DIR.L) {
            return false;
        }
    }

    if (this.dir == DIR.L && dircode == DIR.R) {
        return false;
    }

    if (this.dir == DIR.U && dircode == DIR.D) {
        return false;
    }

    if (this.dir == DIR.D && dircode == DIR.U) {
        return false;
    }

    if (this.dir == dircode) {
        return false;
    }
    return true;
}

Snake.prototype.move = function () {
    var top = this.head.offsetTop;
    var left = this.head.offsetLeft;

    switch (this.dir) {
        case DIR.U:
            top -= this.moveUnit;
            break;
        case DIR.D:
            top += this.moveUnit;
            break;
        case DIR.L:
            left -= this.moveUnit;
            break;
        case DIR.R:
            left += this.moveUnit;
            break;
    }

    if (top < 0 || left < 0 || top > 600 - 20 || left > 800 - 20) {
        return false;
    }

    var snakes = this.items;
    var nt = snakes[0].offsetTop, nl = snakes[0].offsetLeft;

    for (var i = 0; i < snakes.length; i++) {
        var next = snakes[i + 1];
        var current = snakes[i];

        if (next) {
            current.style.top = next.offsetTop + "px";
            current.style.left = next.offsetLeft + "px";
        } else {
            current.style.top = top + "px";
            current.style.left = left + "px";
        }
    }

    this.hitTest(nt, nl);

    return true;
}

Snake.prototype.hitTest = function (top, left) {
    if (this.food && this.head.offsetTop == this.food.top && this.head.offsetLeft == this.food.left) {
        this.food.remove();
        this.food.add();
        this.new(top, left);
    }
}

Snake.prototype.new = function (top, left) {
    var map = document.querySelector(".map");
    var snakeNode = document.createElement("div");
    snakeNode.classList.add("snake");
    snakeNode.style.top = top + "px";
    snakeNode.style.left = left + "px";

    map.insertBefore(snakeNode, this.items[0]);
    this.items = document.querySelectorAll(".snake");
}

function Food() {
    this.food = null;
    this.top = -1;
    this.left = -1;
}

Food.prototype.add = function () {
    var food = document.createElement("div");
    food.classList.add("food");

    var x = Math.ceil(Math.random() * 40) * 20;
    var y = Math.ceil(Math.random() * 30) * 20;

    food.style.top = y + "px";
    food.style.left = x + "px";

    var map = document.querySelector(".map");
    map.appendChild(food);

    this.food = food;
    this.top = y;
    this.left = x;
}

Food.prototype.remove = function () {
    if (this.food) {
        this.food.remove();
        this.food = null;
    }
}