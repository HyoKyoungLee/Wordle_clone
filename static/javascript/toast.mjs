export const toast = document.querySelector(".toast");

export function showToast(message) {
  const toastContents = document.querySelector(".toast-contents");
  toastContents.innerHTML = message;

  toast.style.visibility = "visible";
  setTimeout(() => {
    toast.style.visibility = "hidden";
  }, 2000);
}
