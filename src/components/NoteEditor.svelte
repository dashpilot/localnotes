<script>
    import { run } from 'svelte/legacy';
    import { onMount } from 'svelte';
    import { notes, activeNoteId, updateNote } from '../stores/noteStore';
    import MarkdownEditor from './MarkdownEditor.svelte';
    import { Tag, Plus, X, Clock } from 'lucide-svelte';

    let activeNote = $state();
    let title = $state('');
    let content = $state('');
    let tags = $state([]);
    let newTag = $state('');

    run(() => {
        if ($activeNoteId) {
            activeNote = $notes.find((note) => note.id === $activeNoteId);
            if (activeNote) {
                title = activeNote.title;
                content = activeNote.content;
                tags = [...activeNote.tags];
            }
        }
    });

    function handleTitleChange() {
        if ($activeNoteId) {
            updateNote($activeNoteId, { title });
        }
    }

    function handleContentChange() {
        if ($activeNoteId) {
            updateNote($activeNoteId, { content });
        }
    }

    function addTag() {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            tags = [...tags, newTag.trim()];
            updateNote($activeNoteId, { tags });
            newTag = '';
        }
    }

    function removeTag(tag) {
        tags = tags.filter((t) => t !== tag);
        updateNote($activeNoteId, { tags });
    }

    function handleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    }
</script>

<div class="editor-container">
    <div class="editor-header">
        <input type="text" placeholder="Note title" bind:value={title} on:input={handleTitleChange} class="title-input" />

        <div class="metadata">
            <div class="last-modified">
                <Clock size={14} />
                <span>Last Modified: {new Date(activeNote?.updatedAt).toLocaleString()}</span>
            </div>
        </div>

        <div class="tags-section">
            <div class="tags-header">
                <Tag size={14} />
                <span>Tags</span>
            </div>

            <div class="tags-container">
                {#each tags as tag}
                    <div class="tag">
                        {tag}
                        <button class="remove-tag" on:click={() => removeTag(tag)} aria-label="Remove tag">
                            <X size={14} />
                        </button>
                    </div>
                {/each}
            </div>

            <div class="tag-input-container">
                <input type="text" placeholder="Add tag..." bind:value={newTag} on:keydown={handleKeydown} />
                <button on:click={addTag} aria-label="Add tag">
                    <Plus size={16} />
                </button>
            </div>
        </div>
    </div>

    <MarkdownEditor bind:value={content} on:change={handleContentChange} />
</div>

<style>
    .editor-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .editor-header {
        padding: 15px;
        border-bottom: 1px solid #e0e0e0;
    }

    .title-input {
        width: 100%;
        font-size: 24px;
        font-weight: bold;
        border: none;
        outline: none;
        margin-bottom: 10px;
    }

    .metadata {
        font-size: 12px;
        color: #888;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
    }

    .last-modified {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .tags-section {
        margin-top: 15px;
    }

    .tags-header {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 8px;
        font-size: 14px;
        color: #666;
    }

    .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 10px;
    }

    .tag {
        display: flex;
        align-items: center;
        background-color: #f0f0f0;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
    }

    .remove-tag {
        background: none;
        border: none;
        cursor: pointer;
        margin-left: 5px;
        display: flex;
        align-items: center;
        color: #888;
    }

    .remove-tag:hover {
        color: #ff5252;
    }

    .tag-input-container {
        position: relative;
        display: flex;
        align-items: center;
    }

    .tag-input-container input {
        width: 100%;
        padding: 8px 35px 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-size: 14px;
        outline: none;
    }

    .tag-input-container input:focus {
        border-color: #4a69bd;
    }

    .tag-input-container button {
        position: absolute;
        right: 8px;
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
    }

    .tag-input-container button:hover {
        color: #4a69bd;
    }
</style>
