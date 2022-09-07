let canvas = document.querySelector("#canvas");
let input = document.querySelector("#input");
let ctx = canvas.getContext("2d");
let piezas = [];

canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight


class Pieza {
    constructor(datosPieza , datosImg) {
        this.datosPieza = datosPieza;
        this.datosImg = datosImg;
        this.margen = 0;
        this.ladoIzq = null;
        this.ladoDer = null;
        this.ladoInf = null;
        this.ladoSup = null;
    }

    setLadoIzq (lado) {this.ladoIzq = lado}
    setLadoDer (lado) {this.ladoDer = lado}
    setLadoInf (lado) {this.ladoInf = lado}
    setLadoSup (lado) {this.ladoSup = lado}

    setX (initX) {
        if (initX<0){
            this.datosPieza.posXInit = 0
        } else if (initX > canvas.width- this.datosPieza.tamanio){
            this.datosPieza.posXInit = canvas.width- this.datosPieza.tamanio
        } else {
            this.datosPieza.posXInit = initX
        }
    }
    setY (initY) {
        if (initY<0){
            this.datosPieza.posYInit = 0
        }else if (initY > canvas.height - this.datosPieza.tamanio){
            this.datosPieza.posYInit = canvas.height - this.datosPieza.tamanio
        } else {
            this.datosPieza.posYInit = initY
        }
    }
    getTam() {
        return this.datosPieza.tamanio;
    }

    getDif (mouseX, mouseY) {
        let x = mouseX - this.datosPieza.posXInit
        let y = mouseY - this.datosPieza.posYInit
        return {"x": x, "y":y}
    }

    isElem(posicion) {
        if (posicion.x > this.datosPieza.posXInit && posicion.x < this.datosPieza.posXInit + this.datosPieza.tamanio) {
            if  (posicion.y > this.datosPieza.posYInit && posicion.y < this.datosPieza.posYInit + this.datosPieza.tamanio) {
                return true
            }
        }
        return false
    }
   
    draw (){
        ctx.drawImage(this.datosImg.img,this.datosImg.dx, this.datosImg.dy, this.datosImg.tamanioImg, this.datosImg.tamanioImg, 
                        this.datosPieza.posXInit, this.datosPieza.posYInit, this.datosPieza.tamanio, this.datosPieza.tamanio)
        
        ctx.fillStyle = "green";
        ctx.strokeRect(this.datosPieza.posXInit, this.datosPieza.posYInit, this.datosPieza.tamanio, this.datosPieza.tamanio );
    }
};

const maximoComunDivisor = (a, b) => {
    if (b === 0) return a;
    return maximoComunDivisor(b, a % b);
};

function randomCeroUno(){
    return Math.round(Math.random());
};

function inicializacionPiezas(pxs, img) {
    let divisor = maximoComunDivisor(pxs.height, pxs.width);
    
    if (divisor == pxs.width) {
        divisor = pxs.width/3
    }
    
    let limiteAncho = pxs.width/divisor
    let limiteAlto = pxs.height/divisor

    let divisorImg = img.width/ limiteAncho

    for (x=0, i=0, dx=0; x< pxs.width, i<limiteAncho; x+= divisor, i++, dx+= divisorImg){
        piezas[i]=new Array(limiteAlto)
        for (y=0, j=0, dy=0; y<pxs.height, j<limiteAlto; y+= divisor, j++, dy+=divisorImg) {

            let datosInitPieza = {"posXInit":x,"posYInit": y, "tamanio": divisor}
            let datosImg = {"img":img, "dx":dx, "dy": dy, "tamanioImg":divisorImg}
            piezas[i][j] = new Pieza(datosInitPieza, datosImg);
            if (i>0) {
                let lado = this.randomCeroUno();
                piezas[i][j].setLadoIzq(lado);
                piezas[i-1][j].setLadoDer(lado);
            }
            if (j>0) {
                let lado = this.randomCeroUno();
                piezas[i][j].setLadoSup(lado);
                piezas[i][j-1].setLadoInf(lado);
            }
        }
    }
};

function calcularTamañoNuevo(img)  {
    ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
    newWidth = img.width*ratio
    newHeight = img.height*ratio
    return {"height": newHeight, "width": newWidth}
};

function dibujarPiezas() {
    for (i=0; i< piezas.length; i++){
        for (j=0; j<piezas[i].length; j++) {
            let pieza = piezas[i][j]
            pieza.draw()
        }
    }
}

function barajar() {
    for (i=0; i< piezas.length; i++){
        for (j=0; j<piezas[i].length; j++) {
            let pieza = piezas[i][j]
            let tam = pieza.getTam()
            pieza.setX(Math.random() * (canvas.width - tam +1) + 0);
            pieza.setY(Math.random() * (canvas.height - tam +1) + 0);
        }
    }
}

input.onchange = () => { 
    let reader = new FileReader();
    const img = new Image();
    file = input.files[0]; 

    reader.readAsDataURL(file);
    reader.onloadend = function(readerEvent) {
        let content = readerEvent.target.result;
        img.src = content;
        
        img.onload = () => {
            nvoTamaño = calcularTamañoNuevo(img)
            document.body.appendChild(img);
            inicializacionPiezas( nvoTamaño, img)
            barajar()
            dibujarPiezas()

        };
    };
};

function limpiarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let press = false
let elem 
let dif = 0
canvas.onmousedown = (e) => {
    press = true
    for (i=0; i< piezas.length; i++){
        for (j=0; j<piezas[i].length; j++) {
            let pieza = piezas[i][j]
            let es = pieza.isElem({"x": e.layerX,"y":e.layerY})
            if (es) {
                elem = pieza
            }
        }
    }
    if (elem != undefined && press){
        dif = elem.getDif(e.layerX, e.layerY)
    }
}
canvas.onmousemove = (e) => {
    if (elem != undefined && press){
        elem.setX(e.layerX - dif.x)
        elem.setY(e.layerY - dif.y)
        limpiarCanvas()
        dibujarPiezas()
    }
}
canvas.onmouseup = () => {
    press = false;
    dif = 0
}