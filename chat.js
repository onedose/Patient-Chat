const token ="ya29.a0AXeO80SCbwlB--Ljit_vK3nFWmKwALmMm_QX1ylRvFZTEQEn3NXvyjaERrgonMB_lPMI2WZZ6hI7Nfx77WLS8DERmYFioKwMYFY4nsdLvK_EEK36B8zgDva1Pw_0U0FN1fawLenaRX4G95GFX-m_Qike9FMiMrnV-WpqO6tLM_DUKEFEx2BD3bI21ME8mw0FFaf1i2j15jodDH8p6FcGgwOBcOxC2QurzxCCxvt_zZC9FOVTRwoz5h-crd7O779KtCdYQT_Xvyps6naHfgnDHNUNvEWx-_C-9aopCllhfzvXjCipWlXRQpjTMhlj-FxT7Qsr2hXYDvpFlMQmTtvWNxmDjGWlx-_4RmPWU7VPBuDP7i9wglJHdlYaF24JVo-niPXK_vPL-KYLogKxAW5v0z997xMMV2FEjS0aCgYKAfoSARMSFQHGX2Mi6o7v9eUjzEcmudfWIPSiYg0426"
const endpoint = "https://us-central1-aiplatform.googleapis.com/v1/projects/onedose-425510/locations/us-central1/publishers/google/models/gemini-2.0-flash-001:generateContent";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

async function generateContent(details) {
  if (!details) return;

  try {
    // Remove the reference to aiResponsePanel
    // const aiResponsePanel = document.getElementById('aiResponse');
    // aiResponsePanel.innerHTML = '<p>Loading instructions...</p>';

    // Prepare the details for Gemini API
    const medicineDetails = `
      Medicine Name: ${details.name}
      Dosage: ${details.dosage}
      Frequency: ${details.frequency}
      Instructions: ${details.instructions}
    `;

    // Add a loading message to the chat
    appendMessage('Generating medication explanation...', 'bot');

    // Use fetchGeminiResponse to get detailed explanation
    const response = await fetchGeminiResponse(`Provide a detailed, patient-friendly explanation of this medication: ${medicineDetails}`);

    // Add the response to the chat
    appendMessage(response, 'bot');

  } catch (error) {
    console.error("Error:", error);
    // Show error in chat
    appendMessage('Sorry, there was an error getting the medication instructions. Please try again.', 'bot');
  }
}

// Modify the explain medicine button event listener
document.addEventListener('DOMContentLoaded', () => {
  const explainButtons = document.querySelectorAll('.explain-medicine-btn');
  
  explainButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent card toggle
      
      // Get medicine details from the card
      const medicineCard = button.closest('.medicine-card');
      const medicineName = medicineCard.querySelector('.medicine-title h3').textContent;
      const medicineDetails = medicineCard.querySelector('.medicine-details');
      
      const details = {
        name: medicineName,
        dosage: medicineDetails.querySelector('.detail-item:nth-child(2) p').textContent,
        frequency: medicineDetails.querySelector('.detail-item:nth-child(1) p').textContent,
        instructions: medicineDetails.querySelector('p:last-of-type').textContent
      };

      // Generate content with the extracted details
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