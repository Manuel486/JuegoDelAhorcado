let contenido = document.querySelector('#contenido');
let erroneo = document.querySelector('#erroneo');

let canvas = document.querySelector("#canvas");
let pincel = canvas.getContext("2d"); 

let sonidoCorrecto = new Audio('./sonido/correcto.mp3');
let sonidoIncorrecto = new Audio('./sonido/incorrecto.mp3');
let sonidoConfeti = new Audio('./sonido/confeti.mp3');

// Parámetros del juego
let palabras = ['HTML','CSS','REACT','JAVA','PYTHON','PASCAL','RUBY','PROLOG','SQL','PHP'];  
let letrasEncontradas = [];
let letrasErradas = [];
let palabraSecreta = "";
let intentos = 0;
let jugando = true;

// Nuevo juego -> nueva palabra
document.querySelector('#nuevoJuego').addEventListener("click",function(){
    reiniciarJuego();
    jugando = true;
    inicioJuego();
});

// Desistir -> regresar a la ventana principal
document.querySelector('#desistir').addEventListener("click",function(){
    jugando = false;
    for (let i = intentos+1; i < 7; i++) {
        evaluarIntento(i);
    }

    for (let z = 0; z < palabraSecreta.length; z++) {
        contenido.children[z].classList.add("correcto");
        contenido.children[z].textContent = palabraSecreta[z];
    }
    
    alerta('Perdiste','./imagenes/gameOver.png','130px','80px','La palabra secreta era "'+palabraSecreta+'".');
    document.getElementById('desistir').disabled = true;
})

function inicioJuego(){
    palabraAleatoria();
    crearEstructura();
    generarCamposVacios();
}

function palabraAleatoria(){
    let random = Math.floor(Math.random()*palabras.length);
    palabraSecreta = palabras[random];
}

function crearEstructura(){
    //soporte 
    pincel.fillStyle = "black";
    pincel.fillRect(10,250,210,20); 

    // columna
    pincel.fillStyle = "black";
    pincel.fillRect(50,20,20,230);
}

function generarCamposVacios(){
    for(let i of palabraSecreta){
        const span = document.createElement("span");
        span.textContent = "";
        span.classList.add("color");
        contenido.appendChild(span);
    }
}

function reiniciarJuego(){
    contenido.innerHTML = "";
    erroneo.innerHTML = "";
    canvas.width = canvas.width;
    document.getElementById('desistir').disabled = false;
    letrasEncontradas = [];
    letrasErradas = [];
    intentos = 0;
    palabraSecreta = "";
}

// Ingresar letras
document.addEventListener("keyup", function(e) {
    let letra = e.key;
    letra = letra.toUpperCase();

    if(!(letra.length==1 && /^[A-ZÑ]/.test(letra))){
        return;
    }

    if(jugando && !letrasErradas.includes(letra) && !letrasEncontradas.includes(letra)){
        let indices = [];
        let idx = palabraSecreta.indexOf(letra);

        while(idx != -1){
            indices.push(idx);
            idx = palabraSecreta.indexOf(letra,idx+1);
        }

        if (indices.length>0) {
            for (let i = 0; i < indices.length; i++) {
                contenido.children[indices[i]].classList.add("correcto");
                contenido.children[indices[i]].textContent = letra;
                letrasEncontradas.push(letra);
            }
            sonidoCorrecto.play();

            if(letrasEncontradas.length == palabraSecreta.length){
                sonidoConfeti.play();
                alerta('Ganaste','./imagenes/win.png','150px','150px','Lograste encontrar la palabra secreta  "'+palabraSecreta+'".')
                document.getElementById('desistir').disabled = true;
            }
        } else {
            sonidoIncorrecto.play();
            letrasErradas.push(letra);
            const span = document.createElement("span");
            span.textContent = letra;
            span.classList.add("incorrecto");
            erroneo.appendChild(span);
            intentos++;
            evaluarIntento(intentos);
            if(intentos == 6){
                alerta('Perdiste','./imagenes/gameOver.png','130px','80px','La palabra secreta era  "'+palabraSecreta+'".');
                jugando = false;
                document.getElementById('desistir').disabled = true;
            }
        } 
    }
});

function evaluarIntento(intentos){
    pincel.fillStyle = "black";
    switch (intentos) {
        case 1:
            // palo superior
            pincel.fillRect(50,14,120,20); 
            break;
        case 2:
            // palo inferior
            pincel.fillRect(170,14,20,50);
            break;

        case 3:
            // cabeza
            pincel.beginPath();
            pincel.arc(180,84,20,0,2*3.14);
            pincel.strokeStyle = "black";
            pincel.lineWidth = 4;
            pincel.stroke();
            break;
        case 4:
            // cuerpo
            pincel.fillRect(177,104,6,50);
            break;
        case 5:
            // pierna derecha
            pincel.beginPath(); 
            pincel.moveTo(180,154);
            pincel.lineTo(170,190);
            pincel.lineWidth = 6;
            pincel.stroke();

            // pierna izquierda
            pincel.beginPath(); 
            pincel.moveTo(180,154);
            pincel.lineTo(190,190);
            pincel.lineWidth = 6;
            pincel.stroke();

            break;
        case 6:
            // brazo derecho
            pincel.beginPath(); 
            pincel.moveTo(180,125);
            pincel.lineTo(160,141);
            pincel.lineWidth = 6;
            pincel.stroke();

            // brazo izquierdo
            pincel.beginPath(); 
            pincel.moveTo(180,125);
            pincel.lineTo(200,141);
            pincel.lineWidth = 6;
            pincel.stroke();

            // Ojo Izquierdo
            pincel.beginPath(); 
            pincel.moveTo(178,80);
            pincel.lineTo(170,90);
            pincel.lineWidth = 6;
            pincel.stroke();

            pincel.beginPath(); 
            pincel.moveTo(170,80);
            pincel.lineTo(178,90);
            pincel.lineWidth = 6;
            pincel.stroke();

            // Ojo Derecho
            pincel.beginPath(); 
            pincel.moveTo(190,80);
            pincel.lineTo(182,90);
            pincel.lineWidth = 6;
            pincel.stroke();

            pincel.beginPath(); 
            pincel.moveTo(182,80);
            pincel.lineTo(190,90);
            pincel.lineWidth = 6;
            pincel.stroke();
            break;

        default:
            break;
    }
}

function alerta(titulo,imagen,widthImagen,heightImange,texto){
    Swal.fire({
        heightAuto: false,
        title: titulo,
        text: texto,
        imageUrl: imagen,
        imageWidth: widthImagen,
        imageHeight: heightImange,
        confirmButtonText: 'Regresar',
        confirmButtonColor: '#F56E56',
        allowOutsideClick: false
    })
}

inicioJuego();