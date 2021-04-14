<template>
  <header class="container-fluid header">
    <div class="container row header-container">
      <div class="header-left-side">
        <img src="@/assets/images/eJogsegedLogo.png" alt="e-Jogsegéd logó" />
      </div>
      <div class="header-right-side">
        <h1>Adminisztrációs felülete</h1>
      </div>
    </div>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss">
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
    .header-right-side {
      background: #c03;
      width: 100%;
      padding-left: 50px;
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      z-index: 5;
      h1 {
        font-family: SourceSansPro;
        font-size: 35px;
        text-align: center;
        color: white;
      }
    }
  }
}
</style>