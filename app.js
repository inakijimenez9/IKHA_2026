let datos = [];

fetch("data/plazak.json")
.then(r => r.json())
.then(data => {

    datos = data;

    cargarFiltro("f-th","TH");
    cargarFiltro("f-centro","NOMBRE_CENTRO");
    cargarFiltro("f-nivel","NIVEL");
    cargarFiltro("f-descnivel","DESCRIPCION_NIVEL");
    cargarFiltro("f-asignatura","DESC_ASIGNATURA");
    cargarFiltro("f-preceptividad","PRECEPTIVIDAD");

    renderizar(data);

});
function cargarFiltro(id,campo){

    const valores =
    [...new Set(datos.map(x => x[campo]))]
    .sort();

    const sel = document.getElementById(id);

    valores.forEach(v=>{

        const op=document.createElement("option");

        op.value=v;
        op.text=v;

        sel.appendChild(op);

    });

    new Choices(sel,{
        removeItemButton:true
    });

}

function renderizar(rows){

let html="<table>";

html+=`
<tr>
<th>Plaza</th>
<th>TH</th>
<th>Municipio</th>
<th>Centro</th>
<th>Nivel</th>
<th>Asignatura</th>
<th>Perfil</th>
<th>Situación</th>
</tr>
`;

rows.forEach(r=>{

html+=`
<tr>
<td>${r.NUM_PLAZA}</td>
<td>${r.TH}</td>
<td>${r.MUNICIPIO}</td>
<td>${r.NOMBRE_CENTRO}</td>
<td>${r.DESCRIPCION_NIVEL}</td>
<td>${r.DESC_ASIGNATURA}</td>
<td>${r.DESC_PERFIL}</td>
<td>${r.SITUACION_VACANTE}</td>
</tr>
`;

});

html+="</table>";

document.getElementById("resultados").innerHTML=html;

}
