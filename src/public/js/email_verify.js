const resentText = document.getElementById("resend-in");
const resendBtn = document.getElementById("resendbtn");
const sendBtn = document.getElementById("sendBtn");
const verifyBtn = document.getElementById("verify");

if (sendBtn) {
  sendBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch("/auth/verify");
      showSuccessAlert(response.data.message, "Please wait..");
      verifyBtn.style.display = "block";
      sendBtn.style.display = "none";
      resentText.style.display = "block";
      setTimer();
    } catch (error) {
      showErrorAlert(error.response?.data?.message || "Failed to resend OTP");
    }
  });
}

if (verifyBtn) {
  verifyBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const otp = document.getElementById("verification_token").value;

    if (otp.trim() === "") {
      showErrorAlert("OTP must be required");
      return;
    }
    try {
      const response = await axios.post("/auth/verify", {
        verification_token: otp,
      });
      showSuccessAlert(response.data.message, "Please wait");

      setTimeout(() => {
        location.replace("/home");
      }, 5000);
    } catch (error) {
      showErrorAlert(error.response?.data?.message || "Verification failed");
    }
  });
}

if (resendBtn) {
  resendBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch("/auth/verify");

      showSuccessAlert(response.data.message, "please wait...");
    } catch (error) {
      showErrorAlert(error.response?.data?.message || "Failed to resend OTP");
    }
  });
}

function setTimer() {
  let seconds = 60;
  const timer = setInterval(() => {
    resentText.innerText = `Resend in : ${seconds} sec`;
    seconds--;
    if (seconds == -1) {
      clearInterval(timer);
      resendBtn.style.display = "block";
      resentText.style.display = "none";
    } else {
      resentText.innerText = `Resend in : ${seconds} sec`;
    }
  }, 1000);
}
