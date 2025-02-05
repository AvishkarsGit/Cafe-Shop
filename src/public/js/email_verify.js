document.querySelector("#resendbtn").addEventListener("click", (e) => {
  e.preventDefault();

alert("Please wait!.... while we send the email.");
  fetch("/auth/verify", { method: "PATCH" })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        alert("Email has been send successfully");
      } else {
        alert("email sending fail!!");
      }
    })
    .catch((err) => {
      console.log(err);
      alert("An error occurred while sending the email.");
    })
    .finally(() => {
      window.location.reload();
    });
});
