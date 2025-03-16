const categoryAddBtn = document.getElementById("add-new-category");

categoryAddBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.replace("/category/create");
});

async function appendCategory() {
  const response = await fetch("/category/categories");
  const data = await response.json();
  const categories = data.categories;

  for (let item of categories) {
    addCategoriesUI(item.category, item._id, item.categoryImgUrl);
  }
}

appendCategory();

function addCategoriesUI(category, id, imgUrl) {
  const categoryRow = document.createElement("div");
  const subContainer = document.querySelector(".sub-container");

  categoryRow.className = "category-row";
  categoryRow.innerHTML = `
      <img src='${imgUrl}' alt="category" class="categoryImg"/>
      <p class="category-name" id='${id}'>${category}</p>
            <div class="category-icons">
            <i class="ri-edit-box-line edit" id="${id}"></i>
            <i class="ri-delete-bin-6-line delete" id="${id}"></i>
            </div>
      `;
  subContainer.appendChild(categoryRow);
  const edits = categoryRow.querySelectorAll(".edit");
  const deletes = categoryRow.querySelectorAll(".delete");
  edits.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = e.target.id;
      window.location.replace(`/category/edit/${id}`);
    });
  });

  deletes.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = e.target.id;
      try {
        const response = await axios.delete(`/category/delete/${id}`);

        if (response.data.success) {
          showSuccessAlert(response.data.message, "Please wait");
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      } catch (error) {
        showErrorAlert(error.response.data.message);
      }
    });
  });
}
