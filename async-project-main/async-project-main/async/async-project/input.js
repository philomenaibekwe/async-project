let navLinks = document.getElementById("navLinks")

   function showMenu(){
    navLinks.style.right ="0";
   }
   function hideMenu(){
    navLinks.style.right="-200px";
   }
   
let products = [];
let cart = [];
const listProducts = document.getElementById('products');
const listCarts = document.getElementById('carts');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total')
const cartLink = document.getElementById('cart-link');
const cartContainer = document.getElementById('cart');
const closeCartButton = document.getElementById('close-cart-button');
const cartAside = document.getElementById('cart');
const closeButton = document.getElementsByClassName('close-button')[0];
const listProductsLink = document.getElementById('list-products'); // Get the Product link
const sortSelect = document.getElementById('sort-select');
const limitSelect = document.getElementById('limit-select');
const applyFiltersButton = document.getElementById('apply-filters');
const adminForm = document.getElementById('admin-product-form');
const addProductButton = document.getElementById('add-product');
const updateProductButton = document.getElementById('update-product');
const deleteProductButton = document.getElementById('delete-product');

const getProductItems = async () => {
    const response = await fetch('https://fakestoreapi.com/products');
    const productData = await response.json();
    products = productData;
    displayProducts(products);
};
const getAllCarts = async () => {
        const response = await fetch('https://fakestoreapi.com/carts');
        const cartsData = await response.json();
        displayCarts(cartsData);
};

const displayProducts = (productsToDisplay) => {
    listProducts.innerHTML = ''; // Clear existing content
    productsToDisplay.forEach((item) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';

        const title = document.createElement('h2');
        title.innerText = item.title;

        const price = document.createElement('p');
        price.innerText = `$${item.price}`;

        const image = document.createElement('img');
        image.src = item.image;
        image.alt = item.title;

        const addToCartButton = document.createElement('button');
        addToCartButton.innerText = 'Add to Cart';
        addToCartButton.addEventListener('click', () => addToCart(item));
        
        const viewDetailsButton = document.createElement('button');
        viewDetailsButton.innerText = 'View Details';
        viewDetailsButton.addEventListener('click', () => showProductDetails(item));

        productDiv.appendChild(title);
        productDiv.appendChild(price);
        productDiv.appendChild(image);
        productDiv.appendChild(addToCartButton);
        productDiv.appendChild(viewDetailsButton);

        listProducts.appendChild(productDiv);
    });
};
const displayCarts = (carts) => {
    listCarts.innerHTML = ''; // Clear any existing content
    carts.forEach((cart) => {
        const cartDiv = document.createElement('div');
        cartDiv.className = 'cart';

        const cartId = document.createElement('h2');
        cartId.innerText = `Cart ID: ${cart.id}`;

        const userId = document.createElement('p');
        userId.innerText = `User ID: ${cart.userId}`;

        const date = document.createElement('p');
        date.innerText = `Date: ${new Date(cart.date).toLocaleDateString()}`;

        const productsList = document.createElement('ul');
        cart.products.forEach((product) => {
            const productItem = document.createElement('li');
            productItem.innerText = `Product ID: ${product.productId}, Quantity: ${product.quantity}`;
            productsList.appendChild(productItem);
        });

        cartDiv.appendChild(cartId);
        cartDiv.appendChild(userId);
        cartDiv.appendChild(date);
        cartDiv.appendChild(productsList);

        listCarts.appendChild(cartDiv);
    });
}; 
const addToCart = (product) => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    displayCartItems();
    modal.style.display = 'none';
};

const removeFromCart = (productId) => {
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        if (existingProduct.quantity > 1) {
            existingProduct.quantity--;
        } else {
            cart = cart.filter(item => item.id !== productId);
        }
    }
    displayCartItems();
};

const calculateTotal = () => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    alert(`Total cost: $${total.toFixed(2)}`);
    // You can also display this in the UI instead of using an alert
};
const displayCartItems = () => {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `
            ${item.title} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
        total += item.price * item.quantity;
    });
    cartTotal.innerText = total.toFixed(2);
};
const sendOrderToAdmin = async () => {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before placing an order.");
        return;
    }

    const orderDetails = {
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    };

    try {
        const response = await fetch('https://example.com/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderDetails),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        alert(`Order placed successfully! Order ID: ${result.orderId}`);
        cart = []; // Clear the cart after sending the order
        displayCartItems(); // Update UI
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('Your order has been placed!');
    }
};

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

cartLink.addEventListener('click', (event) => {
    event.preventDefault();
    cartContainer.style.display = 'block';
 });

closeCartButton.addEventListener('click', () => {
    cartContainer.style.display = 'none';
});

cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    cartAside.classList.toggle('visible');
});

const checkoutButton = document.createElement('button');
checkoutButton.innerText = 'Checkout';
checkoutButton.addEventListener('click', async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/carts', {
            method: 'POST',
            body: JSON.stringify({
                userId: 1, // This would typically be dynamic based on the logged-in user
                date: new Date(),
                products: cart.map((item) => ({
                    productId: item.id,
                    quantity: 1 // Assuming quantity is 1 for simplicity
                }))
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        console.log('Order placed:', result);
        alert('Order placed successfully!');
        cart = []; // Clear cart after checkout
        displayCartItems();
    } catch (error) {
        console.error('Error during checkout:', error);
    }
});
cartItemsContainer.appendChild(checkoutButton);
const userList = document.getElementById('user-list');
const getAllUsers = async () => {
        const response = await fetch('https://fakestoreapi.com/users');
        const users = await response.json();
        displayUsers(users);
};

const displayUsers = (users) => {
    userList.innerHTML = '';
    users.forEach((user) => {
        const userItem = document.createElement('li');
        userItem.innerText = `${user.username} (${user.email})`;

        const deleteUserButton = document.createElement('button');
        deleteUserButton.innerText = 'Delete';
        deleteUserButton.addEventListener('click', () => deleteUser(user.id));

        userItem.appendChild(deleteUserButton);
        userList.appendChild(userItem);
    });
};

const deleteUser = async (userId) => {
    try {
        const response = await fetch(`https://fakestoreapi.com/users/${userId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        console.log('User deleted:', result);
        alert('User deleted successfully!');
        getAllUsers(); // Refresh user list
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

// Initially fetch and display all users
getAllUsers();

listProductsLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    displayProducts(products); // Display all products
});

document.getElementById('search-input').addEventListener('input', () => {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(item => 
        item.title.toLowerCase().includes(searchQuery)
    );
    displayProducts(filteredProducts);
});

document.getElementById('electronics').addEventListener('click', () => {
    const filteredProducts = products.filter(item => item.category === 'electronics');
    displayProducts(filteredProducts);
});

document.getElementById('jewelry').addEventListener('click', () => {
    const filteredProducts = products.filter(item => item.category === 'jewelery');
    displayProducts(filteredProducts);
});

document.getElementById('menC').addEventListener('click', () => {
    const filteredProducts = products.filter(item => item.category === "men's clothing");
    displayProducts(filteredProducts);
});

document.getElementById('womenC').addEventListener('click', () => {
    const filteredProducts = products.filter(item => item.category === "women's clothing");
    displayProducts(filteredProducts);
});
getProductItems();

getAllCarts();

// Sorting function
const sortProducts = (productsToSort, criterion) => {
    return productsToSort.sort((a, b) => {
        if (criterion === 'price-asc') {
            return a.price - b.price;
        } else if (criterion === 'price-desc') {
            return b.price - a.price;
        } else if (criterion === 'name-asc') {
            return a.title.localeCompare(b.title);
        } else if (criterion === 'name-desc') {
            return b.title.localeCompare(a.title);
        }
        return 0;
    });
};

// Function to limit the number of products displayed
const limitProducts = (productsToLimit, limit) => {
    return productsToLimit.slice(0, limit);
};

// Apply filters and display products
applyFiltersButton.addEventListener('click', () => {
    let filteredProducts = [...products];

    // Apply sorting
    const sortValue = sortSelect.value;
    filteredProducts = sortProducts(filteredProducts, sortValue);

    // Apply limiting
    const limitValue = parseInt(limitSelect.value, 10);
    if (!isNaN(limitValue) && limitValue > 0) {
        filteredProducts = limitProducts(filteredProducts, limitValue);
    }

    displayProducts(filteredProducts);
});

const showProductDetails = (product) => {
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalPrice = document.getElementById('modal-price');

    modalTitle.innerText = product.title;
    modalImage.src = product.image;
    modalImage.alt = product.title;
    modalDescription.innerText = product.description;
    modalPrice.innerText = `Price: $${product.price}`;

    modal.style.display = 'block';

    const closeModal = () => {
        modal.style.display = 'none';
    };

    document.querySelector('.close-button').addEventListener('click', closeModal);
    document.getElementById('add-to-cart-button').addEventListener('click', () => addToCart(product));
};

const userLoginLink = document.getElementById('user-login'); // Get the User Login link

userLoginLink.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default link behavior
    
    const username = prompt("Enter your username:", "mor_2314");
    const password = prompt("Enter your password:", "83r5^_");
    
    if (username && password) {
        try {
            const response = await fetch('https://fakestoreapi.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            if (!response.ok) {
                throw new Error('Login failed: ' + response.statusText);
            }
            const jsonResponse = await response.json();
            console.log(jsonResponse);

            if (jsonResponse.token) {
                alert("Login successful!");
                // Optionally, store the token in localStorage or sessionStorage
                localStorage.setItem('authToken', jsonResponse.token);
                // Update UI to reflect login status
                userLoginLink.innerText = "Logout";
                userLoginLink.addEventListener('click', logoutUser);
            } else {
                alert("Login failed! Please check your credentials.");
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert("An error occurred during login. Please try again later.");
        }
    } else {
        alert("Username and password cannot be empty!");
    }
});

function logoutUser(e) {
    e.preventDefault();
    localStorage.removeItem('authToken');
    alert("You have been logged out.");
    userLoginLink.innerText = "User Login";
    userLoginLink.removeEventListener('click', logoutUser);
    userLoginLink.addEventListener('click', loginUser);
}

function loginUser(e) {
    e.preventDefault();
    // The original login logic here
}

// Reattach the login event listener on page load if the user is not logged in
if (!localStorage.getItem('authToken')) {
    userLoginLink.addEventListener('click', loginUser);
} else {
    userLoginLink.innerText = "Logout";
    userLoginLink.addEventListener('click', logoutUser);
}

adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productId = document.getElementById('product-id').value;
    const productTitle = document.getElementById('product-title').value;
    const productPrice = document.getElementById('product-price').value;
    const productCategory = document.getElementById('product-category').value;
    const productImage = document.getElementById('product-image').value;
    const productDescription = document.getElementById('product-description').value;

    if (productId) {
        updateProduct(productId, productTitle, productPrice, productCategory, productImage, productDescription);
    } else {
        addProduct(productTitle, productPrice, productCategory, productImage, productDescription);
    }
});

deleteProductButton.addEventListener('click', () => {
    const productId = document.getElementById('product-id').value;
    if (productId) {
        deleteProduct(productId);
    }
});

const addProduct = async (title, price, category, image, description) => {
    try {
        const response = await fetch('https://fakestoreapi.com/products', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                price: price,
                category: category,
                image: image,
                description: description
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const product = await response.json();
        console.log('Product added:', product);
        alert('Product added successfully!');
        getAllProducts(); // Refresh the product list
    } catch (error) {
        console.error('Error adding product:', error);
    }
};

const updateProduct = async (id, title, price, category, image, description) => {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: title,
                price: price,
                category: category,
                image: image,
                description: description
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const updatedProduct = await response.json();
        console.log('Product updated:', updatedProduct);
        alert('Product updated successfully!');
        getAllProducts(); // Refresh the product list
    } catch (error) {
        console.error('Error updating product:', error);
    }
};

const deleteProduct = async (id) => {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        console.log('Product deleted:', result);
        alert('Product deleted successfully!');
        getAllProducts(); // Refresh the product list
    } catch (error) {
        console.error('Error deleting product:', error);
    }
};

// Example: Prepopulate form with product data for editing
const editProduct = (product) => {
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-title').value = product.title;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-description').value = product.description;

    addProductButton.style.display = 'none';
    updateProductButton.style.display = 'inline';
    deleteProductButton.style.display = 'inline';
};

// Use `editProduct(product)` to populate the form when an admin selects a product to edit.
