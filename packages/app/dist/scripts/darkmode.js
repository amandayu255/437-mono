document.addEventListener("DOMContentLoaded", () => {
    const savedMode = localStorage.getItem("dark-mode");

    if (savedMode === "true") {
        document.body.classList.add("dark-mode");
    }

    const toggleInput = document.querySelector("#dark-mode-toggle input");
    if (toggleInput) {
        toggleInput.checked = savedMode === "true";

        toggleInput.addEventListener("change", (event) => {
            const isDark = event.target.checked;
            document.body.classList.toggle("dark-mode", isDark);
            localStorage.setItem("dark-mode", isDark);
        });
    }
});
