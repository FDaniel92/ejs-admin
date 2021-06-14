//Modulok importálása
import Vue from 'vue'
import App from './App.vue'

import axios from 'axios'
import router from "./router";
//Modulok használata
Vue.prototype.$http = axios
Vue.config.productionTip = false

//Globálisan hozzáférhető css
import './assets/styles/template/base/base.scss';
//Vue objektum példányosítása
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
