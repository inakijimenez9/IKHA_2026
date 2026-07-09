let datos = [];

let choices = {};

const filtros = {
    "f-th": "TH",
    "f-centro": "NOMBRE_CENTRO",
    "f-nivel": "NIVEL",
    "f-descnivel": "DESCRIPCION_NIVEL",
    "f-asignatura": "DESC_ASIGNATURA",
    "f-preceptividad": "PRECEPTIVIDAD"
};

fetch("data/plazak.json")
    .then(r => r.json())
    .then(data => {

        datos = data;

        inicializarFiltros();

        actualizar();

    });

function inicializarFiltros() {

    Object.entries(filtros).forEach(([id, campo]) => {

        const valores = obtenerValoresUnicos(datos, campo);

        const select = document.getElementById(id);

        valores.forEach(v => {

            const option = document.createElement("option");
            option.value = v;
            option.textContent = v;

            select.appendChild(option);

        });

        choices[id] = new Choices(select, {
            removeItemButton: true,
            searchEnabled: true,
            shouldSort: true,
            itemSelectText: ''
        });

        select.addEventListener("change", actualizar);

    });

}

function obtenerValoresUnicos(array, campo) {

    return [...new Set(
        array
            .map(r => r[campo])
            .filter(v => v !== null && v !== undefined && v !== "")
    )].sort();

}

function getSelectedValues(id) {

    return choices[id]
        .getValue(true)
        .filter(v => v !== "");

}

function aplicarFiltros() {

    return datos.filter(r => {

        return Object.entries(filtros).every(([id, campo]) => {

            const seleccionados = getSelectedValues(id);

            if (seleccionados.length === 0) return true;

            return seleccionados.includes(String(r[campo]));

        });

    });

}

function actualizar() {

    const filtrados = aplicarFiltros();

    actualizarOpciones();

    renderizar(filtrados);

}

function actualizarOpciones() {

    Object.entries(filtros).forEach(([idActual, campoActual]) => {

        const seleccionActual = getSelectedValues(idActual);

        let registrosValidos = datos.filter(r => {

            return Object.entries(filtros).every(([id, campo]) => {

                if (id === idActual) return true;

                const seleccionados = getSelectedValues(id);

                if (seleccionados.length === 0) return true;

                return seleccionados.includes(String(r[campo]));

            });

        });

        const opcionesValidas = obtenerValoresUnicos(
            registrosValidos,
            campoActual
        );

        choices[idActual].clearChoices();

        choices[idActual].setChoices(
            opcionesValidas.map(v => ({
                value: String(v),
                label: String(v),
                selected: seleccionActual.includes(String(v))
            })),
            'value',
            'label',
            true
        );

    });

}

function renderizar(rows) {

    let html = `
    <p><strong>${rows.length}</strong> resultados encontrados</p>

    <table>
        <thead>
            <tr>
                <th>Plaza</th>
                <th>TH</th>
                <th>Municipio</th>
                <th>Centro</th>
                <th>Nivel</th>
                <th>Asignatura</th>
                <th>Perfil</th>
                <th>Preceptividad</th>
                <th>Situación</th>
            </tr>
        </thead>
        <tbody>
    `;

    rows.forEach(r => {

        html += `
        <tr>
            <td>${r.NUM_PLAZA || ""}</td>
            <td>${r.TH || ""}</td>
            <td>${r.MUNICIPIO || ""}</td>
            <td>${r.NOMBRE_CENTRO || ""}</td>
            <td>${r.DESCRIPCION_NIVEL || ""}</td>
            <td>${r.DESC_ASIGNATURA || ""}</td>
            <td>${r.DESC_PERFIL || ""}</td>
            <td>${r.PRECEPTIVIDAD || ""}</td>
            <td>${r.SITUACION_VACANTE || ""}</td>
        </tr>
        `;

    });

    html += `
        </tbody>
    </table>
    `;

    document.getElementById("resultados").innerHTML = html;

}