<template>
  <div class="container">
    <div class="question">{{ questionText }}</div>
    <div class="answers">
      <span class="answer" @click="answer(true)">
        <div class="answer-icon">
          <img
            src="../../assets/thumbsup.svg"
            height="28px"
            alt="feedback-icon"
            draggable="false"
          />
        </div>
        <span class="answer-text">Yes</span>
      </span>
      <span class="answer" @click="answer(false)">
        <div class="answer-icon answer-no">
          <img
            src="../../assets/thumbsdown.svg"
            height="28px"
            alt="feedback-icon"
            draggable="false"
          />
        </div>
        <span class="answer-text">No</span>
      </span>
    </div>
    <div v-if="!!this.$slots.default" class="slot">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "BinaryQuestion",
  props: ["questionText", "questionNumber"],
  methods: {
    answer: function (choice) {
      this.$emit("answered", choice);
    },
  },
  mounted() {
    const images = this.$el.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('dragstart', (event) => {
        event.preventDefault();
      });
    });
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
}

.question {
  margin-bottom: 1rem;
  /* font-weight: 600; */
  /* font-size: 1rem; */
  /* text-align: center; */
}

.answers {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.answer {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 20px;
  color: black;
  /* font-size: 1.1em; */
  font-weight: 200;
  cursor: pointer;
}

.answer-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.25rem;
}

.answer-text {
  font-weight: 500;
}

/* .answer:hover {
  color: #2c3e50 !important;
}

.answer-text:hover {
  color: #262626;
  font-weight: 500;
} */

.slot {
  margin-top: 20px;
}
</style>
