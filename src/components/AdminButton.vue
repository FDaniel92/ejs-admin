<template>
  <button class="admin-button">{{ label }}</button>
</template>

<script lang="js">
export default {
    name: 'admin-button',
    props: {
      label: String
    }
}
</script>

<style lang="scss" scoped></style>