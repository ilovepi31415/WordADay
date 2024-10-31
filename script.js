const root = document.documentElement;
const buttons = document.querySelectorAll('#answer-container button')
const answerA = document.getElementById('a');
const answerB = document.getElementById('b');
const answerC = document.getElementById('c');
const answerContainer = document.getElementById('answer-container');
const title = document.getElementById('title');
const description = document.getElementById('description');
const feedback = document.getElementById('feedback');
const scorecard = document.getElementById('score');
const questionBank = {
    frission: {
        word: 'Frission',
        definition: 'A brief moment of emotional excitement or fear that can cause a physical response, such as shivers or a tingling sensation',
        questions: [
            "As the orchestra played the final notes of the symphony, a ________ of excitement swept through the audience, leaving them breathless.",
            "She felt a ________ of fear when she heard the creaking floorboards behind her in the dimly lit hallway.",
            "The unexpected twist in the novel sent a ________ of surprise through the book club, sparking a lively discussion.",
            "Walking through the gallery, he experienced a ________ of inspiration as he stood before the masterpiece, captivated by its beauty."
        ]
    },
    locution: {
        word: 'Locution',
        definition: 'A particular form of expression or a peculiarity of phrasing; a word or expression characteristic of a region, group, or culture',
        questions: [
            "His use of archaic ________ gave the speech a formal tone that resonated with the audience.",
            "In her poetry, she often employed a unique ________ that set her apart from contemporary writers.",
            "The professor explained that regional ________ can significantly influence how a language evolves over time.",
            "During the debate, the politician's ________ was carefully chosen to evoke a sense of empathy among voters."
        ]
    },
    sonder: {
        word: 'Sonder',
        definition: 'The realization that each random passerby is living a life as vivid and complex as your own.',
        questions: [
            "In a bustling city, the feeling of __________ washed over her as she watched strangers interact.",
            "He experienced __________ when he paused to consider the stories behind the faces in the crowd.",
            "While traveling, she often felt __________, imagining the lives of people she met along the way.",
            "The concept of __________ can lead to a deeper empathy for others and an appreciation of their experiences."
        ]
    },        
    syzygy: {
        word: 'Syzygy',
        definition: 'A conjunction or opposition, especially of the moon with the sun; a straight-line configuration of three celestial bodies.',
        questions: [
            "The rare astronomical event of ________ occurs when the Earth, moon, and sun align in a straight line.",
            "During a total solar eclipse, a ________ takes place as the moon perfectly covers the sun.",
            "The ancient astronomers often observed ________ to predict lunar and solar eclipses.",
            "In astrology, a ________ is thought to influence the energies of the planets involved in the alignment."
        ]
    },
    ultracrepidarian: {
        word: 'Ultracrepidarian',
        definition: 'Someone with no special or expert knowledge on a subject but who still expresses an opinion on it',
        questions: [
            'The occasional patient is a(n) ________ and tries to explain their condition to the doctor, but they don\'t know what they\'re talking about',
            'Her _________ tendencies often led to eye rolls, especially when she tried to advise the engineer on complex technical matters',
            'Though he was well-versed in finance, his ________ comments on climate science quickly lost the room\'s respect',
            'The internet has turned everyone into a(n) ________, with countless people sharing opinions on topics they barely understand'
        ]
    }
}
let wordList = [];
let learnedWords = [];
let correctWord;
let score = 0;
let askedQuestions = 0;

// Runs on page load
function startUp() {
    // Creates the word list
    for (let word in questionBank) {
        wordList.push(word);
    }
    askQuestion();
}

// Runs when a button is clicked to submit an answer
function checkAnswer(button) {
    // Finds the correct answer
    buttons.forEach((btn) => {
        btn.style.backgroundColor = (btn.textContent == correctWord ? '#3a3' : '#a33');
        btn.disabled = true;
    });
    if (button.textContent == correctWord) {
        setFeedback('Correct!');
        score++;
    }
    else {
        setFeedback('Incorrect...')
    }
    updateScore();
    setTimeout(() => {
        resetQuestion();
        askQuestion();
    }, 1000);
}

// Creates the text for the next question
function askQuestion() {
    const answers = getGroup(wordList, 3);
    correctWord = getRandom(answers); // TODO: Make adaptable word bank
    title.textContent = 'Which word fills the blank?';
    console.log(answers)
    description.textContent = getRandom(questionBank[correctWord].questions);
    // Fill answer options
    answerA.textContent = answers[0];
    answerB.textContent = answers[1];
    answerC.textContent = answers[2];
}

// Changes text when a new word is being defined
function defineWord() {
    let newWord = getRandom(wordList);
    title.textContent = questionBank[newWord].word;
    description.textContent = questionBank[newWord].definition;
    learnedWords.push(newWord);
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

// Selects a random value from an array
function getRandom(arr) {
    return arr[arr.length * Math.random() << 0];
}

function getGroup(arr, n) {
    if (n > arr.length) {
        throw new Error("Cannot get more elements than length of array");
    }
    let shuffled = arr.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.random() * (i + 1) << 0;
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, n);
}

function resetQuestion() {
    buttons.forEach(btn => {
        btn.disabled = false;
        btn.style.backgroundColor = '';
    });
    setFeedback('');
}

function updateScore() {
    askedQuestions++;
    scorecard.textContent = `${score}/${askedQuestions}`;
}