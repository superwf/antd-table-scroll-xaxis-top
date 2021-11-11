import React from 'react'

import { Props } from './type'
import { useTableTopScroll } from './hook'
import { errorText } from './constant'

const scrollBarWrapperStyle: React.CSSProperties = {
  overflow: 'auto',
}
const scrollBarStyle: React.CSSProperties = {
  height: '1em',
}

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
export const AntdTableScrollXaxisTop: React.FC<Props> = ({ children, debugName, prefixCls = 'ant', ...props }) => {
  const { tableAriaId, wrapperRef, scrollBarWrapperRef, topScrollListener, scrollBarRef } = useTableTopScroll({
    debugName,
    prefixCls,
    children,
  })
  if (children && React.isValidElement(children)) {
    const table = React.cloneElement(children)
    const tableId = table.props.id || tableAriaId
    return (
      <div ref={wrapperRef} {...props}>
        <div
          role="scrollbar"
          aria-controls={tableId}
          aria-valuenow={0}
          style={scrollBarWrapperStyle}
          ref={scrollBarWrapperRef}
          onScroll={topScrollListener}
        >
          <div ref={scrollBarRef} style={scrollBarStyle} />
        </div>
        <table.type id={tableId} {...table.props} />
      </div>
    )
  }
  if (process.env.NODE_ENV !== 'production') {
    console.error(errorText)
  }
  return null
}

export default AntdTableScrollXaxisTop
