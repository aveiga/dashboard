export function Widget(options) {
    var self = this;
    self.id = options.id;
    self.options = options;
    self.containerDiv = null;
    self.mainWrapperDiv = null;
    self.headerDiv = null;
    self.bottomRightVertex = null;
    self.bodyDiv = null;

    self.isMoving = false;
    self.isResizing = false;
    self.initialMouseX = 0;
    self.initialMouseY = 0;
    self.initialWidgetHeight = 0;
    self.initialWidgetWidth = 0;

    // OPTIONS
    // id:string;
    // name:string;
    // height:int;
    // width:int;
    // x:int;
    // y:int;
    // zIndex:int;

    function init() {
        draw();
    }

    init();

    function draw() {
        self.containerDiv = document.createElement('div');
        self.containerDiv.id = options.id;
        self.containerDiv.style.top = self.options.y;
        self.containerDiv.style.left = self.options.x;
        self.containerDiv.style.position = "absolute";
        self.containerDiv.style.borderStyle = "solid";
        self.containerDiv.style.borderColor = "red";
        self.containerDiv.style.borderWidth = "2px";
        self.containerDiv.style.height = self.options.height;
        self.containerDiv.style.width = self.options.width;
        self.containerDiv.style.zIndex = self.options.zIndex;
        self.containerDiv.style.userSelect = "none";

        self.mainWrapperDiv = document.createElement('div');
        self.mainWrapperDiv.style.position = 'relative';
        self.mainWrapperDiv.style.width = "100%";
        self.mainWrapperDiv.style.height = "100%";

        self.headerDiv = createHeader();
        self.bottomRightVertex = createBottomRightVertex();
        self.bodyDiv = createBodyDiv();

        self.mainWrapperDiv.appendChild(self.headerDiv);
        self.mainWrapperDiv.appendChild(self.bottomRightVertex);
        self.mainWrapperDiv.appendChild(self.bodyDiv);

        self.containerDiv.appendChild(self.mainWrapperDiv);

        document.body.appendChild(self.containerDiv);
    }

    function createHeader() {
        let newHeader = document.createElement('div');
        newHeader.style.height = "20px";
        newHeader.style.width = "100%";
        newHeader.style.position = "relative";
        newHeader.style.backgroundColor = "red";

        let closeElement = document.createElement('button');
        closeElement.onclick = function() { 
            self.containerDiv.parentNode.removeChild(self.containerDiv);
            options.onDelete(self) 
        };
        closeElement.textContent = "CLOSE";
        newHeader.appendChild(closeElement);

        document.addEventListener('mousedown', e => {
            if(e.target != newHeader) {
                return;
            }

            self.isMoving = true;
            self.initialMouseX = e.x;
            self.initialMouseY = e.y;
            self.initialWidgetX = pxToInt(self.containerDiv.style.left);
            self.initialWidgetY = pxToInt(self.containerDiv.style.top);
        });

        document.addEventListener('mousemove', e => {
            if(self.isMoving) {
                self.containerDiv.style.left = intToPx(self.initialWidgetX + (e.x - self.initialMouseX));
                self.containerDiv.style.top = intToPx(self.initialWidgetY +  (e.y - self.initialMouseY));
            }
        });

        document.addEventListener('mouseup', e => {
            if(self.isMoving) {
                self.isMoving = false;
            }
        });

        return newHeader;
    }

    function createBottomRightVertex() {
        let bottomRightVertex = document.createElement('div');
        bottomRightVertex.style.position = "absolute";
        bottomRightVertex.style.bottom = "-5px";
        bottomRightVertex.style.right = "-5px";
        bottomRightVertex.style.height = "10px";
        bottomRightVertex.style.width = "10px";
        bottomRightVertex.style.backgroundColor = "yellow";

        document.addEventListener('mousedown', e => {
            if(e.target != bottomRightVertex) {
                return;
            }

            self.isResizing = true;
            self.initialMouseX = e.x;
            self.initialMouseY = e.y;
            self.initialWidgetHeight = pxToInt(self.containerDiv.style.height);
            self.initialWidgetWidth = pxToInt(self.containerDiv.style.width);
        });

        document.addEventListener('mousemove', e => {
            if(self.isResizing) {
                self.containerDiv.style.height = intToPx(self.initialWidgetHeight + (e.y - self.initialMouseY));
                self.containerDiv.style.width = intToPx(self.initialWidgetWidth + (e.x - self.initialMouseX));
            }
        });

        document.addEventListener('mouseup', e => {
            if(self.isResizing) {
                self.isResizing = false;
            }
        });

        return bottomRightVertex;
    }

    function createBodyDiv() {
        let newContainer = document.createElement('div');
        newContainer.style.height = "calc(100% - 20px)";
        newContainer.style.width = "100%";
        newContainer.style.position = "relative";
        newContainer.style.backgroundColor = "lightgray";
        newContainer.style.overflow = "auto";

        if(options.appElement) {
            newContainer.innerHTML = options.appElement;
        }

        if(options.dependencies) {
            options.dependencies.forEach(element => {
                switch(element.type) {
                    case 'javascript':
                        let script = document.createElement('script');
                        script.src=element.src;
                        script.type="text/javascript";

                        newContainer.appendChild(script);
                        break;
                    case 'stylesheet':
                        let link = document.createElement('link');
                        link.href = element.src;
                        link.type = "text/css";
                        link.rel = "stylesheet";

                        newContainer.appendChild(link);
                        break;
                    default:
                        break;
                }
            });
        }

        return newContainer;
    }

    // function createBottomLeftVertex() {
    //     let bottomLeftVertex = document.createElement('div');
    //     bottomLeftVertex.style.position = "absolute";
    //     bottomLeftVertex.style.bottom = "-5px";
    //     bottomLeftVertex.style.left = "-5px";
    //     bottomLeftVertex.style.height = "10px";
    //     bottomLeftVertex.style.width = "10px";
    //     bottomLeftVertex.style.backgroundColor = "yellow";

    //     document.addEventListener('mousedown', e => {
    //         if(e.target != bottomLeftVertex) {
    //             return;
    //         }

    //         self.isResizing = true;
    //         self.initialMouseX = e.x;
    //         self.initialMouseY = e.y;
    //         self.initialWidgetHeight = pxToInt(self.containerDiv.style.height);
    //         self.initialWidgetWidth = pxToInt(self.containerDiv.style.width);
    //     });

    //     document.addEventListener('mousemove', e => {
    //         if(self.isResizing) {
    //             self.containerDiv.style.height = intToPx(self.initialWidgetHeight + (e.y - self.initialMouseY));
    //             self.containerDiv.style.width = intToPx(self.initialWidgetWidth + (e.x - self.initialMouseX));
    //         }
    //     });

    //     document.addEventListener('mouseup', e => {
    //         if(self.isResizing) {
    //             self.isResizing = false;
    //         }
    //     });

    //     return bottomLeftVertex;
    // }

    function pxToInt(px) {
        return parseInt(px.substring(0, px.length - 2));
    }

    function intToPx(int) {
        return int + "px";
    }

    // self.setHeight = function setHeight(height) {
    //     this.height = height;
    // }

    // self.setWidth = function setWidth(width) {
    //     this.width = width;
    // }
}