const token ="ya29.a0AXeO80SsB_9Z_wq653BnbL5SnAiu9QSXXQZ7GjT1MLWnTdOFKIkOnCtlfp5UpEANElNE7ZPqK86g5m-5QgpIECttr9QWipuOwly9rytNt1etAjIkx9SdFNGOTfpFqWMNhcuenFLBgeNbFVEVIXYMjPaVKdCSZ0SE_VJPkie_ezaXctHHfXWbkeeUlWOdicivrqBez2Y-MSrLbyQkbhFBdmfsgrPnRNstmZWsWmy1Ao0qgY7Gvlz3lHbZ_DoZT72N7_u4bcmpmYh5bczCrn5XiYruKm_4YSK_lP0rZmjpCHAaoxgPutGK02530TEE6Nnin0nhDdLh9T5rZZiGZgBAmE8SAkYKtBBmm-tRWRl0dvhXi5c9PCfmfIXBQPRI0yJ_oq8gAmSeq6f6DXdvjSODdfucMNDmgw0D4ZjRaCgYKASsSARMSFQHGX2Mi0YwnhwqcTP0RpIQ6wt7YIg0427"
const endpoint = "https://us-central1-aiplatform.googleapis.com/v1/projects/onedose-425510/locations/us-central1/publishers/google/models/gemini-2.0-flash-001:generateContent";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

async function generateContent(details) {
  if (!details) return;

  const medicineDetails = details;
  // Extract the medicine name from the card
  const medicineName = medicineDetails.closest('.medicine-card').querySelector('.medicine-title h3').textContent;
  
  // Modify selectors to use standard querySelector methods
  const frequencyElement = Array.from(medicineDetails.querySelectorAll('.detail-item')).find(item => 
    item.querySelector('h4') && item.querySelector('h4').textContent.trim() === 'Frequency'
  );
  const frequency = frequencyElement ? frequencyElement.querySelector('p').textContent.trim() : "Not available";

  const durationElement = Array.from(medicineDetails.querySelectorAll('.detail-item')).find(item => 
    item.querySelector('h4') && item.querySelector('h4').textContent.trim() === 'Duration'
  );
  const duration = durationElement ? durationElement.querySelector('p').textContent.trim() : "Not available";

  const progressElement = Array.from(medicineDetails.querySelectorAll('.detail-item')).find(item => 
    item.querySelector('h4') && item.querySelector('h4').textContent.trim() === 'Progress'
  );
  const progressRemaining = progressElement ? progressElement.querySelector('p').textContent.trim() : "Not available";
  
  const progressPercent = medicineDetails.querySelector('.progress-fill') ? 
    medicineDetails.querySelector('.progress-fill').style.width.trim() : 
    "Not available";

  const nextDoseElement = Array.from(medicineDetails.querySelectorAll('.detail-item')).find(item => 
    item.querySelector('h4') && item.querySelector('h4').textContent.trim() === 'Next Dose'
  );
  const nextDose = nextDoseElement ? nextDoseElement.querySelector('p').textContent.trim() : "Not available";

  const instructions = medicineDetails.querySelector('p strong + p') ? 
    medicineDetails.querySelector('p strong + p').textContent.trim() : 
    "Not available";

  const output = `
    Medicine: ${medicineName}
    Frequency: ${frequency}
    Duration: ${duration}
    Progress: ${progressRemaining}
    Progress Percentage: ${progressPercent}
    Next Dose: ${nextDose}
    Instructions: ${instructions}
  `;

  const body = {
    contents: {
      role: "user",
      parts: [
        {
          text: `You are a qualified doctor who is capable of suggesting instructions based on already prescribed medicines. **YOU CANNOT GENERATE NAMES OF MEDICINES BUT CAN ONLY SUGGEST INSTRUCTIONS TO TAKE THEM***. Take this medicine detail:
          ${output}
          as input and generate the required instructions to give to the patient in the following json format.
          {"instructions":[]}`,
        },
      ],
    },
  };

  try {
    // Show loading state in AI response panel
    const aiResponsePanel = document.getElementById('aiResponse');
    aiResponsePanel.innerHTML = '<p>Loading instructions...</p>';

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
    const instructions = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json\n|\n```/g, ''));
    
    // Create HTML for instructions
    const instructionsHtml = `
      <h3 class="mb-4" style="color: var(--primary-color)">Instructions for ${medicineName}</h3>
      <ul style="list-style-type: disc; padding-left: 20px;">
        ${instructions.instructions.map(instruction => `
          <li style="margin-bottom: 12px; color: var(--secondary-text-color)">${instruction}</li>
        `).join('')}
      </ul>
    `;
    
    // Update AI response panel
    aiResponsePanel.innerHTML = instructionsHtml;

  } catch (error) {
    console.error("Error:", error);
    // Show error in AI response panel
    document.getElementById('aiResponse').innerHTML = `
      <p style="color: #dc2626;">Sorry, there was an error getting the instructions. Please try again.</p>
    `;
  }
}

// Add click handler for Explain Medicine buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.medicine-card').forEach(card => {
    const explainButton = card.querySelector('.quick-actions button:last-child');
    explainButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card toggle
      const details = card.querySelector('.medicine-details');
      generateContent(details);
    });
  });
});

// Original functions remain unchanged
function toggleDetails(card) {
  const details = card.querySelector('.medicine-details');
  const allDetails = document.querySelectorAll('.medicine-details');

  allDetails.forEach(detail => {
    if (detail !== details) {
      detail.style.display = 'none';
    }
  });

  if (details.style.display === 'block') {
    details.style.display = 'none';
  } else {
    details.style.display = 'block';
  }
}

function searchMedications(query) {
  query = query.toLowerCase();
  const cards = document.querySelectorAll('.medicine-card');
  
  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const details = card.querySelector('.medicine-details').textContent.toLowerCase();
    
    if (title.includes(query) || details.includes(query)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function handleCustomQuestion(event) {
  if (event.key === 'Enter') {
    const question = event.target.value.trim();
    if (question) {
      askQuestion(question);
      event.target.value = '';
    }
  }
}

async function fetchGeminiResponse(question) {
    
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

    const body = {
        contents: {
            role: "user",
            parts: [{
                text: `You are a helpful medical assistant. Provide a clear, concise, and informative response to the following medical-related question. Ensure the answer is patient-friendly and easy to understand:

Question: ${question}

Guidelines:
- Provide accurate medical information
- Use simple, clear language
- Focus on practical advice
- Do not provide specific medical diagnoses
- Recommend consulting a healthcare professional for personalized advice`
            }]
        },
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300
        }
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Extract the text response from the Gemini API
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        return aiResponse;
    } catch (error) {
        console.error("Error fetching Gemini response:", error);
        throw error;
    }
}