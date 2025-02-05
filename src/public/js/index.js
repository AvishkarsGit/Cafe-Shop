const { login } = require("./AxiosApi.js");
document.querySelector("#login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log(email, password);
});
