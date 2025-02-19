const token =""
const endpoint =
  "https://us-central1-aiplatform.googleapis.com/v1/projects/onedose-425510/locations/us-central1/publishers/google/models/gemini-2.0-flash-001:generateContent";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

async function generateContent(details) {
  console.log(details);

  let medicineDetails = details;
  // Extract the frequency
  let frequency =
    medicineDetails
      .querySelector(".detail-item h4:nth-child(1) + p")
      ?.textContent.trim() || "Not available";
  let duration =
    medicineDetails
      .querySelector(".detail-item h4:nth-child(2) + p")
      ?.textContent.trim() || "Not available";
  let progressRemaining =
    medicineDetails
      .querySelector(".detail-item h4:nth-child(3) + p")
      ?.textContent.trim() || "Not available";
  let progressPercent =
    medicineDetails.querySelector(".progress-fill")?.style.width.trim() ||
    "Not available";
  let nextDose =
    medicineDetails
      .querySelector(".detail-item h4:nth-child(4) + p")
      ?.textContent.trim() || "Not available";
  let instructions =
    medicineDetails.querySelector("p strong + p")?.textContent.trim() ||
    "Not available";

  let actionButtons =
    Array.from(medicineDetails.querySelectorAll(".quick-actions .action-btn"))
      .map((button) => button.textContent.trim())
      .join(", ") || "No actions available";

  let output = `
      Frequency: ${frequency}
      Duration: ${duration}
      Progress: ${progressRemaining}
      Progress Percentage: ${progressPercent}
      Next Dose: ${nextDose}
      Instructions: ${instructions}
      Action Buttons: ${actionButtons}
  `;

  const body = {
    contents: {
      role: "user",
      parts: [
        {
          text: `You are a qualified doctor who is capable of suggesting instructions based on already prescribed medicines. **YOU CANNOT GENERATE NAMES OF MEDICINES BUT CAN ONLY SUGGEST INSTRUCTIONS TO TAKE THEM***. Take this medicine detail:
          ${output}
          as input and generate the required instructions to give to the patient in the following json format.
          {"instructions":[]}
          `,
        },
      ],
    },
  };
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    console.log("Response:", data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("Error:", error);
  }
}

generateContent();
