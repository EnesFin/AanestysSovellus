
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

let votes = [
  {
    id: 1,
    question: 'Mikä on lempieläimesi?',
    options: {
      'Kissä': 0,
      'Koira': 0,
      'Papukaija': 0
    },
    voteGroups: {}
  },
  {
    id: 2,
    question: 'Millaista internetyhteyttä käytät?',
    options: {
      '5g': 0,
      '4g': 0,
      'Valokuitu': 0
    },
    voteGroups: {}
  }
];
function displayElementWithTimeout(elementId, displayValue, timeout = 5000) {
  document.getElementById(elementId).style.display = displayValue;
  setTimeout(function () {
    document.getElementById(elementId).style.display = 'none';
  }, timeout);
}


function vote(number) {
  const resetRadioBtn = document.getElementsByName(`voteGroup${number}`);
  const userName = document.getElementById('userName').value;

  if (userName === '') {
    document.getElementById('userName').className = 'form-control is-invalid';
    document.getElementById('notName').style = '';
    return;
  }

  const voteGroup = document.querySelector(`input[name="voteGroup${number}"]:checked`);

  const currentQuestion = votes.find(question => question.id === number);

  if (!currentQuestion.voteGroups[userName]) {
    currentQuestion.voteGroups[userName] = true;
    currentQuestion.options[voteGroup.value]++;
    updateVotesResult(number);
    displayElementWithTimeout('voted', 'block', 4000);
  } else {
    document.getElementById('userName').className = 'form-control is-invalid';
    document.getElementById('oneVote').style.display = 'block';
    return;
  }

  updateVotesResult(number);

  resetRadioBtn.forEach(btn => {
    btn.checked = false;
  });
  showResults(number);
  toggleVoteButton(number);
}

function showResults(number) {
  updateVotesResult(number);
  document.getElementById(`vote${number}Result`).style.display = 'block';
}

function updateName() {
  document.getElementById('notName').style = 'display: none;';
  document.getElementById('oneVote').style = 'display: none;';
  document.getElementById('userName').className = 'form-control';

}

function adminFunctions() {
  for (const question of votes) {
    document.getElementById(`subm${question.id}`).disabled = true;
    document.getElementById(`removeQuestion${question.id}`).style.display = 'inline-block';
    const resetRadioBtn = document.getElementsByName(`voteGroup${question.id}`);
    resetRadioBtn.forEach(btn => {
    btn.disabled = true;
  });

  }
  document.getElementById('addNewArea').style.display = 'block';
  document.getElementById('adminNotUse').style.display = 'none';
  displayElementWithTimeout('adminOK', 'block', 4000);
}


function adminNotfn() {
  document.getElementById('addNewArea').style = 'display: none;';
  document.getElementById('adminNotUse').style.display = 'block';
  displayElementWithTimeout('userOK', 'block', 4000);


  for (const question of votes) {
    toggleVoteButton(question.id);
    document.getElementById(`removeQuestion${question.id}`).style.display = 'none';
    const resetRadioBtn = document.getElementsByName(`voteGroup${question.id}`);
    resetRadioBtn.forEach(btn => {
    btn.disabled = false;
  });

  }
}

function resetStats() {
  if (votes.length === 0) {
    displayElementWithTimeout('nullOK', 'block', 4000);
    return;
  }
  votes.forEach(vote => {
    const index = votes.findIndex(item => item.id === vote.id);
    if (index !== -1) {
      votes[index].options = Object.fromEntries(Object.keys(votes[index].options).map(key => [key, 0]));
      votes[index].voteGroups = {};
      updateVotesResult(votes[index].id);
    }
  });
  document.getElementById('nollaOK').style.display = 'block';
  setTimeout(function () {
    document.getElementById('nollaOK').style.display = 'none';
  }, 5000);

}


function updateVotesResult(id) {
  const voteResultDiv = document.getElementById(`vote${id}Result`);
  voteResultDiv.innerHTML = '';

  const question = votes.find(q => q.id === id);

  for (const key in question.options) {
    const voteCount = question.options[key];
    const resultItem = document.createElement('p');
    resultItem.innerHTML = `<div class="progress my-1"><div class="progress-bar" role="progressbar" style="width: ${voteCount * 10}%" ></div>${key}:${voteCount}</div>`;
    voteResultDiv.appendChild(resultItem);
  }
}


function addNewQuestion() {

  const additionalQuestionDiv = document.getElementById('newQuestionArea');
  const arvo = votes.length + 1;
  const newQuestion = document.getElementById('additionalQuestionInput').value;
  const newOption1 = document.getElementById('additionalOption1').value;
  const newOption2 = document.getElementById('additionalOption2').value;
  const newOption3 = document.getElementById('additionalOption3').value;

  if (newQuestion === '') {
    document.getElementById('notInput').style.display = 'block';
    document.getElementById('additionalQuestionInput').className = 'form-control is-invalid';
  } else if (newOption1 === '') {
    document.getElementById('additionalOption1').className = 'form-control is-invalid';
  } else if (newOption2 === '') {
    document.getElementById('additionalOption2').className = 'form-control is-invalid';
  } else if (newOption3 === '') {
    document.getElementById('additionalOption3').className = 'form-control is-invalid';
  } else {
    document.getElementById('notInput').style.display = 'none';
    document.getElementById('additionalQuestionInput').className = 'form-control';
    document.getElementById('additionalOption1').className = 'form-control';
    document.getElementById('additionalOption2').className = 'form-control';
    document.getElementById('additionalOption3').className = 'form-control';

    votes.push({
      id: arvo,
      question: newQuestion,
      options: {
        [newOption1]: 0,
        [newOption2]: 0,
        [newOption3]: 0
      },
      voteGroups: {}
    });

    const newQuestionDiv = document.createElement('div');
    newQuestionDiv.innerHTML = `
          
          <div class="col-md-8" id="voteName${arvo}">
          <hr class="my-4">
            <h3>${newQuestion}</h3>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="voteGroup${arvo}" value="${newOption1}">
              <label class="form-check-label">${newOption1}</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="voteGroup${arvo}" value="${newOption2}">
              <label class="form-check-label">${newOption2}</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="voteGroup${arvo}" value="${newOption3}">
              <label class="form-check-label">${newOption3}</label>
            </div>
            <button type="button" class="btn btn-primary mt-3 submit-btn" id="subm${arvo}" onclick="vote(${arvo})" disabled>Äänestä</button>
            <button type="button" class="btn btn-secondary mt-3" id="showResults${arvo}" onclick="showResults(${arvo})">Näytä tulokset</button>
            <button type="button" class="btn btn-danger mt-3" id="removeQuestion${arvo}" style="display: inline-block;" onclick="removeQuestion(${arvo})">Poistaa</button>
            <div id="vote${arvo}Result" class="mt-3" style="display: none;"></div>
          </div>
        `;

    additionalQuestionDiv.appendChild(newQuestionDiv);
    displayElementWithTimeout('addOK', 'block', 4000);

  }
}

function removeQuestion(id) {
  const questionToRemove = document.getElementById(`voteName${id}`);
  questionToRemove.remove();
  const index = votes.findIndex(q => q.id === id);
  if (index !== -1) {
    votes.splice(index, 1);
  }
  displayElementWithTimeout('deleteOK', 'block', 3000);
}


function toggleVoteButton(id) {
  const submitButton = document.getElementById(`subm${id}`);
  const radioButtons = document.querySelectorAll(`input[name="voteGroup${id}"]:checked`);

  if (radioButtons.length > 0) {
      submitButton.disabled = false;
  } else {
      submitButton.disabled = true;
  }
}

// Sayfa yüklendiğinde butonların durumunu kontrol et
votes.forEach(vote => {
  toggleVoteButton(vote.id);
});

// Radio buton değişikliklerini dinleyerek butonların durumunu güncelle
votes.forEach(vote => {
  const radioButtons = document.getElementsByName(`voteGroup${vote.id}`);
  radioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
          toggleVoteButton(vote.id);
      });
  });
});

