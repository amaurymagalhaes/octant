import { ButtonHTMLAttributes, ReactNode } from 'react';
import { LinkProps } from 'react-router-dom';

export const BUTTON_VARIANTS = [
  'secondary',
  'cta',
  'iconOnly',
  'iconOnlyTransparent',
  'iconVertical',
  'link',
  'link2',
];

export type ButtonVariant = typeof BUTTON_VARIANTS[number];
export type ButtonType = ButtonHTMLAttributes<Element>['type'];

export default interface ButtonProps {
  Icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  href?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  isHigh?: boolean;
  isLoading?: boolean;
  isSmallFont?: boolean;
  label?: string;
  onClick?: (event?: Event) => void;
  rel?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  to?: LinkProps['to'];
  type?: ButtonType;
  variant?: ButtonVariant;
}
