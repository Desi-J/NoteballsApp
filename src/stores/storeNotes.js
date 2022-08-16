import { defineStore } from 'pinia';
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  addDoc
} from 'firebase/firestore';
import { db } from '@/js/firebase';
import { useStoreAuth } from './storeAuth';

let notesCollectionRef 
let notesCollectionQuery 

let getNotesSnapshot = null

export const useStoreNotes = defineStore('storeNotes', {
  state: () => {
    return {
      notes: [],
      notesLoaded: false
    };
  },
  actions: {
    init() {
      const storeAuth = useStoreAuth()
      //initialize db refs
      notesCollectionRef = collection(db, 'users', storeAuth.user.id, 'notes');
      notesCollectionQuery = query(notesCollectionRef, orderBy('date', 'desc'));

      this.getNotes()
    },
    async getNotes() {
      this.notesLoaded = false

      //unsubscribe from any active listener
      if(getNotesSnapshot) getNotesSnapshot()

      getNotesSnapshot = onSnapshot(notesCollectionQuery, (querySnapshot) => {
        let newNotes = [];
        querySnapshot.forEach((doc) => {
          let note = {
            id: doc.id,
            content: doc.data().content,
            date: doc.data().date
          };
          newNotes.push(note);
        });

          this.notes = newNotes;
          this.notesLoaded = true

      }, error => {
        console.log('error.message', error.message)
      });

      
    },
    clearNotes() {
      this.notes = []
    },
    async addNote(newNoteContent) {
      let currentDate = new Date().getTime(),
        date = currentDate.toString();

      await addDoc(notesCollectionRef, {
        content: newNoteContent,
        date
      });

    
    },
    async deleteNote(idToDelete) {
      // this.notes = this.notes.filter((note) => note.id !== idToDelete);

      //delete from firestore
      await deleteDoc(doc(notesCollectionRef, idToDelete));
    },
    async updateNote(id, content) {
      // update doc with given id
      await updateDoc(doc(notesCollectionRef, id), {
        content
      });
    }
  },
  getters: {
    getNoteContent: (state) => {
      return (id) => {
        //returns an array of 1 item
        return state.notes.filter((note) => note.id === id)[0].content;
      };
    },
    totalNotesCount: (state) => {
      return state.notes.length;
    },
    totalCharactersCount: (state) => {
      let count = 0;
      state.notes.forEach((note) => {
        count += note.content.length;
      });
      return count;
    }
  }
});
