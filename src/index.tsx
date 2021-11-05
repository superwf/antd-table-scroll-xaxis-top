import * as React from 'react'

import { Props } from './type'
import { useTableTopScroll } from './hook'

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
  const { wrapperRef, scrollBarWrapperRef, topScrollListener, scrollBarRef } = useTableTopScroll({
    debugName,
    prefixCls,
  })
  return (
    <div ref={wrapperRef} {...props}>
      <div style={scrollBarWrapperStyle} ref={scrollBarWrapperRef} onScroll={topScrollListener}>
        <div ref={scrollBarRef} style={scrollBarStyle} />
      </div>
      {children}
    </div>
  )
}
