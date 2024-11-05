
const baseURL = "https://3000-idx-apibd-1729303596730.cluster-f4iwdviaqvc2ct6pgytzw4xqy4.cloudworkstations.dev";
const token = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Mjk5MDkwNjAsImlkIjoiYTQwOWQwMjQtYmJjYi00MjRhLWExZDAtMDIwM2FhOWRkNjVkIn0.zPszizbmGFU5Gr1XKSIkh0McM2HE2nATr-frY0YUU5HsMFyLByIbCROCoYF3yHQUS1SDHo_vGA569QDYgQhdAw"

// Función para cargar las tarjetas
function cargarTarjetas() {
    fetch(`${baseURL}/tarjeta`, {
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(res => {
        const lista = document.getElementById("lista");
        lista.innerHTML = ''; 
        res.forEach(tarjeta => {
            const html = `
                <div class="card" style="width: 18rem; margin: 10px">
                    <img src="${tarjeta.images}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${tarjeta.title}</h5>
                        <p class="card-text">${tarjeta.description}</p>
                        <p style="color: red;">${tarjeta.value}</p>
                        <p><strong>Categoría:</strong> ${tarjeta.categoria_nombre || 'Sin categoría'}</p>
                        <button type="button" onclick="eliminar(${tarjeta.tarj_id})" class="btn btn-danger">Eliminar</button>
                        <button type="button" onclick="editForm(${tarjeta.tarj_id}, '${tarjeta.title}', '${tarjeta.description}', '${tarjeta.value}', '${tarjeta.images}', ${tarjeta.categoria_id})" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal-edit">Editar</button>
                    </div>
                </div>`;
            lista.innerHTML += html; 
        });
    })
    .catch(error => console.error('Error al cargar las tarjetas:', error));
}


// Llama a la función al cargar la página
document.addEventListener("DOMContentLoaded", cargarTarjetas);

// Función para enviar el formulario de creación de producto
function sendForm() {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const value = document.getElementById("value");
  const image = document.getElementById("image");
  const categoriaId = document.getElementById("categoria"); // Obtener ID de la categoría


  const body = {
      title: title.value,
      description: description.value,
      value: value.value,
      images: [image.value],
      categoria_id: categoriaId.value,
  };

  fetch(`${baseURL}/tarjeta`, {
      method: "POST",
      headers: {
          "Authorization": token,
          "Content-type": "application/json"
      },
      body: JSON.stringify(body)
  })
  .then(res => res.json())
  .then(res => {
      title.value = "";
      description.value = "";
      value.value = "";
      image.value = "";
      location.reload();
  });
}

// Función para eliminar producto
function eliminar(tarj_id) {
    fetch(`${baseURL}/tarjeta/${tarj_id}`, {
        method: "DELETE",
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(res => {
        location.reload();
    });
}

// Función para llenar el formulario de edición de producto
function editForm(id, title, description, value, image, categoriaId) {
    idedit = id;
    document.getElementById("title-edit").value = title;
    document.getElementById("description-edit").value = description;
    document.getElementById("value-edit").value = value;
    document.getElementById("image-edit").value = image;

    // Asignar la categoría seleccionada en el select de edición
    const categoriaSelectEdit = document.getElementById("categoria-edit");
    categoriaSelectEdit.value = categoriaId; 
}


// Función para guardar los cambios en el producto editado
function saveedit() {
    const title = document.getElementById("title-edit");
    const description = document.getElementById("description-edit");
    const value = document.getElementById("value-edit");
    const image = document.getElementById("image-edit");
    const categoriaId = document.getElementById("categoria-edit").value; // Obtener ID de la categoría

    const body = {
        title: title.value,
        description: description.value,
        value: value.value,
        images: [image.value],
        categoria_id: categoriaId // Incluir ID de la categoría
    };

    fetch(`${baseURL}/tarjeta/${idedit}`, {
        method: "PUT",
        headers: {
            "Authorization": token,
            "Content-type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(res => {
        title.value = "";
        description.value = "";
        value.value = "";
        image.value = "";
        location.reload(); // Recargar para mostrar los cambios
    })
    .catch(error => console.error('Error al actualizar la tarjeta:', error));
}


// Función para agregar una nueva categoría
function agregarCategoria() {
    const nombreCategoria = document.getElementById("nombreCategoria").value;

    const body = {
        nombre: nombreCategoria,
    };

    fetch(`${baseURL}/categoria`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(res => {
        document.getElementById("nombreCategoria").value = ""; // Limpiar el input
        mostrarCategorias(); // Actualizar la lista de categorías
    });
}

// Función para eliminar una categoría
function eliminarCategoria(id) {
    fetch(`${baseURL}/categoria/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(res => {
        mostrarCategorias(); // Actualizar la lista de categorías
    });
}

// Función para llenar el formulario de edición de categoría
function editCategoriaForm(id, nombre) {
    document.getElementById("nombreCategoriaEditar").value = nombre;
    document.getElementById("modalCategoriaEditar").setAttribute("data-id", id);
}

// Función para guardar los cambios en la categoría editada
function guardarCategoriaEditada() {
    const id = document.getElementById("modalCategoriaEditar").getAttribute("data-id");
    const nombre = document.getElementById("nombreCategoriaEditar").value;

    const body = {
        nombre: nombre,
    };

    fetch(`${baseURL}/categoria/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": token,
            "Content-type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(res => {
        document.getElementById("nombreCategoriaEditar").value = ""; // Limpiar el input
        mostrarCategorias(); // Actualizar la lista de categorías
    });
}

// Función para mostrar categorías en la interfaz
function mostrarCategorias() {
    fetch(`${baseURL}/categoria`, {
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(categorias => {
        const categoriaContainer = document.getElementById("categorias");
        categoriaContainer.innerHTML = ""; // Limpiar contenedor antes de renderizar
        categorias.forEach(categoria => {
            const div = document.createElement("div");
            div.classList.add("card");
            div.style.width = "12rem";
            div.style.margin = "10px";
            div.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${categoria.nombre}</h5>
                    <button type="button" class="btn btn-danger" onclick="eliminarCategoria(${categoria.id})">Eliminar</button>
                    <button type="button" class="btn btn-primary" onclick="editCategoriaForm(${categoria.id}, '${categoria.nombre}')" data-bs-toggle="modal" data-bs-target="#modalCategoriaEditar">Editar</button>
                </div>`;
            categoriaContainer.appendChild(div);
        });
    });
}

// Llama a esta función al cargar la página para mostrar categorías
document.addEventListener("DOMContentLoaded", mostrarCategorias);

function cargarCategoriasSelect() {
    fetch(`${baseURL}/categoria`, {
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(categorias => {
        const categoriaSelect = document.getElementById("categoria");
        const categoriaSelectEdit = document.getElementById("categoria-edit");
        
        categoriaSelect.innerHTML = ""; // Limpiar las opciones actuales
        categoriaSelectEdit.innerHTML = ""; // Limpiar las opciones actuales para edición

        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.id; // Usa el ID de la categoría
            option.textContent = categoria.nombre; // Muestra el nombre de la categoría

            const optionEdit = option.cloneNode(true); // Clona la opción para el modal de edición
            categoriaSelect.appendChild(option);
            categoriaSelectEdit.appendChild(optionEdit);
        });
    });
}

// Llama a cargarCategoriasSelect() al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarCategoriasSelect();
    mostrarCategorias(); // Ya existente para mostrar categorías en la interfaz
    cargarTarjetas();    // Ya existente para mostrar tarjetas
});





