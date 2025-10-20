document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function displayCart() {
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>🛒 Your cart is empty.</p>";
      cartTotal.textContent = "0";
      updateCartCount();
      return;
    }

    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-img">
        <div class="cart-details">
          <h3>${item.title}</h3>
          <p>Price: ₹${(item.price * 83).toFixed(0)}</p>
          <div class="quantity">
            <button class="decrease" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="increase" data-index="${index}">+</button>
          </div>
          <button class="remove-btn" data-index="${index}">🗑️ Remove</button>
        </div>
      `;
      cartContainer.appendChild(div);
    });

    updateCartCount();
    updateCartTotal();
  }

  function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.quantity * (item.price * 83), 0);
    cartTotal.textContent = total.toFixed(0);
  }

  function updateCartCount() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;
  }

  cartContainer.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains("increase")) {
      cart[index].quantity += 1;
    } else if (e.target.classList.contains("decrease")) {
      cart[index].quantity = Math.max(1, cart[index].quantity - 1);
    } else if (e.target.classList.contains("remove-btn")) {
      cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
  });

  displayCart();
});
// scripts/cart.js

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
  alert("✅ Product added to cart!");
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = total;
}

// Call this on page load to refresh badge
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
});
// scripts/cart.js

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
  alert("✅ Product added to cart!");
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return; // Exit if element not found
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = total;
}

// Update badge on page load
document.addEventListener("DOMContentLoaded", updateCartCount);
// Handle increase, decrease, and remove
  cartContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("increase")) {
      const index = e.target.dataset.index;
      cart[index].quantity += 1;
      saveAndRefresh();
    }

    if (e.target.classList.contains("decrease")) {
      const index = e.target.dataset.index;
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1);
      }
      saveAndRefresh();
    }

    if (e.target.classList.contains("remove-btn")) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      saveAndRefresh();
    }
  });

  // Save and refresh
  function saveAndRefresh() {
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
  }

  // Checkout redirection
  checkoutBtn.addEventListener("click", () => {
    if (cart.length > 0) {
      window.location.href = "checkout.html";
    }
  });

  // Initialize cart
  displayCart();
  document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.querySelector(".checkout-btn");
  // ...
});
checkoutBtn.addEventListener("click", () => {
  if (cart.length > 0) {
    window.location.href = "checkout.html";
  }
});

