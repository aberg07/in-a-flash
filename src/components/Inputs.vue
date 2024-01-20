<script setup lang="ts">
import { ref } from 'vue';
interface Card {question: string, answer: string};
interface Deck {deck_name: string, deck_content: Card[]};
type DeckCollection = Deck[];
defineProps({
    deck: {
        type: Object as () => Deck,
        required: true
    },
    deckSet: {
        type: Array as () => DeckCollection,
        required: true
    },
    deckIndex: {
        type: Number,
        required: true
    },
    openButtonIndex: {
        type: Number,
        required: true
    }
});
const emit = defineEmits(['addCard', 'addDeck', 'switchDecks', 'deleteDeck', 'renameDeck', 'shuffleDeck', 'deleteCard', 'deleteCheckedCards']);
const frontText = ref('');
const backText = ref('');

function clearText() {
    frontText.value = '';
    backText.value = '';
}

</script>

<template>
    <div class="container col-12" id="card-maker-wrapper">
        <h3 class="text-center" id="deck-name-title">{{deckSet[deckIndex].deck_name}}</h3>
        <div id="input-container">
            <!--Prevent default submit behaviour on forms with '.prevent'-->
            <form id="card-maker" v-on:submit.prevent="$emit('addCard', frontText, backText); clearText()">
                <label for="front-text">Front Text</label>
                <input type="text" id="front-text" v-model="frontText">
                <label for="back-text">Back Text</label>
                <input type="text" id="back-text" v-model="backText">
                <button class="btn btn-primary" type="submit" id="submit-button">Add card</button>
            </form>
        </div>
    </div>
    <div class='container col-12' id="list-container-wrapper">
        <div id="tabs">
            <!--Make a tab for each deck, v-bind the 'open' class to change its style and make the open
            tab stand out-->
            <div class="tab" v-for="(i, index) in deckSet" :key="index" :class="{'open': openButtonIndex == index}">
                <!--A deck name longer than 17 characters will be cut off with a ... to make tabs with long names look neater-->
                <div class="switch-tab" @click="$emit('switchDecks', index)"><span>{{ i.deck_name.length > 17 ? i.deck_name.slice(0, 17) + "..." : i.deck_name }}</span></div>
                <i class="fa-solid fa-pencil rename-deck-icon" @click="$emit('renameDeck', index)"></i>
                <i class="fa-solid fa-x delete-deck-icon" @click="$emit('deleteDeck', index)"></i>
            </div>
        </div>
        <div class="container" id="list-container">
            <div class="row" v-for="(i, index) in deck.deck_content">
                <div class="col-1 delete-card-col">
                    <i class="fa-solid fa-trash delete-card-icon" @click="$emit('deleteCard', index)"></i>
                </div>
                <div class="col-1 d-flex justify-content-center align-items-center">
                    <input class="form-check-input" type="checkbox" :id="String(index)"/>
                </div>
                <div class="col-10 check-card-col">
                    <label class="form-check-label" :for="String(index)"><span>{{ i.question }}</span></label>
                </div>
            </div>
        </div>
    </div>
    <div class="container" id="buttons">
        <button type="button" id="delete-button" class="btn btn-danger" @click="$emit('deleteCheckedCards')">Delete checked cards</button>
        <button type="button" id='shuffle-button' class="btn btn-primary" @click="$emit('shuffleDeck')">Shuffle deck</button>
        <button type='button' id="new-deck-button" class="btn btn-primary" @click="$emit('addDeck')">Create new deck</button>
    </div>
</template>

<style>
#card-maker-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    row-gap: 1rem;
    background-color: #f7d92a;
    border: 1px solid black;
    border-radius: 5px;
    margin: 1rem auto;
    width: 50%;
}
#input-container {
    width: 60%;
    height: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    margin: 0 auto;
}
#list-container-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 52%;
    height: 25%;
}
#list-container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background-color: beige;
    overflow-x: hidden;
    overflow-y: auto;
    border-bottom: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
}
.form-check {
    min-width: 95%;
    max-width: 95%;
}
#list-container label {
    margin: 0;
}
#tabs {
    max-width: 100%;
    display: flex;
    flex-wrap: wrap;
}
#tabs .tab {
    background-color: #ccccad;
    cursor: pointer;
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-radius: 5px 5px 0 0;
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: max-content min-content min-content;
    column-gap: 0.4rem;
}
#tabs .tab:hover {
    background-color: #8a8a6e;
}
#tabs .tab.open {
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 1px solid black;
    background-color: beige;
}
.switch-tab {
    grid-column: 1;
}
.rename-deck-icon {
    grid-column: 2;
    transition: color 0.2s;
}
.rename-deck-icon:hover {
    color: blue;
}
.delete-deck-icon {
    grid-column: 3;
    transition: color 0.2s;
}
.delete-deck-icon:hover {
    color: red;
    cursor: pointer;
}
.delete-card-col {
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
}
.check-card-col {
    display: flex;
    align-items: center;
    justify-content: center;
}
.delete-card-icon {
    grid-column: 2;
    transition: color 0.2s;
}
.delete-card-icon:hover {
    cursor: pointer;
    color: red;
}
#card-maker {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto auto;
    column-gap: 1rem;
    row-gap: 1rem;
    justify-items: center;
    align-items: center;
}
#card-maker #submit-button {
    grid-column: 1/ span 2;
    grid-row: 3;
    justify-self: stretch;
    place-self: stretch;
}
#buttons {
    width: 50%;
    display: flex;
    justify-content: center;
}
#buttons button {
    border: 1px solid black;
    width: 33%;
}
@media only screen and (max-width: 768px) {
    #card-maker-wrapper {
        width: 90%;
    }
    #list-container-wrapper {
        width: 100%;
    }
    
    #buttons {
        width: 90%;
        flex-direction: column;
        align-items: center;
    }
    #buttons button {
        width: 50%;
    }
}
@media only screen and (min-width: 769px) and (max-width: 1024px) {
    #card-maker-wrapper {
        width: 75%;
    }
    #deck-name-title {
        font-size: 2.5rem;
    }
    #card-maker > * {
        font-size: 1.5rem;
    }
    #list-container-wrapper {
        width: 78%;
    }
    .switch-tab > span {
        font-size: 1.7rem;
    }
    .form-check-label > span {
        font-size: 1.7rem;
    }
    .form-check-input {
        width: 70%;
        height: 70%;
    }
    .delete-card-icon {
        font-size: 1.7rem;
    }
    .rename-deck-icon {
        font-size: 1.7rem;
    }
    .delete-deck-icon {
        font-size: 1.7rem;
    }
    #buttons {
        width: 79%;
    }
    #buttons > button {
        font-size: 1.7rem;
    }
}
</style>