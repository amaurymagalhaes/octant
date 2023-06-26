import { CurrentView } from 'views/AllocationView/types';

export default interface AllocationNavigationProps {
  areButtonsDisabled: boolean;
  currentView: CurrentView;
  isLoading: boolean;
  onAllocate: () => void;
  onResetValues: () => void;
  setCurrentView: (newView: CurrentView) => void;
}
