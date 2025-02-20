// Stub patient data
const patients = [
    {
        id: "P12345",
        name: "John Doe",
        age: 45,
        gender: "Male",
        medications: ["Amoxicillin", "Lisinopril"],
        nextAppointment: "March 1, 2025"
    },
    {
        id: "P67890",
        name: "Jane Smith",
        age: 35,
        gender: "Female",
        medications: ["Metformin", "Atorvastatin"],
        nextAppointment: "April 15, 2025"
    },
    {
        id: "P54321",
        name: "Michael Johnson",
        age: 55,
        gender: "Male",
        medications: ["Warfarin", "Simvastatin"],
        nextAppointment: "May 20, 2025"
    },
    {
        id: "P98765",
        name: "Emily Brown",
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
    query = query.toLowerCase().trim();
    const resultsContainer = document.getElementById('patientSearchResults');
    
    // Filter patients
    const filteredPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(query) || 
        patient.id.toLowerCase().includes(query)
    );

    // Clear previous results
    resultsContainer.innerHTML = '';

    // Populate results
    if (filteredPatients.length === 0) {
        resultsContainer.innerHTML = '<p style="text-align: center; color: var(--secondary-text-color);">No patients found.</p>';
    } else {
        filteredPatients.forEach(patient => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('patient-result-item');
            resultItem.innerHTML = `
                <div class="patient-result-avatar">${patient.name.charAt(0)}</div>
                <div class="patient-result-details">
                    <h3>${patient.name}</h3>
                    <p>ID: ${patient.id} | Age: ${patient.age} | ${patient.gender}</p>
                    <p>Medications: ${patient.medications.join(', ')}</p>
                </div>
            `;
            resultItem.onclick = () => selectPatient(patient);
            resultsContainer.appendChild(resultItem);
        });
    }
}

// Function to select a patient
function selectPatient(patient) {
    // Update patient context in the right panel
    const patientAvatar = document.querySelector('.patient-avatar');
    const patientName = document.querySelector('.patient-details h3');
    const patientAppointment = document.querySelector('.patient-details p:first-of-type');
    const patientId = document.querySelector('.patient-details p:last-of-type');

    if (patientAvatar) patientAvatar.textContent = patient.name.charAt(0) + patient.name.charAt(1);
    if (patientName) patientName.textContent = patient.name;
    if (patientAppointment) patientAppointment.textContent = `Next Appointment: ${patient.nextAppointment}`;
    if (patientId) patientId.textContent = `Patient ID: ${patient.id}`;

    // Close popup
    closePatientSearchPopup();
}

// Event listener to close popup when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('patientSearchPopup');
    
    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closePatientSearchPopup();
        }
    });

    // Add event listener to search input to filter in real-time
    const popupInput = document.getElementById('patientSearchPopupInput');
    popupInput.addEventListener('input', (event) => {
        filterPatients(event.target.value);
    });
});