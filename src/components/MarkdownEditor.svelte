<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { marked } from 'marked';
    import { Bold, Italic, Link, Heading, List, Code, Eye, Edit3 } from 'lucide-svelte';

    /**
     * @typedef {Object} Props
     * @property {string} [value]
     */

    /** @type {Props} */
    let { value = $bindable('') } = $props();
    let previewMode = $state(false);
    let editorElement = $state();

    const dispatch = createEventDispatcher();

    function handleInput() {
        dispatch('change', value);
    }

    function togglePreview() {
        previewMode = !previewMode;
    }

    let htmlContent = $derived(marked(value));

    // Simple toolbar actions
    function insertMarkdown(prefix, suffix = '') {
        const selectionStart = editorElement.selectionStart;
        const selectionEnd = editorElement.selectionEnd;
        const selectedText = value.substring(selectionStart, selectionEnd);

        const beforeSelection = value.substring(0, selectionStart);
        const afterSelection = value.substring(selectionEnd);

        value = beforeSelection + prefix + selectedText + suffix + afterSelection;

        // Dispatch change event
        dispatch('change', value);

        // Set cursor position
        setTimeout(() => {
            editorElement.focus();
            if (selectedText.length > 0) {
                editorElement.selectionStart = selectionStart + prefix.length;
                editorElement.selectionEnd = selectionStart + prefix.length + selectedText.length;
            } else {
                editorElement.selectionStart = selectionStart + prefix.length;
                editorElement.selectionEnd = selectionStart + prefix.length;
            }
        }, 0);
    }

    function insertBold() {
        insertMarkdown('**', '**');
    }

    function insertItalic() {
        insertMarkdown('*', '*');
    }

    function insertLink() {
        insertMarkdown('[', '](url)');
    }

    function insertHeading() {
        insertMarkdown('## ');
    }

    function insertList() {
        insertMarkdown('- ');
    }

    function insertCodeBlock() {
        insertMarkdown('```\n', '\n```');
    }
</script>

<div class="markdown-editor">
    <div class="toolbar">
        <button on:click={insertBold} title="Bold">
            <Bold size={16} />
        </button>
        <button on:click={insertItalic} title="Italic">
            <Italic size={16} />
        </button>
        <button on:click={insertLink} title="Link">
            <Link size={16} />
        </button>
        <button on:click={insertHeading} title="Heading">
            <Heading size={16} />
        </button>
        <button on:click={insertList} title="List">
            <List size={16} />
        </button>
        <button on:click={insertCodeBlock} title="Code Block">
            <Code size={16} />
        </button>
        <div class="spacer"></div>
        <button on:click={togglePreview} class:active={previewMode}>
            {#if previewMode}
                <Edit3 size={16} />
                <span class="btn-text">Edit</span>
            {:else}
                <Eye size={16} />
                <span class="btn-text">Preview</span>
            {/if}
        </button>
    </div>

    <div class="editor-content">
        {#if previewMode}
            <div class="preview-pane">
                {@html htmlContent}
            </div>
        {:else}
            <textarea bind:value bind:this={editorElement} on:input={handleInput} placeholder="Write your markdown content here..."></textarea>
        {/if}
    </div>
</div>

<style>
    .markdown-editor {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .toolbar {
        display: flex;
        padding: 10px;
        border-bottom: 1px solid #e0e0e0;
        background-color: #f9f9f9;
    }

    .toolbar button {
        background: none;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 5px 10px;
        margin-right: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .toolbar button:hover {
        background-color: #f0f0f0;
    }

    .toolbar button.active {
        background-color: #e0e0e0;
    }

    .btn-text {
        margin-left: 5px;
        font-size: 14px;
    }

    .spacer {
        flex: 1;
    }

    .editor-content {
        flex: 1;
        overflow: auto;
    }

    textarea {
        width: 100%;
        height: 100%;
        border: none;
        resize: none;
        padding: 15px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 14px;
        line-height: 1.5;
        outline: none;
    }

    .preview-pane {
        padding: 15px;
        height: 100%;
        overflow: auto;
        line-height: 1.6;
    }

    .preview-pane h1,
    .preview-pane h2,
    .preview-pane h3 {
        margin-top: 1em;
        margin-bottom: 0.5em;
    }

    .preview-pane p {
        margin-bottom: 1em;
    }

    .preview-pane ul,
    .preview-pane ol {
        margin-bottom: 1em;
        padding-left: 2em;
    }

    .preview-pane code {
        background-color: #f0f0f0;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Courier New', Courier, monospace;
    }

    .preview-pane pre {
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 4px;
        overflow-x: auto;
        margin-bottom: 1em;
    }
</style>
