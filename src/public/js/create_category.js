const categoryForm = document.getElementById("category-form");
const backArrow = document.querySelector(".back-arrow-div");

backArrow.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.replace("/category");
});

