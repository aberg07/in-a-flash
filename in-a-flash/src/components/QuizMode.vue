<script setup lang="ts">
import FlashCard from './FlashCard.vue';
import {ref, computed, inject} from 'vue';
interface Card {question: string, answer: string};
interface Deck {deck_name: string, deck_content: Card[]};
type DeckCollection = Deck[];

const deckCollection: DeckCollection = inject('deckCollection')!;
const deckIndex = ref(0);
const index = ref(0);
const quizSetup = ref(true);
const quizFinished = ref(false);
const answered = ref(false);
const userAnswer = ref('');
const score = ref(0);
const getDeckNames = computed(() => {
    return deckCollection.map((deck: Deck) => deck.deck_name)
})
const getDeckContent = computed(() => {
    return deckCollection[deckIndex.value].deck_content;
});
const isCorrect = computed(() => {
    return (getDeckContent.value[index.value].answer.toLowerCase().trim() === userAnswer.value.toLowerCase().trim());
    //Trim whitespace and convert to lowercase both flashcard's answer and user input and then compare to prevent an answer being wrong due to space or capitalization inconsistencies
})
function startQuizMode() {
    let choice = <HTMLInputElement>document.getElementById('deck-selection')!; //We need to tell TypeScript that this is an input element so it sees that the "value" property exists
    deckIndex.value = Number(choice.value);
    if (getDeckContent.value.length === 0) alert("You cannot quiz yourself on an empty deck.");
    else quizSetup.value = false;
}
function submitAnswer() {
    if (isCorrect.value) score.value += 1;
    answered.value = true;
}
function next() {
    if (index.value + 1 === getDeckContent.value.length) {
        quizFinished.value = true;
        answered.value = false;
    }
    else {
        index.value += 1;
        answered.value = false;
        userAnswer.value = '';
    }
}

</script>

<template>
    <h1 class="text-center title">In a Flash - Quiz Mode</h1>
    <div class="container col-12" id="setup" v-if="quizSetup">
        <div id="quiz-container">
            <h3 id="quiz-mode-title">Choose a deck to be quizzed on!</h3>
            <!--Create drop down menu with options for each deck-->
            <form id="quiz-setup-form" @submit.prevent="startQuizMode">
                <select id="deck-selection">
                    <!--The value attribute corresponds to the deck index-->
                    <option v-for="(deck, index) in getDeckNames" :value="index">{{ deck }}</option>
                </select>
                <input id="setup-submit-button" class="btn btn-primary" type="submit" value="Quiz me!">
            </form>
        </div>
    </div>
    <div class="container-fluid" id="quiz" v-else>
        <!--Quiz hasn't finished and user hasn't answered-->
        <div v-if="!quizFinished && !answered" id="card-wrapper">
            <FlashCard class="flashcard" :front=getDeckContent[index].question :back=getDeckContent[index].answer :index=index />
        </div>
        <!--User has answered but quiz hasn't finished-->
        <div id="feedback-wrapper" v-else>
            <div id="feedback">
                <!--User's answer is correct-->
                <p v-if="answered && isCorrect">Correct! Current score: {{ score }} out of {{ getDeckContent.length }}</p>
                <!--User's answer is incorrect, compare correct answer to user's answer-->
                <div id="wrong-answer" v-else-if="(answered && !isCorrect) && !quizFinished">
                    <p>Wrong! Current score: {{ score }} out of {{ getDeckContent.length }}</p>
                    <p>Correct answer: <span class='correct'>{{ getDeckContent[index].answer }}</span></p>
                    <p>Your answer: <span class='wrong'>{{ userAnswer }}</span></p>
                </div>
                <!--Quiz has finished, displays final score-->
                <p v-if="quizFinished">You scored {{ score }} out of {{ getDeckContent.length }}!</p>
            </div>
        </div>
        <div class="container col-12" id="quiz-input-container">
            <form id="submit-form" v-on:submit.prevent="submitAnswer">
                <input type="text" id="answer" v-model="userAnswer" :disabled="answered || quizFinished">
                <!--Disable submit button if the user has already answered or the quiz is finished-->
                <input type="submit" class="btn btn-primary" value="Submit answer" :disabled="answered || quizFinished">
            </form>
            <!--Disable 'next' button if the quiz is finished-->
            <button type="button" id="quiz-next-button" class="btn btn-primary" @click="next()" v-if="answered" :disabled="quizFinished">Next</button>
        </div>
        <div v-if="quizFinished" class="container col-12" id="try-again-container">
            <div class="row justify-content-center">
                <button type="button" class="btn btn-primary" id="try-again-button" @click="quizSetup=true; quizFinished=false; answered=false; index=0; userAnswer=''; score=0">Try again?</button>
            </div>
        </div>
    </div>
    <div class="container-fluid" id="footer">
        <div id="links">
            <router-link to="/"><button class="btn btn-success" id="study-mode-button">Go to study mode</button></router-link>
        </div>
    </div>
</template>

<style>
.title {
    color: #FFFFFF;
}
#setup {
    margin-top: 2rem;
}
#quiz {
    margin-top: 2rem;
    display: flex;
    row-gap: 2rem;
    flex-direction: column;
    align-items: center;
}
#quiz-container {
    color: #FFFFFF;
    width: 100%;
    height: 30%;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}
#quiz-container form {
    width: 50%;
    display: flex;
    flex-flow: column;
    align-items: center;
    row-gap: 0.5rem;
}
#quiz-container form > select {
    width: 50%;
}
#quiz-container form > input {
    width: 50%;
    color: #FFFFFF;
}
#submit-form {
    display: flex;
    align-items: center;
}
#submit-form > * {
    height: 2.5rem;
}
#answer {
    background: black;
    color: white;
}
#card-wrapper {
    width: 50%;
    display: flex;
    justify-content: center;
}
#feedback-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
#feedback {
    color: #FFFFFF;
    grid-column: 1 / 3;
    height: 15%;
    width: 50%;
}
#feedback p {
    text-align: center;
    font-size: 1.5rem;
}
.correct {
    color:green;
    font-weight: bold;
}
.wrong {
    color: red;
    font-weight: bold;
}
#quiz-input-container {
    position: fixed;
    top: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
}
#try-again-button {
    width: 25%;
}
@media only screen and (max-width: 768px) {
    #quiz-container {
        width: 100%;
    }
    #quiz-container form {
        width: 100%;
    }
    .card {
        width: 100%;
    }
    #quiz-input-container {
        width: 100%;
    }
    #quiz-next-button {
        height: 2.5rem;
    }
    #card-wrapper {
        width: 100%;
    }
    #try-again-button {
        width: 85%;
    }
}
@media only screen and (min-width: 769px) and (max-width: 1024px) {
    #quiz-mode-title {
        font-size: 3rem;
    }
    .title {
        font-size: 4rem;
    }
    #quiz-setup-form {
        font-size: 2rem;
    }
    #quiz-container form > select {
        width: 100%;
    }
    #quiz-container form > input {
        width: 100%;
    }
    #setup-submit-button {
        font-size: 2rem;
    }
    #submit-form > * {
        font-size: 2rem;
        height: 20%;
    }
    #try-again-button {
        font-size: 2rem;
        width: 63%;
    }
    #answer {
        height: 4rem;
    }
    .card {
        width: 100%;
    }
    #card-wrapper {
        width: 70%;
    }
    #feedback > p {
        font-size: 3rem;
    }
    #wrong-answer > p {
        font-size: 3rem;
    }
    #quiz-next-button {
        font-size: 2rem;
    }
    #quiz-input-container {
        top: 48%;
    }
}
</style>