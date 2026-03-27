let saldo = localStorage.getItem("saldo");

if(saldo === null){
saldo = 0;
}

saldo = Number(saldo).toLocaleString("es-CO");

document.getElementById("saldoUsuario").innerText = saldo;