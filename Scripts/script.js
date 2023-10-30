const card = document.getElementById('card');
card.addEventListener('click', () => flip());
card.addEventListener('animationend', () => unflip());
const backButton = document.getElementById('back-button');
backButton.addEventListener('click', () => back());
const nextButton = document.getElementById('next-button');
nextButton.addEventListener('click', () => next());
const frontText = document.getElementById('front-text');
const backText = document.getElementById('back-text');
const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', () => addCard())
const deck1Button = document.getElementById('deck-1');
deck1Button.addEventListener('click', function() {
    switchDecks(this.name);
});
deck1Button.classList.add('open');
const list = document.getElementById('list-container');
const deleteButton = document.getElementById('delete-button');
deleteButton.addEventListener('click', () => deleteList());
const shuffleButton = document.getElementById('shuffle-button');
shuffleButton.addEventListener('click', () => shuffle());
const newDeckButton = document.getElementById('new-deck-button');
newDeckButton.addEventListener('click', () => makeNewDeck());

const storedCards = localStorage.getItem('deck');
let deck = JSON.parse(storedCards);
if (JSON.parse(storedCards) === null) deck = [];
deckCollection = [deck];
let noCards = {'question' : 'There are currently no cards in your deck. Add one now!',
                'answer' : 'There are currently no cards in your deck. Add one now!'}
let index = 0;
let deckIndex = 0;
let animated = false;
if (deckCollection[deckIndex].length === 0) node = document.createTextNode(noCards.question);
else node = document.createTextNode(deckCollection[deckIndex][0].question);
content = document.getElementById('question');
content.appendChild(node);
card.appendChild(content);
updateList();

function flip() {
    if (animated == false) {
        content = card.children[0];
        if (content.id == 'question') {
            content.id = 'answer';
            if (deckCollection[deckIndex].length > 0) setTimeout(function() {content.innerText = deckCollection[deckIndex][index].answer}, 600);
            else setTimeout(function() {content.innerText = noCards.answer}, 600);
        }
        else if (content.id == 'answer') {
            content.id = 'question';
            if (deckCollection[deckIndex].length > 0) setTimeout(function() {content.innerText = deckCollection[deckIndex][index].question}, 600);
            else setTimeout(function() {content.innerText = noCards.question}, 600);
        }
    }
    animated = true;
    card.classList.add('active');
}

function unflip() {
    card.classList.remove('active');
    animated = false;
}

function next() {
    content = card.children[0];
    if (deckCollection[deckIndex].length > 0) {
        index++;
        if (index >= deckCollection[deckIndex].length) {
            index = 0;
        }
        content.id = 'question';
        content.innerText = deckCollection[deckIndex][index].question;
    }
    else content.innerText = noCards.question;
}

function back() {
    content = card.children[0];
    if (deckCollection[deckIndex].length > 0) {
        index--;
        if (index < 0) index = deckCollection[deckIndex].length - 1;
        content.id = 'question';
        content.innerText = deckCollection[deckIndex][index].question;
    }
    else content.innerText = noCards.question;
}

function addCard() {
    if (frontText.value === '' || backText.value === '') alert('Neither side of a card can be empty.');
    else {
        deckCollection[deckIndex].push({'question' : frontText.value, 'answer' : backText.value});
        frontText.value = '';
        backText.value = '';
        alert('Card added successfully.');
        updateList();
        if (deckCollection[deckIndex].length === 1) next();
    }
    localStorage.setItem('deck', JSON.stringify(deck));
}

function deleteList() {
    questions = list.getElementsByTagName('label');
    checkboxes = list.getElementsByTagName('input');
    let deleteList = [];
    for (let i = 0; i < questions.length; i++) {
        if (checkboxes[i].checked == true) deleteList.push(questions[i].innerText);
    }
    if (deleteList.length === 0) return;
    for (let i = 0; i < deckCollection[deckIndex].length; i++){
        if (Object.values(deckCollection[deckIndex][i])[0] === deleteList[0]) {
            deckCollection[deckIndex].splice(i, 1);
            deleteList.shift();
            i = -1;
        }
    }
    updateList();
    if (deckCollection[deckIndex].length === 0) flip();
    localStorage.setItem('deck', JSON.stringify(deck));
}

function shuffle() {
    if (deckCollection[deckIndex].length === 0) return;
    else {
        for (let i = deck.length - 1; i > 0; i--) {
            // Generate a random index between 0 and i
            const randomIndex = Math.floor(Math.random() * (i + 1));
            // Swap elements at randomIndex and i
            [deckCollection[deckIndex][i], deckCollection[deckIndex][randomIndex]] = [deckCollection[deckIndex][randomIndex], deckCollection[deckIndex][i]];
        }
        content = card.children[0];
        content.innerText = deckCollection[deckIndex][index].question;
        updateList();
    }
}

function makeNewDeck() {
    tabs = document.getElementById('tabs');
    newTab = document.createElement('button');
    deckCollection.push([]);
    newTab.innerText = "Deck " + deckCollection.length;
    newTab.id = "deck-" + deckCollection.length;
    newTab.classList.add('tab');
    newTab.name = deckCollection.length;
    newTab.addEventListener('click', function() {
        switchDecks(this.name);
    });
    tabs.appendChild(newTab);
}

function switchDecks(deckId) {
    tabs.children[deckIndex].classList.remove('open');
    deckIndex = deckId-1;
    tabs.children[deckIndex].classList.add('open');
    updateList();
}

function updateList() {
    questions = list.getElementsByTagName('input');
    labels = list.getElementsByTagName('label');
    while (questions.length > 0) {
        questions[0].remove();
        labels[0].remove();
    }
    for (let i = 0; i < deckCollection[deckIndex].length; i++) {
        listQuestion = document.createElement('input');
        listQuestion.type = 'checkbox';
        listQuestion.id = `q${i}`;
        listQuestion.name = `q${i}`;
        listQuestion.value = deckCollection[deckIndex][i].question;
        listQuestion.classList.add('question');
        listQuestionLabel = document.createElement('label');
        listQuestionLabel.setAttribute('for', listQuestion.id)
        listQuestionLabel.innerText = deckCollection[deckIndex][i].question;
        list.appendChild(listQuestion);
        list.appendChild(listQuestionLabel);
    }
}