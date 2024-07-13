<template>
  <div>
    <div class="feedback-panel-button" v-on:click="revealClicked" ref="feedbackButton">
      <span class="feedback-panel-content">{{options.buttonText}}</span>
    </div>

    <transition name="feedback-panel">
      <div v-if="isPanelOpen" class="feedback-panel-overlay" v-on:click="revealClicked"></div>
    </transition>

    <div>
      <transition name="feedback-panel">
        <div v-if="isPanelOpen" class="feedback-panel-dialog-container">
          <div v-on:click="revealClicked" class="feedback-panel-close-btn">
            <span>+</span>
          </div>
          <div class="feedback-panel-question-container" v-if="question !== null">
            <component
              v-bind:is="question.component"
              v-bind:questionText="question.questionText"
              v-bind="question.props"
              @answered="answerProvided"
            >
              <div class="feedback-panel-additional-buttons">
                <div class="feedback-panel-btn-back">
                  <button
                    v-if="!question.isFirst && question.canBack"
                    @click="previousQuestion"
                    class="feedback-panel-btn-feedback"
                  >
                    Back
                  </button>
                </div>
                <div class="feedback-panel-btn-skip" v-if="question.skippable">
                  <button @click="skip" class="feedback-panel-btn-feedback">
                    Skip
                  </button>
                </div>
              </div>
            </component>

            <Stepper class="feedback-panel-stepper" :total="totalQuestions" :current="question.questionNumber" />
          </div>

          <div v-else class="feedback-panel-last-view">
            Thanks for your feedback. It helps us to make our website better!
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Reminder from "./Reminder.vue";
import Stepper from "./Stepper.vue";
import StarQuestion from "./questions/StarQuestion.vue";
import OpenQuestion from "./questions/OpenQuestion.vue";
import BinaryQuestion from "./questions/BinaryQuestion.vue";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion.vue";
import { sendWithRegistration } from "../scripts/feedbackSender";
import { isPanelOpen, isReminderOpen, mutations } from "../scripts/feedbackStore";
import options from "../config";

let getFirstQuestion;
let getNextQuestion;
let getPreviousQuestion;

export default {
  name: "FeedbackPanel",

  components: {
    Reminder,
    Stepper,
    StarQuestion,
    OpenQuestion,
    BinaryQuestion,
    MultipleChoiceQuestion,
  },

  created() {
    import("../scripts/questions").then((m) => {
      getFirstQuestion = m.getFirstQuestion;
      getNextQuestion = m.getNextQuestion;
      getPreviousQuestion = m.getPreviousQuestion;

      m.init();
      this.question = getFirstQuestion();
      this.totalQuestions = m.getTotalAmount();
    });
  },

  data() {
    return {
      question: null,
      answers: [],
      sendingInProgress: false,
      totalQuestions: 0,
      feedbackSubmitted: false,
      options: options.config,
    };
  },

  computed: {
    isPanelOpen: isPanelOpen,
    isReminderOpen: isReminderOpen,
  },

  methods: {
    revealClicked: function() {
      mutations.toggleIsPanelOpen();

      if (this.isPanelOpen) {
        mutations.setIsReminderOpen(false);
      }

      if (!this.isPanelOpen && this.answers.length !== 0) {
        this.submitResults();
        this.reset();
      }
    },

    answerProvided: async function(answer) {
      if (answer !== null) {
        this.answers.push({
          question: this.question.questionText,
          answer,
          questionId: this.question.id,
        });
      }

      this.question = getNextQuestion(answer);

      if (this.question === null) {
        await this.submitResults();
      }
    },

    skip: async function() {
      this.question = getNextQuestion();

      if (this.question === null) {
        await this.submitResults();
      }
    },

    previousQuestion: function() {
      if (!this.isFirst) {
        this.question = getPreviousQuestion();
        this.answers.pop();
      }
    },

    submitResults: async function(quiet = false) {
      if (!quiet) this.sendingInProgress = true;

      try {
        await sendWithRegistration(this.answers);
        this.feedbackSubmitted = true;
      } catch (e) {
        console.error("Sending feedback failed ", e);
      }

      this.sendingInProgress = false;

      setTimeout(() => this.reset(500), 800);
    },

    reset: function(timeout = 0) {
      this.sendingInProgress = false;
      mutations.setIsPanelOpen(false);

      setTimeout(() => {
        this.question = getFirstQuestion();
        this.answers = [];
      }, timeout);
    },
  },
};
</script>

<style>
.feedback-panel-button {
  transform: rotate(-90deg) translateY(-50%);
  position: fixed;
  right: -4.1rem; /* Adjust this value to align perfectly */
  top: 50%;
  padding: 0.25rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 0.25rem 0.25rem 0 0;
  cursor: pointer;
  transition: transform 0.5s, background-color 0.2s;
  z-index: 1001;
  background-color: #327F86;
}

.feedback-panel-button:hover {
  background-color: #2b6173;
}

.feedback-panel-dialog-container {
  /* Fixes code blocks overlap */
  z-index: 1003;
  position: fixed;
  right: 0;
  top: 0;
  background-color: white;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  transition: transform 0.5s, box-shadow 0.5s;
  overflow: auto;
  width: 25rem;
  height: 100vh;
}

.feedback-panel-enter-active,
.feedback-panel-leave-active {
  transform: translateX(0rem);
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.feedback-panel-enter,
.feedback-panel-leave-to {
  transform: translateX(30rem);
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.feedback-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1002;
}

/* .reminder-enter-active,
.reminder-leave-active {
  opacity: 1 !important;
}

.reminder-enter,
.reminder-leave-to {
  opacity: 0 !important;
} */

.feedback-panel-question-container {
  margin: 2.5rem;
}

.feedback-panel-content {
  color: white;
  font-weight: 500;
  font-size: 1.2rem;
}

.feedback-panel-loading {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.feedback-panel-loading img {
  width: 50px;
}

.feedback-panel-stepper {
  position: absolute;
  bottom: 1em;
  right: 0;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  color: gray;
}

.feedback-panel-btn-feedback {
  background-color: #327F86;
  border: 2px solid #ffffff00;
  color: white;
  min-width: 56px;
  padding: 5px 10px;
  border-radius: 5px;
  font-family: inherit;
  cursor: pointer;
  transition: 0.2s ease;
}

.feedback-panel-btn-feedback:hover {
  background-color: #2b6173;
  transition: 0.2s ease;
}

.feedback-panel-btn-feedback:active {
  background-color: #2b6173;
}

.feedback-panel-btn-skip {
  display: flex;
  justify-content: flex-end;
}

.feedback-panel-btn-back {
  display: flex;
  justify-content: flex-start;
}

.feedback-panel-last-view {
  padding: 2em;
}

.feedback-panel-close-btn {
  position: absolute;
  right: 10px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin: 10px 5px;
  border-radius: 50%;
  text-align: center;
  font-weight: 700;
  line-height: 28px;
  font-size: 25px;
  transform: rotate(45deg);
}

.feedback-panel-additional-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1em;
}

.feedback-panel-shaky {
  animation: shake 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both infinite;
  transform: translate3d(0, 0, 0);
  transform: scale(1);
}

@keyframes feedback-panel-shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-10px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
