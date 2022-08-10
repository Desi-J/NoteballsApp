import { defineStore } from 'pinia';

export const useStoreNotes = defineStore('storeNotes', {
  state: () => {
    return {
      notes: [
        {
          id: 'id1',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad sed non itaque adipisci similique dolor vero qua eveniet eum error'
        },
        {
          id: 'id2',
          content: 'This is a shorter note. Woo!'
        }
      ]
    };
  },
  actions: {
    addNote(newNoteContent) {
      console.log('note added!', newNoteContent);

      let currentDate = new Date().getTime(),
        id = currentDate.toString();

      let note = {
        id,
        content: newNoteContent
      };

      this.notes.unshift(note);
    },
    deleteNote(idToDelete) {
      this.notes = this.notes.filter(note => note.id !== idToDelete)
    },
    updateNote(id, content) {
      let index = this.notes.findIndex(note => note.id === id)
      this.notes[index].content = content
    }
  },
  getters: {
    getNoteContent: (state) => {
      return (id) => {
        //returns an array of 1 item
        return state.notes.filter(note => note.id === id )[0].content
      }
    },
    totalNotesCount: (state) => {
      return state.notes.length
    },
    totalCharactersCount: (state) => {
      let count = 0;
      state.notes.forEach(note => {
        count += note.content.length
      })
      return count

      //REDUCE FUNCTION ^-^
      /*
      return state.notes.reduce((acc,item) => {
         console.log('accumulator: ', acc)
         console.log('item: ', item.content.length)
         return acc += item.content.length
      },0)
      */
    }
  }
});
