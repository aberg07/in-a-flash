<script setup lang="ts">
defineProps({
    front: {
        type: String,
        required: true
    },
    back: {
        type: String,
        required: true
    },
    isFlipped: {
        type: Boolean,
        required: false
    },
    isFlipAnimated: {
        type: Boolean,
        required: false
    },
    isNextAnimated: {
        type: Boolean,
        required: false
    },
    isBackAnimated: {
        type: Boolean,
        required: false
    }
});
</script>

<template>
    <div class="card" @click="$emit('flipAnimate')" :class="{ 'flip-animated':isFlipAnimated, 'next-animated':isNextAnimated, 'back-animated':isBackAnimated }">
        <p>{{ isFlipped ? back : front }}</p>
    </div>
</template>

<style>
.card {
    width: 70%;
    height: 10rem;
    background-color: #f7d92a;
    border: 1px solid black;
    padding: 2px;
    justify-self: center;
    align-self: center;
    display: flex;
    justify-content: center;
    text-align: center;
    overflow-y: auto;
}
@media only screen and (max-width: 768px) {
    .card > p {
        font-size: 1rem;
    }
}
@media only screen and (min-width: 769px) and (max-width: 1024px) {
    .card > p {
        font-size: 1.8rem;
    }
    .card {
        height: 14rem;
    }
}
.flip-animated {
    animation: flip 2s 1;
}
.flip-animated p {
    animation: flip 2s 1;
}
.next-animated {
    animation: next 0.5s 1;
}
.back-animated {
    animation: back 0.5s 1;
}
@keyframes flip {
    100% {
        transform: scaleX(-1);
    }
}
@keyframes next {
    10% {
        opacity: 0.8;
    }
    20% {
        opacity: 0.6;
    }
    30% {
        opacity: 0.4;
    }
    40% {
        opacity: 0.2;
    }
    50% {
        opacity: 0;
        translate: -100px;
    }
    55% {
        translate: 100px;
    }
    60% {
        opacity: 0.2;
    }
    70% {
        opacity: 0.4;
    }
    80% {
        opacity: 0.6;
    }
    90% {
        opacity: 0.8;
    }
    100% {
        opacity: 1;
    }
}
@keyframes back {
    10% {
        opacity: 0.8;
    }
    20% {
        opacity: 0.6;
    }
    30% {
        opacity: 0.4;
    }
    40% {
        opacity: 0.2;
    }
    50% {
        opacity: 0;
        translate: 100px;
    }
    55% {
        translate: -100px;
    }
    60% {
        opacity: 0.2;
    }
    70% {
        opacity: 0.4;
    }
    80% {
        opacity: 0.6;
    }
    90% {
        opacity: 0.8;
    }
    100% {
        opacity: 1;
    }
}
</style>