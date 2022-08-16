<template>
  <!-- tabs -->
  <div class="auth">
    <div class="tabs is-centered">
      <ul>
        <li :class="{ 'is-active': !register }">
          <a @click="register = false">Login</a>
        </li>
        <li :class="{ 'is-active': register }">
          <a @click="register = true">Register</a>
        </li>
      </ul>
    </div>

    <!-- form -->
    <div class="card auth-form">
      <div class="card-content">
        <div class="title has-text-centered">
          {{ formTitle }}
        </div>

        <form @submit.prevent="onSubmit">
          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input
                v-model="credentials.email"
                class="input"
                placeholder="e.g. alexsmith@gmail.com"
                type="email"
              />
            </div>
          </div>

          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input
                v-model="credentials.password"
                class="input"
                placeholder="Enter a password"
                type="password"
              />
            </div>
          </div>

          <div class="field is-grouped is-grouped-right">
            <p class="control">
              <button class="button is-primary">{{ formTitle }}</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
/*
  imports
*/
import { ref, computed, reactive } from 'vue';
import { useStoreAuth } from '@/stores/storeAuth';

/*
  store
*/
const storeAuth = useStoreAuth()
/*
  login/register
*/
const register = ref(false);

/*
  form title
*/
const formTitle = computed(() => {
  return register.value ? 'Register' : 'Login';
});

/*
  credentials
*/
const credentials = reactive({
  email: '',
  password: ''
})

/*
  submit
*/

const onSubmit = () => {
  if (!credentials.email || !credentials.password) {
    alert ('Please enter both an email and a password')
  } 
  else {
    if (register.value) {
      storeAuth.registerUser(credentials)
    } 
    else {
      storeAuth.loginUser(credentials)
    }
  }
}
</script>

<style>
.auth-form {
  max-width: 400px;
  margin: 0 auto;
}
</style>
