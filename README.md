# In a Flash

In a Flash is a flashcard app built with Vue and Bootstrap. Current features include:
- Creating multiple flashcard decks
- Using your browser's local storage to save the flashcards you have made
- A quiz minigame using flashcards you have made

## Updates
2024-01-21: This was a major design and structural overhaul I've been working on steadily over the past 2 weeks using what I've learned on my own and with FreeCodeCamp's curriculum. The update includes:
- Responsive design, allowing for a much cleaner display on mobile
- Ability to delete individual cards in addition to being able to delete multiple cards at once
- The renaming and deleting deck functions have been moved and can be accessed from each deck's tab. The previous rename/delete deck buttons would only work on the user's current deck.
- New flashcard animations

Also a major improvement over the previous version is its use of Vue SFCs - the previous version existed in one big HTML file using the Vue CDN. I'm happy to say this project's code is now much cleaner than the last version's!

### Planned features
- Switching the app's language (I am planning to introduce Spanish and Japanese for the time being, as they are the only other languages I can speak fluently)
- Transition to a full stack web app using databases and user authentication for flashcard storage
