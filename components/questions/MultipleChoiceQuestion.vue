<template>
    <div class="container">
      <div class="question">{{ questionText }}</div>
      <div class="choices">
        <div v-for="(choice, index) in choices" :key="index" class="choice">
          <input
            type="radio"
            :id="`choice-${index}`"
            :value="choice"
            v-model="selectedChoice"
          />
          <label :for="`choice-${index}`">{{ choice }}</label>
        </div>
      </div>
      <div class="buttons">
        <slot></slot>
        <button @click="submit" class="feedback-panel-btn-feedback">Next</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "MultipleChoiceQuestion",
    props: {
      questionText: String,
      choices: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        selectedChoice: null,
      };
    },
    created() {
      console.log("Choices prop: ", this.choices);  // Debugging choices prop
    },
    methods: {
      submit() {
        this.$emit("answered", this.selectedChoice);
      },
    },
  };
  </script>
  
  <style scoped>
  .question {
    word-wrap: break-word;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 1rem;
  }
  
  .choices {
  margin-bottom: 20px;
}

.choice {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.choice label {
  margin-left: 0.25rem;
}

.choice input {
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1em;
  height: 1em;
  border: 0.1em solid rgba(60, 60, 67, 0.3);
  border-radius: 50%;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
  cursor: pointer;
}

.choice input::before {
  content: '';
  width: 0.65em;
  height: 0.65em;
  border-radius: 50%;
  transition: transform 0.2s ease-in-out;
  box-shadow: inset 1em 1em #3ea2a8;
  transform: scale(0);
}

.choice input:checked::before {
  transform: scale(1);
}

  .buttons {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  button {
    margin-left: 10px;
  }
  
  .container {
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
  }
  </style>
  