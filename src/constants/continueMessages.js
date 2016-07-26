import { epidemicIntensifyContinue } from '../actions/cardActions';


export default Object.freeze({
  TO_INTENSIFY_STEP: {
    message: 'Continue to Epidemic Intensify step',
    action: epidemicIntensifyContinue()
  }
});
