
const fileDropzone = document.getElementById("fileDropzone");
const fileInput = document.getElementById("foto_mascota");
const filePreview = document.getElementById("filePreview");
const fileDropzoneText = document.getElementById("fileDropzoneText");
const removeFileBtn = document.getElementById("removeFile");

function previewFile(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        filePreview.src = e.target.result;
        filePreview.style.display = "block";
        fileDropzoneText.style.display = "none";
        removeFileBtn.style.display = "inline-block";
    }
    reader.readAsDataURL(file);
}

fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files[0]) {
        previewFile(fileInput.files[0]);
    }
});

fileDropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    fileDropzone.style.background = "#e9e9e9";
});

fileDropzone.addEventListener("dragleave", (e) => {
    e.preventDefault();
    fileDropzone.style.background = "";
});

fileDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    fileDropzone.style.background = "";
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event('change'));
    }
});

removeFileBtn.addEventListener("click", () => {
    fileInput.value = "";
    filePreview.src = "";
    filePreview.style.display = "none";
    fileDropzoneText.style.display = "inline";
    removeFileBtn.style.display = "none";
});