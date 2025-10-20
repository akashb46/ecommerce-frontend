// Example: Add to Cart Functionality
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".add-to-cart");
    buttons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const productId = e.target.dataset.id;
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push(productId);
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Product added to cart!");
        });
    });
});
