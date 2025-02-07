document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      try {
        const response = await axios.post(
          "/auth/login",
          { email, password },
          { withCredentials: true }
        );
        alert("login successful");
        window.location.replace("/");
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401 && error.response.data.expired) {
            alert("Session expired. Please log in again.");
          } else {
            alert(
              error.response.data.message || "Login failed. Please try again."
            );
          }
        } else if (error.request) {
          alert("No response from server. Please check your network.");
        } else {
          alert("An error occurred. Please try again.");
        }
      }
    });
  }
});
