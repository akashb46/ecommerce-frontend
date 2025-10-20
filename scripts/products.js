document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("product-container");
  const cartCount = document.getElementById("cart-count");

  // Get product ID from URL
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    container.innerHTML = "<p>⚠️ No product selected.</p>";
    return;
  }

  // Fetch product data
  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(res => res.json())
    .then(product => displayProduct(product))
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p>⚠️ Failed to load product details.</p>";
    });

  // Display product details dynamically
  function displayProduct(product) {
    container.innerHTML = `
      <div class="product-images">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="product-info">
        <h2>${product.title}</h2>
        <p class="price">₹${(product.price * 83).toFixed(0)}</p>
        <p class="description">${product.description}</p>
        <button id="add-to-cart" class="btn">🛒 Add to Cart</button>
      </div>
    `;

    document.getElementById("add-to-cart").addEventListener("click", () => {
      addToCart(product);
    });
  }

  // Add product to localStorage cart
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

  // Update the cart icon count
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
  }

  updateCartCount();
});
document.addEventListener("DOMContentLoaded", async () => {
  const productsContainer = document.getElementById("products-grid");

  if (!productsContainer) return;

  try {
    // Fetch products (replace with your API or JSON)
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();

    products.forEach(product => {
      // Create product card
      const card = document.createElement("div");
      card.classList.add("product-card");

      // Use <picture> for responsive WebP images
      const picture = document.createElement("picture");

      // WebP source for modern browsers
      const webpSource = document.createElement("source");
      webpSource.type = "image/webp";
      webpSource.srcset = `
        images/${product.id}-small.webp 480w,
        images/${product.id}-medium.webp 768w,
        images/${product.id}-large.webp 1200w
      `;
      webpSource.sizes = "(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px";

      // Fallback <img> for older browsers
      const img = document.createElement("img");
      img.src = `images/${product.id}-medium.webp`; // default
      img.alt = product.title;
      img.loading = "lazy"; // native lazy loading
      img.dataset.src = `images/${product.id}-medium.webp`; // for JS lazy loading

      picture.appendChild(webpSource);
      picture.appendChild(img);

      // Product title
      const title = document.createElement("h3");
      title.textContent = product.title;

      // Product price
      const price = document.createElement("p");
      price.textContent = `$${product.price}`;

      // Add all elements to card
      card.appendChild(picture);
      card.appendChild(title);
      card.appendChild(price);

      // Append card to grid
      productsContainer.appendChild(card);
    });

    // ===== JS Lazy Loading for older browsers =====
    const lazyImages = document.querySelectorAll("img[data-src]");
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          obs.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => observer.observe(img));

  } catch (error) {
    console.error("Error loading products:", error);
    productsContainer.innerHTML = "<p>Failed to load products. Please try again later.</p>";
  }
});
