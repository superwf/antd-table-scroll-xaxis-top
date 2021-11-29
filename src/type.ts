import { ReactElement } from 'react'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /** for debug info, should not be used in production mode */
  debugName?: string
  /**
   * @deprecated
   * useless from 1.0.2
   * */
  prefixCls?: string
  children: ReactElement<any>
}
