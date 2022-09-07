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

            let datosPieza = {"posXInit":x,"posXFinal": x+divisor,"posYInit": y, "posYFinal": y+divisor, "tamanio": divisor}
            let datosImg = {"img":img, "dx":dx, "dy": dy, "tamanioImg":divisorImg}
            piezas[i][j] = new Pieza(datosPieza, datosImg);
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

function dibujarImagen(img, newWidth, newHeight){
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
};

function dibujarPiezas() {
    for (i=0; i< piezas.length; i++){
        for (j=0; j<piezas[i].length; j++) {
            let pieza = piezas[i][j]
            pieza.draw()
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
            // dibujarImagen(img,canvas.width,canvas.height)
            dibujarPiezas()

        };
    };
};
