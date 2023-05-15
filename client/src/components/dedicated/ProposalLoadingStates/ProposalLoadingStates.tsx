import React, { FC } from 'react';
import { Trans } from 'react-i18next';

import Loader from 'components/core/Loader/Loader';

import ProposalLoadingStatesProps from './types';

const ProposalLoadingStates: FC<ProposalLoadingStatesProps> = ({ isLoadingError, isLoading }) => {
  if (isLoadingError) {
    return <Trans i18nKey="components.dedicated.proposalLoadingStates.text" />;
  }
  if (isLoading) {
    return <Loader />;
  }
  return null;
};

export default ProposalLoadingStates;
