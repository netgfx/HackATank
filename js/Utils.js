var Registry = {
    "stage": ''
};

var particlesCrate_T0 = [];
var particlesTurret_T0 = [];

var objImages = [
        "assets/textures/objects/woodCrate2.png"
];
var enemyImages = [
        "assets/textures/enemies/EnemyT0.png"
];

/** * registerTicker * Description
 * @param {type} fn* Description
 **/
function registerTicker(fn) {
    TweenLite.ticker.addEventListener("tick", fn);
}

function removeTicker(fn) {
    TweenLite.ticker.removeEventListener("tick", fn);
}

/** * getRandom * Description
 * @param {type} max* Description
 * @param {type} min* Description
 **/
function getRandom(max, min) {
    return Math.floor(Math.random() * (1 + max - min) + min);
}

/** * precise_round * Description
 * @param {type} num* Description
 * @param {type} decimals* Description
 **/
function precise_round(num, decimals) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

//// COLLISION DETECTION ////


$.collision = function (selector) {

    var data;
    var i, l;
    selector = String(selector).split(",");

    //i = data.length;
    data = $(selector[0]);

    if (data === undefined || data === null) {
        return false;
    }

    var data_offset = data.offset();
    var data_width = data.outerWidth();
    var data_height = data.outerHeight();
    var data_tl = {
        x: data_offset.left,
        y: data_offset.top
    },
        data_tr = {
            x: data_offset.left + data_width,
            y: data_offset.top
        },
        data_bl = {
            x: data_offset.left,
            y: data_offset.top + data_height
        },
        data_br = {
            x: data_offset.left + data_width,
            y: data_offset.top + data_height
        };

    var targets = $(selector[1] + "," + selector[2]);
    // console.log(selector,targets);
    for (i = 0; i < targets.length; i++) {

        var elem = $(targets[i]);
        var offset = elem.offset();
        var width = elem.outerWidth();
        var height = elem.outerHeight();

        var tl = {
            x: offset.left,
            y: offset.top
        },
            tr = {
                x: offset.left + width,
                y: offset.top
            },
            bl = {
                x: offset.left,
                y: offset.top + height
            },
            br = {
                x: offset.left + width,
                y: offset.top + height
            },
            obj = {
                obj: elem
            };

        if (!(
            data_br.x < bl.x ||
            data_bl.x > br.x ||
            data_bl.y < tl.y ||
            data_tl.y > bl.y)) {
            return {
                result: true,
                item1: data,
                item2: obj.obj
            };
        }

    }


    return {
        result: false
    };
};


///////////////////////

function get_random_color() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

/// OBJECT CREATION ///

function masterObj(_img, type, tier, fn, params) {

    var _this = this;
    this.img = _img;
    this.params = params;
    this.fn = fn;
    //this.id = 'mapObj_' + d;
    var $img = _img;
    this.particles = [];
    var particles = [];

    console.log(_img);
    createCanvas();

    function createCanvas(_x, _y, life) {

        var img = new Image();
        img.src = $img;

        img.onload = function () {

            var obj = createParticles(img, _x, _y, this.id, type, tier * 10);

            this.item = obj;
            _this.item = obj;

            if (fn !== null && fn !== undefined) {
                fn(params);
            }
            //var parent = document.getElementById('container_' + UID);
            //console.log('parent');
            //parent.appendChild(obj);
        };

    }

    function createParticles(imgObj, left, top, id, type, life) {


        var splitFactor = 10;
        if (type === 'turret') {
            splitFactor = 10;
        }

        var elem = document.createElement("div");
        particles = [];
        var ratio = 5;
        if (type !== 'turret') {
            ratio = 5;
        } else {
            ratio = 10;
        }
        for (var n = 0; n < ratio; n++) {
            for (var i = 0; i < ratio; i++) {
                var imgX = n * splitFactor;
                var imgY = i * splitFactor;
                particles.push({
                    x: imgX,
                    y: imgY,
                    imgX: imgX,
                    imgY: imgY,
                    vx: 0,
                    vy: 0,
                    isRolling: false,
                    isLocked: true
                });
            }
        }


        console.log("PARTICLES ARE: ", particles.length);
        //elem.style.display = 'none';

        elem.life = life;
        elem.attributes['life'] = life;
        elem.setAttribute('life', Number(life));
        elem.style.width = splitFactor * ratio + "px";
        elem.style.height = splitFactor * ratio + "px";
        elem.style.position = "absolute";
        elem.style.left = left + "px";
        elem.style.top = top + "px";

        var canvas;
        var context;
        console.log(imgObj);
        var canvasArr = [];
        for (var n = 0; n < particles.length; n++) {

            var particle = particles[n];

            canvas = document.createElement("canvas");
            canvas.width = splitFactor;
            canvas.height = splitFactor;
            canvas.style.left = particle.x + "px";
            canvas.style.top = particle.y + "px";
            canvas.style.position = 'absolute';
            context = canvas.getContext("2d");
            context.drawImage(imgObj, particle.imgX, particle.imgY, splitFactor, splitFactor, 0, 0, splitFactor, splitFactor);

            canvasArr.push(canvas);
            elem.appendChild(canvas);

        }

        if (type == "turret") {
            particlesTurret_T0.push({
                'item': elem,
                'canvas': canvasArr
            });
        } else {
            particlesCrate_T0.push({
                'item': elem,
                'canvas': canvasArr
            });
        }


        return elem;

    }


    this.reset = function () {

        console.log($("#" + this.id).children().length);
        $("#" + this.id).empty().remove();
        $("#container").children("div").remove();


        _this.createCanvas();

    };

    return this;

};