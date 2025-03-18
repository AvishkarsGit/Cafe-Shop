const editForm = document.getElementById("category-edit-form");
const backArrow = document.querySelector(".back-arrow-div");

const editBtn = document.getElementById("edit-category");

backArrow.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.replace("/category");
});

async function editCategory(e, id) {
  e.preventDefault();
  const formData = new FormData(editForm);

  const categoryData = {
    category: formData.get("category"),
    categoryImgUrl: formData.get("categoryImgUrl"),
  };


  try {
    const response = await axios.post(`/category/edit/${id}`, categoryData, {
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
}
