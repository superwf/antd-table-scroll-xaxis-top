import { debounce } from 'lodash'
import * as React from 'react'
import type { UIEventHandler } from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /** for debug info, should not be used in production mode */
  debugName?: string
  /**
   * for antd ConfigProvider prop `prefixCls`
   * Only use this when you custom a different prefixCls
   * @default 'ant'
   * */
  prefixCls?: string
}

const { error } = console

const scrollBarWrapperStyle: React.CSSProperties = {
  overflow: 'auto',
}
const scrollBarStyle: React.CSSProperties = {
  height: '1em',
}

const syncScrollLeft = (dom: HTMLElement, scrollLeft: number) => {
  if (dom.scrollLeft !== scrollLeft) {
    dom.scrollLeft = scrollLeft
  }
}

const isAnt3Env = (wrapper: HTMLDivElement, prefixCls: string) =>
  wrapper.querySelector(`.${prefixCls}-table-body > table`) !== null

/**
 * 为单独移动顶部或底部scroll的时候加锁
 * 否则为scrollLeft会出现互相赋值循环触发scroll事件的现象
 * 导致拖动卡顿
 *
 * 考虑到当前硬件场景，同一时间内只能用一个鼠标，因此正在被拖动的组件只能是一个，将锁放在这里而不是每个组件使用独立的锁相当于全局模式公用一个锁
 * */
let isScrollingTop = false
let isScrollingBottom = false
const releaseIsScrollingTop = debounce(() => {
  isScrollingTop = false
}, 20)
const releaseIsScrollingBottom = debounce(() => {
  isScrollingBottom = false
}, 20)

/**
 * @remark 里面包裹一个antd的Table使用
 *
 * 生成虚拟dom结构
 * div.wrapper
 *   div.scrollBar
 *   Table
 *
 * 将div.wripper与Table中的 ${tableContentMarker} 的scroll事件联动
 * https://stackoverflow.com/questions/3934271/horizontal-scrollbar-on-top-and-bottom-of-table
 *
 * @example
 * ```ts
 *  <ScrollOnTableTop>
 *    <Table size="small" columns={columns} scroll={{ y: 500, }} />
 *  </ScrollOnTableTop>
 * ```
 * */
export const AntdTableScrollXaxisTop: React.FC<Props> = ({ children, debugName, prefixCls = 'ant', ...props }) => {
  /** 直接在jsx中可定义的结构，使用ref */
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const scrollBarRef = React.useRef<HTMLDivElement>(null)
  const scrollBarWrapperRef = React.useRef<HTMLDivElement>(null)

  const log = React.useCallback(
    (str: string) => error(`${debugName} :: AntdTableScrollXaxisTop occurs error: ${str}`),
    [debugName],
  )

  /** 需要通过querySelector获取的变量使用state存放，因为每次update的时候该内容会更新，且state变量可以作为useEffect的依赖 */
  const [innerTableWrapper, setInnerTableWrapper] = React.useState<HTMLDivElement | null>(null)
  const [innerTable, setInnerTable] = React.useState<HTMLTableElement | null>(null)

  /** 监听底部的table横向scroll事件，并同步顶部scrollBar位置 */
  const bottomScrollListener = React.useCallback(() => {
    if (isScrollingTop) {
      return
    }
    const topScrollBarWrapper = scrollBarWrapperRef.current
    if (topScrollBarWrapper && innerTableWrapper) {
      isScrollingBottom = true
      syncScrollLeft(topScrollBarWrapper, innerTableWrapper.scrollLeft)
      releaseIsScrollingBottom()
    }
  }, [innerTableWrapper])

  /** 监听底部的table横向scroll事件，并同步顶部scrollBar位置 */
  const topScrollListener: UIEventHandler<HTMLDivElement> = React.useCallback(
    e => {
      if (isScrollingBottom) {
        return
      }
      if (innerTableWrapper) {
        isScrollingTop = true
        syncScrollLeft(innerTableWrapper, e.currentTarget.scrollLeft)
        releaseIsScrollingTop()
      }
    },
    [innerTableWrapper],
  )

  /** 一次性创建ResizeObserver */
  const observer = React.useMemo(
    () =>
      new ResizeObserver(mutationList => {
        mutationList.forEach(mutation => {
          const topScrollBar = scrollBarRef.current
          const wrapper = wrapperRef.current
          if (topScrollBar && wrapper) {
            if (wrapper.clientWidth < mutation.contentRect.width) {
              const topScrollBarWrapper = scrollBarWrapperRef.current
              // 计算竖向滚动条的宽度
              // https://stackoverflow.com/questions/13382516/getting-scroll-bar-width-using-javascript
              if (topScrollBarWrapper) {
                if (mutation.target?.parentElement?.parentElement) {
                  const barWidth =
                    mutation.target.parentElement.parentElement.clientWidth - mutation.target.parentElement.clientWidth
                  if (barWidth > 0) {
                    topScrollBarWrapper.style.width = `calc(100% - ${barWidth}px)`
                  }
                }
              }
              topScrollBar.style.width = `${mutation.contentRect.width}px`
              topScrollBar.style.display = 'inherit'
            } else {
              topScrollBar.style.display = 'none'
            }
          }
        })
      }),
    [],
  )

  /**
   * 卸载时销毁ResizeObserver
   * 此处不能直接返回 observer.disconnect
   * 因为 observer 是可能会更新，必须动态引用
   * */
  React.useEffect(
    () => () => {
      observer.disconnect()
    },
    [observer],
  )

  /** 内部table dom变化时，重新监听 */
  React.useEffect(() => {
    const wrapper = wrapperRef.current
    if (wrapper) {
      const isAnt3 = isAnt3Env(wrapper, prefixCls)
      const selector = isAnt3 ? `.${prefixCls}-table-body` : `.${prefixCls}-table-content`
      const innerTableWrapperDom = wrapper.querySelector(selector) as HTMLDivElement
      if (innerTableWrapper !== innerTableWrapperDom) {
        setInnerTableWrapper(innerTableWrapperDom)
      }
      if (!innerTableWrapperDom && debugName) {
        log(`"${selector}" not found, make sure has antd Table component as children`)
      }
      const innerTableDom = wrapper.querySelector(`${selector} > table`) as HTMLTableElement
      if (!innerTableDom && debugName) {
        log(`"${selector} > table" not found, make sure has antd Table component as children`)
      }
      if (innerTableDom !== innerTable) {
        setInnerTable(innerTableDom)
      }

      if (innerTableWrapper && innerTable) {
        observer.observe(innerTable, {
          box: 'border-box',
        })
        innerTableWrapper.addEventListener('scroll', bottomScrollListener)
      }
    }
    return () => {
      if (innerTable) {
        observer.unobserve(innerTable)
      }
      if (innerTableWrapper) {
        innerTableWrapper.removeEventListener('scroll', bottomScrollListener)
      }
    }
  }, [innerTable, innerTableWrapper, bottomScrollListener, observer, log])

  return (
    <div ref={wrapperRef} {...props}>
      <div style={scrollBarWrapperStyle} ref={scrollBarWrapperRef} onScroll={topScrollListener}>
        <div ref={scrollBarRef} style={scrollBarStyle} />
      </div>
      {children}
    </div>
  )
}
