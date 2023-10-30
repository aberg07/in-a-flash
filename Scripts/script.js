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
if (deck.length === 0) node = document.createTextNode(noCards.question);
else node = document.createTextNode(deck[0].question);
content = document.getElementById('question');
content.appendChild(node);
card.appendChild(content);
updateList();

function flip() {
    if (animated == false) {
        content = card.children[0];
        if (content.id == 'question') {
            content.id = 'answer';
            if (deck.length > 0) setTimeout(function() {content.innerText = deck[index].answer}, 600);
            else setTimeout(function() {content.innerText = noCards.answer}, 600);
        }
        else if (content.id == 'answer') {
            content.id = 'question';
            if (deck.length > 0) setTimeout(function() {content.innerText = deck[index].question}, 600);
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
    if (deck.length > 0) {
        index++;
        if (index >= deck.length) {
            index = 0;
        }
        content.id = 'question';
        content.innerText = deck[index].question;
    }
    else content.innerText = noCards.question;
}

function back() {
    content = card.children[0];
    if (deck.length > 0) {
        index--;
        if (index < 0) index = deck.length - 1;
        content.id = 'question';
        content.innerText = deck[index].question;
    }
    else content.innerText = noCards.question;
}

function addCard() {
    if (frontText.value === '' || backText.value === '') alert('Neither side of a card can be empty.');
    else {
        deck.push({'question' : frontText.value, 'answer' : backText.value});
        frontText.value = '';
        backText.value = '';
        alert('Card added successfully.');
        updateList();
        if (deck.length === 1) next();
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
    for (let i = 0; i < deck.length; i++){
        if (Object.values(deck[i])[0] === deleteList[0]) {
            deck.splice(i, 1);
            deleteList.shift();
            i = -1;
        }
    }
    updateList();
    if (deck.length === 0) flip();
    localStorage.setItem('deck', JSON.stringify(deck));
}

function shuffle() {
    if (deck.length === 0) return;
    else {
        for (let i = deck.length - 1; i > 0; i--) {
            // Generate a random index between 0 and i
            const randomIndex = Math.floor(Math.random() * (i + 1));
            // Swap elements at randomIndex and i
            [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]];
        }
        content = card.children[0];
        content.innerText = deck[index].question;
        updateList();
    }
}

function makeNewDeck() {
    tabs = document.getElementById('tabs');
    newTab = document.createElement('button');
    deckCollection.push([]);
    newTab.innerText = "Deck " + deckCollection.length;
    newTab.id = "deck-" +deckCollection.length;
    newTab.addEventListener('click', () => switchDecks(this.id));
    tabs.appendChild(newTab);
}

function switchDecks(deckId) {
}

function updateList() {
    questions = list.getElementsByTagName('input');
    labels = list.getElementsByTagName('label');
    while (questions.length > 0) {
        questions[0].remove();
        labels[0].remove();
    }
    for (let i = 0; i < deck.length; i++) {
        listQuestion = document.createElement('input');
        listQuestion.type = 'checkbox';
        listQuestion.id = `q${i}`;
        listQuestion.name = `q${i}`;
        listQuestion.value = deck[i].question;
        listQuestion.classList.add('question');
        listQuestionLabel = document.createElement('label');
        listQuestionLabel.setAttribute('for', listQuestion.id)
        listQuestionLabel.innerText = deck[i].question;
        list.appendChild(listQuestion);
        list.appendChild(listQuestionLabel);

    }
}