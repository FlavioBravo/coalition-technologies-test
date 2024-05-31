// DO NOT store credentials in your JS file like this
const username = "coalition";
const password = "skills-test";
const auth = btoa(`${username}:${password}`);

/** Set values for the patient information */
const setCurrentPatientInfo = (patient) => {
  document.getElementById("information-container__wrapper-data_image").src =
    patient.profile_picture;
  document.getElementById("information-container__wrapper-data_image").p;
  document.getElementById(
    "information-container__wrapper-data_birthday"
  ).innerHTML = new Date(patient.date_of_birth).toLocaleDateString(
    {},
    { timeZone: "UTC", month: "long", day: "2-digit", year: "numeric" }
  );
  document.getElementById(
    "information-container__wrapper-data_gender"
  ).innerHTML = patient.gender;
  document.getElementById(
    "information-container__wrapper-data_contact"
  ).innerHTML = patient.phone_number;
  document.getElementById(
    "information-container__wrapper-data_emergency"
  ).innerHTML = patient.emergency_contact;
  document.getElementById(
    "information-container__wrapper-data_insurance"
  ).innerHTML = patient.insurance_type;
};

/** Draw the Presure Graph */
const setBloodPresureGraph = (bloodPresureList) => {
  const xValues = [
    "Otc, 2023",
    "Nov, 2023",
    "Dec, 2023",
    "Jan, 2024",
    "Feb, 2024",
    "Mar, 2024",
  ];

  new Chart("myChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {
          label: "Systolic",
          data: bloodPresureList.map(
            (item) => item.blood_pressure.systolic.value
          ),
          borderColor: "#C26EB4",
          backgroundColor: "#C26EB4",
          pointBackgroundColor: "#C26EB4",
          pointBorderColor: "#C26EB4",
          fill: false,
        },
        {
          label: "Diastolic",
          data: bloodPresureList.map(
            (item) => item.blood_pressure.diastolic.value
          ),
          borderColor: "#8C6FE6",
          backgroundColor: "#8C6FE6",
          pointBackgroundColor: "#8C6FE6",
          pointBorderColor: "#8C6FE6",
          fill: false,
        },
      ],
    },
    options: {
      legend: { display: false },
    },
  });
};

/** insert element list of the patients in the HTML*/
const setPatientList = (patientList) => {
  let patientListHTML = "";
  patientList.forEach((element) => {
    patientListHTML =
      patientListHTML +
      `
    <div class="patients-container__wrapper-list__option">
      <div class="patients-container__wrapper-list__data">
        <img src=${element.profile_picture} alt="" />
        <div class="patients-container__wrapper-list__text">
          <h6>${element.name}s</h6>
          <p>${element.gender}, ${element.age}</p>
        </div>
      </div>
      <img
        src="assets/icons/more_horiz.svg"
        alt=""
        class="patients-container__wrapper-list__img"
      />
    </div>
    `;
  });
  document.getElementById("patients-container__wrapper-list").innerHTML =
    patientListHTML;
};

/** insert element list of results from one patient in the HTML*/
const setResultListByPatient = (resultList) => {
  let resultListHTML = "";
  resultList.forEach((element) => {
    resultListHTML =
      resultListHTML +
      `
      <div class="results__wrapper-lab__option">
        <span>${element}</span>
        <img src="assets/icons/download.svg" alt="" />
      </div>
    `;
  });
  document.getElementById("results__wrapper-lab").innerHTML = resultListHTML;
};

/** Set values for diagnosis history by patient */
const setDiagnosisHistoryByPatient = (patient) => {
  const diagnosis = patient.diagnosis_history[0];
  document.getElementById(
    "systolic_value"
  ).innerHTML = `${diagnosis.blood_pressure.systolic.value}`;
  document.getElementById("diastolic_value").innerHTML =
    diagnosis.blood_pressure.diastolic.value;

  document.getElementById(
    "respiratory_value"
  ).innerHTML = `${diagnosis.respiratory_rate.value} bpm`;
  document.getElementById("respiratory_level").innerHTML =
    diagnosis.respiratory_rate.levels;
  document.getElementById(
    "temperature_value"
  ).innerHTML = `${diagnosis.temperature.value} °F`;
  document.getElementById("temperature_level").innerHTML =
    diagnosis.temperature.levels;
  document.getElementById(
    "heart_value"
  ).innerHTML = `${diagnosis.heart_rate.value} bpm`;
  document.getElementById("heart_level").innerHTML = `<img
  src="assets/icons/arrow_down.svg"
  alt=""
  class="history-container-cards__heart__icon"
/>${diagnosis.heart_rate.levels}`;
};

/** insert element list of diagnostic from one patient in the HTML*/
const setDiagnosticListByPatient = (diagnosticList) => {
  console.log(diagnosticList);
  let diagnosticListHTML = "";
  diagnosticList.forEach((element) => {
    diagnosticListHTML =
      diagnosticListHTML +
      `
      <div class="diagnostic-container__row-table">
        <div class="w-25">
        ${element.name}
        </div>
        <div class="w-50">
        ${element.description}
        </div>
        <div class="w-25">
        ${element.status}
        </div>
      </div>
    `;
  });
  document.getElementById("diagnostic-container__body-table").innerHTML =
    diagnosticListHTML;
};

/** Get all patients information from endpoint */
const getAllPatients = async (auth) => {
  try {
    let response = await fetch(
      "https://fedskillstest.coalitiontechnologies.workers.dev",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    let patientList = await response.json();
    const currentPatient = patientList.find(
      (patient) => patient.name === "Jessica Taylor"
    );
    setCurrentPatientInfo(currentPatient);
    const bloodPresureList = [...currentPatient.diagnosis_history];
    setBloodPresureGraph(bloodPresureList.slice(0, 6));
    let list = patientList.map((patient) => ({
      name: patient.name,
      gender: patient.gender,
      age: patient.age,
      profile_picture: patient.profile_picture,
    }));
    setPatientList(list);
    setResultListByPatient([...currentPatient.lab_results, "Urine Test"]);
    setDiagnosisHistoryByPatient(currentPatient);
    setDiagnosticListByPatient(currentPatient.diagnostic_list);
  } catch (error) {
    console.warn(error);
  }
};

/** Call getAllPatients function */
getAllPatients(auth);
