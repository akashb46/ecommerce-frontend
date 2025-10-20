document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id")); // Convert to number

  const detailContainer = document.getElementById("product-container");
  const relatedContainer = document.getElementById("related-products-grid");

  try {
    // Fetch all products
    const res = await fetch("https://fakestoreapi.com/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    const products = await res.json();

    // Find selected product
    const product = products.find(p => p.id === productId);
    if (!product) {
      detailContainer.innerHTML = "<p>Product not found.</p>";
      return;
    }

    // Display selected product with placeholders for zoom, variations, quantity
    detailContainer.innerHTML = `
      <div class="product-images">
        <img id="productImage" src="${product.image}" alt="${product.title}">
        <div id="zoomLens"></div>
      </div>
      <div class="product-info">
        <h2 id="productTitle">${product.title}</h2>
        <p class="price" id="productPrice">₹${(product.price * 83).toFixed(0)}</p>
        <p class="description" id="productDescription">${product.description}</p>

        <div class="product-variations">
          <label for="size">Size:</label>
          <select id="size">
            <option value="S">S</option>
            <option value="M" selected>M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>

          <label for="color">Color:</label>
          <select id="color">
            <option value="Red">Red</option>
            <option value="Blue" selected>Blue</option>
            <option value="Black">Black</option>
          </select>
        </div>

        <div class="quantity-selector">
          <button id="decrease">−</button>
          <span id="quantity">1</span>
          <button id="increase">+</button>
        </div>
        <p>Total: ₹<span id="total-price">${(product.price * 83).toFixed(0)}</span></p>

        <button class="btn" id="add-to-cart">🛒 Add to Cart</button>
      </div>
    `;

    // Quantity Selector
    let quantity = 1;
    const price = product.price * 83;
    const quantityEl = document.getElementById("quantity");
    const totalEl = document.getElementById("total-price");

    function updateTotal() {
      totalEl.textContent = (price * quantity).toFixed(0);
    }

    document.getElementById("increase").addEventListener("click", () => {
      if (quantity < 10) quantity++;
      quantityEl.textContent = quantity;
      updateTotal();
    });

    document.getElementById("decrease").addEventListener("click", () => {
      if (quantity > 1) quantity--;
      quantityEl.textContent = quantity;
      updateTotal();
    });

    updateTotal();

    // Add to Cart
    const sizeSelect = document.getElementById("size");
    const colorSelect = document.getElementById("color");

    document.getElementById("add-to-cart").addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const selectedSize = sizeSelect.value;
      const selectedColor = colorSelect.value;

      const existing = cart.find(
        item => item.id === product.id && item.size === selectedSize && item.color === selectedColor
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.push({ ...product, quantity: quantity, size: selectedSize, color: selectedColor });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert("✅ Product added to cart!");
    });

    // Zoom Lens
    const img = document.getElementById("productImage");
    const lens = document.getElementById("zoomLens");
    const result = document.getElementById("zoomResult");

    if (img) {
      img.addEventListener("mousemove", moveLens);
      img.addEventListener("mouseenter", () => { lens.style.display = "block"; result.style.display = "block"; });
      img.addEventListener("mouseleave", () => { lens.style.display = "none"; result.style.display = "none"; });

      function moveLens(e) {
        const pos = img.getBoundingClientRect();
        let x = e.clientX - pos.left - lens.offsetWidth / 2;
        let y = e.clientY - pos.top - lens.offsetHeight / 2;

        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > img.width - lens.offsetWidth) x = img.width - lens.offsetWidth;
        if (y > img.height - lens.offsetHeight) y = img.height - lens.offsetHeight;

        lens.style.left = x + "px";
        lens.style.top = y + "px";

        const fx = result.offsetWidth / lens.offsetWidth;
        const fy = result.offsetHeight / lens.offsetHeight;
        result.style.backgroundImage = `url(${img.src})`;
        result.style.backgroundSize = `${img.width * fx}px ${img.height * fy}px`;
        result.style.backgroundPosition = `-${x * fx}px -${y * fy}px`;
      }
    }

    // Show related products (max 4)
    const relatedProducts = products.filter(p => p.id !== productId).slice(0, 4);
    relatedContainer.innerHTML = "";

    relatedProducts.forEach(p => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}">
        <h4>${p.title.length > 25 ? p.title.slice(0, 25) + "..." : p.title}</h4>
        <p>₹${(p.price * 83).toFixed(0)}</p>
        <a href="product.html?id=${p.id}" class="btn">View Details</a>
      `;
      relatedContainer.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    detailContainer.innerHTML = "<p>⚠️ Failed to load product details.</p>";
  }
});
const img = document.getElementById("productImage");
const zoomLens = document.getElementById("zoomLens");
const zoomResult = document.getElementById("zoomResult");

if (img && zoomLens && zoomResult) {
  if ('ontouchstart' in window) {
    zoomLens.style.display = 'none';
    zoomResult.style.display = 'none';
  } else {
    img.addEventListener("mousemove", moveLens);
    img.addEventListener("mouseenter", () => { 
      zoomLens.style.display = "block"; 
      zoomResult.style.display = "block"; 
    });
    img.addEventListener("mouseleave", () => { 
      zoomLens.style.display = "none"; 
      zoomResult.style.display = "none"; 
    });

    function moveLens(e) {
      const pos = img.getBoundingClientRect();
      let x = e.clientX - pos.left - zoomLens.offsetWidth / 2;
      let y = e.clientY - pos.top - zoomLens.offsetHeight / 2;

      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x > img.width - zoomLens.offsetWidth) x = img.width - zoomLens.offsetWidth;
      if (y > img.height - zoomLens.offsetHeight) y = img.height - zoomLens.offsetHeight;

      zoomLens.style.left = x + "px";
      zoomLens.style.top = y + "px";

      const fx = zoomResult.offsetWidth / zoomLens.offsetWidth;
      const fy = zoomResult.offsetHeight / zoomLens.offsetHeight;
      zoomResult.style.backgroundImage = `url(${img.src})`;
      zoomResult.style.backgroundSize = `${img.width * fx}px ${img.height * fy}px`;
      zoomResult.style.backgroundPosition = `-${x * fx}px -${y * fy}px`;
    }
  }
}
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.getElementById("cart-count");
  if (cartBadge) cartBadge.textContent = count;
}

// Call this after adding to cart
document.getElementById("add-to-cart").addEventListener("click", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const selectedSize = sizeSelect.value;
  const selectedColor = colorSelect.value;
  const existing = cart.find(item => item.id === product.id && item.size === selectedSize && item.color === selectedColor);

  if (existing) existing.quantity += quantity;
  else cart.push({ ...product, quantity, size: selectedSize, color: selectedColor });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("✅ Product added to cart!");
});

// Initialize count on page load
updateCartCount();
