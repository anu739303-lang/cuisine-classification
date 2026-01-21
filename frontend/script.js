// Get API endpoint dynamically
const API_BASE_URL = window.location.origin;

async function predictCuisine() {
    const text = document.getElementById("text").value.trim();

    // Validation
    if (!text) {
        showError("Please enter some text to classify");
        return;
    }

    // Show loading spinner
    const spinner = document.getElementById("loadingSpinner");
    spinner.style.display = "block";

    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();

        // Hide loading spinner
        spinner.style.display = "none";

        if (data.error) {
            showError(data.error);
        } else {
            showResult(data.predicted_cuisine);
        }
    } catch (error) {
        spinner.style.display = "none";
        showError("Failed to connect. Please check your internet connection.");
        console.error("Error:", error);
    }
}

function showResult(cuisine) {
    const resultSection = document.getElementById("resultSection");
    const resultText = document.getElementById("result");
    
    resultText.innerText = cuisine || "Unknown";
    resultSection.style.display = "block";
    resultSection.scrollIntoView({ behavior: "smooth", block: "center" });
}

function showError(message) {
    const resultSection = document.getElementById("resultSection");
    const resultText = document.getElementById("result");
    
    resultText.innerText = "❌ " + message;
    resultText.style.color = "#FF6B6B";
    resultSection.style.display = "block";
    resultSection.scrollIntoView({ behavior: "smooth", block: "center" });
}

function clearResult() {
    document.getElementById("text").value = "";
    document.getElementById("resultSection").style.display = "none";
    document.getElementById("text").focus();
}

// Allow Enter key to submit
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("text").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            predictCuisine();
        }
    });
});
