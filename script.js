const formulario = document.getElementById('form-tarea');

formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const estado = document.getElementById('estado').value;
    const data = {
        nombre: nombre,
        estado: estado
    };

    try {
        const response = await fetch('http://localhost/tareas/tareas.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            cargarTareas();
            document.getElementById('nombre').value = '';
            document.getElementById('estado').value = '';
        } else {
            throw new Error('Error en la solicitud');
        }
    } catch (error) {
        console.error(error);
    }
});

const cargarTareas = async () => {
    try {
        const response = await fetch('http://localhost/tareas/tareas.php', {
            method: 'GET',
        });
        const data = await response.json();

        const tareaList = document.getElementById('tarea-list');
        tareaList.innerHTML = '';
        data.forEach(tarea => {
            tareaList.innerHTML += `
                <tr>
                    <td>${tarea.id}</td>
                    <td class="tarea-nombre">${tarea.nombre}</td>
                    <td class="tarea-estado">${tarea.estado}</td>
                    <td>
                        <button class="btn btn-danger eliminar-btn">Eliminar</button>
                        <button class="btn btn-warning editar-btn">Editar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error(error);
    }
};

// Mostrar el modal de edición
const mostrarFormularioEdicion = (id, nombre, estado) => {
    const modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));
    modalEditar.show();

    // Llenar el formulario de edición con los datos actuales
    document.getElementById('editar-id').value = id;
    document.getElementById('editar-nombre').value = nombre;
    document.getElementById('editar-estado').value = estado;
};

// Agregar manejador de eventos para mostrar el modal de edición cuando se hace clic en "Editar"
document.querySelector('#tarea-list').addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('editar-btn')) {
        const row = target.closest('tr');
        const id = row.querySelector('td').textContent;
        const nombre = row.querySelector('.tarea-nombre').textContent;
        const estado = row.querySelector('.tarea-estado').textContent;

        mostrarFormularioEdicion(id, nombre, estado);
    } else if (target.classList.contains('eliminar-btn')) {
        const row = target.closest('tr');
        const id = row.querySelector('td').textContent;
        eliminarTarea(id);
    }
});

// Agregar manejador de eventos para guardar los cambios desde el modal de edición
document.getElementById('guardarCambios').addEventListener('click', async () => {
    const id = document.getElementById('editar-id').value;
    const nombre = document.getElementById('editar-nombre').value;
    const estado = document.getElementById('editar-estado').value;

    editarTarea(id, nombre, estado);

    // Cerrar el modal de edición
    const modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));
    modalEditar.hide();
});

const editarTarea = async (id, nombre, estado) => {
    const data = {
        id: id,
        nombre: nombre,
        estado: estado
    };

    try {
        const response = await fetch(`http://localhost/tareas/tareas.php?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data), // Pasa los datos en el cuerpo de la solicitud como JSON
        });

        if (response.ok) {
            cargarTareas();
        } else {
            throw new Error('Error en la solicitud PUT');
        }
    } catch (error) {
        console.error(error);
    }
};

const eliminarTarea = async (id) => {
    try {
        const data = {
            id: id
        };

        const response = await fetch(`http://localhost/tareas/tareas.php?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            //body: JSON.stringify(data), // Pasa los datos en el cuerpo de la solicitud como JSON
        });

        if (response.ok) {
            cargarTareas();
        } else {
            throw new Error('Error en la solicitud DELETE');
        }
    } catch (error) {
        console.error(error);
    }
};

// Cargar tareas al cargar la página
window.addEventListener('load', () => {
    cargarTareas();
});