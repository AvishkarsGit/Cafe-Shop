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

    try {
      const response = await axios.post("/auth/register", userData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        showSuccessAlert(response.data.message, "Please wait for some seconds");
        setTimeout(() => {
          location.replace("/auth/verify");
        }, 5000);
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
        showErrorAlert("Registration failed");
      }
    }
  });
});
