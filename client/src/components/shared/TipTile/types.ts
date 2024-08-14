import { ReactElement } from 'react';

export type TipTileProps = {
  className?: string;
  dataTest?: string;
  image: string;
  imageClassName?: string;
  isOpen: boolean;
  key?: string;
  onClick?: () => void;
  onClose: () => void;
  text: string | ReactElement;
  title: string;
};
