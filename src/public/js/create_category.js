const categoryForm = document.getElementById("category-form");
const backArrow = document.querySelector(".back-arrow-div");

backArrow.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.replace("/category");
});

categoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(categoryForm);

  const productData = {
    category: formData.get("category"),
    categoryImgUrl: formData.get("categoryImgUrl"),
  };

  if (productData.category.trim() === "") {
    showErrorAlert("Enter category name");
    return;
  }
  try {
    const response = await axios.post("/category/create", productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.success) {
      showSuccessAlert(response.data.message);
      setTimeout(() => {
        window.location.replace("/category");
      }, 5000);
    }
  } catch (error) {
    showErrorAlert(error.response.data.message);
  }
});
