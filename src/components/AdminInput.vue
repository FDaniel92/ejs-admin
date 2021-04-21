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
    />
    <label
      :class="{ active: classes.isActive, error: classes.isError }"
      ref="labelForInput"
      :for="name"
      >{{ inputLabel }}</label
    >
    <span :class="{ active: classes.isActiveRequire }">{{ requiredText }}</span>
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
        if (!this.validOnlyLetters(value) && value !== "") {
          this.classes.isError = true;
          this.classes.isActiveRequire = true;
          this.requiredText = "Túl kevés karakter!";
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
        this.classes.isActiveRequire = true;
        this.requiredText = "Kötelező mező!";
      }
    },
    validOnlyLetters(text) {
      var regex = /^.{6,}$/;
      return regex.test(text);
    },
  },
};
</script>

<style lang="scss" scoped></style>