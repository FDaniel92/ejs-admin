<template>
  <div class="image-input-component row">
    <div class="image-name">
      <div class="image-form-group">
        <input
          :name="id + 'imagenameinput'"
          :id="id + 'imagenameinput'"
          @focus="updateTextareaLabelProp"
          @blur="removeLabelPropForImageName"
          v-model="value.imageName"
        />
        <label
          :class="{ active: classes.isActive }"
          :for="id + 'imagenameinput'"
          >{{ inputLabel }}</label
        >
      <span :class="{ active: classes.isActiveRequireForImageName }">{{
        requiredImageName
      }}</span>
      </div>
    </div>

    <div class="image-alt-name">
      <div class="image-alt-form-group">
        <input
          :name="id + 'altinput'"
          :id="id + 'altinput'"
          @focus="updateImageAltLabelProp"
          @blur="removeLabelPropForIamgeAlt"
          v-model="value.imageAlt"
        />
        <label
          :class="{ active: classes.isActiveAlt }"
          :for="id + 'altinput'"
          >{{ inputAltLabel }}</label
        >
      <span :class="{ active: classes.isActiveRequireForImageAlt }">{{
        requiredImageAlt
      }}</span>
      </div>
    </div>

    <div class="is-carousel">
      <input
        type="checkbox"
        :id="id + 'checkboxid'"
        v-model="value.isCarousel"
      />
      <label :for="id + 'checkboxid'">{{ isCarouselText }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "admin-image-area",
  props: {
    value: Object,
    name: String,
    inputLabel: String,
    inputAltLabel: String,
    isCarouselText: String,
  },
  data() {
    return {
      requiredImageName: null,
      requiredImageAlt: null,
      id: null,
      classes: {
        isActive: false,
        isActiveRequireForImageAlt: false,
        isActiveRequireForImageName: false,
        isActiveAlt: false,
      },
    };
  },
  mounted() {
    this.id = this._uid;
  },
  methods: {
    updateTextareaLabelProp() {
      this.classes.isActive = true;
    },
    updateImageAltLabelProp() {
      this.classes.isActiveAlt = true;
    },
    removeLabelPropForImageName() {
      if (!this.value.imageName) {
        this.classes.isActive = false;
        this.isActiveRequireForImageName = true;
        this.requiredImageName = "Kötelező megadni a file nevét!";
      }
    },
    removeLabelPropForIamgeAlt() {
      if (!this.value.imageName) {
        this.classes.isActive = false;
        this.requiredImageAlt = "Kötelező megadni a kép leírását!";
      }
    },
    removeImageAltLabelProp() {
      if (!this.value.imageAlt) {
        this.classes.isActiveAlt = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>