<template>
  <div class="popup-wrapper">
    <div class="popup">
      <p>{{ popupMessage }}</p>
      <slot name="popupBtn"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "admin-popup",
  props: {
    popupMessage: String,
    popupBtnValue: String,
  },
//   data() {
//     return {
//       isHidden: true,
//     };
//   },
  methods: {
    hideAdminPopup() {
      if (this.isHidden === true) {
        this.isHidden = false;
      } else {
        this.isHidden = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-wrapper {
  background: rgba(204, 0, 51, 0.8);
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000000;
  .popup {
    background: white;
    width: 650px;
    padding: 35px 25px;
    height: fit-content;
    min-height: 200px;
    margin: 0 auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    font-family: SourceSansProBold;
    font-size: 25px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    p {
      margin-bottom: auto;
    }
    .admin-button {
      width: 250px;
      padding: 15px 35px;
      margin-top: 0;
    }
  }
}
</style>