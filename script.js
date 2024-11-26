const foodItemsData = {
    "main-canteen": [
        { img: "https://www.awesomecuisine.com/wp-content/uploads/2018/07/cabbage_manchurian_dry.jpg", name: "Manchuria", price: 35 },
        { img: "https://domesticgothess.com/wp-content/uploads/2021/06/vegetable-fried-rice.jpg", name: "Fried Rice", price: 50 }
    ],
    juice: [
        { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT78_eas4bKLWbtP8bH2ryrD43hW63IIo_PGQ&s", name: "Orange Juice", price: 25 },
        { img: "https://www.crazyvegankitchen.com/wp-content/uploads/2023/06/mango-juice-recipe.jpg", name: "Mango Juice", price: 30 }
    ],
    chaat: [
        { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVxMDZ89fmuKlbqzOdXvFvhLA89V4J_klI3Q&s", name: "Pani Puri", price: 20 },
        { img: "https://www.awesomecuisine.com/wp-content/uploads/2007/11/bhel-puri.jpg", name: "Bhel Puri", price: 25 }
    ]
};

let cart = []; // Global cart array to store selected items

document.getElementById("user-icon").addEventListener("click", () => {
    const dropdown = document.getElementById("logout-dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});

function logout() {
    alert("Logged out!");
    // Implement logout logic here
}

// Display food items for the selected category
function showItems(category) {
    const foodItemsContainer = document.getElementById("food-items");
    foodItemsContainer.innerHTML = ""; // Clear previous items

    const items = foodItemsData[category];
    items.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("food-item");

        const cartItem = cart.find(cartItem => cartItem.name === item.name);
        const quantity = cartItem ? cartItem.quantity : 0; // Match cart quantity if exists

        itemElement.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.price}/-</p>
            <div class="quantity">
                <button onclick="updateQuantity(this, -1, '${item.name}')">-</button>
                <span>${quantity}</span>
                <button onclick="updateQuantity(this, 1, '${item.name}')">+</button>
            </div>
        `;

        foodItemsContainer.appendChild(itemElement);
    });
}

// Update quantity in the main item list
function updateQuantity(button, change, itemName) {
    const quantitySpan = button.parentElement.querySelector("span");
    let quantity = parseInt(quantitySpan.textContent);
    quantity = Math.max(0, quantity + change); // Allow zero
    quantitySpan.textContent = quantity;

    // Update the cart with the new quantity
    const category = Object.keys(foodItemsData).find(cat =>
        foodItemsData[cat].some(item => item.name === itemName)
    );
    const selectedItem = foodItemsData[category].find(item => item.name === itemName);

    const existingItem = cart.find(item => item.name === itemName);
    if (quantity > 0) {
        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            cart.push({ ...selectedItem, quantity });
        }
    } else {
        cart = cart.filter(item => item.name !== itemName);
    }
}

// Gather selected items and show them in the cart popup
function addSelectedItemsToCart() {
    if (cart.length > 0) {
        showCartPopup();
    } else {
        alert("No items selected to add to the cart.");
    }
}

// Display the cart popup
function showCartPopup() {
    const popup = document.getElementById("cart-popup");
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ""; // Clear previous items

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartRow = document.createElement("div");
        cartRow.classList.add("cart-item");

        cartRow.innerHTML = `
            <div class="cart-item-left">
                <img src="${item.img}" alt="${item.name}">
                <p>${item.name}</p>
            </div>
            <div class="cart-item-right">
                <div class="quantity">
                    <button onclick="updateCartQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity('${item.name}', 1)">+</button>
                </div>
                <p>${itemTotal}/-</p>
            </div>
        `;

        cartItemsContainer.appendChild(cartRow);
    });

    const handlingCharges = 10;
    const total = subtotal + handlingCharges;

    document.getElementById("subtotal").textContent = `${subtotal}/-`;
    document.getElementById("handling-charges").textContent = `${handlingCharges}/-`;
    document.getElementById("total").textContent = `${total}/-`;

    popup.style.display = "block"; // Show the popup
}

// Update quantity in the cart popup and sync with the main list
function updateCartQuantity(itemName, change) {
    const cartItem = cart.find(item => item.name === itemName);
    if (cartItem) {
        cartItem.quantity = Math.max(0, cartItem.quantity + change); // Allow zero
        if (cartItem.quantity === 0) {
            cart = cart.filter(item => item.name !== itemName);
        }
    }

    // Update the main list to reflect changes in the cart
    const foodItems = document.querySelectorAll(".food-item");
    foodItems.forEach(foodItem => {
        const itemTitle = foodItem.querySelector("h3").textContent;
        if (itemTitle === itemName) {
            const quantitySpan = foodItem.querySelector(".quantity span");
            const updatedQuantity = cart.find(item => item.name === itemTitle)?.quantity || 0;
            quantitySpan.textContent = updatedQuantity;
        }
    });

    showCartPopup(); // Update the popup
}

// Close the cart popup
function closeCartPopup() {
    document.getElementById("cart-popup").style.display = "none";
}

// Proceed to payment
function payNow() {
    alert("Proceeding to payment...");
    // Add payment logic here
}
