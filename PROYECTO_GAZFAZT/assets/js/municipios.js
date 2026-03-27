const datos = {

"Antioquia": [
"Medellín",
"Bello",
"Envigado",
"Itagüí",
"Rionegro",
"Sabaneta"
],

"Cundinamarca": [
"Bogotá",
"Soacha",
"Chía",
"Zipaquirá"
],

"Valle del Cauca": [
"Cali",
"Palmira",
"Buenaventura",
"Tuluá"
],

"Atlántico": [
"Barranquilla",
"Soledad",
"Malambo",
"Puerto Colombia"
],

"Santander": [
"Bucaramanga",
"Floridablanca",
"Girón",
"Piedecuesta"
],

"Bolívar": [
"Cartagena",
"Magangué",
"Turbaco"
],

"Boyacá": [
"Tunja",
"Duitama",
"Sogamoso",
"Chiquinquirá"
],

"Nariño": [
"Pasto",
"Tumaco",
"Ipiales"
],

"Tolima": [
"Ibagué",
"Espinal",
"Melgar"
],

"Magdalena": [
"Santa Marta",
"Ciénaga",
"Fundación"
]

};

const departamento = document.getElementById("departamento");
const municipio = document.getElementById("municipio");

for (let dep in datos) {

let option = document.createElement("option");

option.value = dep;
option.textContent = dep;

departamento.appendChild(option);

}

departamento.addEventListener("change", function(){

municipio.innerHTML = "<option value=''>Seleccione</option>";

datos[this.value].forEach(m => {

let option = document.createElement("option");

option.value = m;
option.textContent = m;

municipio.appendChild(option);

});

});