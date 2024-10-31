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
const speaker = document.getElementById('mute');
const message = new SpeechSynthesisUtterance();
const speechSynthesis = window.speechSynthesis;
let wordList = [];
let learnedWords = [];
let category;
let correctWord;
let score = 0;
let askedQuestions = 0;
let muted = true;
const weights = {
    definition: 1,
    questions: 3
};
const prompts = {
    definition: 'Which word matches the definition?',
    questions: 'Which word fills the blank?'
}
let weightedCategories = [];
const questionBank = {
    abscond: {
        definition: ['To leave hurriedly and secretly, typically to avoid detection or arrest.'],
        questions: [
            "The thief managed to __________ with a bag full of stolen jewelry before the alarm could be raised.",
            "After embezzling funds, the accountant decided to __________ to another country to evade the law.",
            "During the night, the group planned to __________ from the camp, hoping to escape their watchful guards.",
            "She felt the urge to __________ from the party, overwhelmed by the crowd and the noise surrounding her."
        ]
    },    
    acumen: {
        definition: ['The ability to make good judgments and quick decisions, typically in a particular domain.'],
        questions: [
            "Her business ________ allowed her to spot lucrative opportunities that others overlooked.",
            "With his keen ________, he navigated the complexities of the stock market with ease, maximizing his investments.",
            "The chef\'s culinary ________ was evident in the way he combined unexpected flavors to create exquisite dishes.",
            "His ________ in negotiations turned potential conflicts into mutually beneficial agreements, earning him respect in the industry."
        ]
    },
    ameliorate: {
        definition: ['To make something better or improve a situation.'],
        questions: [
            "The charity aimed to __________ the living conditions of families in the impoverished neighborhood.",
            "He sought to __________ his reputation after the scandal by engaging in community service and outreach.",
            "Through education and outreach, they hoped to __________ the public\'s understanding of climate change issues.",
            "The new policies were designed to __________ the challenges faced by small businesses in the current economy."
        ]
    },    
    anachronistic: {
        definition: ['Belonging to a period other than that being portrayed; outdated or misplaced in time.'],
        questions: [
            "The film\'s depiction of cell phones in the 18th century felt ________, disrupting the historical accuracy of the scene.",
            "His use of old-fashioned slang seemed ________, as if he were from another era entirely.",
            "The knight\'s wristwatch was a humorous but ________ detail in the medieval-themed play.",
            "Wearing a Victorian dress to the modern art gallery made her appear delightfully ________, as though she\'d stepped out of a time machine."
        ]
    },    
    balter: {
        definition: ['To dance clumsily or ungracefully; to move or dance in a carefree manner.'],
        questions: [
            "As the music played, she began to ________ around the living room, completely lost in the rhythm and her own joy.",
            "Despite his lack of formal training, he didn\'t hesitate to ________ at the wedding, drawing smiles from everyone around him.",
            "Under the stars, the friends began to ________ together, their laughter mingling with the soft sounds of nature.",
            "At the festival, children and adults alike ________ in a whimsical display of carefree abandon, celebrating life in the moment."
        ]
    },
    eunoia: {
        definition: ['Beautiful thinking; a state of mind characterized by goodwill and kindness toward others.'],
        questions: [
            "Her __________ was evident in the way she spoke to strangers, always with a kind word or a smile.",
            "The therapist encouraged a practice of __________, cultivating thoughts of compassion and empathy for oneself and others.",
            "With a mindset of __________, he approached each conversation seeking understanding rather than conflict.",
            "The community leader\'s __________ inspired others, as her genuine concern and goodwill brought people together."
        ]
    },    
    fatuous: {
        definition: ['Silly and pointless; lacking intelligence or thought.'],
        questions: [
            "His ________ comments during the meeting only served to annoy his coworkers, who were trying to focus on serious issues.",
            "She laughed at the ________ joke, even though she knew it wasn\'t clever or original.",
            "The politician\'s ________ promises were quickly dismissed by voters who saw them as empty and unrealistic.",
            "Spending hours debating such a minor issue seemed ________, especially when there were more pressing matters at hand."
        ]
    },
    floccinaucinihilipilification: {
        definition: ['The action or habit of estimating something as worthless.'],
        questions: [
            "His tendency toward __________ often led him to dismiss even the most promising ideas without consideration.",
            "The __________ of the artist\'s early work by critics was later proven to be misguided as her talent flourished.",
            "In a world of rapid change, the __________ of traditional values can create a disconnect between generations.",
            "She expressed her __________ of the superficial values in modern society during the passionate debate."
        ]
    },    
    frission: {
        definition: ['A brief moment of emotional excitement or fear that can cause a physical response, such as shivers or a tingling sensation'],
        questions: [
            "As the orchestra played the final notes of the symphony, a ________ of excitement swept through the audience, leaving them breathless.",
            "She felt a ________ of fear when she heard the creaking floorboards behind her in the dimly lit hallway.",
            "The unexpected twist in the novel sent a ________ of surprise through the book club, sparking a lively discussion.",
            "Walking through the gallery, he experienced a ________ of inspiration as he stood before the masterpiece, captivated by its beauty."
        ]
    },
    insouciant: {
        definition: ['Showing a casual lack of concern; indifferent.'],
        questions: [
            "Despite the looming deadline, her ________ attitude made it seem like she had all the time in the world.",
            "He strolled through the park with an ________ demeanor, seemingly oblivious to the chaos surrounding him.",
            "The students were ________ about their grades, thinking they could still pass the course without studying.",
            "Her ________ approach to life often left her friends worried about her future plans."
        ]
    },
    lackadaisical: {
        definition: ['Lacking enthusiasm and determination; carelessly lazy.'],
        questions: [
            "His ________ effort during the project led to poor results that disappointed the entire team.",
            "The coach was frustrated with the players\' ________ attitude during practice, knowing they had potential to do better.",
            "She approached her studies in a ________ manner, rarely completing assignments on time.",
            "The company\'s ________ response to customer complaints damaged its reputation significantly."
        ]
    },        
    lacuna: {
        definition: ['An unfilled space or gap; a missing portion in a manuscript or text.'],
        questions: [
            "The historian noticed a significant __________ in the records, leaving a gap in the understanding of that era.",
            "Her essay had a __________ that made it difficult to follow her argument, requiring additional research to fill in the blanks.",
            "In the manuscript, the editor pointed out a __________ where crucial details about the protagonist's background were omitted.",
            "The sudden __________ in the lecture left students confused, as important concepts had not been addressed."
        ]
    },    
    locution: {
        definition: ['A particular form of expression or a peculiarity of phrasing; a word or expression characteristic of a region, group, or culture'],
        questions: [
            "His use of archaic ________ gave the speech a formal tone that resonated with the audience.",
            "In her poetry, she often employed a unique ________ that set her apart from contemporary writers.",
            "The professor explained that regional ________ can significantly influence how a language evolves over time.",
            "During the debate, the politician's ________ was carefully chosen to evoke a sense of empathy among voters."
        ]
    },
    obdurate: {
        definition: ['Stubbornly refusing to change one\'s opinion or course of action; unyielding.'],
        questions: [
            "Despite the overwhelming evidence against him, he remained ________ in his denial, refusing to acknowledge any wrongdoing.",
            "Her ________ stance on the issue made it difficult for her colleagues to engage in productive discussions.",
            "Even in the face of heartfelt pleas, the CEO was ________ about his decision to cut costs, prioritizing profit over employee welfare.",
            "His ________ refusal to compromise led to a stalemate in negotiations, frustrating everyone involved."
        ]
    },
    panacea: {
        definition: ['A solution or remedy for all difficulties or diseases; a cure-all.'],
        questions: [
            "Many people believe that technology is a __________ for all societal problems, but the reality is more complex.",
            "The politician\'s promise of tax cuts was seen as a __________ that would solve the nation\'s economic woes overnight.",
            "In the quest for personal happiness, some seek a __________ in material possessions, thinking they\'ll provide fulfillment.",
            "Health experts warn that there is no __________ for the obesity epidemic; rather, it requires a multifaceted approach."
        ]
    },
    paucity: {
        definition: ['The presence of something in insufficient quantities; scarcity.'],
        questions: [
            "The __________ of resources in the region has led to widespread poverty and desperation among the inhabitants.",
            "Despite the __________ of evidence, the scientist remained determined to pursue her hypothesis.",
            "The charity struggled to provide aid due to the __________ of donations during the economic downturn.",
            "A __________ of good leadership can result in chaos and confusion within an organization, hindering progress."
        ]
    },        
    perspicacious: {
        definition: ['Having a keen insight and understanding; able to notice and comprehend things that are not immediately obvious.'],
        questions: [
            "Her ________ observations during the meeting helped the team uncover issues they hadn\'t considered before.",
            "The detective\'s ________ mind allowed him to solve complex cases that left others puzzled.",
            "In business, his ________ instincts enabled him to predict market trends long before his competitors.",
            "Her ________ understanding of human nature made her an excellent judge of character, able to discern motivations at a glance."
        ]
    },
    quixotic: {
        definition: ['Exceedingly idealistic; unrealistic and impractical.'],
        questions: [
            "His __________ quest to eliminate all forms of pollution seemed noble but ultimately unattainable.",
            "Many viewed her plan to reform the entire education system as __________, given the complexities involved.",
            "The __________ notion of saving every endangered species led to a lack of focus on more achievable conservation goals.",
            "Despite the __________ nature of his dreams, he inspired others to think beyond the ordinary."
        ]
    },     
    raconteur: {
        definition: ['A person who tells anecdotes in a skillful and amusing way.'],
        questions: [
            "At the party, he quickly became the star of the evening, captivating everyone with his ________ tales of adventure and mischief.",
            "Her knack for storytelling made her the perfect ________, enchanting listeners with her vivid descriptions of past travels.",
            "Every family gathering was a joy, thanks to Grandpa, the ultimate ________, whose humorous stories always had everyone laughing.",
            "During the book club, the author proved to be a skilled ________, sharing behind-the-scenes anecdotes that brought her characters to life."
        ]
    },
    sibilant: {
        definition: ['Making or characterized by a hissing sound.'],
        questions: [
            "The __________ whispers in the dark made her heart race, filling her with an eerie sense of dread.",
            "As the snake slithered through the grass, its __________ movements were nearly imperceptible.",
            "In the stillness of the night, the __________ sound of the wind through the trees created a haunting melody.",
            "The teacher\'s __________ voice echoed in the classroom, captivating the attention of all the students."
        ]
    },      
    sonder: {
        definition: ['The realization that each random passerby is living a life as vivid and complex as your own.'],
        questions: [
            "As she sat in the café, sipping her coffee, a wave of __________ struck her while watching a couple argue animatedly at the next table.",
            "He felt a sudden sense of __________ while walking through the park, imagining the secret dreams and struggles of the joggers around him.",
            "While stuck in traffic, the driver experienced __________, contemplating the diverse lives of people in neighboring cars, each with their own stories to tell.",
            "In a crowded train, the overwhelming sense of __________ enveloped her, making her realize that every face was a novel waiting to be discovered."
        ]
    },           
    syzygy: {
        definition: ['A conjunction or opposition, especially of the moon with the sun; a straight-line configuration of three celestial bodies.'],
        questions: [
            "The rare astronomical event of ________ occurs when the Earth, moon, and sun align in a straight line.",
            "During a total solar eclipse, a ________ takes place as the moon perfectly covers the sun.",
            "The ancient astronomers often observed ________ to predict lunar and solar eclipses.",
            "In astrology, a ________ is thought to influence the energies of the planets involved in the alignment."
        ]
    },
    ultracrepidarian: {
        definition: ['Someone with no special or expert knowledge on a subject but who still expresses an opinion on it'],
        questions: [
            'The occasional patient is a(n) ________ and tries to explain their condition to the doctor, but they don\'t know what they\'re talking about',
            'Her _________ tendencies often led to eye rolls, especially when she tried to advise the engineer on complex technical matters',
            'Though he was well-versed in finance, his ________ comments on climate science quickly lost the room\'s respect',
            'The internet has turned everyone into a(n) ________, with countless people sharing opinions on topics they barely understand'
        ]
    },
    umbral: {
        definition: ['Relating to or resembling an umbra; shadowy or pertaining to deep shadows.'],
        questions: [
            "As the sun set, an ________ darkness began to envelop the forest, giving it an eerie stillness.",
            "The artist used ________ tones to create a sense of mystery and depth in her painting.",
            "Standing in the ________ shadows of the old mansion, he felt a chill run down his spine.",
            "In the ________ region of the eclipse, only a faint outline of the sun was visible, casting an ethereal glow."
        ]
    },
    voluble: {
        definition: ['Speaking or spoken incessantly and fluently; characterized by a ready and continuous flow of words, often to the point of overwhelming listeners.'],
        questions: [
            "During the interview, her ________ responses filled every pause, her words flowing non-stop, leaving little space for the interviewer\'s questions.",
            "He was so ________ that his friends struggled to get a word in, as he seamlessly jumped from topic to topic without ever slowing down.",
            "The politician\'s ________ speech overwhelmed the audience, his endless words making it difficult for anyone to follow his main points.",
            "Her ________ manner in meetings meant that conversations became one-sided, as she moved quickly from one detail to the next without pausing."
        ]
    }     
};

// Runs on page load
function startUp() {
    // Creates the word list
    for (let word in questionBank) {
        wordList.push(word);
    }
    console.log(wordList.length);
    for (let cat in weights) {
        for (let i = 0; i < weights[cat]; i++) {
            weightedCategories.push(cat);
        }
    }
    checkMuted();
    askQuestion();
}

// Runs when a button is clicked to submit an answer
async function checkAnswer(button) {
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
    category = getRandom(weightedCategories);
    correctWord = getRandom(answers); // TODO: Make adaptable word bank
    title.textContent = prompts[category];
    description.textContent = getRandom(questionBank[correctWord][category]);
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
    if (!muted) {
        message.text = myMessage;
        return new Promise((resolve) => {
            message.onend = () => {
                resolve();
            };
            speechSynthesis.speak(message);
        });
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

function toggleMute() {
    muted = !muted;
    checkMuted();
}

function checkMuted() {
    speaker.src = muted ? 'muted.png' : 'sound.png';
}