fetch(`productos.json`)
  .then(response => {
    if (!response.ok) {
      throw new Error('No se puede cargar el archivo JSON.')
    }
    return response.json()
  })
  .then(data => {
    productos = data
    renderizarProductos(productos, carrito)
  })
  .catch(error => {
    console.error('Hubo un problema al cargar el archivo JSON', error)
  })

let carritoRecuperado = localStorage.getItem("carrito")
let carrito = carritoRecuperado ? JSON.parse(carritoRecuperado) : []

// Renderizar productos
function renderizarProductos(productos, carrito) {
  let contenedor = document.getElementById("contenedorProd")
  contenedor.innerHTML = ""

  productos.forEach(producto => {
    let tarjeta = document.createElement("div")
    tarjeta.className = "tarjeta"
    tarjeta.innerHTML = `<img src=./assets/${producto.rutaImagen}>
      <h4>${producto.nombre}</h4>
      <p>Precio: $${producto.precio}</p>
      <p>Stock: ${producto.stock}</p>
      <button id=${producto.id}>Agregar al carrito</button>
      `
    contenedor.appendChild(tarjeta)

    let botonAgregarAlCarrito = document.getElementById(producto.id)
    botonAgregarAlCarrito.addEventListener("click", (e) => agregarProductoAlCarrito(producto, carrito))
  })
}

// Sumar productos al carrito
function agregarProductoAlCarrito(producto, carrito) {
  let productoEnCarrito = carrito.find(item => item.id === producto.id)

  if (producto.stock > 0) {
    if (productoEnCarrito) {
      productoEnCarrito.cantidad++
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        rutaImagen: producto.rutaImagen
      })
    }
    producto.stock--
    localStorage.setItem("carrito", JSON.stringify(carrito))
    tostada()
  } else {
    Swal.fire({
      title: 'Error en su compra',
      text: 'No hay más stock del producto seleccionado',
      icon: 'error'
    })
  }

  renderizarCarrito(carrito)
}

// Renderizar el carrito
function renderizarCarrito(carrito) {
  let divCarrito = document.getElementById("carrito")
  divCarrito.innerHTML = ""

  let precioTotal = 0

  carrito.forEach(item => {
    let tarjetaCarrito = document.createElement("div")
    tarjetaCarrito.className = "div-carrito"
    tarjetaCarrito.innerHTML = `
    <div class="texto-producto"><p>${item.nombre}</p>
    <p>Precio: $${item.precio}</p>
    <p>Cantidad: ${item.cantidad}</p>
    <p>Subtotal: $${item.precio * item.cantidad}</p>
    </div>
    <div class="imagen-producto">
    <img src="./assets/${item.rutaImagen}"  alt="${item.nombre}">
    </div>
    `
    divCarrito.appendChild(tarjetaCarrito)

    precioTotal += item.precio * item.cantidad
  })

  if (precioTotal != 0) {
    let botonPagar = document.createElement("div")
    botonPagar.innerHTML = `<p class="precio-total">Total de la compra: $${precioTotal}</p>`
    divCarrito.appendChild(botonPagar)

    let boton = document.createElement("button")
    boton.innerHTML = "Finalizar Compra"
    boton.addEventListener("click", realizarCompra)
    divCarrito.appendChild(boton)
  }
  else {
        // Carrito vacío
        let mensajeCarritoVacio = document.createElement("div")
        mensajeCarritoVacio.innerHTML = `<p class="carrito-vacio">Carrito vacío</p>`
        divCarrito.appendChild(mensajeCarritoVacio)
      }
}


function realizarCompra(carrito) {
  localStorage.removeItem("carrito")
  carrito = [];
  renderizarCarrito(carrito)
  Swal.fire({
    title: 'Compra realizada con éxito',
    text: 'Gracias por visitarnos',
    icon: 'success'
  })
  verOcultarCarrito()
  renderizarProductos(productos, carrito)
}

// funcion para filtrar productos
function filtrar() {
  let buscador = document.getElementById("buscador").value.toLowerCase()
  let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(buscador))
  renderizarProductos(productosFiltrados, carrito)
}

// botón para buscar y reiniciar busqueda
let buscar = document.getElementById("buscar")
buscar.addEventListener("click", () => filtrar(productos))

let buscador = document.getElementById("buscador")
buscador.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    filtrar()
  }
})

let resetearBusqueda = document.getElementById("resetearBusqueda")
resetearBusqueda.addEventListener("click", reiniciarListaProductos)

function reiniciarListaProductos() {
  renderizarProductos(productos, carrito)
  document.getElementById("buscador").value = ""
}

renderizarProductos(carrito)

let botonVerOcultar = document.getElementById("verOcultar")
botonVerOcultar.addEventListener("click", verOcultarCarrito)

function verOcultarCarrito() {
  let carrito = document.getElementById("carrito")
  let contenedorProd = document.getElementById("contenedorProd")
  carrito.classList.toggle("oculta")
  contenedorProd.classList.toggle("oculta")
}

function tostada() {
  Toastify({
    text: "Producto agregado al carrito",
    duration: 2000,
    destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: false,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "#ebebeb",
      color: "#333",
    },
    onClick: function () { }
  }).showToast()
}