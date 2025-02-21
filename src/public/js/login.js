document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const forgotBtn = document.getElementById("forgot-btn");

  if (!loginForm) {
    console.log("Form not found");
    return;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);

    const userData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    //alert("Please wait...");

    try {
      const response = await axios.post("/auth/login", userData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        showSuccessAlert(
          response.data.message,
          "Please wait for some seconds",
          "success"
        );
        setTimeout(() => {
          location.replace("/"); // Redirect after login
        }, 5000);
      } else {
        showErrorAlert(error.response.message);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        const errors = error.response.data.message;
        let errorMessage = "";
        Object.keys(errors).forEach((key) => {
          errorMessage += `${errors[key]}`;
        });
        showErrorAlert(errorMessage);
      } else {
        showErrorAlert("Login failed");
      }
    }
  });

  forgotBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    let email = document.getElementById("email").value;

    if (!email) {
      showErrorAlert("please provide email to set new password");
      return;
    }

    location.replace(
      `/auth/forgot-password?email=${encodeURIComponent(email)}`
    );
  });
});
