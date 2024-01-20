import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import StudyMode from './components/StudyMode.vue'
import QuizMode from './components/QuizMode.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/',
        name: 'Study Mode',
        component: StudyMode},
        {path: '/quiz',
        name: 'Quiz Mode',
        component: QuizMode}
    ]
});
const app = createApp(App);
app.use(router);
app.mount('#app')
