document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('firstName').addEventListener('blur', checkField);
  document.getElementById('lastName').addEventListener('blur', checkField);
  document.getElementById('email').addEventListener('blur', checkEmail);
  document.getElementById('phoneNumber').addEventListener('blur', checkField);
  document.getElementById('password_1').addEventListener('blur', checkPassword);
  document.getElementById('password_2').addEventListener('blur', checkPassword);
});

function checkField(event) {
  if (event.target.value === "") {
    event.target.style.borderColor = "red";
    successSubmitFlag = false;
  } else {
    event.target.style.borderColor = "green";
  }
}

let successSubmitFlag = true;

function checkValid() {
  let firstNameInput = document.getElementById("firstName");
  let lastNameInput = document.getElementById("lastName");
  let emailInput = document.getElementById("email");
  let phoneNumberInput = document.getElementById("phoneNumber");
  let password_1 = document.getElementById("password_1");
  let password_2 = document.getElementById("password_2");
  let inputs = [firstNameInput, lastNameInput, emailInput, phoneNumberInput, password_1, password_2];

  successSubmitFlag = true;
  checkPassword();
  checkEmail();

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value === "") {
      successSubmitFlag = false;
      inputs[i].style.borderColor = "red";
    } else {
      inputs[i].style.borderColor = "green";
    }
  }

  if (successSubmitFlag) {
    let userData = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      email: emailInput.value,
      phoneNumber: phoneNumberInput.value,
      password_1: password_1.value,
    };

    document.getElementById("successfulSubmit").textContent = "Submitting...";
    fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById("successfulSubmit").textContent = data.message;
    })
    .catch((error) => {
      console.error('Error:', error);
      document.getElementById("successfulSubmit").textContent = "An error occurred. Please try again.";
    });
  }
}

function checkPassword() {
  let password_status = document.getElementById("submitionStatus");
  let password_1 = document.getElementById("password_1");
  let password_2 = document.getElementById("password_2");

  if (password_1.value !== password_2.value) {
    password_status.textContent = "Passwords do not match!";
    password_1.style.borderColor = "red";
    password_2.style.borderColor = "red";
    successSubmitFlag = false;
  } else if (password_1.value.length < 8) {
    password_status.textContent = "Password must be at least 8 characters!";
    password_status.style.color = "red";
    password_1.style.borderColor = "red";
    password_2.style.borderColor = "red";
    successSubmitFlag = false;
  } else {
    password_status.textContent = "Valid password!";
    password_status.style.color = "green";
    password_1.style.borderColor = "green";
    password_2.style.borderColor = "green";
  }
}

function checkEmail() {
  let emailInput = document.getElementById("email");
  let emailStatus = document.getElementById("emailStatus");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(emailInput.value)) {
    emailStatus.textContent = "Invalid email format!";
    emailInput.style.borderColor = "red";
    successSubmitFlag = false;
  } else {
    emailStatus.textContent = "";
    emailInput.style.borderColor = "green";
  }
}
