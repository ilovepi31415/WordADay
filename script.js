const buttons = document.querySelectorAll('#answer-container button')
const answerA = document.getElementById('a');
const answerB = document.getElementById('b');
const answerC = document.getElementById('c');
const answerContainer = document.getElementById('answer-container');
const feedback = document.getElementById('feedback');

function answer(button) {
    button.style.backgroundColor = '#fff';
    buttons.forEach((btn) => {
        btn.disabled = true;
    })
    setFeedback('Correct!');
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