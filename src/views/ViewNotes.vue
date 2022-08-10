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

   
    <!-- notes list -->
    <Note
      v-for="note in storeNotes.notes"
      :key="note.id"
      :note="note"
    />

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
