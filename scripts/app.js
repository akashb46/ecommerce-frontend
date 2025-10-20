document.addEventListener("DOMContentLoaded", async () => {
  const productGrid = document.getElementById("product-grid");
  const cartCount = document.getElementById("cart-count");

  if (!productGrid) {
    console.error("❌ Product grid not found!");
    return;
  }

  try {
    // Fetch all products
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();

    productGrid.innerHTML = ""; // Clear existing content

    // Display each product
    products.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      card.innerHTML = `
        <a href="product.html?id=${product.id}" class="product-link">
          <img 
            src="${product.image}" 
            alt="${product.title}" 
            loading="lazy" 
            width="200"
          />
          <h3>${product.title.slice(0, 25)}...</h3>
          <p class="price">₹${(product.price * 83).toFixed(0)}</p>
        </a>
        <button class="btn add-to-cart">Add to Cart</button>
      `;

      // Handle "Add to Cart"
      card.querySelector(".add-to-cart").addEventListener("click", (e) => {
        e.preventDefault(); // Stop link from triggering
        addToCart(product);
      });

      productGrid.appendChild(card);
    });

    // Update cart badge when page loads
    updateCartCount();

  } catch (error) {
    console.error("⚠️ Error loading products:", error);
    productGrid.innerHTML = `<p>⚠️ Failed to load products. Please try again later.</p>`;
  }

  // === CART FUNCTIONS ===

  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("✅ Product added to cart!");
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
      cartCount.textContent = total;
    }
  }
});
