import { renderHook } from '@testing-library/react-hooks/dom'

import { useTableTopScroll } from './hook'

describe('test useTableTopScroll hook', () => {
  it('ref', () => {
    const { wrapperRef, scrollBarWrapperRef, topScrollListener, scrollBarRef } = renderHook(() => useTableTopScroll({}))
    expect(wrapperRef.current).toBe(null)
  })
})
