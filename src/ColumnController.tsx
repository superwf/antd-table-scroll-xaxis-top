/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */
import React from 'react'
import type { ColumnGroupType } from 'antd/lib/table/interface'
import type { DndContextProps } from '@dnd-kit/core'
import { Radio } from 'antd'
import { CSS } from '@dnd-kit/utilities'
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useSortable, arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'

import { ColumnControllerProps, UseControlColumnsProps } from './type'
import { getKey, sortColByColumnKeys, getFixed } from './tool'
import { FIXED_OPTION } from './constant'

const ColChecker: React.FC<
  {
    colKey: string
    col: any
  } & UseControlColumnsProps
> = ({ colKey, col, excludeKeySet, setExcludeKeySet, fixed, setFixed }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: colKey })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const fixedCheckValue = getFixed(fixed, colKey)
  return (
    <div className="atsxt-controller-label" ref={setNodeRef} style={style} {...attributes}>
      <Radio.Group
        size="small"
        optionType="button"
        options={
          fixedCheckValue
            ? [
                ...FIXED_OPTION,
                {
                  label: '✖️',
                  value: undefined as any,
                },
              ]
            : FIXED_OPTION
        }
        buttonStyle="solid"
        value={fixedCheckValue}
        onChange={e => {
          const v = e.target.value
          if (v === undefined) {
            fixed.left.delete(colKey)
            fixed.right.delete(colKey)
          } else if (v === 'left') {
            fixed.left.add(colKey)
            fixed.right.delete(colKey)
          } else if (v === 'right') {
            fixed.left.delete(colKey)
            fixed.right.add(colKey)
          }
          setFixed({
            left: fixed.left,
            right: fixed.right,
          })
        }}
      />
      <br />
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
      <span className="atsxt-dragable" {...listeners}>
        {col.title}
      </span>
    </div>
  )
}

const ColCheckerChildren: React.FC<
  {
    col: ColumnGroupType<any>
    colKey: string
  } & UseControlColumnsProps
> = ({
  col,
  colKey,
  columnKeys,
  setColumnKeys,
  childrenMapKeys,
  setChildrenMapKeys,
  excludeKeySet,
  setExcludeKeySet,
  fixed,
  setFixed,
}) => {
  const sensors = useSensors(useSensor(PointerSensor))
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: colKey })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const onChildDragEnd: DndContextProps['onDragEnd'] = event => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const items = [...childrenMapKeys[colKey]]
      const oldIndex = items.indexOf(active.id as string)
      const newIndex = items.indexOf(over!.id as string)
      const newItems = arrayMove(items, oldIndex, newIndex)
      setChildrenMapKeys({
        ...childrenMapKeys,
        [colKey]: newItems,
      })
    }
  }
  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onChildDragEnd}>
      <SortableContext id={colKey} items={childrenMapKeys[colKey] || []} strategy={rectSortingStrategy}>
        <div ref={setNodeRef} style={{ ...style, textAlign: 'center' }} {...attributes}>
          <div className="atsxt-center atsxt-dragable" {...listeners}>
            {col.title}
          </div>
          {col.children.sort(sortColByColumnKeys(childrenMapKeys[colKey])).map(child => {
            const childKey = getKey(child)
            return (
              <ColChecker
                key={childKey}
                colKey={childKey}
                col={child}
                columnKeys={columnKeys}
                setColumnKeys={setColumnKeys}
                childrenMapKeys={childrenMapKeys}
                setChildrenMapKeys={setChildrenMapKeys}
                excludeKeySet={excludeKeySet}
                setExcludeKeySet={setExcludeKeySet}
                fixed={fixed}
                setFixed={setFixed}
              />
            )
          })}
        </div>
      </SortableContext>
    </DndContext>
  )
}

export const ColumnController: React.FC<ColumnControllerProps> = ({
  columns,
  columnKeys,
  setColumnKeys,
  childrenMapKeys,
  setChildrenMapKeys,
  excludeKeySet,
  setExcludeKeySet,
  id,
  fixed,
  setFixed,
  ...props
}) => {
  const sensors = useSensors(useSensor(PointerSensor))
  const uuid = React.useMemo(() => id || Math.random().toString().slice(8, -1), [id])

  const onDragEnd: DndContextProps['onDragEnd'] = event => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const items = [...columnKeys]
      const oldIndex = items.indexOf(active.id as string)
      const newIndex = items.indexOf(over!.id as string)
      const newItems = arrayMove(items, oldIndex, newIndex)
      setColumnKeys(newItems)
    }
  }
  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <SortableContext id={uuid} items={columnKeys || []} strategy={rectSortingStrategy}>
        <div {...props} className={`atsxt-controller ${props.className || ''}`}>
          {columns.sort(sortColByColumnKeys(columnKeys)).map(col => {
            const key = getKey(col)
            if ((col as ColumnGroupType<any>).children) {
              return (
                <ColCheckerChildren
                  key={key}
                  colKey={key}
                  col={col as ColumnGroupType<any>}
                  columnKeys={columnKeys}
                  setColumnKeys={setColumnKeys}
                  childrenMapKeys={childrenMapKeys}
                  setChildrenMapKeys={setChildrenMapKeys}
                  excludeKeySet={excludeKeySet}
                  setExcludeKeySet={setExcludeKeySet}
                  fixed={fixed}
                  setFixed={setFixed}
                />
              )
            }
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
                fixed={fixed}
                setFixed={setFixed}
              />
            )
          })}
        </div>
      </SortableContext>
    </DndContext>
  )
}
