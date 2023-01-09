/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */
import React from 'react'
import type { ColumnGroupType } from 'antd/lib/table/interface'
import type { DndContextProps } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import {
  DndContext,
  // closestCenter,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useSortable, arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'

import { ColumnControllerProps, UseControlColumnsProps } from './type'
import { getKey, sortColByColumnKeys } from './tool'

const ColChecker: React.FC<
  {
    colKey: string
    col: any
  } & UseControlColumnsProps
> = ({
  colKey,
  col,
  columnKeys,
  setColumnKeys,
  childrenMapKeys,
  setChildrenMapKeys,
  excludeKeySet,
  setExcludeKeySet,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: String(colKey) })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <div className="atsxt-controller-label" ref={setNodeRef} style={style} {...attributes}>
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
      <span {...listeners}>{col.title}</span>
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
        <div ref={setNodeRef} style={style} {...attributes}>
          <div className="atsxt-center" {...listeners}>
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
  ...props
}) => {
  const sensors = useSensors(useSensor(PointerSensor))
  const uuid = React.useMemo(() => id || Math.random().toString().slice(8, -1), [id])

  const onDragEnd: DndContextProps['onDragEnd'] = event => {
    const { active, over } = event
    console.log(active.id, over && over.id)
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
                  colKey={key}
                  col={col as ColumnGroupType<any>}
                  columnKeys={columnKeys}
                  setColumnKeys={setColumnKeys}
                  childrenMapKeys={childrenMapKeys}
                  setChildrenMapKeys={setChildrenMapKeys}
                  excludeKeySet={excludeKeySet}
                  setExcludeKeySet={setExcludeKeySet}
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
              />
            )
          })}
        </div>
      </SortableContext>
    </DndContext>
  )
}
