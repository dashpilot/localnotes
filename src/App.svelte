<script>
    import { onMount } from 'svelte';
    import Sidebar from './components/Sidebar.svelte';
    import NoteEditor from './components/NoteEditor.svelte';
    import { notes, activeNoteId, saveNotes, loadNotes } from './stores/noteStore';
    import { Menu } from 'lucide-svelte';
    import { Download, Upload } from 'lucide-svelte';

    let sidebarVisible = $state(true);

    onMount(() => {
        loadNotes();
    });

    function exportData() {
        const dataStr = JSON.stringify($notes);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'markdown-notes-backup.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    function importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const importedNotes = JSON.parse(event.target.result);
                    notes.set(importedNotes);
                    saveNotes();
                    alert('Notes imported successfully!');
                } catch (error) {
                    alert('Error importing notes: ' + error.message);
                }
            };

            reader.readAsText(file);
        };

        input.click();
    }
</script>

<main class="app-container">
    {#if sidebarVisible}
        <Sidebar on:toggleSidebar={() => (sidebarVisible = !sidebarVisible)} />
    {:else}
        <button class="show-sidebar-btn" onclick={() => (sidebarVisible = true)}>
            <Menu size={20} />
        </button>
    {/if}

    <div class="content">
        <div class="toolbar">
            <button onclick={exportData} class="toolbar-btn">
                <Download size={16} />
                <span>Export Notes</span>
            </button>
            <button onclick={importData} class="toolbar-btn">
                <Upload size={16} />
                <span>Import Notes</span>
            </button>
        </div>

        {#if $activeNoteId}
            <NoteEditor />
        {:else}
            <div class="empty-state">
                <h2>Select a note or create a new one</h2>
            </div>
        {/if}
    </div>
</main>

<style>
    .app-container {
        display: flex;
        height: 100vh;
        width: 100%;
        background-color: #f5f5f5;
        color: #333;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 20px;
        overflow: hidden;
    }

    .toolbar {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
    }

    .toolbar button {
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
    }

    .toolbar button:hover {
        background-color: #f0f0f0;
    }

    .empty-state {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #888;
    }

    .show-sidebar-btn {
        position: absolute;
        top: 10px;
        left: 10px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
        z-index: 10;
    }

    .toolbar-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        background-color: #f5f5f5;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
    }

    .toolbar-btn:hover {
        background-color: #e9e9e9;
    }
</style>
