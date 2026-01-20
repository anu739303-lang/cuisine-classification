async function predictCuisine() {
    const text = document.getElementById("text").value;

    const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ text: text })
    });

    const data = await response.json();
    document.getElementById("result").innerText =
        "Predicted Cuisine: " + (data.predicted_cuisine || data.error);
}
