const answerA = document.getElementById('a');
const answerB = document.getElementById('b');
const answerC = document.getElementById('c');
const answerContainer = document.getElementById('answer-container');

function hello(button) {
    button.style.backgroundColor = '#fff';
}

// Changes the orientation of the answers based on the screen width
setInterval(() => {
    answerContainer.style.flexDirection = (
        window.innerWidth < 1200 ? 'column' : 'row'
    );
}, 100);