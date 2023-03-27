import React, { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import useOnboardingStore from 'store/onboarding/store';
import AllocationView from 'views/AllocationView/AllocationView';
import EarnView from 'views/EarnView/EarnView';
import MetricsView from 'views/MetricsView/MetricsView';
import OnboardingView from 'views/OnboardingView/OnboardingView';
import ProposalsView from 'views/ProposalsView/ProposalsView';
import ProposalView from 'views/ProposalView/ProposalView';
import SettingsView from 'views/SettingsView/SettingsView';

import { ROOT_ROUTES } from './routes';

const RootRoutes = (): ReactElement => {
  const {
    data: { isOnboardingDone },
  } = useOnboardingStore();

  if (!isOnboardingDone) {
    return (
      <Routes>
        <Route element={<OnboardingView />} path={`${ROOT_ROUTES.onboarding.relative}/*`} />
        <Route element={<Navigate to={ROOT_ROUTES.onboarding.absolute} />} path="*" />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AllocationView />} path={`${ROOT_ROUTES.allocation.relative}/*`} />
      <Route element={<EarnView />} path={`${ROOT_ROUTES.earn.relative}/*`} />
      <Route element={<MetricsView />} path={`${ROOT_ROUTES.metrics.relative}/*`} />
      <Route element={<ProposalsView />} path={`${ROOT_ROUTES.proposals.relative}/*`} />
      <Route element={<ProposalView />} path={`${ROOT_ROUTES.proposalWithAddress.relative}/*`} />
      <Route element={<SettingsView />} path={`${ROOT_ROUTES.settings.relative}/*`} />
      <Route element={<Navigate to={ROOT_ROUTES.proposals.absolute} />} path="*" />
    </Routes>
  );
};

export default RootRoutes;
