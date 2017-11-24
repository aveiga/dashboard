import { Widget } from './widget.js';

var counter = 0;
var widgets = [];
var tempWireframe = {};

function onMessage(msg) {
    console.log(msg);
}

function resetTempVars() {
    tempWireframe.div.parentNode.removeChild(tempWireframe.div);
    tempWireframe = {};
}

function pxToInt(px) {
    return parseInt(px.substring(0, px.length - 2));
}

function intToPx(int) {
    return int + "px";
}

function createGUID() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    // then to call it, plus stitch in '4' in the third group
    let guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();

    return guid;
}

// if(lsbridge) {
//     lsbridge.subscribe('gdp-dashboard', onMessage);
// }

window.addEventListener('mousedown', e => {
    if (e.target != document.body) {
        return;
    }

    tempWireframe.x = e.x;
    tempWireframe.y = e.y;

    tempWireframe.div = document.createElement('div');
    tempWireframe.div.style.top = tempWireframe.y;
    tempWireframe.div.style.left = tempWireframe.x;
    tempWireframe.div.style.position = "absolute";
    tempWireframe.div.style.borderStyle = "solid";
    tempWireframe.div.style.borderColor = "blue";
    tempWireframe.div.style.borderWidth = "2px";
    tempWireframe.div.style.height = e.y - tempWireframe.y;
    tempWireframe.div.style.width = e.x - tempWireframe.x;
    document.body.appendChild(tempWireframe.div);
});

window.addEventListener('mousemove', e => {
    if (tempWireframe.div) {
        tempWireframe.div.style.height = e.y - tempWireframe.y;
        tempWireframe.div.style.width = e.x - tempWireframe.x;
    }
});

window.addEventListener('mouseup', e => {
    if (tempWireframe.div) {
        if (pxToInt(tempWireframe.div.style.height) >= 100 && pxToInt(tempWireframe.div.style.width) >= 100) {
            let id = createGUID();
            let widget = new Widget({
                id: id,
                name: 'temp',
                x: tempWireframe.div.style.left,
                y: tempWireframe.div.style.top,
                height: tempWireframe.div.style.height,
                width: tempWireframe.div.style.width,
                zIndex: counter,
                appElement: `<div id="app">
                                    <v-client-table></v-client-table>
                                </div>`,
                dependencies: [
                    {
                        src: 'http://localhost:8081/build.js',
                        type: 'javascript'
                    }
                ],
                onDelete: function (wid) {
                    for (let i = 0; i < widgets.length; i++) {
                        let w = widgets[i];
                        if (w.id == id) {
                            widgets.splice(i, 1);
                            break;
                        }
                    };
                }
            });

            widgets.push(widget);
            counter++;
        }

        resetTempVars();
    }
});

// self.getWidgets = function getWidgets() {
//     return widgets;
// };