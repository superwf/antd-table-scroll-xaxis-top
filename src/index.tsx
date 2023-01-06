import React from 'react'

import { Props } from './type'
import { useTableTopScroll, useControlColumns } from './hook'
import { ColumnController } from './ColumnController'
import { errorText } from './constant'
import './style.css'

/**
 * use a top scroll bar to sync the bottom xaxis scroll bar.
 * more detail see: https://github.com/superwf/antd-table-scroll-xaxis-top
 *
 * dom structor
 * div.wrapper
 *   div.scrollBar
 *   Table
 *
 * @reference
 * https://stackoverflow.com/questions/3934271/horizontal-scrollbar-on-top-and-bottom-of-table
 *
 * @example
 * ```ts
 *  <ScrollOnTableTop>
 *    <Table size="small" columns={columns} scroll={{ x: 'max-content', }} />
 *  </ScrollOnTableTop>
 * ```
 * */
export const AntdTableScrollXaxisTop: React.FC<Props> = ({ children, debugName, controlColumns, ...props }) => {
  const { tableAriaId, wrapperRef, scrollBarWrapperRef, topScrollListener, scrollBarRef } = useTableTopScroll({
    debugName,
    children,
  })
  const { keySet, setKeySet, ...controlColumnProps } = useControlColumns(controlColumns, children)
  if (children && React.isValidElement(children)) {
    const table = React.cloneElement<Record<string, any>>(children as any)
    const tableId = table.props.id || tableAriaId

    const originColumns = table.props.columns
    return (
      <div ref={wrapperRef} {...props} className={`atsxt-wrapper ${props.className || ''}`}>
        <div
          role="scrollbar"
          aria-controls={tableId}
          aria-valuenow={0}
          ref={scrollBarWrapperRef}
          onScroll={topScrollListener}
          className="atsxt-scroll-bar-wrapper"
        >
          <div ref={scrollBarRef} className="atsxt-scroll-bar" />
        </div>
        <table.type id={tableId} {...table.props} {...controlColumnProps} />
        <ColumnController keySet={keySet} setKeySet={setKeySet} columns={originColumns} />
      </div>
    )
  }
  if (process.env.NODE_ENV !== 'production') {
    console.error(errorText)
  }
  return null
}

export default AntdTableScrollXaxisTop
