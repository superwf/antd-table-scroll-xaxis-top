import React from 'react'
import type { ColumnGroupType } from 'antd/lib/table/interface'

import { ColumnControllerProps, UseControlColumnsProps } from './type'
import { getKey } from './tool'

const ColChecker: React.FC<
  {
    parentColKey?: string
    colKey: string
    col: any
  } & UseControlColumnsProps
> = ({
  colKey,
  parentColKey,
  col,
  columnKeys,
  setColumnKeys,
  childrenMapKeys,
  setChildrenMapKeys,
  excludeKeySet,
  setExcludeKeySet,
}) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label className="atsxt-controller-label">
    <input
      className="atsxt-controller-checkbox"
      type="checkbox"
      onChange={e => {
        const newSet = new Set(excludeKeySet)
        if (e.target.checked) {
          newSet.delete(e.target.value)
        } else {
          newSet.add(e.target.value)
        }
        setExcludeKeySet(newSet)
      }}
      defaultChecked={!excludeKeySet.has(colKey)}
      value={colKey}
    />
    {col.title}
  </label>
)

export const ColumnController: React.FC<ColumnControllerProps> = ({
  columns,
  columnKeys,
  setColumnKeys,
  childrenMapKeys,
  setChildrenMapKeys,
  excludeKeySet,
  setExcludeKeySet,
  ...props
}) => (
  <div {...props} className={`atsxt-controller ${props.className || ''}`}>
    {columns.map(col => {
      if ((col as ColumnGroupType<any>).children) {
        const colHasChildren = col as ColumnGroupType<any>
        const { children } = colHasChildren
        return (
          <div>
            <div className="atsxt-center">{col.title}</div>
            {children.map(child => {
              const key = getKey(child)
              return (
                <ColChecker
                  key={key}
                  colKey={key}
                  col={child}
                  columnKeys={columnKeys}
                  setColumnKeys={setColumnKeys}
                  childrenMapKeys={childrenMapKeys}
                  setChildrenMapKeys={setChildrenMapKeys}
                  excludeKeySet={excludeKeySet}
                  setExcludeKeySet={setExcludeKeySet}
                />
              )
            })}
          </div>
        )
      }
      const key = getKey(col)
      return (
        <ColChecker
          key={key}
          colKey={key}
          col={col}
          columnKeys={columnKeys}
          setColumnKeys={setColumnKeys}
          childrenMapKeys={childrenMapKeys}
          setChildrenMapKeys={setChildrenMapKeys}
          excludeKeySet={excludeKeySet}
          setExcludeKeySet={setExcludeKeySet}
        />
      )
    })}
  </div>
)
