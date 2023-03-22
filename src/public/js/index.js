const socket = io();

const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');

fetch('/productos.json')
    .then(response => response.json())
    .then(data => {
        products = data;
    })
    .catch(error => console.error(error));

productForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = nameInput.value;
    const price = priceInput.value;
    const product = { name, price };

    socket.emit('agregarProducto', product);

    nameInput.value = '';
    priceInput.value = '';
});

socket.on('actualizarLista', ({ product, status }) => {
    if (status === 1) {
        const listItem = document.createElement('li');

        listItem.textContent = `${product.name} - U$D${product.price}`;

        listItem.setAttribute('data-product-id', product.id);

        productList.appendChild(listItem);
    } else {
        console.error('Ha ocurrido un error al agregar el producto.');
    }
});

socket.on('eliminarProducto', ({ id }) => {
    const index = products.findIndex(producto => producto.id === id);
    if (index !== -1) {
        products.splice(index, 1);
    }
});

socket.on('actualizarListaDeProductos', (products) => {
    productList.innerHTML = products.map(product => `
    <li data-product-id="${product.id}">
        ${product.name} - U$D${product.price}
    </li>`).join('');
});