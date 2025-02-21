// Stub patient data
const patients = [
    {
        id: "P12345",
        name: "Janki Davi",
        age: 45,
        gender: "Female",
        medications: ["Amoxicillin", "Lisinopril"],
        nextAppointment: "March 1, 2025"
    },
    {
        id: "P67890",
        name: "Mamta Sharma",
        age: 35,
        gender: "Female",
        medications: ["Metformin", "Atorvastatin"],
        nextAppointment: "April 15, 2025"
    },
    {
        id: "P54321",
        name: "Raj Verma",
        age: 55,
        gender: "Male",
        medications: ["Warfarin", "Simvastatin"],
        nextAppointment: "May 20, 2025"
    },
    {
        id: "P98765",
        name: "Kamala Rathore",
        age: 28,
        gender: "Female",
        medications: ["Levothyroxine"],
        nextAppointment: "June 10, 2025"
    }
];

// Function to show patient search popup
function showPatientSearchPopup() {
    const popup = document.getElementById('patientSearchPopup');
    const popupInput = document.getElementById('patientSearchPopupInput');
    
    popup.style.display = 'flex';
    popupInput.value = ''; // Clear previous search
    filterPatients(''); // Show all patients initially
    popupInput.focus();
}

// Function to close patient search popup
function closePatientSearchPopup() {
    const popup = document.getElementById('patientSearchPopup');
    popup.style.display = 'none';
}

// Function to filter patients
function filterPatients(query) {
    query = query.toLowerCase();
    const resultsContainer = document.getElementById('patientSearchResults');
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Filter patients based on name or ID
    const filteredPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(query) || 
        patient.id.toLowerCase().includes(query)
    );
    
    // Create result cards
    filteredPatients.forEach(patient => {
        const resultCard = document.createElement('div');
        resultCard.classList.add('patient-result-card');
        resultCard.innerHTML = `
            <div class="patient-avatar">${patient.name.charAt(0)}</div>
            <div class="patient-details">
                <h3>${patient.name}</h3>
                <p>ID: ${patient.id} | Age: ${patient.age} | Gender: ${patient.gender}</p>
                <p>Next Appointment: ${patient.nextAppointment}</p>
            </div>
        `;
        resultCard.onclick = () => selectPatient(patient);
        resultsContainer.appendChild(resultCard);
    });
}

// Function to select a patient
function selectPatient(patient) {
    console.log('Selected Patient:', patient);
    // You can add more functionality here, like updating the UI or navigating to patient details
    closePatientSearchPopup();
}

// Add event listener to close popup when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('patientSearchPopup');
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePatientSearchPopup();
        }
    });
});