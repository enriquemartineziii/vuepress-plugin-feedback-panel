import FeedbackPanel from "./components/FeedbackPanel.vue";
// import { setupSpecificPagesTrigger } from './scripts/triggers/specificPagesTrigger.js'
// import { setupTimeoutTrigger } from "./scripts/triggers/timeoutTrigger";
import defaultOptions from "./config";
import userOptions from '@dynamic/feedbackPanelPluginOptions';

export default ({ Vue, router }) => {
  console.log('User Options:', userOptions);  // Debugging userOptions
  configure();
  addComponents(Vue);

  // Feedback panel will not open itself automatically for now
  // That may be enabled in the future
  // setupSpecificPagesTrigger(router);
  // setupTimeoutTrigger();
};

function addComponents(Vue) {
  Vue.component("FeedbackPanel", FeedbackPanel);
}

export function configure() {
  defaultOptions.config = { ...defaultOptions.config, ...userOptions };
  console.log('Final Config:', defaultOptions.config);  // Debugging final configuration
}
