// ==========================================================
// REAL LEAGUE - Página de clasificación
// ==========================================================

// Mientras no tengamos los escudos reales usamos uno de ejemplo.
// Para poner el real solo hay que cambiar la ruta de cada equipo.
const ESCUDO_EJEMPLO = "img/escudos/escudo-ejemplo.svg";

// ----- DATOS (más adelante podrían venir de una base de datos) -----
const equipos = [
    { nombre: "Jugones",         escudo: ESCUDO_EJEMPLO, pg: 15, pe: 3, pp: 2,  gf: 50, gc: 23 },
    { nombre: "Inter Dóner",     escudo: ESCUDO_EJEMPLO, pg: 13, pe: 4, pp: 3,  gf: 40, gc: 27 },
    { nombre: "Octopus",         escudo: ESCUDO_EJEMPLO, pg: 10, pe: 5, pp: 5,  gf: 39, gc: 15 },
    { nombre: "Chocos",          escudo: ESCUDO_EJEMPLO, pg: 8,  pe: 7, pp: 5,  gf: 25, gc: 34 },
    { nombre: "Nottingam Presa", escudo: ESCUDO_EJEMPLO, pg: 4,  pe: 6, pp: 10, gf: 12, gc: 67 }
];

const jugadorSemana = {
    nombre: "Umar Sadiq",
    equipo: "Jugones",
    escudo: ESCUDO_EJEMPLO,
    posicion: "Delantero",
    media: 9.2,
    goles: 5,
    foto: "img/jugador-ejemplo.svg"
};

// ----- FUNCIONES DE CÁLCULO -----

// Calcula lo que se puede sacar de los datos básicos:
// partidos jugados, diferencia de goles y puntos (3 por victoria, 1 por empate)
function calcularEstadisticas(equipo) {
    return {
        ...equipo,
        pj: equipo.pg + equipo.pe + equipo.pp,
        dg: equipo.gf - equipo.gc,
        puntos: equipo.pg * 3 + equipo.pe
    };
}

// Ordena por puntos; si empatan, por diferencia de goles y luego goles a favor
function ordenarClasificacion(lista) {
    return lista.slice().sort(function (a, b) {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos;
        if (b.dg !== a.dg) return b.dg - a.dg;
        return b.gf - a.gf;
    });
}

// Añade el signo + a las diferencias positivas (+27, -9...)
function formatearDiferencia(dg) {
    return dg > 0 ? "+" + dg : String(dg);
}

// ----- FUNCIONES PARA PINTAR EN LA PÁGINA -----

function crearCelda(texto, clase) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    if (clase) celda.className = clase;
    return celda;
}

function crearCeldaEquipo(equipo) {
    const celda = document.createElement("td");
    celda.className = "col-equipo";

    const contenedor = document.createElement("div");
    contenedor.className = "celda-equipo";

    const escudo = document.createElement("img");
    escudo.src = equipo.escudo;
    escudo.alt = "";            // decorativo: el nombre ya está al lado
    escudo.width = 32;
    escudo.height = 36;

    const nombre = document.createElement("span");
    nombre.textContent = equipo.nombre.toUpperCase();

    contenedor.append(escudo, nombre);
    celda.appendChild(contenedor);
    return celda;
}

function pintarTabla() {
    const cuerpoTabla = document.getElementById("cuerpoTabla");
    const clasificacion = ordenarClasificacion(equipos.map(calcularEstadisticas));

    cuerpoTabla.innerHTML = "";

    clasificacion.forEach(function (equipo, indice) {
        const fila = document.createElement("tr");

        fila.appendChild(crearCelda(indice + 1, "col-pos"));
        fila.appendChild(crearCeldaEquipo(equipo));
        fila.appendChild(crearCelda(equipo.pj, "col-extra"));
        fila.appendChild(crearCelda(equipo.pg, "col-extra"));
        fila.appendChild(crearCelda(equipo.pe, "col-extra"));
        fila.appendChild(crearCelda(equipo.pp, "col-extra"));
        fila.appendChild(crearCelda(equipo.gf, "col-extra"));
        fila.appendChild(crearCelda(equipo.gc, "col-extra"));
        fila.appendChild(crearCelda(formatearDiferencia(equipo.dg), "col-dg"));
        fila.appendChild(crearCelda(equipo.puntos, "col-puntos"));

        cuerpoTabla.appendChild(fila);
    });
}

function pintarJugadorSemana() {
    const tarjeta = document.getElementById("tarjetaJugador");
    const j = jugadorSemana;

    tarjeta.innerHTML =
        '<img class="jugador-foto" src="' + j.foto + '" alt="Foto de ' + j.nombre + '" width="300" height="400">' +
        '<div class="jugador-info">' +
            '<h3 class="jugador-nombre">' + j.nombre.toUpperCase() + '</h3>' +
            '<p class="jugador-equipo jugador-equipo-datos"><img src="' + j.escudo + '" alt="" width="28" height="32"><span>' + j.equipo.toUpperCase() + '</span></p>' +
            '<p class="jugador-posicion">' + j.posicion.toUpperCase() + '</p>' +
            '<div class="jugador-stats">' +
                '<div class="stat"><span>MEDIA</span><span class="stat-valor">' + j.media.toFixed(1) + '</span></div>' +
                '<div class="stat"><span>GOLES</span><span class="stat-valor">' + j.goles + '</span></div>' +
            '</div>' +
        '</div>';
}

// ----- ARRANQUE -----
pintarTabla();
pintarJugadorSemana();
