import React, { ReactElement, useState, Fragment } from 'react';

import 'react-toastify/dist/ReactToastify.css';

import AppLoader from 'components/dedicated/AppLoader/AppLoader';
import ModalOnboarding from 'components/dedicated/ModalOnboarding/ModalOnboarding';
import useAppConnectManager from 'hooks/helpers/useAppConnectManager';
import useAppIsLoading from 'hooks/helpers/useAppIsLoading';
import useAppPopulateState from 'hooks/helpers/useAppPopulateState';
import useIsProjectAdminMode from 'hooks/helpers/useIsProjectAdminMode';
import useManageTransactionsPending from 'hooks/helpers/useManageTransactionsPending';
import RootRoutes from 'routes/RootRoutes/RootRoutes';

import 'styles/index.scss';
import 'i18n';

const App = (): ReactElement => {
  useManageTransactionsPending();
  useAppPopulateState();
  const [isFlushRequired, setIsFlushRequired] = useState(false);
  const { isSyncingInProgress } = useAppConnectManager(isFlushRequired, setIsFlushRequired);
  const isLoading = useAppIsLoading(isFlushRequired);
  const isProjectAdminMode = useIsProjectAdminMode();

  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <Fragment>
      <RootRoutes isSyncingInProgress={isSyncingInProgress} />
      {!isSyncingInProgress && !isProjectAdminMode && <ModalOnboarding />}
    </Fragment>
  );
};

export default App;
