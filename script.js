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
let wordList = [];
let learnedWords = [];
let correctWord;
let score = 0;
let askedQuestions = 0;
const message = new SpeechSynthesisUtterance();
const speechSynthesis = window.speechSynthesis;
const questionBank = {
    acumen: {
        word: 'Acumen',
        definition: 'The ability to make good judgments and quick decisions, typically in a particular domain.',
        questions: [
            "Her business ________ allowed her to spot lucrative opportunities that others overlooked.",
            "With his keen ________, he navigated the complexities of the stock market with ease, maximizing his investments.",
            "The chef’s culinary ________ was evident in the way he combined unexpected flavors to create exquisite dishes.",
            "His ________ in negotiations turned potential conflicts into mutually beneficial agreements, earning him respect in the industry."
        ]
    },
    balter: {
        word: 'Balter',
        definition: 'To dance clumsily or ungracefully; to move or dance in a carefree manner.',
        questions: [
            "As the music played, she began to ________ around the living room, completely lost in the rhythm and her own joy.",
            "Despite his lack of formal training, he didn’t hesitate to ________ at the wedding, drawing smiles from everyone around him.",
            "Under the stars, the friends began to ________ together, their laughter mingling with the soft sounds of nature.",
            "At the festival, children and adults alike ________ in a whimsical display of carefree abandon, celebrating life in the moment."
        ]
    },    
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
    obdurate: {
        word: 'Obdurate',
        definition: 'Stubbornly refusing to change one’s opinion or course of action; unyielding.',
        questions: [
            "Despite the overwhelming evidence against him, he remained ________ in his denial, refusing to acknowledge any wrongdoing.",
            "Her ________ stance on the issue made it difficult for her colleagues to engage in productive discussions.",
            "Even in the face of heartfelt pleas, the CEO was ________ about his decision to cut costs, prioritizing profit over employee welfare.",
            "His ________ refusal to compromise led to a stalemate in negotiations, frustrating everyone involved."
        ]
    },    
    raconteur: {
        word: 'Raconteur',
        definition: 'A person who tells anecdotes in a skillful and amusing way.',
        questions: [
            "At the party, he quickly became the star of the evening, captivating everyone with his ________ tales of adventure and mischief.",
            "Her knack for storytelling made her the perfect ________, enchanting listeners with her vivid descriptions of past travels.",
            "Every family gathering was a joy, thanks to Grandpa, the ultimate ________, whose humorous stories always had everyone laughing.",
            "During the book club, the author proved to be a skilled ________, sharing behind-the-scenes anecdotes that brought her characters to life."
        ]
    },    
    sonder: {
        word: 'Sonder',
        definition: 'The realization that each random passerby is living a life as vivid and complex as your own.',
        questions: [
            "As she sat in the café, sipping her coffee, a wave of __________ struck her while watching a couple argue animatedly at the next table.",
            "He felt a sudden sense of __________ while walking through the park, imagining the secret dreams and struggles of the joggers around him.",
            "While stuck in traffic, the driver experienced __________, contemplating the diverse lives of people in neighboring cars, each with their own stories to tell.",
            "In a crowded train, the overwhelming sense of __________ enveloped her, making her realize that every face was a novel waiting to be discovered."
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

// Runs on page load
function startUp() {
    // Creates the word list
    for (let word in questionBank) {
        wordList.push(word);
    }
    askQuestion();
}

// Runs when a button is clicked to submit an answer
async function checkAnswer(button) { // TODO: Make TTS optional
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
        await say('Incorrect. You should have said');
    }
    await say(correctWord);
    updateScore();
    resetQuestion();
    askQuestion();
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

document.addEventListener("keydown", function(event) {
    if (answerA.disabled == false) {
        switch (event.key) {
            case "1":
            checkAnswer(answerA);
                break;
            case "2":
            checkAnswer(answerB);
            break;
            case "3":
            checkAnswer(answerC);
            break;
        }
    }
});

function say(myMessage) {
    message.text = myMessage;
    return new Promise((resolve) => {
        message.onend = () => {
            resolve();
        };
        speechSynthesis.speak(message);
    })
    
}