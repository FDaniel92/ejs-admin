<template>
  <div class="form-group">
    <input
      :value="value"
      :type="type"
      :name="name"
      :id="id"
      @input="updateValue($event.target.value)"
      @focus="updateLabelProp"
      @blur="removeLabelProp"
      :class="{ error: classes.isError }"
      :maxlength="wordCounter"
      :carouselImage="notRequired"
    />
    <label
      :class="{ active: classes.isActive, error: classes.isError }"
      ref="labelForInput"
      :for="name"
      >{{ inputLabel }}</label
    >
    <span :class="{ active: classes.isActiveRequire }">{{ requiredText }}</span>
    <span class="letter-watcher" v-if="wordCounter"
      >Megengedett karakterszám: {{ wordCounter }} / {{ value.length }}
    </span>
  </div>
</template>

<script>
export default {
  name: "admin-input",
  props: {
    value: String,
    type: String,
    name: String,
    id: String,
    inputLabel: String,
    wordCounter: Number,
    notRequired: Boolean,
  },
  data() {
    return {
      requiredText: null,
      classes: {
        isActive: false,
        isError: false,
        isActiveRequire: false,
      },
    };
  },
  methods: {
    updateValue(value) {
      this.$emit("input", value);

      if (this.type === "text") {
        if (
          !this.validOnlyLetters(value) &&
          value !== "" &&
          !this.notRequired
        ) {
          this.classes.isError = true;
          this.classes.isActiveRequire = true;
          this.requiredText =
            "Túl kevés karakter (minimum: 15), kérem írjon még!";
        } else {
          this.requiredText = "";
          this.classes.isActive = true;
          this.classes.isError = false;
          this.classes.isActiveRequire = false;
        }
      }
    },
    updateLabelProp() {
      this.classes.isActive = true;
    },
    removeLabelProp() {
      if (!this.value) {
        this.classes.isError = true;
        this.classes.isActive = false;
        this.requiredText = "Kötelező mező!";
      }
      // if(this.value && this.notRequired) {
      //   this.classes.isActive = true;
      // } else {
      //   this.classes.isActive = false;
      // }
    },
    validOnlyLetters(text) {
      var regex = /^.{15,}$/;
      return regex.test(text);
    },
  },
  mounted() {
    if (this.$route.name === "EditArticle") {
      this.classes.isError = false;
      this.classes.isActive = true;
      this.requiredText = "";
    }
  },
};
</script>

<style lang="scss" scoped></style>