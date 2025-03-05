const signupBtn = document.getElementById("sign-in-btn");

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signup-form");

  if (!form) {
    console.error("Form not found! Check if the ID is correct.");
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Ensure form is correctly referenced
    const formData = new FormData(form); // Correct way to create FormData

    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      phone: formData.get("phone"),
    };

    //alert("Please wait..."); //ui part

    if (userData.name.trim() === "") {
      showErrorAlert("Name must be required");
      return;
    }
    if (userData.email.trim() === "") {
      showErrorAlert("Email must be required");
      return;
    }
    if (userData.phone.trim() === "") {
      showErrorAlert("Phone number must be required");
      return;
    }
    if (userData.password.trim() === "") {
      showErrorAlert("password number must be required");
      return;
    }
    if (
      userData.password.trim().length < 8 ||
      userData.password.trim().length > 15
    ) {
      showErrorAlert("password  must be in between 8-15 character");
      return;
    }
    if (userData.confirmPassword.trim() !== userData.password.trim()) {
      showErrorAlert("password  does not match with confirm password");
      return;
    }

    try {
      const response = await axios.post("/auth/register", userData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        showSuccessAlert(response.data.message, "Please wait..");
        setTimeout(() => {
          location.replace("/auth/verify");
        }, 5000);
      }
    } catch (error) {
      showErrorAlert(error.response.data.message);
    }
  });
});

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  location.replace("/auth/login");
});
