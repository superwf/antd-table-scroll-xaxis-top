export const isAnt3Env = (wrapper: HTMLDivElement, prefixCls? = 'ant') =>
  wrapper.querySelector(`.${prefixCls}-table-body > table`) !== null

export const syncScrollLeft = (dom: HTMLElement, scrollLeft: number) => {
  if (dom.scrollLeft !== scrollLeft) {
    dom.scrollLeft = scrollLeft
  }
}
