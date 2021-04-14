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
          this.requiredText = "Hibás formátum!";
        } else {
          this.requiredText = "";
          this.classes.isActive = true;
          this.classes.isError = false;
          this.classes.isActiveRequire = false;
        }
      }

      if (this.type === "email") {
        if (!this.validEmail(value) && value != "") {
          this.classes.isError = true;
          this.classes.isActiveRequire = true;
          this.requiredText = "Hibás formátum!";
        } else {
          this.requiredText = "";
          this.classes.isError = false;
          this.classes.isActive = true;
          this.classes.isActiveRequire = false;
        }
      }
    },
    updateLabelProp() {
      this.classes.isActive = true;
    },
    removeLabelProp() {
      if (!this.value) {
        this.classes.isActive = false;
      }
    },
    validEmail(email) {
      var re = /^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      return re.test(email);
    },
    validOnlyLetters(text) {
      var regex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
      return regex.test(text);
    },
  },
};
</script>

<style lang="scss" scoped></style>