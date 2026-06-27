const textarea = document.getElementById("nodes");
const submitBtn = document.getElementById("submitBtn");
const result = document.getElementById("result");

submitBtn.addEventListener("click", async () => {

    const lines = textarea.value
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "");

    try {

        const response = await fetch("http://localhost:3000/bfhl", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: lines
            })
        });

        const data = await response.json();

        result.textContent = JSON.stringify(data, null, 4);

    } catch (err) {

        result.textContent = "Error : Unable to connect to server";

        console.error(err);

    }

});