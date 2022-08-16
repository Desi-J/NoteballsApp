<template>
  <div class="notes">
    <!-- new note form -->
    <AddEditNote
      v-model="newNote"
      placeholder="Add a new note"
      ref="addEditNoteRef"
    >
      <template #buttons>
         <button
            @click="addNote"
            :disabled="!newNote"
            class="button is-link has-background-success"
          >
            Add New Note
          </button>
      </template>
    </AddEditNote>

    <!-- progress bar -->
    <progress
      v-if="!storeNotes.notesLoaded"
      class="progress is-large is-success"
      max="100"
    />

    <!-- notes list -->
    <template v-else>
       <Note
        v-for="note in storeNotes.notes"
        :key="note.id"
        :note="note"
      />
    </template>
   
   <!-- Placeholder message -->
   <div
     v-if="!storeNotes.notes.length"
     class="is-size-4 has-text-centered has-text-grey-light is-family-monospace py-6"
   >
    No notes here yet...
   </div>

  </div>
</template>

<script setup>
/*
  import 
*/

import { ref } from 'vue';
import Note from '@/components/Notes/Note.vue'
import AddEditNote from '@/components/Notes/AddEditNote.vue';
import { useStoreNotes } from '@/stores/storeNotes';
import { useWatchCharacters } from '@/use/useWatchCharacters';

/*
  store
*/

const storeNotes = useStoreNotes()

/*
  notes
*/

const newNote = ref('')
const addEditNoteRef = ref(null)

/*
  add note
*/

const addNote = () => {
  storeNotes.addNote(newNote.value)
  newNote.value = ''
  addEditNoteRef.value.focusTextArea()
}

/*
   watch characters
*/

useWatchCharacters(newNote)


</script>
