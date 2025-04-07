const btnAdd = document.querySelectorAll(".btn-add");

fetchCartItems();

btnAdd.forEach((button) => {
  button.addEventListener("click", async function (e) {
    e.preventDefault();

    button.disabled = true;
    button.classList.add("bg-gray-400");
    const productId = e.target.id;

    await addToCart(productId, button);
  });
});

async function addToCart(productId, button) {
  try {
    const response = await axios.post(
      "/cart/add",
      { productId },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Ensures cookies are sent if using authentication
      }
    );

    if (response.data.success) {
      showSuccessAlert(response.data.message);
      socket.emit("cart-count", response.data.count);
      setTimeout(() => {
        showQtyDiv(button);
      }, 5000);
    }
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";
    showErrorAlert(message);
  }
}

function showQtyDiv(button, quantity = 1) {
  button.style.display = "none";

  const parent = button.closest("div");
  const qtyDiv = parent.querySelector(".qty-div");

  if (qtyDiv) {
    qtyDiv.style.display = "flex";

    const qtySpan = qtyDiv.querySelector("#qty");
    const plusBtn = qtyDiv.querySelector(".qty-add");
    const minusBtn = qtyDiv.querySelector(".qty-minus");

    qtySpan.innerText = quantity; // Show actual quantity

    // Remove existing event listeners to avoid multiple bindings
    plusBtn.replaceWith(plusBtn.cloneNode(true));
    minusBtn.replaceWith(minusBtn.cloneNode(true));

    const newPlusBtn = qtyDiv.querySelector(".qty-add");
    const newMinusBtn = qtyDiv.querySelector(".qty-minus");

    newPlusBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      const productId = e.target.id;
      await addQty(qtySpan, productId);
    });

    newMinusBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      const productId = e.target.id;
      await minusQty(qtySpan, qtyDiv, button, productId);
    });
  }
}

async function addQty(qtySpan, productId) {
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
      const card = qtySpan.closest(".flex.items-center.justify-between");
      const priceSpan = card.querySelector("#ProductPrice");
      priceSpan.innerText = `₹ ${updatedPrice}.00`;
    }
  } catch (error) {
    showErrorAlert(error.response.data.message);
  }
}

async function minusQty(qtySpan, qtyDiv, button, productId) {
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
      const card = qtySpan.closest(".flex.items-center.justify-between");
      const priceSpan = card.querySelector("#ProductPrice");
      priceSpan.innerText = `₹ ${updatedPrice}.00`;
    } else {
      socket.emit("cart-count", response.data.count);
      qtyDiv.style.display = "none";

      button.disabled = false;
      button.classList.add("bg-[var(--color-primary)]");
      button.style.display = "block";
    }
  } catch (error) {
    showErrorAlert(error.response.data.message);
  }
}

async function fetchCartItems() {
  try {
    const response = await axios.get("/cart/fetch");

    if (response.data.success) {
      const cartItems = response.data.cartItems;

      btnAdd.forEach((button) => {
        const productId = button.id;
        const cartItem = cartItems.find((item) => item.productId === productId);

        if (cartItem) {
          // ✅ Use actual quantity from backend
          showQtyDiv(button, cartItem.quantity);
        }
      });
    } else {
      console.log(response.data.message);
    }
  } catch (error) {
    showErrorAlert(error.response.data.message);
  }
}
