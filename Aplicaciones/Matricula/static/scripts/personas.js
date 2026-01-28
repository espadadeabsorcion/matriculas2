document.addEventListener('DOMContentLoaded', () => {
    const msg = sessionStorage.getItem('notifierMsg');
    if (msg) {
        const { tipo, titulo, mensaje, icono } = JSON.parse(msg);
        notifier.show(titulo, mensaje, tipo, icono, 5000);
        sessionStorage.removeItem('notifierMsg');
    }
});

async function reiniciarTabla() {
    const response = await fetch("/listarPersonas/");
    const contenido = await response.text();

    document.getElementById("contenedorPersonas").innerHTML = contenido;
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

const personasFormulario = document.getElementById("frmPersonas");
const personasFormularioEditar = document.querySelectorAll(".frmEditarPersona");

async function guardarPersonas(e) {
    e.preventDefault();

    const formData = new FormData(personasFormulario);

    try {
        const response = await fetch("/guardarPersonas/", {
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
        personasFormulario.reset();
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
}

async function modificarPersonas(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form); // Aqui selecciono todo los formularios pilas

    try {
        const response = await fetch("/modificarPersonas/", {
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
}

async function eliminarPersona(event, id) {
    event.preventDefault();
    Swal.fire({
        title: "Esta seguro de borrar esta persona?",
        text: "Esta accion es permanente",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, borrar"
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await fetch(`/eliminarPersona/${id}`, {
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

personasFormulario.addEventListener("submit", guardarPersonas);

document.querySelectorAll(".frmEditarPersona").forEach(form => {
    form.addEventListener("submit", modificarPersonas);
});