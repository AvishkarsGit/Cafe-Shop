const btnAdd = document.querySelectorAll(".btn-add");

btnAdd.forEach((button) => {
  button.addEventListener("click", async function (e) {
    e.preventDefault();

    const productId = e.target.id;
    console.log(productId);

    await addToCart(productId);
  });
});

async function addToCart(productId) {
  try {
    const response = await axios.post(
      "/cart/add",
      { productId },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Ensures cookies are sent if using authentication
      }
    );

    console.log(response.data);
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";
    showErrorAlert(message);
  }
}
