# COMPOSITION API CRASH COURSE NOTES

### 3. Composition API: Switching Over
##### Data and Methods
- Everything in the template stays the same ( works the same way )
- Script section is different
- Composition API has 2 different patterns
  1. Setup function (original)
  2. Script setup (new better)

```js
// SETUP FUNCTION 
<script>
  export default {
    setup() {

    }
  }
</script>
```

##### Data (refs) and Methods
- In composition API there are 2 main types of reactive data
  1. refs (generally used for simple single items of data)
      - Value of ref is stored in a property called **value**
  2. reactive objects (object of data with a bunch of related data properties)
- Both need to be imported
- Must add **return** statement when using *setup function*
- For methods just create named functions anywhere inside the setup function (not in return )

```js
<script>
import { ref } from "vue";
  export default {
    setup() {
      //data
      const counter = ref(0);

      //methods
      function increaseCounter() {
        counter.value++
      }

      const decreaseCounter = () => {
        counter.value--
      }

      //return all data and methods used
      return {
        counter,
        increaseCounter,
        decreaseCounter
      }
    }
  }
```
- Use functions and data the same way as options API

```html
<!-- TEMPLATE -->
<h1>My Counter</h1>
<!-- data -->
<h2>{{counter}}</h2>
<!-- functions -->
<button @click="increaseCounter">Add</button>
<button @click="decreaseCounter">Subtract</button>
```


##### Script Setup
- A new easier way to setup composition API
- Gets rid of *export default, setup function & return statement*
- Any data properties, methods, computed properties declared at top level will be auto available in the template
- Vue team recommends this pattern 
- Simply add a setup attribute in script tag
- Still need to import stuff though

```js
<script setup>
import { ref } from "vue";

      //data
      const counter = ref(0);

      //methods
      function increaseCounter() {
        counter.value++
      }

      const decreaseCounter = () => {
        counter.value--
      }

</script>

```

### 4. Refs, Reactive Objects & Nonreactive data
- 3 Main types of data used in composition api app
  - Refs
  - Reactive objects
  - Non reactive data

#### Refs
- Handy for storing simple independent items of data
- Make changes by accessing the *.value* property of the variable
- Can add as many refs as you want just avoid name clashes
```js
//import
import {ref} from 'vue'
//setup
const count = ref(0)
//use
count.value += 10
```

#### Two Way Data Binding
- Works exactly the same as the options API
- v-model = v-bind + v-on:input
```html
<!-- TEMPLATE -->
<div class="edit-title">
<!-- data -->
    <h3>{{counterTitle}}</h3>
    <!-- 2 way data binding -->
    <input v-model="counter.title" />
  </div>
```

```js
//SCRIPT 
 const counterTitle = ref("My Title")
```

#### Reactive Objects
- Used for storing complex data related to each other (objects)
- Access properties using dot notation

```js
//import
import {reactive} from 'vue'
//setup
const counterData = reactive({
  count: 0,
  title: "My Counter"
})
```
```html
<!-- use -->
<span class="counter"> {{counterData.count}}</span
```
#### Non Reactive Data
- For data properties that don't need to be reactive
- Use when necessary to improve app performance
- Just use standard variable declaration

```js
//SCRIPT
const appTitle = "My Amazing App!"
```
```html
<!-- TEMPLATE -->
<h2>{{appTitle}}</h2>
```

## 5. Methods Computed and Watch
#### Methods
- Methods are simple just write a named function
```html
<!-- TEMPLATE -->
<button @click="myMessage('User 1')"></button>
```
```js
//SCRIPT
const myMessage = (message) => {
   return 'Hello' + message
}
```

#### Computed properties
- Properties generated based on reactive data
- Cached, only updated when dependencies change
- In composition API must import
- Can create anywhere among the script section
- Filters have been removed from Vue 3. Just use computed properties or methods

```js
//OPTIONS API
computed: {
   oddOrEven() {
      return 'odd or even'
   }
}
```

```js
//IMPORT
import {computed} from 'vue';
//SETUP
const oddOrEven = computed(function() {
   return 'odd or even'
})
```
```html
<!-- USE -->
<p>{{oddOrEven}}</p>
```
#### Watchers
- Watchers allow us to watch a data property and then do something whenever it changes
- Can place anywhere within script section

```js
//  OPTIONS API
watch: {
   count(oldCount, newCount) {
      alert('new count updated!')
   }
}
```
```js
//IMPORT
import { watch } from 'vue'
// SETUP
watch(dataItemToWatch, (newValue, oldValue) => {
   alert(newCount)
} )
```


### 7. Custom Directives
- Camel case start with v.
- Can make global by putting into own file and exporting
- export (directive name)
- import (directive name) from (file name)

```html
<!-- TEMPLATE -->

<input v-autofocus />
```

```js
//SCRIPT

const vAutofocus = {   // => v-autofocus
  mounted: (el) => {
    el.focus()
  }
} 
```

## 8. Vue Router

##### Setup and Installation
- Terminal Command ( 4 is latest version)
```
npm install vue-router@4
```
- Add router to app by importing the *createRouter* method from *vue-router*
- This is commonly done in its own file **src/router/index.js**
- When moving to own file make sure to *export default router*
- Don't forget to import in App.js
- 💡 When importing files not specifying a filename auto imports index.js
  - **Ex: src/router === src/router/index.js**
- Add to *createApp* chain ( in main.js )
- *createRouter* accepts an object with rout configurations
- History
  - *createWebHistory* uses real urls in the browser during navigation
  - *createHashHistory* uses **#** symbols (doesn't need fancy setup to get server running)
- Routes
  - An array of route objects that define the *path*, *component* and *name* of each route

```js
//MAIN.JS
import { createApp } from 'vue'
//import
import {createRouter, createWebHashHistory} from 'vue-router'
import App from './App.vue'

//setup
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes //array of objects
})

//use
createApp(App)
  .use(router)
  .mount('#app')
```

##### Adding Routes
- Typically the components that the routes render are located in a **views** or **pages** folder
- Naming convention is to have the word **view** (ex: HomeView.view) CAMELCASE
- Route configuration object
  - Path: specifies the URL the route should go to in browser
  - Name: Makes it easy to send the user to a particular route (programmatically)
  - Component: The component to be used for the route (must import component)
- 💡 Common practice to extract routes outside of router configuration and place the variable reference instead

```js
import ViewNotes from 'src/views/ViewNotes.vue';

routes: [
    {
      path: '/',
      name: 'notes',
      component: ViewNotes

    }
  ]
```

##### Add Router View and Navigation
- *routerView* component determines where our routes will be displayed
- Can be written like... router-view or RouterView 
- *routerLink* components are like a tags allowing you to navigate to a certain urls
- Use *to* attribute to determine the url to go to
- Can be written like... router-link or RouterLink

```js
<template>
  <RouterLink to="/">Notes</RouterLink> 
  <RouterLink to="/stats">Stats</RouterLink>
  <RouterView/>
</template>
```

##### Styling Active class
- Vue routes can be styled by using the active-class attribute and giving it a class to apply

```js
<RouterLink 
  to="/stats"
  class="navbar-item"
  active-class="is-active"
  > 
  Stats
</RouterLink>
```
##### Use Route

```js
//IMPORT
import { useRoute } from "vue-router";
//SETUP
const route = useRoute();
//USE
  const showPostId = () => {
    alert(`This post's id is: ${route.params.id}`)
  }
```


##### Use Router

```js
//IMPORT
import { useRouter } from "vue-router";
//SETUP
const router = useRouter();
//USE
  const goToFirstPost = () => {
    router.push({
      name: "postDetails",
      params: {
        id: "id1"
      }
    })
  }
```

##### V-For
- Works the same way as the options API
- v-for(**item** in **array**)
- key attr must be unique
- Make sure to bind the to property to use the dynamic route

```js
<ul>
  <li 
    v-for="post in posts" 
    :key="post.id"
  >
    <RouterLink :to="`/postDetail/${post.id}`">{{ post.title }}</RouterLink>
  </li>
    </ul>
```
- 💡 Quick way to do a v-for without array/content
```html
<!-- quickly makes 3 instances of the component -->
 <div class="card" v-for="i in 3">
```

##### Template Refs
- Refs for the html (template)
- camelCase with the word Ref at the end
- template and script names must match

```html
<!-- TEMPLATE -->
<h2 ref="appTitleRef">{{ appTitle }}</h2>
```

```js
// IMPORT
import { ref } from "vue"
// SETUP
const appTitleRef = ref(null) 
// USE
onMounted(() => {
  console.log(`The app title is ${appTitleRef.value.offsetWidth} px wide`)
  })
```


##### Next Tick
- Wait until the DOM is updated and *then* do something

```js
// IMPORT
  import { nextTick } from "vue"

// USE
const increaseCounter = (amount) => {
    counterData.count += amount;
    nextTick(() => {
      console.log("Count has increased!")
    })
  };
```
- next tick is an asynchronous function
- Also works with async await

```js
const increaseCounter = async (amount) => {
  counterData.count += amount;

  await nextTick()
  console.log("Count has increased!")
  
  };
```

##### Teleport
- Move an element from its default place in the DOM to somewhere else
- Can be moved outside the vue app (div #app)
- Great for modals
- to attribute is a **css selector**

```js
<teleport to="body">
  <p>This is a modal </p>
</teleport>
```

## 10. Child Components, Props and Emits

##### Child Components
- No need to register the component like in the options API

```js
// IMPORT
import Modal from "../components/Modal.vue"
```

```html
<!-- USE -->
<Modal v-if="showModal"></Modal>
```


##### Slots
- Lets you pass down template content to a child component
- Slots have access to all of the data in the component they are implemented in
- Can dedicate html to a slot with the following... 
- NORMAL=> v-slot:(slot-name)
- SHORTHAND => #(slot-name)
- Great for reusable code
- Named slots must use template tag

```html
 <!-- CHILD COMPONENT -->
  <div  class="modal">
    <h2>
      <!-- named slot -->  
      <slot name="title"/>
    </h2>
    <!-- default slot -->
    <slot/>
    <button>Close Modal</button>
  </div>
```
- Named slots content should be in template tags  

```html
<!-- PARENT COMPONENT -->
  <Modal v-if="showModal">
  <!-- named slot -->
    <template v-slot:title>My New Title</template>
    <p>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum possimus numquam dicta
      placeat itaque hic dignissimos fugiat nam. Magnam, repudiandae!
    </p>
  </Modal>
```

- Can access data properties too
```html
<!-- PARENT -->
  <slot name="secondary">{{data}}</slot>
<!-- CHILD -->
  <slot>Show this instead</slot>
```
- Can pass fallback content if nothing is received from parent
- Slots can be scoped giving parent components access to the child data properties
- Pass value from child with **v-bind**
- Access from parent with **v-slot**

- Can access slot data with $slot

```js
// OPTIONS
this.$slots.title()

// COMPOSITION
import { useSlots } from "vue"

const slots = useSlots()

console.log(slots.title())
```


##### Props
- Passing props from **parent** => **child** is the same as options API
- Receiving props from **child** => **parent** has changed
- Can use as title OR *props*.title
- Access in script section with props.title

```js
// OPTIONS
props: {
  title: {
    type: String,
    default: "No title specified" //if no props given
  }
}

//COMPOSITION
const props = defineProps({ //no import
  title: {
    type: String,
    default: "No title specified" //if no props given
  }
}) 
```

##### Emits
- Emit a custom even on child component
- Don't need to import defineEmits()
- Use emits the same way in the template

```js
// CHILD COMPONENT
// OPTIONS
emits: ['hideModal']

//COMPOSITION
//template
<button @click="$emit('hideModal')">Close Modal</button>
//script
const emit = defineEmits(['hideModal'])
```

- Listen for custom event on parent component
```html
<!-- PARENT COMPONENT -->
<Modal @hideModal="showModal = false"></Modal>
```

- Trigger event in script

```html
<button @click="handleButtonClick">Close Modal</button>
```

```js
function handleButtonClick() {

  // OPTIONS
this.$emit('hideModal');

//COMPOSITION
emit("hideModal")
}
```

##### ModelValue
- Can access ref directly from child component
- Massively simplifies child to parent communication
- Often removes the need for custom events and listening for them
- v-model 
- modelValue

- Hook up **v-model** to parent component
```js
// PARENT
<Modal v-model="showModal"> //data
</Modal>
```


- In child accept **modelValue** as **props**
```js
  //CHILD
//script
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
```
- In template change the v-if to the *boolean* value of modelValue (passed as props)
- Use the modelValue in template by setting the value of a property
```html
<!-- template -->
<div 
  v-if="modelValue"
  class="modal"
>
</div>
```

#### Update Model Value
- A special event allows to directly modify a value coming from parent component (v-model) without emitting events from the child component
- Whatever value passed in with v-model will be changed directly to whatever we *pass as the second parameter*
- Child updates will now be seen by parent
- Emit (update:modelValue, desired value) in the child component
- Add to emits array

```js
// CHILD
const emits = defineEmits(["update:modelValue"])

const handleButtonClick () => {
  //false is the value passed to parent
  emit(update:modelValue, false) 
}
```

- Can emit directly from template 
```html
<textarea
            v-model="modelValue"
            @input="$emit('update:modelValue', modelValue)"
            class="textarea"
            placeholder="Add a new note"
            ref="newNoteRef"
          />
```

#### Expose Child Methods to Parents
- use defineExpose to make child methods available to parents
- This allows parent components to trigger a function on a child component
- no need to import

```js
defineExpose({
  functionForParentElement,
})
```

##### Dynamic Components
- Let's you to switch out a component being used in a particular part of the app
- 1. Make component dynamic by using the **component** tag
- 2. Add an :is="component to display" prop (v-bind:is)

```js
//  TEMPLATE 
<component :is="Modal"></component>
```
- Can switch between components
```js
<component
  :is="isDark ? DarkModal : Modal"
></component>
```
##### Provide / Inject
- Let's you pass data to a deeply nested child component
- Use provide to give child components access to data
- Inject let's children use the data no matter how deeply nested
- 💡 Make sure property names are spelled right

```js
// PARENT
// import
import { provide } from "vue";
//use
provide('reference', actualData)

//GREAT GREAT GRANDCHILD
//import
import { inject } from "vue";
//use
const data = inject('reference')
```
## 11. Composables
- Compositions equivalent to mixins from options api
- Extracts reactive data and/or components into own file to be used in different part of code
- Code that can be reused in other parts of code so we don't have to rewrite that code
- Composable is just a function (returns a single value)
- Can import in any component and use destructuring to get parts wanted
- Can expose values as read only
- Can use composables for global state management
- Recommended composables go into the folder src/**use**
- File names should be in camelCase and begin with the word **use** (.js extension)
- Function should be same name as file


##### Make Composable
```js
//import vue stuff used
import { reactive} from "vue"

export function useCounter() {
  //place stuff related to composable
  const counterData = reactive({
    count: 10,
    title: "My Counter 2"
  });

  const increaseCounter = (amount) => {
    counterData.count += amount;
  };

  const decreaseCounter = (amount) => {
    counterData.count -= amount;
  };

//return the things to use
  return {
    counterData,
    increaseCounter,
    decreaseCounter
  }
}
```

##### Use Composable
- Import composable where it will be used
```js
 import {functionName} from 'src/use/fileName' 
 ```
- 2 ways to access composable data

```js
//WAY 1
//use destructuring to grab only things needed
//perfect if not wanting to change template
const {counterData, increaseCounter, decreaseCounter} = useCounter()
```

```js
//WAY 2
//assign whole composable to a constant and then use dot notation
//update template accordingly
const counter = useCounter()
counter.increaseCounter();
counter.decreaseCounter();
counter.counterData.title = "My new title"
```

##### Reuse Composable
```js
// IMPORT
import { useCounter } from "src/use/useCounter"

//SETUP
const {counterData, increaseCounter} = useCounter()
```
```html
<!-- USE -->
<button @click="increaseCounter">{{counterData.count}}</button>
```
- Counter (data) will be reset when changing pages (routing)
- New counter instance will be created on every page change
- To make data global just move it **outside** of composable function

```js
import { reactive} from "vue"

  //place outside to make global
  const counterData = reactive({
    count: 10,
    title: "My Counter 2"
  });

export function useCounter() {

  const increaseCounter = (amount) => {
    counterData.count += amount;
  };

  const decreaseCounter = (amount) => {
    counterData.count -= amount;
  };

//return the things to use
  return {
    counterData,
    increaseCounter,
    decreaseCounter
  }
}
```

##### Add Composable From Vue Use
- Vue has a library of ready to use composables (vueUse)
- [vueUse library](https://vueuse.org) over 150 composables!
```
npm i @vueuse/core
```
- Example usage

```js
//import
import { useOnline } from '@vueuse/core'
//setup
const online = useOnline()
```

```html
<!-- use -->
<p>You are currently {{ online ? 'online' : 'offline'}}</p>
```



## 12. State Management With Pinia
- State management allows us to store data and methods in one centralized place
- State management like Pinia can be used all throughout the app
- Store all data in a **store** folder
- Pinia store has 3 main sections (State, Actions, Getters)
- STATE: Stores all of the data properties
- ACTIONS: Stores methods that can access/modify the data stored in state
- GETTERS: Methods that can grab something from state possibly modify and return it
- Getters like computed properties

#### Pinia Setup
- Typically Pinia files go in a **src/stores** folder
```
<!-- install -->
npm install pinia
```
- Create a pinia root store and pass to App
```js
//MAIN.JS
import {createPinia} from 'pinia'

app.use(createPinia())
```

```js
// src/stores/example.js

import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  //State
  //Actions
  //Getters
})
```
- More info can be found at [Pinia Docs](https://pinia.vuejs.org)

##### Composable State vs Vuex vs Pinia
- 3 different ways to integrate state management
- Composables: variable=data, methods=actions, computed properties=getters
- Vuex: Actions can access but **not** manipulate state 
  - Mutations are methods that **can** manipulate state
- Pinia: Optimized specifically for the composition API

##### State
- Define state in Pinia
```js
import { defineStore } from "pinia";
//function that takes an object
export const useCounterStore({
  id: 'counter',
  //function that returns an object
  state: () => ({
    count: 0,
    title: 'My Counter Title'
  })
})
```
```js 
// IMPORT
import {useCounterStore} from 'src/stores/counter'
//SETUP
const counter = useCounterStore()
```
```html
<!-- USE -->
<h1>{{counter.title}}</h1>
```

##### Actions
- Actions modify state in Pinia
- An object full of methods (like options API)
- Access properties using *this* keyword

```js
//STORE
actions: {
    increaseCounter() {
      this.count++
    },
    decreaseCounter() {
      this.count--
    }
  }
```
- Use in other parts of the app
- Already imported when imported *counter* from *useCounterStore*
```html

<button @click="counter.increaseCounter">Increase</button>
```

##### Getters
- Getters let us get a value from state modify or generate something based on that value and return it
- Available to any component using this store
- Getters state values are cached and only updated when their dependencies change
- Add getters object full of methods (computed properties)
- In order for getters to work they do need to return a value

```js
//SETUP
getters: {
    //pass in state as a parameter
    oddOrEven: (state) => {
      if ( state.count % 2 === 0) return 'even'
      return 'odd'
    }
  }
```

```html
<!-- USE -->
<p>This counter is: {{oddOrEven}}</p>
```

##### Use Pinia Store Everywhere
- Use in any part of app the same way as described earlier
1. Import: import **{functionName}** from **fileName**
2. Setup: const **name** = **functionName()**
3. Use: {{name.stateName}} 


## 13. Bulma CSS Integration

##### Import
- [official docs](https://bulma.io)
- A CSS library with predefined classes and styled components to easily style apps
- 4 Ways to setup
``` css
/*import css*/
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";
```
```html
 <!-- import html  -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
```
```js
// NPM
npm install bulma

or download
```

##### Setup
- Import in top level file
```css
@import "bulma/css/bulma.min.css"
```

### PRO TIPS
- 💡 When adding state management to app **the earlier the better**
- 💡 Remember where the data is coming from (props, state, etc) in order to pass it correctly
- 💡
- 💡
- 💡
- 💡
