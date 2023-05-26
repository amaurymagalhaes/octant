import { visitWithLoader } from 'cypress/utils/e2e';
import { FIAT_CURRENCIES_SYMBOLS, DISPLAY_CURRENCIES } from 'src/constants/currencies';
import {
  DISPLAY_CURRENCY,
  IS_CRYPTO_MAIN_VALUE_DISPLAY,
  IS_ONBOARDING_ALWAYS_VISIBLE,
  IS_ONBOARDING_DONE,
} from 'src/constants/localStorageKeys';
import { ETH_STAKED } from 'src/constants/stake';
import { ROOT_ROUTES } from 'src/routes/RootRoutes/routes';
import getValueCryptoToDisplay from 'src/utils/getValueCryptoToDisplay';

describe('settings', () => {
  beforeEach(() => {
    localStorage.setItem(IS_ONBOARDING_ALWAYS_VISIBLE, 'false');
    localStorage.setItem(IS_ONBOARDING_DONE, 'true');
    visitWithLoader(ROOT_ROUTES.settings.absolute);
  });

  it('"Always show Allocate onboarding" option toggle works', () => {
    cy.get('[data-test=AlwaysShowOnboarding__InputCheckbox]').check();
    cy.get('[data-test=AlwaysShowOnboarding__InputCheckbox]').should('be.checked');
    cy.getAllLocalStorage().then(() => {
      expect(localStorage.getItem(IS_ONBOARDING_ALWAYS_VISIBLE)).eq('true');
    });

    cy.get('[data-test=AlwaysShowOnboarding__InputCheckbox]').click();
    cy.get('[data-test=AlwaysShowOnboarding__InputCheckbox]').should('not.be.checked');
    cy.getAllLocalStorage().then(() => {
      expect(localStorage.getItem(IS_ONBOARDING_ALWAYS_VISIBLE)).eq('false');
    });

    cy.get('[data-test=AlwaysShowOnboarding__InputCheckbox]').click();
    cy.get('[data-test=AlwaysShowOnboarding__InputCheckbox]').should('be.checked');
    cy.getAllLocalStorage().then(() => {
      expect(localStorage.getItem(IS_ONBOARDING_ALWAYS_VISIBLE)).eq('true');
    });
  });

  it('"Use crypto as main value display" option is checked by default', () => {
    cy.get('[data-test=UseCryptoAsMainValueDisplay__InputCheckbox]').should('be.checked');
    cy.getAllLocalStorage().then(() => {
      expect(localStorage.getItem(IS_CRYPTO_MAIN_VALUE_DISPLAY)).eq('true');
    });
  });

  it('"Use crypto as main value display" option toggle works', () => {
    cy.get('[data-test=UseCryptoAsMainValueDisplay__InputCheckbox]').check();
    cy.get('[data-test=UseCryptoAsMainValueDisplay__InputCheckbox]').should('be.checked');
    cy.getAllLocalStorage().then(() => {
      expect(localStorage.getItem(IS_CRYPTO_MAIN_VALUE_DISPLAY)).eq('true');
    });

    cy.get('[data-test=UseCryptoAsMainValueDisplay__InputCheckbox]').click();
    cy.get('[data-test=UseCryptoAsMainValueDisplay__InputCheckbox]').should('not.be.checked');
    cy.getAllLocalStorage().then(() => {
      expect(localStorage.getItem(IS_CRYPTO_MAIN_VALUE_DISPLAY)).eq('false');
    });

    cy.get('[data-test=UseCryptoAsMainValueDisplay__InputCheckbox]').click();
    cy.get('[data-test=UseCryptoAsMainValueDisplay__InputCheckbox]').should('be.checked');
    cy.getAllLocalStorage().then(() => {
      expect(localStorage.getItem(IS_CRYPTO_MAIN_VALUE_DISPLAY)).eq('true');
    });
  });

  it('"Use crypto as main value display" option by default displays crypto value as primary in DoubleValue component', () => {
    cy.get('[data-test=Metrics__Button]').click();

    const cryptoValue = getValueCryptoToDisplay({
      cryptoCurrency: 'ethereum',
      valueCrypto: ETH_STAKED,
    });

    cy.get('[data-test=MetricsView__DoubleValue--ethStaked]').within(() => {
      cy.get('[data-test=MetricsView__DoubleValue--ethStaked__primary]')
        .invoke('text')
        .should('eq', cryptoValue);
      cy.get('[data-test=MetricsView__DoubleValue--ethStaked__secondary]')
        .invoke('text')
        .should('not.eq', cryptoValue);
    });
  });

  it('"Use crypto as main value display" option changes DoubleValue sections order', () => {
    cy.get('[data-test=UseCryptoAsMainValueDisplay__InputCheckbox]').uncheck();
    cy.get('[data-test=Metrics__Button]').click();

    const cryptoValue = getValueCryptoToDisplay({
      cryptoCurrency: 'ethereum',
      valueCrypto: ETH_STAKED,
    });

    cy.get('[data-test=MetricsView__DoubleValue--ethStaked]').within(() => {
      cy.get('[data-test=MetricsView__DoubleValue--ethStaked__primary]')
        .invoke('text')
        .should('not.eq', cryptoValue);
      cy.get('[data-test=MetricsView__DoubleValue--ethStaked__secondary]')
        .invoke('text')
        .should('eq', cryptoValue);
    });
  });

  it('"Choose a display currency" option works', () => {
    cy.getAllLocalStorage().then(() => {
      expect(localStorage.getItem(DISPLAY_CURRENCY)).eq('"usd"');
    });

    for (let i = 0; i < DISPLAY_CURRENCIES.length - 1; i++) {
      const displayCurrency = DISPLAY_CURRENCIES[i];
      const displayCurrencyToUppercase = displayCurrency.toUpperCase();
      const nextDisplayCurrencyToUppercase =
        i < DISPLAY_CURRENCIES.length - 1 ? DISPLAY_CURRENCIES[i + 1].toUpperCase() : undefined;

      cy.get('[data-test=InputSelect__CustomSingleValue]').contains(displayCurrencyToUppercase);
      cy.get('[data-test=Metrics__Button]').click();

      if (FIAT_CURRENCIES_SYMBOLS[displayCurrency]) {
        cy.get('[data-test=MetricsView__DoubleValue--ethStaked__secondary]').contains(
          FIAT_CURRENCIES_SYMBOLS[displayCurrency],
        );
      } else {
        cy.get('[data-test=MetricsView__DoubleValue--ethStaked__secondary]').contains(
          displayCurrencyToUppercase,
        );
      }

      cy.get('[data-test=Settings__Button]').click();
      cy.get('[data-test=InputSelect]').click();
      cy.get(`[data-test=InputSelect__CustomOption--${nextDisplayCurrencyToUppercase}]`).click();
    }
  });
});
