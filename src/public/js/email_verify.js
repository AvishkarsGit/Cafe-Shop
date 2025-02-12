document
  .getElementById("verification-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const otp = document.getElementById("verification_token").value;

    try {
      const response = await axios.post("/auth/verify", {
        verification_token: otp,
      });

      alert(response.data.message);

      location.replace("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Verification failed");
    }
  });

document.getElementById("resendbtn").addEventListener("click", async () => {
  try {
    const response = await axios.patch("/auth/verify");

    alert(response.data.message);
  } catch (error) {
    alert(error.response?.data?.message || "Failed to resend OTP");
  }
});
