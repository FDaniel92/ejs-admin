<template>
  <header class="container-fluid header">
    <div class="container row header-container">
      <div class="header-left-side">
        <img src="@/assets/images/eJogsegedLogo.png" alt="e-Jogsegéd logó" />
      </div>
      <nav class="header-navigation">
        <router-link to="/">Főoldal</router-link>
        <router-link to="/cikk-felvetele">Cikk felvétele</router-link>
        <router-link to="/cikkek-megtekintese">Cikkek megtekintése</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss">
.edit-article-page {
  .header {
  margin-bottom: 0;
  }
}
.header {
  background: white;
  position: relative;
  margin-bottom: 50px;
  z-index: 5;
  &:after {
    content: "";
    position: absolute;
    width: 50%;
    height: 80px;
    background: #c03;
    right: 0;
    top: 0;
    z-index: 0;
  }
  .header-container {
    height: 80px;
    .header-left-side {
      display: flex;
      flex-direction: row;
      align-items: center;
      z-index: 5;
      img {
        width: 160px;
        height: 50px;
        margin-right: 150px;
      }
    }
    .header-navigation {
      display: flex;
      flex-direction: row;
      align-items: center;
      z-index: 100;
      width: 100%;
      padding-left: 50px;
      background: #c03;
      a {
        font-size: 20px;
        margin-right: 20px;
        color: white;
        text-decoration: none;
        font-family: SourceSanspro;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>