const categoryForm = document.getElementById("category-form");
const backArrow = document.querySelector(".back-arrow-div");

backArrow.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.replace("/category");
});

categoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const categoryAddBtn = document.getElementById("save-category");

  const formData = new FormData(categoryForm);

  // const categoryData = {
  //   category: formData.get("category"),
  //   categoryImgUrl: formData.get("categoryImgUrl"),
  // };

  try {
    const response = await axios.post("/category/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.success) {
      showSuccessAlert(response.data.message, "Please wait...");
      setTimeout(() => {
        window.location.replace("/category");
      }, 5000);
    }
  } catch (error) {
    showErrorAlert(error.response.data.message);
  }
});
