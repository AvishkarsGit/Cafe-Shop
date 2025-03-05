const productForm = document.getElementById("product-form");
const addBtn = document.getElementById("add-btn");
const select = document.getElementById("categorySelect");

appendCategories(select);

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);

  const selectedValue = select.value;

  const productData = {
    ProductName: formData.get("ProductName"),
    ProductPrice: formData.get("ProductPrice"),
    Description: formData.get("Description"),
    imgUrl: formData.get("imgUrl"),
    category: selectedValue,
  };

  if (productData.ProductName.trim() === "") {
    showErrorAlert("Enter product name");
    return;
  }
  if (productData.ProductPrice.trim() === "") {
    showErrorAlert("Enter product price");
    return;
  }
  if (productData.Description.trim() === "") {
    showErrorAlert("Enter product description");
    return;
  }
  if (productData.imgUrl.trim() === "") {
    showErrorAlert("Enter product img url");
    return;
  }
  if (
    selectedValue.trim() === "" ||
    selectedValue.trim() === "Select Category"
  ) {
    showErrorAlert("Choose one category for product");
    return;
  }
  try {
    const response = await axios.post("/products/create", productData, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.data.success) {
      showSuccessAlert(response.data.message, "Please wait...");
      setTimeout(() => {
        window.location.replace("/");
      }, 5000);
    }
  } catch (error) {
    showErrorAlert(error.response.data.message);
  }
});

function appendCategories(select) {
  try {
    axios
      .get("/category/categories")
      .then((response) => {
        const categories = response.data.categories;
        for (let category of categories) {
          const option = document.createElement("option");
          option.value = category.category;
          option.textContent = category.category;
          select.appendChild(option);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
}
