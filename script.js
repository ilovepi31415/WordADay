const root = document.documentElement;
const buttons = document.querySelectorAll('#answer-container button')
const answerA = document.getElementById('a');
const answerB = document.getElementById('b');
const answerC = document.getElementById('c');
const answerContainer = document.getElementById('answer-container');
const title = document.getElementById('title');
const description = document.getElementById('description');
const feedback = document.getElementById('feedback');

const questionBank = {
    noun: {
        ultracrepidarian: {
            word: 'Ultracrepidarian',
            definition: 'Someone with no special or expert knowledge on a subject but who still expresses an opinion on it'
        }
    }
}

// Runs when a button is clicked to submit an answer
function checkAnswer(button) {
    buttons.forEach((btn) => {
        btn.style.backgroundColor = (btn == button ? '#3a3' : '#a33');
        btn.disabled = true;
    })
    setFeedback('Correct!');
    setTimeout(() => { // Resets the questions
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.style.backgroundColor = '';
        });
        setFeedback('');
        title.textContent = questionBank.noun.ultracrepidarian.word;
        description.textContent = questionBank.noun.ultracrepidarian.description;
    }, 1000);
}

// Changes the orientation of the answers based on the screen width
setInterval(() => {
    answerContainer.style.flexDirection = (
        window.innerWidth < 1200 ? 'column' : 'row'
    );
}, 100);

function setFeedback(message) {
    feedback.textContent = message;
}

function getRandom(dict) {
    var keys = Object.keys(dict);
    return dict[keys[(keys.length * Math.random()) << 0]];
}