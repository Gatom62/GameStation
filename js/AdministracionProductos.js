const API_URL = "https://retoolapi.dev/5CsIhm/Productos";

//Convertimos los datos json
async function ObtenerProductos() {
    const respuesta = await fetch(API_URL);
    const data = await respuesta.json();
    MostrarDatos(data);
}

//Funcion para crear las filas de la tabla en base a un JSON
//"datos" representará al JSON donde viene la información
function MostrarDatos(datos) {
    const tabla = document.querySelector("#tabla tbody")
    tabla.innerHTML = " ";
    datos.forEach(producto => {
        tabla.innerHTML += `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.descuento}</td>
                <td>${producto.stock}</td>
                <td>${producto.precio}</td>
                <td>
                    <button class="btn btn-outline-primary" onclick="AbrirModalEditar('${producto.id}', '${producto.nombre}', '${producto.descuento}', '${producto.stock}', '${producto.precio}')" data-bs-target="#mdEditar">Editar</button>
                    <button class="btn btn-outline-danger" onclick="EliminarProducto(${producto.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}
// Ejecuta el método al cargar el script.
// Asegúrate de que 'ObtenerProductos' esté definido en algún lugar de tu código.
ObtenerProductos();

// Obtiene referencias a los elementos del DOM.
const modalAgregar = document.getElementById("mdAgregar");
const btnAbrirModalAgregar = document.getElementById("btnAgregar");
const btnCerrarModalAgregar = document.getElementById("btn_cerrar");

btnAbrirModalAgregar.addEventListener("click", () => {
    modalAgregar.showModal();
});

// Cierra el modal al hacer clic en el botón de cerrar.
btnCerrarModalAgregar.addEventListener("click", () => {
    modalAgregar.close();
});

// Cierra el modal al hacer clic fuera de él.
// Usamos 'e.target' para verificar si el clic fue directamente en el modal o en un elemento dentro de él.
modalAgregar.addEventListener('click', (e) => {
    if (e.target === modalAgregar) {
        modalAgregar.close();
    }
});

//El volado para actulazar
// Función para abrir el modal de edición con los datos del producto
function AbrirModalEditar(id, nombre, descuento, stock, precio) {
    // Asignar valores a los campos del formulario
    document.getElementById("txtIdEditar").value = id;
    document.getElementById("txtNombreEditar").value = nombre;
    document.getElementById("txtDescuentoEditar").value = descuento;
    document.getElementById("txtStockEditar").value = stock;
    document.getElementById("txtPrecioEditar").value = precio;
    
    // Mostrar el modal
    const modalEditar = new bootstrap.Modal(document.getElementById('mdEditar'));
    modalEditar.show();
}

// Función para manejar el envío del formulario de edición
document.getElementById("fmEditar").addEventListener("submit", async e => {
    e.preventDefault();
    
    // Capturar los valores del formulario
    const id = document.getElementById("txtIdEditar").value;
    const nombre = document.getElementById("txtNombreEditar").value.trim();
    const stock = document.getElementById("txtStockEditar").value.trim();
    const precio = document.getElementById("txtPrecioEditar").value.trim();
    const descuento = document.getElementById("txtDescuentoEditar").value.trim();
    
    // Validación básica
    if (!nombre || !stock || !precio) {
        Swal.fire({
            title: "Error",
            text: "Por favor complete todos los campos requeridos",
            icon: "error"
        });
        return;
    }
    
    try {
        // Llamar a la API para actualizar el registro
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, stock, precio, descuento })
        });
        
        if (respuesta.ok) {
            // Cerrar el modal
            const modalEditar = bootstrap.Modal.getInstance(document.getElementById('mdEditar'));
            modalEditar.hide();
            
            Swal.fire({
                title: "¡Éxito!",
                text: "El producto fue actualizado correctamente",
                icon: "success"
            });
            
            // Recargar la tabla
            ObtenerProductos();
        } else {
            throw new Error("Error al actualizar el producto");
        }
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error"
        });
    }
});

//Eliminar un registro
async function EliminarProducto(id) {
    const result = await Swal.fire({
        title: "¿Quieres eliminar el registro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
        try {
            const respuesta = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (respuesta.ok) {
                Swal.fire({
                    title: "Registro eliminado",
                    icon: "success"
                });

                // Recargar la tabla después de eliminar
                ObtenerProductos();
            } else {
                Swal.fire({
                    title: "El registro no fue eliminado",
                    icon: "error"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error al eliminar",
                text: error.message,
                icon: "error"
            });
        }
    }
}

//Para que sevea la imagen que el usuario aya subido
document.addEventListener("DOMContentLoaded", function () {
    const uploadInput = document.getElementById("productImageUpload");
    const productImage = document.getElementById("productImage");
    const clearBtn = document.getElementById("clearImageBtn");
    const errorElement = document.getElementById("imageError");

    // Evento al seleccionar una imagen
    uploadInput.addEventListener("change", function () {
        const file = this.files[0];
        errorElement.textContent = "";

        // Validaciones
        if (!file) return;

        if (!file.type.match('image.*')) {
            showError("¡Solo se permiten imágenes!");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showError("La imagen debe pesar menos de 2MB");
            return;
        }

        // Mostrar vista previa
        const reader = new FileReader();
        reader.onload = function (e) {
            productImage.src = e.target.result;
            productImage.style.display = "block";
        };
        reader.readAsDataURL(file);
    });

    // Botón para limpiar la imagen
    clearBtn.addEventListener("click", function () {
        uploadInput.value = "";
        productImage.src = "https://via.placeholder.com/300x200?text=Imagen+del+producto";
        errorElement.textContent = "";
    });

    function showError(message) {
        errorElement.textContent = message;
        uploadInput.classList.add("is-invalid");
        setTimeout(() => uploadInput.classList.remove("is-invalid"), 3000);
    }
});