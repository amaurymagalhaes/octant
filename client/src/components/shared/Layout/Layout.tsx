import cx from 'classnames';
import React, {
  FC,
  // useState,
  Fragment,
  useEffect,
  useRef,
  // useMemo,
  //  useEffect
} from 'react';
// import { useTranslation } from 'react-i18next';
// import {
// useLocation,
//  useMatch, useNavigate
// } from 'react-router-dom';
// import { useAccount } from 'wagmi';

import LayoutFooter from 'components/shared/Layout/LayoutFooter';
import LayoutNavbar from 'components/shared/Layout/LayoutNavbar';
import LayoutTopBar from 'components/shared/Layout/LayoutTopBar';
import ModalLayoutConnectWallet from 'components/shared/Layout/ModalLayoutConnectWallet';
import ModalLayoutWallet from 'components/shared/Layout/ModalLayoutWallet';
import Loader from 'components/ui/Loader';
import { LAYOUT_BODY_ID } from 'constants/domElementsIds';
// import useEpochAndAllocationTimestamps from 'hooks/helpers/useEpochAndAllocationTimestamps';
// import useGetValuesToDisplay from 'hooks/helpers/useGetValuesToDisplay';
// import useIsProjectAdminMode from 'hooks/helpers/useIsProjectAdminMode';
import useIsProjectAdminMode from 'hooks/helpers/useIsProjectAdminMode';
import useMediaQuery from 'hooks/helpers/useMediaQuery';
// import useCurrentEpoch from 'hooks/queries/useCurrentEpoch';
// import useIndividualReward from 'hooks/queries/useIndividualReward';
// import useIsDecisionWindowOpen from 'hooks/queries/useIsDecisionWindowOpen';
// import useIsPatronMode from 'hooks/queries/useIsPatronMode';
// import useUserTOS from 'hooks/queries/useUserTOS';
// import { ROOT_ROUTES } from 'routes/RootRoutes/routes';
import useIsPatronMode from 'hooks/queries/useIsPatronMode';
import useLayoutStore from 'store/layout/store';
import SyncView from 'views/SyncView/SyncView';

// import useSettingsStore from 'store/settings/store';
// import { chevronLeft } from 'svg/navigation';
// import getDifferenceInWeeks from 'utils/getDifferenceInWeeks';
// import getIsPreLaunch from 'utils/getIsPreLaunch';
// import getTimeDistance from 'utils/getTimeDistance';
// import truncateEthAddress from 'utils/truncateEthAddress';

import styles from './Layout.module.scss';
import LayoutProps from './types';

const Layout: FC<LayoutProps> = ({
  children,
  dataTest,
  navigationBottomSuffix,
  // isHeaderVisible = true,
  isLoading,
  isNavigationVisible = true,
  classNameBody,
  isSyncingInProgress,
  // isAbsoluteHeaderPosition = false,
  // showHeaderBlur = true,
}) => {
  const { isMobile, isDesktop } = useMediaQuery();
  const isProjectAdminMode = useIsProjectAdminMode();
  const { data: isPatronMode } = useIsPatronMode();

  const ref = useRef(null);
  const topBarWrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(window.scrollY);
  const lastScrollYUpRef = useRef(0);
  // const { data: isPatronMode } = useIsPatronMode();
  // const { i18n, t  } = useTranslation('translation', { keyPrefix: 'layout.main' });
  // const { address, isConnected } = useAccount();
  // const { data: individualReward } = useIndividualReward();
  // const { data: currentEpoch } = useCurrentEpoch();
  // const { timeCurrentAllocationEnd, timeCurrentEpochEnd } = useEpochAndAllocationTimestamps();
  // const { data: isDecisionWindowOpen } = useIsDecisionWindowOpen();
  // const { pathname } = useLocation();
  // const navigate = useNavigate();
  // const { data: isUserTOSAccepted } = useUserTOS();
  // const {
  //   data: { isCryptoMainValueDisplay },
  // } = useSettingsStore(({ data }) => ({
  //   data: {
  //     isCryptoMainValueDisplay: data.isCryptoMainValueDisplay,
  //   },
  // }));

  const {
    setIsWalletModalOpen,
    setIsConnectWalletModalOpen,
    data: { isWalletModalOpen, isConnectWalletModalOpen },
  } = useLayoutStore(state => ({
    data: {
      isConnectWalletModalOpen: state.data.isConnectWalletModalOpen,
      isWalletModalOpen: state.data.isWalletModalOpen,
    },
    setIsConnectWalletModalOpen: state.setIsConnectWalletModalOpen,
    setIsWalletModalOpen: state.setIsWalletModalOpen,
  }));

  // const isPreLaunch = getIsPreLaunch(currentEpoch);
  // const isAllocationRoot = !!useMatch(ROOT_ROUTES.allocation.absolute);
  // const isUseMatchProject = !!useMatch(ROOT_ROUTES.projectWithAddress.absolute);
  // const isUseMatchProjectWithAddress = !!useMatch(ROOT_ROUTES.projectWithAddress.absolute);
  // const isProjectRoot = isUseMatchProject || isUseMatchProjectWithAddress;
  // const isProjectsRoot = !!useMatch(ROOT_ROUTES.projects.absolute);
  // const getValuesToDisplay = useGetValuesToDisplay();

  // const showAllocationPeriod = isAllocationRoot || isProjectRoot || isProjectsRoot;

  // const getCurrentPeriod = () => {
  //   if (isDecisionWindowOpen && timeCurrentAllocationEnd) {
  //     return getTimeDistance(Date.now(), new Date(timeCurrentAllocationEnd).getTime());
  //   }
  //   if (!isDecisionWindowOpen && timeCurrentEpochEnd) {
  //     return getTimeDistance(Date.now(), new Date(timeCurrentEpochEnd).getTime());
  //   }
  //   return '';
  // };
  // const [currentPeriod, setCurrentPeriod] = useState(() => getCurrentPeriod());

  // const truncatedEthAddress = useMemo(() => address && truncateEthAddress(address), [address]);

  // const isAllocationPeriodIsHighlighted = useMemo(() => {
  //   if (isDecisionWindowOpen && timeCurrentAllocationEnd) {
  //     return getDifferenceInWeeks(Date.now(), new Date(timeCurrentAllocationEnd).getTime()) < 1;
  //   }
  //   if (!isDecisionWindowOpen && timeCurrentEpochEnd) {
  //     return getDifferenceInWeeks(Date.now(), new Date(timeCurrentEpochEnd).getTime()) < 1;
  //   }
  //   return false;
  // }, [isDecisionWindowOpen, timeCurrentAllocationEnd, timeCurrentEpochEnd]);

  // const individualRewardText = useMemo(() => {
  //   if (currentEpoch === 1 || individualReward === 0n || !isDecisionWindowOpen) {
  //     return i18n.t('layout.main.noRewardsYet');
  //   }
  //   if (currentEpoch === undefined || individualReward === undefined) {
  //     return i18n.t('layout.main.loadingRewardBudget');
  //   }
  //   return i18n.t('common.rewards', {
  //     rewards: getValuesToDisplay({
  //       cryptoCurrency: 'ethereum',
  //       showCryptoSuffix: true,
  //       valueCrypto: individualReward,
  //     }).primary,
  //   });
  //   // eslint-disable-next-line  react-hooks/exhaustive-deps
  // }, [individualReward, currentEpoch, isDecisionWindowOpen, isCryptoMainValueDisplay]);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentPeriod(getCurrentPeriod());
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  //   // eslint-disable-next-line  react-hooks/exhaustive-deps
  // }, [isDecisionWindowOpen, timeCurrentAllocationEnd, timeCurrentEpochEnd]);

  // Logic that hides TopBar when scrolling down and shows when scrolling up (only on mobile devices)
  useEffect(() => {
    if (!topBarWrapperRef?.current) {
      return;
    }
    const topBarWrapperEl = topBarWrapperRef.current;

    const listener = e => {
      if (e.target.body.className === 'bodyFixed') {
        return;
      }
      const { offsetTop, clientHeight } = topBarWrapperEl;

      if (window.scrollY > scrollRef.current) {
        topBarWrapperEl.style.position = 'absolute';
        if (window.scrollY < lastScrollYUpRef.current + clientHeight) {
          topBarWrapperEl.style.top = `${lastScrollYUpRef.current}px`;
        } else if (window.scrollY >= clientHeight) {
          topBarWrapperEl.style.top = `${window.scrollY - clientHeight}px`;
        }
      } else {
        lastScrollYUpRef.current = window.scrollY;
        if (window.scrollY <= offsetTop) {
          topBarWrapperEl.style.top = '0px';
          topBarWrapperEl.style.position = 'fixed';
        }
      }

      scrollRef.current = window.scrollY;
    };

    if (!isMobile) {
      return;
    }

    lastScrollYUpRef.current = window.scrollY;
    document.addEventListener('scroll', listener);

    return () => {
      topBarWrapperEl.style.position = 'fixed';
      topBarWrapperEl.style.top = '0px';
      document.removeEventListener('scroll', listener);
    };
  }, [isMobile]);

  if (isSyncingInProgress) {
    return <SyncView />;
  }

  return (
    <Fragment>
      <div ref={ref} className={styles.root} data-test={dataTest}>
        <div
          ref={topBarWrapperRef}
          className={cx(
            styles.topBarWrapper,
            isProjectAdminMode && styles.isProjectAdminMode,
            isPatronMode && styles.isPatronMode,
          )}
        >
          <LayoutTopBar className={styles.section} />
        </div>
        {/* {isHeaderVisible && (
          <Fragment>
            {showHeaderBlur && <div className={styles.headerBlur} />}
            <div
              className={cx(
                styles.headerWrapper,
                ELEMENT_POSITION_FIXED_CLASSNAME,
                isAbsoluteHeaderPosition && styles.isAbsoluteHeaderPosition,
              )}
            >
              <div className={styles.header} data-test="MainLayout__Header">
                <div className={styles.logo} data-test="MainLayout__Logo" onClick={onLogoClick}>
                  <Svg img={octant} size={4} />
                  {networkConfig.isTestnet && (
                    <div className={styles.testnetIndicatorWrapper}>
                      <div className={styles.testnetIndicator}>{networkConfig.name}</div>
                    </div>
                  )}
                </div>
                <div className={styles.buttons}>
                  {isConnected && address ? (
                    <div
                      className={styles.profileInfo}
                      data-test="ProfileInfo"
                      onClick={() => isUserTOSAccepted && setIsWalletModalOpen(true)}
                    >
                      <div className={styles.walletInfo}>
                        <div className={styles.addressWrapper}>
                          {(isProjectAdminMode || isPatronMode) && (
                            <div
                              className={cx(
                                styles.badge,
                                isProjectAdminMode && styles.isProjectAdminMode,
                              )}
                              data-test="ProfileInfo__badge"
                            >
                              {isProjectAdminMode ? t('admin') : t('patron')}
                            </div>
                          )}

                          <div
                            className={cx(
                              styles.address,
                              isProjectAdminMode && styles.isProjectAdminMode,
                              !isProjectAdminMode && isPatronMode && styles.isPatronMode,
                            )}
                          >
                            {truncatedEthAddress}
                          </div>
                        </div>
                        {!!currentEpoch &&
                          currentEpoch > 1 &&
                          (showAllocationPeriod ? (
                            <div className={styles.allocationPeriod}>
                              <Trans
                                components={[
                                  <span
                                    className={cx(
                                      isAllocationPeriodIsHighlighted && styles.highlighted,
                                    )}
                                  />,
                                ]}
                                i18nKey={
                                  isDecisionWindowOpen
                                    ? 'layout.main.allocationEndsIn'
                                    : 'layout.main.allocationStartsIn'
                                }
                                values={{ currentPeriod }}
                              />
                            </div>
                          ) : (
                            <div className={styles.budget}>{individualRewardText}</div>
                          ))}
                      </div>
                      <Button
                        className={cx(
                          styles.buttonWallet,
                          isWalletModalOpen && styles.isWalletModalOpen,
                        )}
                        Icon={<Svg img={chevronBottom} size={0.8} />}
                        isEventStopPropagation={false}
                        variant="iconOnlyTransparent2"
                      />
                    </div>
                  ) : (
                    <Button
                      className={styles.buttonConnect}
                      dataTest="MainLayout__Button--connect"
                      isDisabled={isPreLaunch}
                      isSmallFont
                      label={t('buttonConnect')}
                      onClick={() => setIsModalConnectWalletOpen(true)}
                      variant="cta"
                    />
                  )}
                </div>
              </div>
            </div>
          </Fragment>
        )} */}
        <div
          className={cx(
            styles.body,
            styles.section,
            isLoading && styles.isLoading,
            !!navigationBottomSuffix && styles.isNavigationBottomSuffix,
            classNameBody,
          )}
          data-test="MainLayout__body"
          id={LAYOUT_BODY_ID}
        >
          {isLoading ? <Loader dataTest="MainLayout__Loader" /> : children}
        </div>
        {!isDesktop && isNavigationVisible && (
          <LayoutNavbar navigationBottomSuffix={navigationBottomSuffix} />
        )}
        <LayoutFooter className={styles.section} />
      </div>
      <ModalLayoutWallet
        modalProps={{
          isOpen: isWalletModalOpen,
          onClosePanel: () => setIsWalletModalOpen(false),
        }}
      />
      <ModalLayoutConnectWallet
        modalProps={{
          isOpen: isConnectWalletModalOpen,
          onClosePanel: () => setIsConnectWalletModalOpen(false),
        }}
      />
    </Fragment>
  );
};

export default Layout;
