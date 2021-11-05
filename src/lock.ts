import { debounce } from 'lodash'

/**
 * 为单独移动顶部或底部scroll的时候加锁
 * 否则为scrollLeft会出现互相赋值循环触发scroll事件的现象
 * 导致拖动卡顿
 *
 * 考虑到当前硬件场景，同一时间内只能用一个鼠标，因此正在被拖动的组件只能是一个，将锁放在这里而不是每个组件使用独立的锁相当于全局模式公用一个锁
 * */
export const lock = {
  isScrollingTop: false,
  isScrollingBottom: false,
  releaseIsScrollingTop: debounce(() => {
    lock.isScrollingTop = false
  }, 20),
  releaseIsScrollingBottom: debounce(() => {
    lock.isScrollingBottom = false
  }, 20),
}
