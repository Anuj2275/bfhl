const textarea = document.getElementById("nodes");
const submitBtn = document.getElementById("submitBtn");
const result = document.getElementById("result");

submitBtn.addEventListener("click", async () => {

    const lines = textarea.value
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "");

    try {

        const response = await fetch("https://bfhl-api-gd98.onrender.com/bfhl", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: lines
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        result.textContent = JSON.stringify(data, null, 4);

    } catch (err) {

        result.textContent = err.message;
        console.error(err);

    }

});