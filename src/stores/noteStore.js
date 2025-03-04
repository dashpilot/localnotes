import { writable } from 'svelte/store';

// Create stores
export const notes = writable([]);
export const activeNoteId = writable(null);

// Local storage key
const STORAGE_KEY = 'markdown-notes-data';

// Load notes from localStorage
export function loadNotes() {
    try {
        const savedNotes = localStorage.getItem(STORAGE_KEY);
        if (savedNotes) {
            notes.set(JSON.parse(savedNotes));
        }
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

// Save notes to localStorage
export function saveNotes() {
    try {
        notes.subscribe((value) => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        })();
    } catch (error) {
        console.error('Error saving notes:', error);
    }
}

// Create a new note
export function createNote() {
    const newNote = {
        id: Date.now().toString(),
        title: 'Untitled',
        content: '',
        tags: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    notes.update((currentNotes) => {
        const updatedNotes = [newNote, ...currentNotes];
        return updatedNotes;
    });

    activeNoteId.set(newNote.id);
    saveNotes();
}

// Update a note
export function updateNote(id, updates) {
    notes.update((currentNotes) => {
        return currentNotes.map((note) => {
            if (note.id === id) {
                return {
                    ...note,
                    ...updates,
                    updatedAt: Date.now(),
                };
            }
            return note;
        });
    });

    saveNotes();
}

// Delete a note
export function deleteNote(id) {
    notes.update((currentNotes) => {
        return currentNotes.filter((note) => note.id !== id);
    });

    activeNoteId.update((currentId) => {
        if (currentId === id) {
            return null;
        }
        return currentId;
    });

    saveNotes();
}
