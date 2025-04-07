const qtyMinus = document.querySelectorAll(".qty-minus");
const qtyAdd = document.querySelectorAll(".qty-add");
const checkoutBtn = document.querySelector("#checkout");

calculateTotalPrice();
qtyAdd.forEach((add) => {
  add.addEventListener("click", async (e) => {
    e.preventDefault();
    const productId = e.target.id;

    qtySpan = document.getElementById(`qty_${productId}`);
    priceSpan = document.getElementById(`price-span_${productId}`);

    await addQty(qtySpan, priceSpan, productId);
  });
});

qtyMinus.forEach((minus) => {
  minus.addEventListener("click", async (e) => {
    e.preventDefault();
    const productId = e.target.id;

    qtySpan = document.getElementById(`qty_${productId}`);
    priceSpan = document.getElementById(`price-span_${productId}`);

    await minusQty(qtySpan, priceSpan, productId);
  });
});

checkoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  calculateTotalPrice();
});

async function addQty(qtySpan, priceSpan, productId) {
  try {
    const response = await axios.post(
      "/cart/updateCart",
      { productId },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Ensures cookies are sent if using authentication
      }
    );

    if (response.data.success) {
      qtySpan.innerText = response.data.quantity;
      const updatedPrice = response.data.updatedPrice;
      priceSpan.innerText = `₹ ${updatedPrice}.00`;
    }
    calculateTotalPrice();
  } catch (error) {
    showErrorAlert(error.response.data.message);
  }
}

async function minusQty(qtySpan, priceSpan, productId) {
  try {
    const response = await axios.post(
      "/cart/removeFromCart",
      { productId },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Ensures cookies are sent if using authentication
      }
    );

    if (response.data.success) {
      if (response.data.quantity >= 1)
        qtySpan.innerText = response.data.quantity;
      const updatedPrice = response.data.updatedPrice;
      priceSpan.innerText = `₹ ${updatedPrice}.00`;
    } else {
      socket.emit("cart-count", response.data.count);
      window.location.reload();
    }
    calculateTotalPrice();
  } catch (error) {
    showErrorAlert(error.response.data.message);
  }
}

function calculateTotalPrice() {
  const totalPriceSpan = document.getElementById("total-price");
  const totalPrices = document.querySelectorAll(".price_span");
  let totalAmount = 0;
  totalPrices.forEach((price) => {
    const totalPrice = price.textContent.trim();
    const numericPrice = parseFloat(totalPrice.split("₹ ")[1]);
    totalAmount = totalAmount + numericPrice;
  });
  totalPriceSpan.innerHTML = `₹ ${totalAmount}.00`;
}
