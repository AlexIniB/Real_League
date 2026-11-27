// ==========================================================
// REAL LEAGUE - Animación 3D con el scroll
// ==========================================================

(function () {

    // ----- Elementos del DOM -----
    const raiz = document.documentElement;
    const contenedorScroll = document.getElementById("contenedorScroll");
    const botonesSeccion = document.querySelectorAll(".boton-seccion");
    const textoFinal = document.getElementById("textoFinal");

    // Para no ejecutar la función demasiadas veces seguidas
    let esperandoFrame = false;

    // Limita un número entre un mínimo y un máximo
    function limitar(valor, minimo, maximo) {
        return Math.max(minimo, Math.min(maximo, valor));
    }

    // Función principal: se llama cada vez que se hace scroll o se cambia el tamaño
    function actualizarEscena() {
        const posicion = contenedorScroll.getBoundingClientRect();
        const scrollTotal = contenedorScroll.offsetHeight - window.innerHeight;

        // progreso va de 0 (arriba del todo) a 1 (final del scroll)
        const progreso = limitar(-posicion.top / scrollTotal, 0, 1);

        // Suavizado de la curva para que el giro empiece y termine despacio
        const progresoSuave = progreso * progreso * (3 - 2 * progreso);

        // El campo se va inclinando hasta quedar como una mesa en 3D
        // En móvil/tablet vertical inclinamos menos para que no se amontonen los iconos
        const esVertical = window.matchMedia("(orientation: portrait) and (max-width: 1024px)").matches;
        const inclinacionMaxima = esVertical ? 50 : 61;
        const inclinacion = progresoSuave * inclinacionMaxima;
        const elevacion = -progreso * 7;
        const zoom = 1 + progresoSuave * 0.13;

        // Pasamos los valores al CSS mediante variables
        raiz.style.setProperty("--progreso", progreso.toFixed(4));
        raiz.style.setProperty("--inclinacion", inclinacion.toFixed(2) + "deg");
        raiz.style.setProperty("--elevacion", elevacion.toFixed(1) + "px");
        raiz.style.setProperty("--zoom", zoom.toFixed(3));

        // El logo se levanta del césped en la primera parte del scroll
        const levantar = limitar((progreso - 0.04) / 0.5, 0, 1);
        const levantarSuave = levantar * levantar * (3 - 2 * levantar);
        raiz.style.setProperty("--levantar", levantarSuave.toFixed(4));

        // Los botones empiezan a aparecer a partir del 22% del scroll
        const aparicion = limitar((progreso - 0.22) / 0.48, 0, 1);

        botonesSeccion.forEach(function (boton, i) {
            // Cada botón sale un poco después que el anterior
            const retraso = limitar((aparicion - i * 0.055) / 0.78, 0, 1);

            boton.style.opacity = retraso.toFixed(3);

            // Los botones se levantan del césped hasta quedar de pie
            boton.style.transform =
                "translateZ(" + (8 + retraso * 18) + "px) " +
                "translateY(" + ((1 - retraso) * 8) + "px) " +
                "rotateX(-90deg) " +
                "scale(" + (0.58 + retraso * 0.42) + ")";
        });

        // El texto final aparece cuando queda poco para terminar
        textoFinal.style.opacity = limitar((progreso - 0.76) / 0.18, 0, 1).toFixed(3);

        esperandoFrame = false;
    }

    // Evento scroll (usamos requestAnimationFrame para que vaya fluido)
    window.addEventListener("scroll", function () {
        if (!esperandoFrame) {
            requestAnimationFrame(actualizarEscena);
            esperandoFrame = true;
        }
    }, { passive: true });

    window.addEventListener("resize", actualizarEscena);

    // Primera ejecución al cargar la página
    actualizarEscena();

})();
