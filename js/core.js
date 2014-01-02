$(document).ready(function () {

    createBG();
    createStage();
    $(".cmd").keypress(handleEnter);

    createThrowprops();
});

function createBG() {

    var items = [
        "assets/bg/item1.png",
        "assets/bg/item2.png",
        "assets/bg/item3.png",
        "assets/bg/item4.png",
        "assets/bg/item5.png",
        "assets/bg/item6.png",
        "assets/bg/item7.png",
        "assets/bg/item8.png"
    ];

    var w = 10000; //$(document).width();
    var h = 10000; //$(document).height();

    var spacialAnalysisX = Math.round(w / 20);
    var spacialAnalysisY = Math.round(h / 20);

    var max = spacialAnalysisX > spacialAnalysisY ? spacialAnalysisX : spacialAnalysisY;

    window.console.log(max, w, h);
    for (var i = 0; i < max; i++) {

        var randomX = getRandom(w, 50);
        var randomY = getRandom(h, 50);

        var image = new Image();
        image.style.left = randomX + "px";
        image.style.top = randomY + "px";
        image.style.position = "absolute";
        image.className = "decals";
        image.onload = onLoadDecal(image);

        image.src = items[getRandom(items.length - 1, 0)];

    }

}

function onLoadDecal(image) {

    $("#bg").append(image);

}

function createStage(){
    var stage = new Kinetic.Stage({
        container: 'content',
        width: $(window).width(),
        height: 1000
    });

    Registry.stage = stage;

    var layer = new Kinetic.Layer();
    var rect = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: 10000,//$(window).width(),
        height: 10000,//$(window).height(),
        fill:"#000000",
        opacity:0
    });

    // add the shape to the layer
    layer.add(rect);

    // add the layer to the stage
    stage.add(layer);
}

///////////////////////////////////////////////////////

function handleEnter(e) {

    if (e.which == 13 && e.shiftKey === false) {
        e.preventDefault();
        // enter pressed

        var newCommand = $(".cmd").val();
        var result = parseCommand(newCommand);
        var message = $(".log").val();

        if (result.command === "clear") {
            $(".cmd").val('');
        } else if (result.command === "move") {
            $(".log").val(message + "\n" + result.message);
            $(".cmd").val('');
            $(".log").scrollTop(9999);
        } else {
            $(".log").val(message + "\n" + newCommand);
            $(".cmd").val('');
            $(".log").scrollTop(9999);
        }
        return false;

    }
}

function parseCommand(command) {

    var split = String(command).split('=');
    var commandParts = {};
    split[0] = String(split[0]).replace(/\s+/g, '');
    split[1] = String(split[1]).replace(/\s+/g, '');

    commandParts[split[0]] = split[1] === 'undefined' ? 20 : split[1];
    console.log(split, commandParts);
    command = String(command).toLowerCase();

    if (command === "clear") {
        window.console.log(String(command).toLowerCase() === "clear");
        $(".log").val('');
        return {
            'command': "clear",
            'message': ''
        };
    } else if (split.length >= 1) {
        if (split[0] === "move") {
            if (split[1] === undefined) {

            }
            return {
                "command": "move",
                "message": '> moving towards: ' + commandParts.move
            };
        } else if (split[0] === "shoot") {
            return {
                "command": "move",
                "message": '> shooting...'
            };
        } else if (split[0] === "scan") {
            return {
                "command": "move",
                "message": '> scanning...'
            };
        } else if (split[0] === "stop") {
            return {
                "command": "move",
                "message": '> stoping...'
            };
        } else if (split[0] === "turn") {
            return {
                "command": "move",
                "message": '> turning towards: ' + commandParts.turn
            };
        }
    }
}

function createThrowprops() {
    var gridWidth = $(window).width(),
        gridHeight = $(window).height(),
        realHeight = $("#bg").height(),
        realWidth = $("#bg").width(),
        gridRows = 2,
        gridColumns = 1;

    TweenLite.set($("#frame"), {
        height: gridHeight,
        width: gridWidth
    });
    TweenLite.set($("#bg"), {
        height: realHeight,
        lineHeight: realHeight
    });

    var mapProxy = Draggable.create("#bg", {
        bounds: $("#frame"),
        edgeResistance: 0.98,
        type: "x,y",
        dragResistance:0.55,
        trigger:".kineticjs-content",
        resistance: 0,
        velocity: 100,
        throwProps: true,
        dragClickables: true,
        onThrowUpdate: function () {
            var item = Draggable.get("#bg");
            //window.console.log(item, mapProxy, item.endX, item.endY);
            moveMinimapFrame(item.endX, item.endY);
        }
        // },
        // snap: {
        //     // x: function (endValue) {
        //     //     return Math.round(endValue / gridWidth) * gridWidth;
        //     }

        // }
    });

}

function moveMinimapFrame(x, y) {

    var equivalentX = (Math.abs(x) * 200) / 10000;
    var equivalentY = (Math.abs(y) * 200) / 10000;

    if (equivalentX > (200 - $(".minimap-frame").width()) - 2) {
        equivalentX = (200 - $(".minimap-frame").width()) - 2;
    }

    if (equivalentY > (200 - $(".minimap-frame").height()) - 2) {
        equivalentY = (200 - $(".minimap-frame").height()) - 2;
    }

    TweenMax.to(".minimap-frame", 0.1, {
        'left': equivalentX,
        'top': equivalentY
    });
    window.console.log(equivalentX, equivalentY, (200 - $(".minimap-frame").height()));


}