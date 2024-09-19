import cx from 'classnames';
import { useAnimate } from 'framer-motion';
import React, { FC, Fragment, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

import Allocation from 'components/Allocation';
import Settings from 'components/Settings';
import Button from 'components/ui/Button';
import Drawer from 'components/ui/Drawer';
import Svg from 'components/ui/Svg';
import useIsProjectAdminMode from 'hooks/helpers/useIsProjectAdminMode';
import useMediaQuery from 'hooks/helpers/useMediaQuery';
import useNavigationTabs from 'hooks/helpers/useNavigationTabs';
import useCurrentEpoch from 'hooks/queries/useCurrentEpoch';
import useIsDecisionWindowOpen from 'hooks/queries/useIsDecisionWindowOpen';
import useIsPatronMode from 'hooks/queries/useIsPatronMode';
import { ROOT_ROUTES } from 'routes/RootRoutes/routes';
import useAllocationsStore from 'store/allocations/store';
import useLayoutStore from 'store/layout/store';
import { octant } from 'svg/logo';
import { calendar, chevronBottom } from 'svg/misc';
import { allocate, settings } from 'svg/navigation';
import truncateEthAddress from 'utils/truncateEthAddress';

import styles from './LayoutTopBar.module.scss';
import LayoutTopBarProps from './types';

const LayoutTopBar: FC<LayoutTopBarProps> = ({ className }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'layout.topBar' });
  const { isDesktop, isMobile } = useMediaQuery();
  const { isConnected, address } = useAccount();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data: isDecisionWindowOpen } = useIsDecisionWindowOpen();
  const { data: currentEpoch } = useCurrentEpoch();
  const {
    isSettingsDrawerOpen,
    isAllocationDrawerOpen,
    setIsWalletModalOpen,
    setIsConnectWalletModalOpen,
    setIsAllocationDrawerOpen,
    setIsSettingsDrawerOpen,
  } = useLayoutStore(state => ({
    isAllocationDrawerOpen: state.data.isAllocationDrawerOpen,
    isSettingsDrawerOpen: state.data.isSettingsDrawerOpen,
    setIsAllocationDrawerOpen: state.setIsAllocationDrawerOpen,
    setIsConnectWalletModalOpen: state.setIsConnectWalletModalOpen,
    setIsSettingsDrawerOpen: state.setIsSettingsDrawerOpen,
    setIsWalletModalOpen: state.setIsWalletModalOpen,
  }));
  const isProjectAdminMode = useIsProjectAdminMode();
  const { data: isPatronMode } = useIsPatronMode();
  const { allocations } = useAllocationsStore(state => ({
    allocations: state.data.allocations,
  }));
  const allocationsPrevRef = useRef(allocations);

  const tabs = useNavigationTabs(true);
  const [scope, animate] = useAnimate();

  const allocationInfoText = useMemo(() => {
    const epoch = currentEpoch! - 1;

    if (isDecisionWindowOpen) {
      return isMobile
        ? t('epochAllocationWindowOpenShort', { epoch })
        : t('epochAllocationWindowOpen', { epoch });
    }

    return isMobile
      ? t('epochAllocationWindowClosedShort', { epoch })
      : t('epochAllocationWindowClosed', { epoch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDecisionWindowOpen, currentEpoch, isMobile]);

  const buttonWalletText = useMemo(() => {
    if (!isConnected) {
      return !isMobile ? t('connectWallet') : t('connect');
    }

    if (isProjectAdminMode || isPatronMode) {
      return `${isProjectAdminMode ? t('admin') : t('patron')}${isMobile ? '' : ` ${truncateEthAddress(address!, true)}`}`;
    }

    return truncateEthAddress(address!, isMobile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isConnected, isMobile, isProjectAdminMode, isPatronMode]);

  const onLogoClick = () => {
    if (pathname === ROOT_ROUTES.home.absolute) {
      window.scrollTo({ behavior: 'smooth', top: 0 });
      return;
    }

    navigate(ROOT_ROUTES.home.absolute);
  };

  useEffect(() => {
    if (pathname !== ROOT_ROUTES.settings.absolute || !isDesktop) {
      return;
    }

    setIsSettingsDrawerOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, pathname]);

  useEffect(() => {
    if (isSettingsDrawerOpen && pathname !== ROOT_ROUTES.settings.absolute && !isDesktop) {
      navigate(ROOT_ROUTES.settings.absolute);
      setIsSettingsDrawerOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, pathname, isSettingsDrawerOpen]);

  useEffect(() => {
    if (pathname !== ROOT_ROUTES.allocation.absolute || !isDesktop) {
      return;
    }

    setIsAllocationDrawerOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, pathname]);

  useEffect(() => {
    if (isAllocationDrawerOpen && pathname !== ROOT_ROUTES.allocation.absolute && !isDesktop) {
      navigate(ROOT_ROUTES.allocation.absolute);
      setIsAllocationDrawerOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop, pathname, isAllocationDrawerOpen]);

  useEffect(() => {
    if (!scope?.current || allocations.length === allocationsPrevRef.current.length) {
      return;
    }
    animate([
      [scope?.current, { scale: 1.5 }, { duration: 0.15, ease: 'easeOut' }],
      [scope?.current, { scale: 1 }, { duration: 0.15, ease: 'easeOut' }],
    ]);
    allocationsPrevRef.current = allocations;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allocations]);

  return (
    <div className={cx(styles.root, className)}>
      <Svg classNameSvg={styles.octantLogo} img={octant} onClick={onLogoClick} size={4} />
      {isDesktop && (
        <div className={styles.links}>
          {tabs.map(tab => (
            <div
              key={tab.key}
              className={cx(styles.link, tab.isActive && styles.isActive)}
              onClick={() => navigate(tab.to)}
            >
              {tab.label}
            </div>
          ))}
        </div>
      )}
      <div className={styles.allocationInfo}>
        {!isMobile && <Svg classNameSvg={styles.calendarIcon} img={calendar} size={1.6} />}
        {allocationInfoText}
      </div>
      <Button
        className={cx(
          styles.buttonWallet,
          !isConnected && styles.isConnectButton,
          isPatronMode && styles.isPatronMode,
          isProjectAdminMode && styles.isProjectAdminMode,
        )}
        onClick={() =>
          isConnected ? setIsWalletModalOpen(true) : setIsConnectWalletModalOpen(true)
        }
        variant="cta"
      >
        {buttonWalletText}
        {isConnected && (
          <Svg classNameSvg={styles.buttonWalletArrow} img={chevronBottom} size={1} />
        )}
      </Button>
      {isDesktop && (
        <Fragment>
          <div
            className={styles.settingsButton}
            onClick={() => setIsSettingsDrawerOpen(!isSettingsDrawerOpen)}
          >
            <Svg classNameSvg={styles.settingsButtonIcon} img={settings} size={2} />
          </div>
          {!isProjectAdminMode && !isPatronMode && (
            <div
              className={styles.allocateButton}
              onClick={() => setIsAllocationDrawerOpen(!isAllocationDrawerOpen)}
            >
              <Svg classNameSvg={styles.allocateButtonIcon} img={allocate} size={2} />
              {allocations.length > 0 && (
                <div
                  ref={scope}
                  className={styles.numberOfAllocations}
                  data-test="LayoutTopBar__numberOfAllocations"
                >
                  {allocations.length}
                </div>
              )}
            </div>
          )}
        </Fragment>
      )}
      {isDesktop && (
        <>
          <Drawer isOpen={isSettingsDrawerOpen} onClose={() => setIsSettingsDrawerOpen(false)}>
            <Settings />
          </Drawer>
          <Drawer isOpen={isAllocationDrawerOpen} onClose={() => setIsAllocationDrawerOpen(false)}>
            <Allocation />
          </Drawer>
        </>
      )}
    </div>
  );
};

export default LayoutTopBar;
