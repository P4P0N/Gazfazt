/* BOTONES DE RECARGA */

function seleccionarValor(valor, boton){

let input = document.getElementById("monto");

input.value = valor;

/* quitar selección de todos los botones */

let botones = document.querySelectorAll(".btn-recarga");

botones.forEach(btn => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline-primary");
});

/* marcar el botón seleccionado */

boton.classList.remove("btn-outline-primary");
boton.classList.add("btn-primary");

}

function habilitarOtro(){

let input = document.getElementById("monto");

input.value = "";
input.focus();

/* quitar selección */

let botones = document.querySelectorAll(".btn-recarga");

botones.forEach(btn => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline-primary");
});

}


/* BANCOS */

const bancos = [
"Bancolombia",
"Davivienda",
"Banco de Bogotá",
"BBVA",
"Banco Popular",
"Banco AV Villas",
"Scotiabank Colpatria",
"Banco Agrario",
"Banco Falabella",
"Banco Caja Social"
];

const selectBanco = document.getElementById("banco");

/* opción inicial vacía para validación */

selectBanco.innerHTML = "<option value=''>Seleccione un banco</option>";

bancos.forEach(banco => {

let opcion = document.createElement("option");

opcion.textContent = banco;
opcion.value = banco;

selectBanco.appendChild(opcion);

});

function seleccionarValor(valor, boton){

let input = document.getElementById("monto");

input.disabled = false;
input.value = valor;

/* quitar selección de todos los botones */

let botones = document.querySelectorAll(".btn-recarga");

botones.forEach(btn => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline-primary");
});

/* marcar el botón seleccionado */

boton.classList.remove("btn-outline-primary");
boton.classList.add("btn-primary");

}

function habilitarOtro(){

let input = document.getElementById("monto");

input.disabled = false;
input.value = "";
input.focus();

/* quitar selección de botones */

let botones = document.querySelectorAll(".btn-recarga");

botones.forEach(btn => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline-primary");
});

}

document.querySelector("form").addEventListener("submit", function(e){

e.preventDefault();

let monto = parseInt(document.getElementById("monto").value);

let saldoActual = localStorage.getItem("saldo");

if(saldoActual === null){
saldoActual = 0;
}else{
saldoActual = parseInt(saldoActual);
}

let nuevoSaldo = saldoActual + monto;

localStorage.setItem("saldo", nuevoSaldo);

window.location.href = "/PROYECTO_GAZFAZT/indexUsuario.html";

});