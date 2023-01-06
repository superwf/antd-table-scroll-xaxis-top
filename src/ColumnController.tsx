import React from 'react'

import { ColumnControllerProps } from './type'

export const ColumnController: React.FC<ColumnControllerProps> = ({ columns, keySet, setKeySet, ...props }) => (
  <div {...props} className={`atsxt-controller ${props.className || ''}`}>
    {columns.map(col => {
      const key = col.key || (col as any).dataIndex
      return (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label key={key} className="atsxt-controller-label">
          <input
            className="atsxt-controller-checkbox"
            type="checkbox"
            onChange={e => {
              if (e.target.checked) {
                keySet.delete(e.target.value)
              } else {
                keySet.add(e.target.value)
              }
              setKeySet(new Set(keySet))
            }}
            defaultChecked={!keySet.has(key)}
            value={key}
          />
          {col.title}
        </label>
      )
    })}
  </div>
)
