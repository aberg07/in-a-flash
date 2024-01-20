<script setup lang="ts">
import FlashCard from './FlashCard.vue';
import Inputs from './Inputs.vue'
import {ref, computed, inject} from 'vue';
interface Card {question: string, answer: string};
interface Deck {deck_name: string, deck_content: Card[]};
type DeckCollection = Deck[];

const deckCollection: DeckCollection = inject('deckCollection')!;
const deckIndex = ref(0);
const index = ref(0);
const openButtonIndex = ref(0);
const isFlipAnimated = ref(false);
const isNextAnimated = ref(false);
const isBackAnimated = ref(false);
const isFlipped = ref(false);

const getDeckContent = computed(() => {
    return deckCollection[deckIndex.value].deck_content;
});
function back() {
    setTimeout(() => {
      if (index.value - 1 >= 0) index.value--;
      else index.value = getDeckContent.value.length - 1;
      isFlipped.value = false;
    }, 250)
    isBackAnimated.value = true;
    setTimeout(() => isBackAnimated.value = false, 500);
}
function flip() {
    isFlipAnimated.value = true;
    setTimeout(() => {isFlipped.value = !isFlipped.value}, 600)
    setTimeout(() => isFlipAnimated.value = false, 2000);
}
function next() {
    setTimeout(() => {
      if (index.value + 1 < getDeckContent.value.length) index.value++;
      else index.value = 0;
      isFlipped.value = false;
    }, 250)
    isNextAnimated.value = true;
    setTimeout(() => isNextAnimated.value = false, 500);
}
function addCard(frontText: string, backText: string) {
  if (frontText.trim() === "" || backText.trim() === "") {
    alert('Neither side of a card can be empty.');
  }
  else {
    getDeckContent.value.push({question: frontText, answer: backText});
    localStorage.setItem("deckCollection", JSON.stringify(deckCollection));
  }
}
function addDeck() {
    deckCollection.push({"deck_name": "Deck " + String(deckCollection.length+1), "deck_content": []});
    localStorage.setItem("deckCollection", JSON.stringify(deckCollection));
}
function switchDecks(newDeckIndex: number) {
    deckIndex.value = newDeckIndex;
    openButtonIndex.value = newDeckIndex;
    index.value = 0;
}
function deleteDeck(deleteDeckIndex: number) {
    if (deckCollection.length == 1) alert("You cannot delete your only deck.");
    else if (confirm(`Are you sure you want to delete the deck "${deckCollection[deleteDeckIndex].deck_name}"?`)) {
    deckIndex.value = 0;
    openButtonIndex.value = 0;
    deckCollection.splice(deleteDeckIndex, 1);
    localStorage.setItem("deckCollection", JSON.stringify(deckCollection));
    }
}
function renameDeck(renameIndex: number) {
    let newName = String(prompt(`Please enter a new name for the deck "${deckCollection[renameIndex].deck_name}."`));
    if (newName == "") alert("A deck's name cannot be empty.");
    else if (newName != "null") { //If the user cancels the rename prompt, the function returns null - this will prevent the deck from being renamed "null"
      deckCollection[renameIndex].deck_name = newName;
      localStorage.setItem("deckCollection", JSON.stringify(deckCollection));
    }
}
function shuffleDeck() {
  //Shuffling an empty deck does nothing
    if (getDeckContent.value.length === 0) return;
    else {
        for (let i = getDeckContent.value.length - 1; i > 0; i--) {
            // Generate a random index between 0 and i
            const randomIndex = Math.floor(Math.random() * (i + 1));
            // Swap elements at randomIndex and i
            [getDeckContent.value[i], getDeckContent.value[randomIndex]] = [getDeckContent.value[randomIndex], getDeckContent.value[i]];
            isFlipped.value = false;
        }
        localStorage.setItem("deckCollection", JSON.stringify(deckCollection));
    }
}
function deleteCard(deleteIndex: number) {
  if (index.value === deleteIndex) {
    if (index.value -1 >= 0) {
      index.value--;
    }
  }
  getDeckContent.value.splice(deleteIndex, 1);
  isFlipped.value = false;
}
function deleteCheckedCards() {
  const list = document.getElementById('list-container')!; //Because TS doesn't have access to the DOM, the "!" at the end lets it know it's not null or undefined
  const checkboxes = [...list.getElementsByTagName('input')];
  index.value = 0; //Before deleting, set index to 0 as a safeguard to prevent out of bound errors
  deckCollection[deckIndex.value].deck_content = getDeckContent.value.filter((element, index) => checkboxes[index].checked == false && element) //Return only the cards that haven't been checked
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false; //Noticed that some checkboxes remained checked after deleting cards - for now this will ensure that user's checkbox input is reset
  }
  localStorage.setItem("deckCollection", JSON.stringify(deckCollection));
}
function animateDisable() {
    isFlipAnimated.value = true;
    setTimeout(() => isFlipAnimated.value = false, 2000);
}
</script>

<template>
  <h1 class="text-center title">In a Flash - Study Mode</h1>
  <div class="container col-12" id="button-wrapper">
    <div class="row h-100 align-items-center">
      <div class="col-2 d-flex justify-content-end" id="back-button-wrapper">
        <button type="button" class="btn btn-primary" id="back-button" @click="back()" :disabled="isFlipAnimated ||isNextAnimated || isBackAnimated">&lt;</button>
      </div>
      <div class="col-8 d-flex justify-content-center">
        <FlashCard v-if="getDeckContent.length > 0" class="flashcard" @click="flip()" :front=getDeckContent[index].question :back=getDeckContent[index].answer :isFlipped=isFlipped :isFlipAnimated=isFlipAnimated :isNextAnimated=isNextAnimated :isBackAnimated=isBackAnimated @flipAnimate="animateDisable()"/>
        <FlashCard v-else class="flashcard" @click="flip()" :front='"There are currently no cards in your deck. Add one now!"' :back='"There are currently no cards in your deck. Add one now!"' :deck=deckCollection[deckIndex].deck_content :isFlipped="isFlipped" :isFlipAnimated=isFlipAnimated :isNextAnimated=isNextAnimated :isBackAnimated=isBackAnimated @flipAnimate="animateDisable()"/>
      </div>
      <div class="col-2 d-flex justify-content-start" id="next-button-wrapper">
        <button type="button" class="btn btn-primary" id="next-button" @click="next()" :disabled="isFlipAnimated ||isNextAnimated || isBackAnimated">&gt;</button>
      </div>
    </div>
  </div>
  <Inputs :deck=deckCollection[deckIndex] :deckSet=deckCollection :deckIndex=deckIndex :openButtonIndex=openButtonIndex @addCard="addCard" @addDeck="addDeck" @switchDecks="switchDecks" @deleteDeck="deleteDeck" @renameDeck="renameDeck" @shuffleDeck="shuffleDeck" @deleteCard="deleteCard" @deleteCheckedCards="deleteCheckedCards"/>
  <div class="container-fluid" id="footer">
    <div id="links">
      <router-link to="/quiz"><button class="btn btn-success" id="quiz-mode-button">Go to quiz mode</button></router-link>
    </div>
  </div>

</template>

<style>
.title {
  color: #FFFFFF;
}
#button-wrapper {
  height: 20%;
  width: 60%;
}
#back-button {
  font-size: 2rem;
  height: 100%;
}
#next-button {
  font-size: 2rem;
  height: 100%;
}
#back-button-wrapper {
  height: 75%;
}
#next-button-wrapper {
  height: 75%;
}
#footer {
  width: 99%;
  position: fixed;
  top: 90%;
}
#links {
  width: 100%;
  display: flex;
  justify-content: center;
}
#study-mode-button {
  border: 1px solid black;
}
#quiz-mode-button {
  border: 1px solid black;
}
@media only screen and (max-width: 768px) {
  #button-wrapper {
    width: 90%;
  }
  #study-mode-button {
    width: 10rem;
  }
  #quiz-mode-button {
    width: 10rem;
  }
  #footer {
    width: 93%;
    position: fixed;
    top: 95%;
  }
  .card {
    width: 100%;
  }
}
@media only screen and (min-width: 769px) and (max-width: 1024px) {
  #button-wrapper {
    width: 90%;
  }
  #back-button-wrapper {
    height: 50%;
  }
  #next-button-wrapper {
    height: 50%;
  }
  #study-mode-button {
    font-size: 1.7rem;
  }
  #quiz-mode-button {
    font-size: 1.7rem;
  }
}
</style>