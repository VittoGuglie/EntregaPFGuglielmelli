const socket = io();

const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');

const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const codeInput = document.getElementById('code');
const stockInput = document.getElementById('stock');
const categoryInput = document.getElementById('category');
const descriptionInput = document.getElementById('description');

const deleteForm = document.getElementById('delete-Form');
const idDelete = document.getElementById('productId');

// Evento de agregar producto
productForm.addEventListener('submit', event => {
    event.preventDefault();

    const title = nameInput.value;
    const price = Number(priceInput.value);
    const code = codeInput.value;
    const stock = Number(stockInput.value);
    const category = categoryInput.value;
    const description = descriptionInput.value

    if (!title || !description || !code || !price || !stock || !category) {
        alert('Por favor, complete todos los campos obligatorios');
        return;
    }

    const product = { title, description, code, price, stock, category };

    fetch("http://localhost:8080/api/products", {
        method: 'POST',
        body: JSON.stringify(product),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo agregar el producto');
            }
        })
        .catch(error => {
            alert(error.message);
        });

    socket.emit('agregarProducto', product);

    nameInput.value = '';
    priceInput.value = '';
});

//Evento para eliminar un producto
deleteForm.addEventListener('submit', event => {
    event.preventDefault();

    fetch(`http://localhost:8080/api/products/${idDelete.value}`, {
        method: 'DELETE',
    })
    .then(res => {
        if(res.ok) {
            productList.forEach((product) => {
                const listItem = product.id;
                listItem.parentNode.removechild(listItem);
            });
        }
    })
    .catch(error => console.error(error));

    location.reload();
});

//Evento para actualizar la lista de productos
socket.on('actualizarLista', ({ product }) => {
    const productLi = document.createElement('li');
    productLi.setAttribute('id', 'product-' + product.id);
    productLi.textContent = `${product.title} - U$D${product.price}`;
    productList.appendChild(productLi);
});
