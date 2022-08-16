# Firebase Notes

### Setup
- Cerate a new project at [firebase.google.com](https://firebase.google.com/)
- Install firebase in terminal

```
npm install firebase
```

### Initialize Firebase App

```js
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'string',
  authDomain: 'string',
  projectId: 'string',
  storageBucket: 'string',
  messagingSenderId: 'string',
  appId: ' long string'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
```

### Create Firestore Database
- Store all of the app data
- Go to build => firestore database => create database => start in test mode => choose location(default) => enable
  - Located on left side bar
- Cloud firestore databases are organized into **collections**
- Each collection contains **documents**
  - Can also create **sub collections** in each document
- Click on *start collection* and give it a meaningful name according to app data (ex: notes)
- Each document is an individual data object (note: { id, content })

### Connect to Database
- Connect app to database to access the firestore data
- NAV: 
  - *go to docs* (top right) => *build* (dropdown) => *firestore* => *get started* (left nav)
  - **web version 9**
  - The Cloud Firestore SDK is available as an npm package.
  ```
  npm install firebase@9.9.2 --save
  ```
  - You'll need to import both Firebase and Cloud Firestore.

  ```js
  import { initializeApp } from "firebase/app";
  import { getFirestore } from "firebase/firestore";
  ```
- **db** gives access to our database (read, write, delete, update)
  ```js
  const db = getFirestore(app)
  ```

### Grab Data from Firestore
- Get all documents in a collection

```js
import { collection, getDocs } from "firebase/firestore";

const querySnapshot = await getDocs(collection(db, "collection name here"));
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
  //make a new note and push to pinia data
   let note = {
      id: doc.id,
      // to access content use doc.data().content
      content: doc.data().content
        }
      this.notes.push(note)
});
```

### Get Data in Real Time
- Listen for changes in the database and update in real time

```js
onSnapshot(collection(db, 'collection name here'), (querySnapshot) => {
        let newNotes = [];
        querySnapshot.forEach((doc) => {
          let note = {
            id: doc.id,
            content: doc.data().content
          };
          newNotes.push(note);
        });
        this.notes = newNotes;
      });
```

### Add Data to Database
- import **setDoc** and **doc** from firestore

```js
//PINIA Store
// Add a new document in collection "notes"
      await setDoc(doc(db, "notes", idParameter), { 
       content: newNoteContent // from pinia addNote method
      });
```

### Delete Data From Firebase

```js
import { doc, deleteDoc } from "firebase/firestore";

await deleteDoc(doc(db, "collection name here", idParameter));
```

### Update document
- Only updates the fields specified
```js
import { doc, updateDoc } from "firebase/firestore";

await updateDoc(doc(db, 'collection name here', idParameter), {
        fieldName: value
      });
```

### Order Documents By Date
- When getting data from database pass a query instead of a collection ref (db, 'notes') to sort incoming data

```js
import { query, orderBy, limit } from "firebase/firestore";  

const notesCollectionQuery = query(citiesRef, orderBy("fieldName", "desc"), limit(3));

async getNotes() {
      onSnapshot(notesCollectionQuery, (querySnapshot) => {
        let newNotes = [];
        querySnapshot.forEach((doc) => {
          let note = {
            id: doc.id,
            content: doc.data().content
          };
          newNotes.push(note);
        });
        this.notes = newNotes;
      });
    },
```

### Auto Ids
- Firebase can auto generate a unique ID

```js
import { collection, addDoc } from "firebase/firestore"; 

// Add a new document with a generated id.
const docRef = await addDoc(collection(db, "cities"), {
  name: "Tokyo",
  country: "Japan"
});
console.log("Document written with ID: ", docRef.id);
```

## Authentication

### Setup in Firestore
```js
//SRC/JS/FIREBASE.JS
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

```
- Export in Pinia
```js
export {
  db, 
  auth
}
```

### New Pinia Store For Handling Authentication
- Set up a separate pinia store for authentication
```js
//SRC/STORES/STOREAUTH.JS
import { defineStore} from "pinia";
import { auth } from "@/js/firebase";

export const useStoreAuth = defineStore('storeAuth', {
  state: () => {
    return {

    }
  },
  actions: {

  }
})
```

### Register User

```js
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
//auth from firebase, email & pass from user input
createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
          console.log('user: ', user)
        }).catch((error) => {
          console.log('error message', error.message)
  });
  ```

### Logout User

```js
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();
signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});
```

### Login User

```js
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
  ```

### Listen for Auth Changes and Store User Data
- Store **user id** in the **state** of **storeAuth**
- Hook that listens to all auth changes (login, logout, etc...)
- Trigger hook when app first starts
```js
init() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user.id = user.uid
          this.user.email = user.email
        } else {
          this.user = {}
        }
      });
    },
```

### Redirect User on Auth Change
- After a user logs in redirect them to their notes
- Reroute user depending on login or logout
- Must use a plugin to give **pinia** access to **vue router**
- **markRaw** will make anything we pass into it non reactive
- Can now access router in pinia store as **this.router**

```js
//SETUP IN MAIN.JS
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '@/router'
import { markRaw } from 'vue'

const pinia = createPinia()
//adds a property called 'router' to the root pinia store and will be available through all stores
pinia.use(({ store }) => {
  store.router = markRaw(router)
})

createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
```
- **.replace**: browser history gets replaced and user can't go back

```js
//STORE AUTH JS
 init() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user.id = user.uid
          this.user.email = user.email
          //if logged in send them to their notes
          this.router.push('/')
        } else {
          this.user = {}
          // if logged out send to login screen
          this.router.replace('/auth')
        }
      });
    },
```
### Restructure DB For Multiple Users
- (collection: users) => (document: uid) => (subCollection: notes) => (subDocuments: userNotes)
- No longer can grab notes by passing in 'notes' for the collection name
- Path to data one section at a time
```js
const notesCollectionRef = collection(db, 'users', 'yKScg1Y9YEYVlqetJR87yhMo7Dg1', 'notes');
const notesCollectionQuery = query(notesCollectionRef, orderBy('date', 'asc'));
```

### Refs For Multiple Users
- Create an action in the notes store to initialize collectionRef with user unique id
- Grab id of user from authStore
- Import { useStoreAuth } from "@/stores/storeAuth"
- Setup store auth in the action/ method you are using it in
- Trigger only when user is logged in else an error

```js
import {useStoreNotes} from '@/stores/storeNotes'

init() {
      const storeNotes = useStoreNotes()

      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user.id = user.uid
          this.user.email = user.email
          this.router.push('/')
          storeNotes.init()
        } else {
          this.user = {}
          this.router.replace('/auth')
          console.log('cleared')
          storeNotes.clearNotes()
        }
      });
    },
```

### Clear Notes Array in State on Logout
- Create an action for clearing notes array in state (store Notes)

```js
//storeNotes.js
 clearNotes() {
      this.notes = []
    },
```
- Fire the action when user logs out
```js
//storeAuth.js
init() {
      const storeNotes = useStoreNotes()

      onAuthStateChanged(auth, (user) => {
        //...
       else {
          this.user = {}
          this.router.replace('/auth')
          storeNotes.clearNotes()
        }
      });
    },
```

### Unsubscribe from getNotes Listener
- onSnapshot hook will keep listening forever even when user is logged out
- Unsubscribe from onSnapshot hook whenever a user **logs in ** (easier)
- Assign snapshot to variable then call variable later on to Unsubscribe
- Upon login check to see if there is already a listener if so Unsubscribe

```js
//make a global variable in notes store
let getNotesSnapshot = null
```


```js
//LOGIN
 async getNotes() {
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

      });
```

- **OR** can unsubscribe upon **logout**
```js
//LOGOUT
clearNotes() {
  this.notes = []
  //unsubscribe from any active listener
  if (getNotesSnapshot) getNotesSnapshot()
}
```

## Security & Hosting

### Navigation Guards
- Prevents users from going on certain pages/routes under certain conditions
- A global navigation guard will be fired every time a user tries to go to a route
- Put in router file under the router configuration

```js
//navigation guards
router.beforeEach(async (to, from) => {
  const storeAuth = useStoreAuth()
  console.log('to', to)
  //if not logged in and route other than auth
  if (!storeAuth.user.id && to.name !== 'auth') {
    return { name: 'auth'}
  }//if logged in and going to auth page
  if (storeAuth.user.id && to.name === 'auth') {
    //stop user from leaving current route
    return false
  }
})

```

### Firestore Security Rules
- When setting up in test mode website is completely insecure
- Anyone can read/write in the database
- Security Rules so user can only read and edit their stuff
- Allow the user to read or write to a certain document path based on a certain condition
- Every user passes a request object (request.auth.uid)
  - Unique id of user making the request

```
