let html5QrCode;

function iniciarEscaner() {

    alert("Se ejecutó el escáner"); // 👈 prueba
    html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250
        },
        (decodedText) => {

            console.log("QR leído:", decodedText);

            html5QrCode.stop(); // 🔥 detiene la cámara

            procesarQR(decodedText);
        }
    ).catch(err => {
        console.log("Error cámara:", err);
    });
}

function procesarQR(texto) {

    if (!texto.startsWith("GZF|")) {
        mostrarResultado("QR inválido ❌", "danger");
        return;
    }

    let partes = texto.split("|");

    let data = {};

    for (let i = 1; i < partes.length; i++) {
        let [clave, valor] = partes[i].split("=");
        data[clave] = valor;
    }

    simularValidacion(data);
}

function simularValidacion(data) {

    document.getElementById("resultado").innerHTML =
        `<div class="alert alert-info">⏳ Validando pago...</div>`;

    setTimeout(() => {
        validarPago(data);
    }, 2000);
}

function validarPago(data) {

    let estado = "";
    let mensaje = "";

    if (parseInt(data.m) > 0) {
        estado = "APROBADO";
        mensaje = "✅ Puede tanquear";
        mostrarResultado(`
            Usuario: ${data.u}<br>
            Monto: ${data.m}<br>
            Estado: ${estado}
        `, "success");
    } else {
        estado = "RECHAZADO";
        mensaje = "❌ Pago inválido";
        mostrarResultado(mensaje, "danger");
    }
}

function mostrarResultado(texto, tipo) {
    document.getElementById("resultado").innerHTML =
        `<div class="alert alert-${tipo}">${texto}</div>`;
}