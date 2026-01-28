document.addEventListener('DOMContentLoaded', () => {
    const msg = sessionStorage.getItem('notifierMsg');
    if (msg) {
        const { tipo, titulo, mensaje, icono } = JSON.parse(msg);
        notifier.show(titulo, mensaje, tipo, icono, 5000);
        sessionStorage.removeItem('notifierMsg');
    }
});

const mascotasFormulario = document.getElementById("frmMascotas");
const mascotasFormularioEditar = document.querySelectorAll(".frmEditarMascota")

// Reestructurado usando promesas asincronas:

async function reiniciarTabla() {
    const response = await fetch("/listarMascotas/");
    const contenido = await response.text();

    document.getElementById("contenedorMascotas").innerHTML = contenido;
};

async function recargar(mensaje, tipo = 'success') {
    sessionStorage.setItem('notifierMsg', JSON.stringify({
        tipo: tipo,
        titulo: tipo === 'success' ? 'Todo Bien' : 'Error',
        mensaje: mensaje,
        icono: tipo === 'success'
            ? '/static/img/notification/ok-48.png'
            : '/static/img/notification/high_priority-48.png'
    }));
    location.reload();
}

async function guardarMascotas(e) {
    e.preventDefault();

    const formData = new FormData(mascotasFormulario);

    try {
        const response = await fetch("/guardarMascotas/", {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: formData
        })

        const data = await response.json();

        if (!data.tabien) {
            notifier.show(
                'Error',
                data.mensaje,
                'error',
                '/static/img/notification/high_priority-48.png',
                5000
            );
            return;
        }
        notifier.show(
            'Todo Bien',
            data.mensaje,
            'success',
            '/static/img/notification/ok-48.png',
            5000
        );
        mascotasFormulario.reset(); // Limpio formulario papáaaaaaa
        document.getElementById("btnClose").click();
        reiniciarTabla();
    } catch (e) {
        notifier.show(
            'Error',
            e,
            'error',
            '/static/img/notification/high_priority-48.png',
            5000
        );
    }
};

async function modificarMascotas(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await fetch("/modificarMascotas/", {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: formData
        });

        const data = await response.json();
        if (!data.tabien) {
            notifier.show(
                'Error',
                data.mensaje,
                'error',
                '/static/img/notification/high_priority-48.png',
                5000
            );
            return;
        }
        notifier.show(
            'Todo Bien',
            data.mensaje,
            'success',
            '/static/img/notification/ok-48.png',
            5000
        );
        form.reset();
        const btnCerrar = form.closest(".modal-content").querySelector(".btnCloseEditar");
        if (btnCerrar) btnCerrar.click();
        reiniciarTabla();
        recargar(data.mensaje, data.tabien ? 'success' : 'error');
    } catch (e) {
        notifier.show(
            'Error',
            e,
            'error',
            '/static/img/notification/high_priority-48.png',
            5000
        );
    }
};

async function eliminarMascota(event, id) {
    event.preventDefault();
    Swal.fire({
        title: "Esta seguro de borrar esta mascota?",
        text: "Esta accion es permanente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, borrar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await fetch(`/eliminarMascota/${id}`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCookie("csrftoken")
                }
            });
            const data = await response.json();
            try {
                if (!data.tabien) {
                    notifier.show(
                        'Error',
                        data.mensaje,
                        'error',
                        '/static/img/notification/high_priority-48.png',
                        5000
                    );
                    return;
                };
                notifier.show(
                    'Exito',
                    data.mensaje,
                    'success',
                    '/static/img/notification/ok-48.png',
                    3000
                );
                reiniciarTabla();
            } catch (e) {
                console.error(err);
                notifier.show(
                    'Error',
                    e,
                    'error',
                    '/static/img/notification/high_priority-48.png',
                    5000
                );
            };
        }
    });
}

mascotasFormulario.addEventListener("submit", guardarMascotas);

document.querySelectorAll(".frmEditarMascota").forEach(form => {
    form.addEventListener("submit", modificarMascotas);
});
