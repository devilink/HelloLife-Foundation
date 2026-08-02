import 'next/link';

declare module 'next/link' {
  export interface LinkProps {
    children?: React.ReactNode;
  }
}
