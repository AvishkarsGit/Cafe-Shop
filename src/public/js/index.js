function showSuccessAlert(message, subMessage) {
  Swal.fire({
    icon: "success",
    title: message,
    text: subMessage,
    timer: 5000,
    timerProgressBar: true,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
  });
}
function showErrorAlert(errorMsg) {
  Swal.fire({
    icon: "error",
    text: errorMsg,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
  });
}
