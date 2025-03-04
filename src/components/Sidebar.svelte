<script>
    import { stopPropagation } from 'svelte/legacy';
    import { createEventDispatcher } from 'svelte';
    import { notes, activeNoteId, createNote, deleteNote } from '../stores/noteStore';
    import { Search, Plus, X, ChevronLeft, Trash2 } from 'lucide-svelte';

    const dispatch = createEventDispatcher();

    let searchQuery = $state('');

    let filteredNotes = $derived(searchQuery ? $notes.filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase()) || note.content.toLowerCase().includes(searchQuery.toLowerCase())) : $notes);

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date
            .toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
            })
            .toUpperCase();
    }

    function handleCreateNote() {
        createNote();
    }
</script>

<div class="sidebar">
    <div class="sidebar-header">
        <div class="user-info">
            <div class="avatar">
                <span>L</span>
            </div>
            <h3>My Notes</h3>
        </div>
        <button class="toggle-btn" on:click={() => dispatch('toggleSidebar')}>
            <ChevronLeft size={18} />
        </button>
    </div>

    <div class="search-container">
        <div class="search-icon">
            <Search size={16} />
        </div>
        <input type="text" placeholder="Search notes..." bind:value={searchQuery} />
    </div>

    <button class="new-note-btn" on:click={handleCreateNote}>
        <Plus size={16} /> <span>Add new note</span>
    </button>

    <div class="notes-list">
        {#each filteredNotes as note (note.id)}
            <div class="note-item" class:active={note.id === $activeNoteId} on:click={() => activeNoteId.set(note.id)}>
                <div class="note-content">
                    <div class="note-date">{formatDate(note.updatedAt)}</div>
                    <div class="note-title">{note.title || 'Untitled'}</div>
                    <div class="note-preview">{note.content.substring(0, 60)}...</div>

                    <div class="note-tags">
                        {#each note.tags as tag}
                            <span class="tag">{tag}</span>
                        {/each}
                    </div>
                </div>

                <button class="delete-btn" on:click={stopPropagation(() => deleteNote(note.id))}>
                    <Trash2 size={16} />
                </button>
            </div>
        {/each}
    </div>
</div>

<style>
    .sidebar {
        width: 300px;
        background-color: white;
        border-right: 1px solid #e0e0e0;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #e0e0e0;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .avatar {
        width: 30px;
        height: 30px;
        background-color: #333;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }

    .toggle-btn {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .search-container {
        padding: 15px;
        position: relative;
    }

    .search-icon {
        position: absolute;
        left: 25px;
        top: 50%;
        transform: translateY(-50%);
        color: #888;
    }

    .search-container input {
        width: 100%;
        padding: 8px 12px 8px 35px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-size: 14px;
    }

    .new-note-btn {
        margin: 0 15px 15px;
        padding: 10px;
        background-color: #f5f5f5;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-size: 14px;
    }

    .notes-list {
        flex: 1;
        overflow-y: auto;
    }

    .note-item {
        padding: 15px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        position: relative;
        display: flex;
        justify-content: space-between;
    }

    .note-item:hover {
        background-color: #f9f9f9;
    }

    .note-item.active {
        background-color: #f0f0f0;
    }

    .note-date {
        font-size: 12px;
        color: #888;
        margin-bottom: 5px;
    }

    .note-title {
        font-weight: bold;
        margin-bottom: 5px;
    }

    .note-preview {
        font-size: 13px;
        color: #666;
        margin-bottom: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .note-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }

    .tag {
        font-size: 11px;
        background-color: #f0f0f0;
        padding: 2px 6px;
        border-radius: 10px;
    }

    .delete-btn {
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
        display: flex;
        align-items: center;
    }

    .note-item:hover .delete-btn {
        opacity: 1;
    }

    .note-content {
        flex: 1;
        overflow: hidden;
    }
</style>
