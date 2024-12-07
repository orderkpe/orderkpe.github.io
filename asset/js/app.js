// Inisialisasi Telegram Web App
const tg = window.Telegram.WebApp;

tg.expand(); // Memperluas aplikasi untuk layar penuh
tg.onEvent('mainButtonClicked', () => {
    // Event ketika tombol utama Telegram diklik
    checkout();
});

const cart = [];
const menuItems = [
    { id: 1, name: "Burger", price: 50000, image: "images/burger.jpg" },
    { id: 2, name: "Pizza", price: 75000, image: "images/pizza.jpg" },
    { id: 3, name: "French Fries", price: 30000, image: "images/fries.jpg" },
    { id: 4, name: "Cola", price: 15000, image: "images/cola.jpg" },
];

// Display menu
function displayMenu() {
    const menuContainer = document.getElementById("menu-items");
    menuContainer.innerHTML = "";

    menuItems.forEach(item => {
        const menuItem = document.createElement("div");
        menuItem.classList.add("menu-item");

        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>Rp${item.price}</p>
            <button onclick="addToCart(${item.id})">Add to Cart</button>
        `;

        menuContainer.appendChild(menuItem);
    });
}

// Display cart
function displayCart() {
    const cartContainer = document.getElementById("cart-items");
    const totalPriceContainer = document.getElementById("total-price");

    cartContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>Rp${item.price}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;

        cartContainer.appendChild(cartItem);
        total += item.price;
    });

    totalPriceContainer.textContent = `Total: Rp${total}`;

    // Update main button in Telegram Web App
    if (cart.length > 0) {
        tg.MainButton.setText(`Checkout Rp${total}`);
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

function addToCart(itemId) {
    const item = menuItems.find(menuItem => menuItem.id === itemId);
    if (item) cart.push(item);
    displayCart();
}

function removeFromCart(itemId) {
    const index = cart.findIndex(cartItem => cartItem.id === itemId);
    if (index > -1) cart.splice(index, 1);
    displayCart();
}

async function checkout() {
    const ngrokUrl = "https://your-ngrok-url.ngrok.io"; // Replace with actual ngrok URL
    const response = await fetch(`${ngrokUrl}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart),
    });

    if (response.ok) {
        tg.MainButton.hide();
        tg.close(); // Tutup aplikasi setelah checkout
    } else {
        alert("Failed to checkout!");
    }
}

// Initialize menu display
displayMenu();
