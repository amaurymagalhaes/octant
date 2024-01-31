import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import MetricsGridTile from 'components/Metrics/MetricsGrid/MetricsGridTile';
import MetricsGridTileValue from 'components/Metrics/MetricsGrid/MetricsGridTileValue';
import useMetricsEpoch from 'hooks/helpers/useMetrcisEpoch';
import useEpochDonors from 'hooks/queries/useEpochDonors';

import MetricsEpochGridCurrentDonorsProps from './types';

const MetricsEpochGridCurrentDonors: FC<MetricsEpochGridCurrentDonorsProps> = ({
  isLoading = false,
  className,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'views.metrics' });
  const { epoch } = useMetricsEpoch();
  const { data: epochDonors } = useEpochDonors(epoch);

  const currentDonorsString = `${epochDonors?.length || 0}`;

  return (
    <MetricsGridTile
      className={className}
      dataTest="MetricsEpochGridCurrentDonors"
      groups={[
        {
          children: (
            <MetricsGridTileValue
              isLoading={isLoading}
              showSubvalueLoader={false}
              value={currentDonorsString}
            />
          ),
          title: t('currentDonors'),
        },
      ]}
      size="S"
    />
  );
};

export default MetricsEpochGridCurrentDonors;
