<template>
  <div id="admin">

    <admin-header></admin-header>
    <router-view :key="$route.path"></router-view>
    
  </div>
</template>

<script>
//Komponens importálása, hogy használhassuk a jelenlegi file-ban
import AdminHeader from "./components/AdminHeader";

export default {
  components: {
    AdminHeader
  }
};
</script>

<style lang="scss">
//Szükséges scss file importálása
@import "@/assets/styles/app.scss";
</style>