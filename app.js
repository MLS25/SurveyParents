const form = document.getElementById('surveyForm');
const steps = Array.from(document.querySelectorAll('.form-step'));
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');
const progressBar = document.getElementById('progressBar');
const successPopup = document.getElementById('successPopup');
const errorPopup = document.getElementById('errorPopup');

let currentStep = 0;

function updateStep() {
  steps.forEach((step, index) => {
    step.classList.toggle('active', index === currentStep);
  });
  prevBtn.style.display = currentStep > 0 ? 'inline-block' : 'none';
  nextBtn.style.display = currentStep < steps.length - 1 ? 'inline-block' : 'none';
  submitBtn.style.display = currentStep === steps.length - 1 ? 'inline-block' : 'none';
  progressBar.style.width = ((currentStep + 1) / steps.length) * 100 + '%';
}

function validateStep() {
  const activeStep = steps[currentStep];
  const radios = activeStep.querySelectorAll('input[type="radio"]');
  const textareas = activeStep.querySelectorAll('textarea');

  if (radios.length > 0) {
    return Array.from(radios).some(input => input.checked);
  }

  if (textareas.length > 0) {
    return Array.from(textareas).every(textarea => textarea.value.trim() !== '');
  }

  return true;
}

function saveProgress() {
  const formData = {};

  form.querySelectorAll('input[type="radio"]').forEach(input => {
    if (input.checked) {
      formData[input.name] = input.value;
    }
  });

  form.querySelectorAll('textarea').forEach(textarea => {
    formData[textarea.name] = textarea.value;
  });

  localStorage.setItem('surveyData', JSON.stringify(formData));
}

function loadProgress() {
  const data = JSON.parse(localStorage.getItem('surveyData') || '{}');

  for (const [name, value] of Object.entries(data)) {
    const field = form.querySelector(`[name="${name}"]`);
    if (field) {
      if (field.type === 'radio') {
        const radio = form.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radio) radio.checked = true;
      } else {
        field.value = value;
      }
    }
  }
}

form.addEventListener('input', saveProgress);

nextBtn.addEventListener('click', () => {
  if (!validateStep()) {
    errorPopup.classList.add('show');
    return;
  }
  currentStep++;
  updateStep();
});

prevBtn.addEventListener('click', () => {
  currentStep--;
  updateStep();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    await fetch(form.action, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });

    localStorage.removeItem('surveyData');
    successPopup.style.display = 'flex';
  } catch (err) {
    console.error('Submission failed', err);
    alert('Something went wrong while submitting.');
  }
});

function closePopup() {
  successPopup.style.display = 'none';
  window.location.href = "thank-you.html";
}

function closeError() {
  errorPopup.classList.remove('show');
}

loadProgress();
updateStep();
function generateConfetti() {
  const confettiContainer = document.getElementById('confetti');
  const numConfettiPieces = 100;
  
  for (let i = 0; i < numConfettiPieces; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti-piece');
    
    // Randomize position
    confetti.style.left = Math.random() * 100 + 'vw';
    
    // Randomize animation delay
    confetti.style.animationDelay = Math.random() * 2 + 's';
    
    // Randomize color
    confetti.style.backgroundColor = getRandomColor();
    
    confettiContainer.appendChild(confetti);
  }
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

document.getElementById('submitBtn').addEventListener('click', () => {
  generateConfetti();
  document.getElementById('confetti').style.display = 'block';
  setTimeout(() => {
    document.getElementById('confetti').style.display = 'none';
  }, 3000);
});

