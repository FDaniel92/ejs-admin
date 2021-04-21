<template>
  <div class="textarea-form-group">
    <textarea
      :value="value"
      :name="name"
      :id="id"
      @input="updateValue($event.target.value)"
      @focus="updateTextareaLabelProp"
      @blur="removeLabelProp"
      rows="8"
      :class="{ error: classes.isError }"
    ></textarea>
    <label
      :class="{ active: classes.isActive, error: classes.isError }"
      ref="labelForTextarea"
      :for="name"
      >{{ inputLabel }}</label
    >
    <span :class="{ active: classes.isActiveRequire }">{{ requiredText }}</span>
  </div>
</template>

<script>
export default {
  name: "admin-textarea",
  props: {
    value: String,
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
      if (value !== "") {
        this.requiredText = "";
        this.classes.isError = false;
        this.classes.isActive = true;
        this.classes.isActiveRequire = false;
      }
    },
    updateTextareaLabelProp() {
      this.classes.isActive = true;
    },
    removeLabelProp() {
      if (!this.value) {
        this.classes.isError = true;
        this.classes.isActiveRequire = true;
        this.requiredText = "Kötelező mező!";
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>