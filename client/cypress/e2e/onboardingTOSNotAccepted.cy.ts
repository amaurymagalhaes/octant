// eslint-disable-next-line import/no-extraneous-dependencies
import chaiColors from 'chai-colors';

import {
  beforeSetup,
  checkChangeStepsByClickingEdgeOfTheScreenMoreThan25px,
  checkChangeStepsByClickingEdgeOfTheScreenUpTo25px,
  checkChangeStepsBySwipingOnScreenDifferenceLessThanl5px,
  checkChangeStepsBySwipingOnScreenDifferenceMoreThanOrEqual5px,
  checkChangeStepsWithArrowKeys,
  checkCurrentElement,
  checkProgressStepperSlimIsCurrentAndClickNext,
  connectWallet,
} from 'cypress/utils/onboarding';
import viewports from 'cypress/utils/viewports';
import { getStepsDecisionWindowOpen } from 'src/hooks/helpers/useOnboardingSteps/steps';

chai.use(chaiColors);

Object.values(viewports).forEach(({ device, viewportWidth, viewportHeight }) => {
  describe(`onboarding (TOS not accepted): ${device}`, { viewportHeight, viewportWidth }, () => {
    before(() => {
      beforeSetup();
    });

    beforeEach(() => {
      cy.intercept(
        {
          method: 'POST',
          url: '/user/*/tos',
        },
        { body: { accepted: true }, statusCode: 200 },
      );
      connectWallet(false);
    });

    it('onboarding TOS step should be first and active', () => {
      checkCurrentElement(0, true);
      cy.get('[data-test=ModalOnboardingTOS]').should('be.visible');
    });

    it('user is not able to click through entire onboarding flow', () => {
      for (let i = 1; i < getStepsDecisionWindowOpen('2', '16 Jan').length; i++) {
        checkProgressStepperSlimIsCurrentAndClickNext(i, i === 1);
      }
    });

    it('user is not able to close the modal by clicking button in the top-right', () => {
      cy.get('[data-test=ModalOnboarding]').should('be.visible');
      cy.get('[data-test=ModalOnboarding__Button]').click({ force: true });
      cy.get('[data-test=ModalOnboarding]').should('be.visible');
    });

    it('renders every time page is refreshed', () => {
      cy.get('[data-test=ModalOnboarding]').should('be.visible');
      cy.reload();
      cy.get('[data-test=ModalOnboarding]').should('be.visible');
    });

    it('user cannot change steps with arrow keys (left, right)', () => {
      checkChangeStepsWithArrowKeys(false);
    });

    it('user can change steps by clicking the edge of the screen (up to 25px from each edge)', () => {
      checkChangeStepsByClickingEdgeOfTheScreenUpTo25px(false);
    });

    it('user cannot change steps by clicking the edge of the screen (more than 25px from each edge)', () => {
      checkChangeStepsByClickingEdgeOfTheScreenMoreThan25px(false);
    });

    it('user cannot change steps by swiping on screen (difference more than or equal 5px)', () => {
      checkChangeStepsBySwipingOnScreenDifferenceMoreThanOrEqual5px(false);
    });

    it('user cannot change steps by swiping on screen (difference less than 5px)', () => {
      checkChangeStepsBySwipingOnScreenDifferenceLessThanl5px(false);
    });

    it('TOS acceptance changes onboarding step to next step', () => {
      checkCurrentElement(0, true);
      cy.get('[data-test=TOS_InputCheckbox]').check();
      cy.switchToMetamaskNotification();
      cy.confirmMetamaskSignatureRequest();
      checkCurrentElement(1, true);
    });

    it('TOS acceptance allows the user to close the modal by clicking button in the top-right', () => {
      checkCurrentElement(0, true);
      cy.get('[data-test=TOS_InputCheckbox]').check();
      cy.switchToMetamaskNotification();
      cy.confirmMetamaskSignatureRequest();
      checkCurrentElement(1, true);
      cy.get('[data-test=ModalOnboarding__Button]').click();
      cy.get('[data-test=ModalOnboarding]').should('not.exist');
    });
  });
});
