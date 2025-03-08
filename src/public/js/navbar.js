const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const menusBtn = document.getElementById("menus");
const orderBtn = document.getElementById("orders");
const cartBtn = document.getElementById("cart");
const profileBtn = document.getElementById("profile");
const productBtn = document.getElementById("add-product");
const categoryBtn = document.getElementById("add-category");
 
checkRoutes = () => {
  const currentPath = window.location.pathname;
  switch (currentPath) {
    case "/":
      menusBtn.style.backgroundColor = "rgba(228, 25, 89, 0.847)";
      menusBtn.style.color = "white";
      break;
    case "/orders":
      orderBtn.style.backgroundColor = "rgba(228, 25, 89, 0.847)";
      orderBtn.style.color = "white";
      break;
    case "/cart":
      cartBtn.style.backgroundColor = "rgba(228, 25, 89, 0.847)";
      cartBtn.style.color = "white";
      break;
    case "/profile":
      profileBtn.style.backgroundColor = "rgba(228, 25, 89, 0.847)";
      profileBtn.style.color = "white";
      break;
    case "/auth/reset/password":
      changePasswordBtn.style.backgroundColor = "rgba(228, 25, 89, 0.847)";
      changePasswordBtn.style.color = "white";
      break;
    case "/auth/login":
      loginBtn.style.backgroundColor = "rgba(228, 25, 89, 0.847)";
      loginBtn.style.color = "white";
      break;
    case "/auth/register":
      signupBtn.style.backgroundColor = "rgba(228, 25, 89, 0.847)";
      signupBtn.style.color = "white";
      break;
    case "/auth/verify":
      profileBtn.style.backgroundColor = "rgba(228, 25, 89, 0.847)";
      profileBtn.style.color = "white";
      break;
    case "/products/create":
      productBtn.style.backgroundColor = "rgba(228, 25, 89, 0.847)";
      productBtn.style.color = "white";
      break;
    case "/category":
      categoryBtn.style.backgroundColor = "rgba(228, 25, 89, 0.847)";
      categoryBtn.style.color = "white";
      break;
    case "/category/create":
      categoryBtn.style.backgroundColor = "rgba(228, 25, 89, 0.847)";
      categoryBtn.style.color = "white";
      break;
    case "/category/edit/:id":
      categoryBtn.style.backgroundColor = "rgba(228, 25, 89, 0.847)";
      categoryBtn.style.color = "white";
      break;
    default:
      break;
  }
};

if (loginBtn) {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    location.replace("/auth/login");
  });
}

if (signupBtn) {
  // signup
  signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    location.replace("/auth/register");
  });
}

if (logoutBtn) {
  // logout
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/logout", {
        withCredentials: true,
      });
      if (response.data.success) {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      // showErrorAlert(error.response.data.message);
    }
  });
}

if (menusBtn) {
  menusBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    location.replace("/");
  });
}

if (orderBtn) {
  orderBtn.addEventListener("click", (e) => {
    e.preventDefault();
    location.assign("/orders");
  });
}

if (profileBtn) {
  profileBtn.addEventListener("click", (e) => {
    e.preventDefault();
    location.assign("/profile");
  });
}

if (productBtn) {
  productBtn.addEventListener("click", (e) => {
    e.preventDefault();
    location.assign("/products/create");
  });
}

if (categoryBtn) {
  categoryBtn.addEventListener("click", (e) => {
    e.preventDefault();
    location.assign("/category");
  });
}

checkRoutes();
