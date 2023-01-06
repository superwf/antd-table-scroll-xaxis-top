import { TableProps } from 'antd/lib/table'
import { ReactElement } from 'react'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /** for debug info, should not be used in production mode */
  debugName?: string
  children: ReactElement<any>

  controlColumns?: boolean
}

export type TablePropsAny = TableProps<any>

export type UseControlColumnsReturn = TablePropsAny & {
  keySet: Set<string>
  setKeySet: (s: Set<string>) => void
}

export type ColumnControllerProps = {
  columns: Exclude<TablePropsAny['columns'], undefined>
  keySet: Set<string>
  setKeySet: (s: Set<string>) => void
} & React.HTMLAttributes<HTMLDivElement>
