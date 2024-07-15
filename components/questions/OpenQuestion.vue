<template>
  <div class="container">
    <div class="question">{{ questionText }}</div>
    <div class="text">
      <textarea rows=5 v-model="comment" placeholder="What did you like or dislike? How can we improve this page?"></textarea>
    </div>
    <div class="buttons">
      <slot></slot>
      <button @click="submit" class="feedback-panel-btn-feedback">Submit</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "StarQuestion",
  props: ["questionText","questionNumber"],
  data() {
    return {
      comment: "",
    };
  },
  methods: {
    submit: function () {
      this.$emit("answered", this.comment === "" ? null : this.comment);
    },
  },
};
</script>

<style scoped>
.question {
  word-wrap: break-word;
  margin-bottom: 1rem;
  /* font-weight: 600; */
  /* font-size: 1rem; */
}

.stars {
  display: flex;
  justify-content: space-around;
  cursor: pointer;
}

.buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;

}

button {
  margin-left: 10px;
}

textarea {
  resize: vertical; /* Allows vertical resizing only */
  width: 100%; /* Ensures textarea takes up full width of its container */
  padding: 1rem; /* Adds padding inside the textarea */
  box-sizing: border-box; /* Includes padding in the textarea's width */
  max-width: 100%; /* Prevents textarea from expanding beyond the container */
  border: 1px solid #00000000;
  border-radius: 0.25rem;
  min-height: 5rem;
  max-height: 45rem;
  background-color: #f1f3f4;
  color: #5f6368;
}

.container {
  overflow: hidden; /* Hides any overflow content */
  width: 100%; /* Ensures container takes up full width of its parent */
  box-sizing: border-box; /* Includes padding in the container's width */
}
@media (max-width: 720px) {
  textarea {
    min-height: 5rem;
    max-height: 7rem;
  }
}
</style>