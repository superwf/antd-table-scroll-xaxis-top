import { TableProps } from 'antd/lib/table'
import { ReactElement } from 'react'

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /** for debug info, should not be used in production mode */
  debugName?: string
  children: ReactElement<any>

  controlColumns?: boolean
}

export type TablePropsAny = TableProps<any>

export type FixedColSet = { left: Set<string>; right: Set<string> }

export type UseControlColumnsProps = {
  excludeKeySet: Set<string>
  setExcludeKeySet: (s: Set<string>) => void
  columnKeys: string[]
  setColumnKeys: (k: string[]) => void
  childrenMapKeys: Record<string, string[]>
  setChildrenMapKeys: (r: Record<string, string[]>) => void
  fixed: FixedColSet
  setFixed: (v: any) => void
}

export type UseControlColumnsReturn = TablePropsAny & UseControlColumnsProps

export type ColumnControllerProps = {
  columns: Exclude<TablePropsAny['columns'], undefined>
  columnKeys: string[]
  setColumnKeys: (k: string[]) => void
  childrenMapKeys: Record<string, string[]>
  setChildrenMapKeys: (r: Record<string, string[]>) => void
  excludeKeySet: Set<string>
  setExcludeKeySet: (s: Set<string>) => void
  fixed: FixedColSet
  setFixed: (v: any) => void
} & React.HTMLAttributes<HTMLDivElement>
