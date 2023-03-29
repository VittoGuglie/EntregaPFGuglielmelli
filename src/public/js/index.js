const socket = io();

const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const deleteForm = document.getElementById('delete-form');

// Evento de agregar producto
productForm.addEventListener('submit', event => {
    event.preventDefault();

    const name = nameInput.value;
    const price = priceInput.value;
    const product = { name, price, id: Date.now() };

    socket.emit('agregarProducto', product);

    nameInput.value = '';
    priceInput.value = '';
});

//Evento para actualizar la lista de productos
socket.on('actualizarLista', ({ product, status, productId }) => {
    console.log('product:', product);
    console.log('status:', status);
    console.log('productId:', productId);

    if (status === 1) {
        if (product && product.id) {
            const productLi = document.createElement('li');
            productLi.setAttribute('id', product.id);
            productLi.textContent = `${product.name} - U$D${product.price}`;
            productList.appendChild(productLi);
        } else {
            console.error('El objeto de producto no tiene una propiedad "id".');
        }
    } else if (productId == product.id) {
        const productLi = document.getElementById(productId);
        socket.emit('eliminarProducto', productLi);
        productLi.remove();
    } else {
        console.error('Ha ocurrido un error al agregar el producto.');
    }
});
