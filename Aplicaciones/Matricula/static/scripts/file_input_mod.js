document.querySelectorAll(".file-dropzone").forEach(dropzone => {
    const fileInput = dropzone.querySelector(".foto_mascota");
    const filePreview = dropzone.querySelector(".filePreview");
    const fileText = dropzone.querySelector(".fileDropzoneText");
    const removeBtn = dropzone.closest(".form-group").querySelector(".removeFileBtn");

    // Inicializar estado según si hay imagen
    if (filePreview.src && filePreview.src !== window.location.href) {
        filePreview.style.display = "block";
        fileText.style.display = "none";
        removeBtn.style.display = "inline-block";
    }

    function previewFile(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            filePreview.src = e.target.result;
            filePreview.style.display = "block";
            fileText.style.display = "none";
            removeBtn.style.display = "inline-block";
        }
        reader.readAsDataURL(file);
    }

    fileInput.addEventListener("change", () => {
        if (fileInput.files && fileInput.files[0]) previewFile(fileInput.files[0]);
    });

    dropzone.addEventListener("dragover", e => { e.preventDefault(); dropzone.style.background = "#e9e9e9"; });
    dropzone.addEventListener("dragleave", e => { e.preventDefault(); dropzone.style.background = ""; });
    dropzone.addEventListener("drop", e => {
        e.preventDefault(); dropzone.style.background = "";
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            fileInput.files = e.dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        }
    });

    removeBtn.addEventListener("click", () => {
        fileInput.value = "";
        filePreview.src = "";
        filePreview.style.display = "none";
        fileText.style.display = "inline";
        removeBtn.style.display = "none";
    });
});