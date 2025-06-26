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
                    <button class="btn btn-outline-primary" onclick="AbrirModalEditar('${producto.id}', '${producto.nombre}', '${producto.descuento}', '${producto.stock}', '${producto.precio}')">Editar</button>
                    <button class="btn btn-outline-danger" onclick="EliminarProducto(${producto.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
}
// Ejecuta el método al cargar el script.
// Asegúrate de que 'ObtenerProductos' esté definido en algún lugar de tu código.
ObtenerProductos();

// Proceso para agregar un nuevo producto

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

//Agregar nuevo integrante desde el formulario        //Para que este metodo se ejecute cuando el formulario tenga un submit
document.getElementById("fmAgregar").addEventListener("submit", async e => {
    e.preventDefault(); //Esto representa a "submit" y evita que el formulario se envie de un solo.

    //Capturar los valores del formulario
    const Producto = document.getElementById("txtProducto").value.trim();
    const Stock = document.getElementById("txtStock").value.trim();
    const Precio = document.getElementById("txtPrecio").value.trim();
    const Descuento = document.getElementById("txtDescuento").value.trim();

    //Validación basica
    if (!Producto || !Descuento || !Stock || !Precio) {
        alert("Ingrese los valores necesarios");
    }

    //Llamar a la API para enviar el registro
    const respuesta = await fetch(API_URL, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Producto, Descuento, Stock, Precio })
    }); //fetch: Es para llamar a la api || await por si se tarda

    //Verificar si la API responde que los datos fueron enviados correctamente
    if (respuesta.ok) {
        //Limpiar el formulario
        document.getElementById("fmAgregar").reset();

        //Cerrar el modal (dialog)
        modalAgregar.close();

        Swal.fire({
            title: "El registro fue agregado",
            icon: "success",
            draggable: true
        });

        //Recargar la tabla
        ObtenerIntegrantes();
    } else {
        Swal.fire({
            title: "El registro no fue agregado",
            icon: "error",
            draggable: true
        });
    }
});


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