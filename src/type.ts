import { ReactElement } from 'react'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /** for debug info, should not be used in production mode */
  debugName?: string
  children: ReactElement<any>
}
