document.addEventListener("DOMContentLoaded", () => {
  const orderContainer = document.getElementById("order-items");
  const orderTotal = document.getElementById("order-total");
  const checkoutForm = document.getElementById("checkout-form");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Show order summary
  function displayOrder() {
    orderContainer.innerHTML = "";

    if (cart.length === 0) {
      orderContainer.innerHTML = "<p>Your cart is empty.</p>";
      orderTotal.textContent = "0";
      checkoutForm.querySelector(".confirm-btn").disabled = true;
      return;
    }

    let total = 0;
    cart.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("order-item");
      div.innerHTML = `
        <p><strong>${item.title}</strong> (${item.quantity} × ₹${(item.price * 83).toFixed(0)})</p>
      `;
      orderContainer.appendChild(div);
      total += item.quantity * (item.price * 83);
    });

    orderTotal.textContent = total.toFixed(0);
  }

  // Handle form submit
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const payment = document.getElementById("payment").value;

    if (!name || !email || !address || !payment) {
      alert("Please fill out all fields.");
      return;
    }

    // Save order or simulate confirmation
    alert(`✅ Thank you, ${name}! Your order has been placed successfully.`);
    localStorage.removeItem("cart");
    window.location.href = "index.html";
  });

  displayOrder();
});
