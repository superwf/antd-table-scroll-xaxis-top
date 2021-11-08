/* eslint-disable jsx-a11y/no-redundant-roles */
import { render, fireEvent, act } from '@testing-library/react'
import { Table as Antd3Table } from 'antd3'
import { Table } from 'antd'
import * as React from 'react'

import { assertIsDefined } from './assertIsDefined'
import { columns, dataSource } from './mockData'
import { errorText } from './constant'
import { sleep } from './sleep'

import { AntdTableScrollXaxisTop } from '.'

describe('AntdTableScrollXaxisTop', () => {
  describe('ant3', () => {
    const App = () => (
      <AntdTableScrollXaxisTop>
        <Antd3Table scroll={{ x: 'auto', y: 300 }} columns={columns} dataSource={dataSource} />
      </AntdTableScrollXaxisTop>
    )
    beforeEach(() => {
      const l = document.createElement('link')
      l.setAttribute('rel', 'stylesheet')
      l.setAttribute('type', 'text/css')
      l.setAttribute('href', 'https://unpkg.com/antd@3.26.20/dist/antd.min.css')
      document.head.appendChild(l)
    })

    afterEach(() => {
      const l = document.head.querySelector('link')
      assertIsDefined(l)
      expect(l.href).toBe('https://unpkg.com/antd@3.26.20/dist/antd.min.css')
      if (l) {
        document.head.removeChild(l)
      }
    })

    it('scroll by top', async () => {
      const app = render(<App />)
      const topScroll = await app.findByRole('scrollbar')
      expect(topScroll.scrollLeft).toBe(0)
      const tableWrapper = document.querySelector('.ant-table-body')
      assertIsDefined(tableWrapper)
      const scrollByTop = 120
      topScroll.scrollLeft = scrollByTop
      fireEvent(topScroll, new UIEvent('scroll', {}))
      expect(tableWrapper.scrollLeft).toBe(scrollByTop)
      app.unmount()
    })

    it('scroll by bottom', async () => {
      const app = render(<App />)
      const topScroll = await app.findByRole('scrollbar')
      expect(topScroll.scrollLeft).toBe(0)
      const tableWrapper = document.querySelector('.ant-table-body')
      assertIsDefined(tableWrapper)
      const scrollByBottom = 120
      tableWrapper.scrollLeft = scrollByBottom
      fireEvent(tableWrapper, new UIEvent('scroll', {}))
      expect(topScroll.scrollLeft).toBe(scrollByBottom)
      app.unmount()
    })
  })

  describe('ant4', () => {
    const App: React.FC = () => (
      <AntdTableScrollXaxisTop>
        <Table scroll={{ x: 'auto', y: 300 }} columns={columns} dataSource={dataSource} />
      </AntdTableScrollXaxisTop>
    )
    beforeEach(() => {
      const l = document.createElement('link')
      l.setAttribute('rel', 'stylesheet')
      l.setAttribute('type', 'text/css')
      l.setAttribute('href', 'https://unpkg.com/antd@4.16.13/dist/antd.min.css')
      document.head.appendChild(l)
    })

    afterEach(() => {
      const l = document.head.querySelector('link')
      assertIsDefined(l)
      expect(l.href).toBe('https://unpkg.com/antd@4.16.13/dist/antd.min.css')
      if (l) {
        document.head.removeChild(l)
      }
    })

    it('scroll by top', async () => {
      const app = render(<App />)
      const topScroll = await app.findByRole('scrollbar')
      expect(topScroll.scrollLeft).toBe(0)
      const tableWrapper = document.querySelector('.ant-table-body')
      assertIsDefined(tableWrapper)
      const scrollByTop = 120
      topScroll.scrollLeft = scrollByTop
      fireEvent(topScroll, new UIEvent('scroll', {}))
      expect(tableWrapper.scrollLeft).toBe(scrollByTop)
      app.unmount()
    })

    it('scroll by bottom', async () => {
      const app = render(<App />)
      const topScroll = await app.findByRole('scrollbar')
      expect(topScroll.scrollLeft).toBe(0)
      const tableWrapper = document.querySelector('.ant-table-body')
      assertIsDefined(tableWrapper)
      const scrollByBottom = 120
      tableWrapper.scrollLeft = scrollByBottom
      fireEvent(tableWrapper, new UIEvent('scroll', {}))
      expect(topScroll.scrollLeft).toBe(scrollByBottom)
      app.unmount()
    })

    it('support one and only one Table children', () => {
      const { error } = console
      const consoleError = jest.fn()
      console.error = consoleError
      // skip type check
      const Wrapper: any = AntdTableScrollXaxisTop
      const app1 = render(
        <Wrapper>
          <Table />
          <Table />
        </Wrapper>,
      )

      expect(consoleError).toHaveBeenCalledTimes(1)
      expect(consoleError).toHaveBeenCalledWith(errorText)

      const app2 = render(<Wrapper />)
      expect(consoleError).toHaveBeenCalledTimes(2)
      console.error = error

      app1.unmount()
      app2.unmount()
    })

    it('async data insert', async () => {
      const AsyncData = () => {
        const [data, setData] = React.useState<any[]>([])
        return (
          <>
            <AntdTableScrollXaxisTop>
              <Table scroll={{ x: 'auto', y: 300 }} columns={columns} dataSource={data} />
            </AntdTableScrollXaxisTop>
            <button
              type="button"
              role="button"
              onClick={() => {
                setData(dataSource)
              }}
            >
              update
            </button>
          </>
        )
      }
      const app = render(<AsyncData />)

      const button = await app.findByRole('button')
      act(() => {
        fireEvent(button, new MouseEvent('click', {}))
      })
      const topScroll = await app.findByRole('scrollbar')
      const tableWrapper = document.querySelector('.ant-table-body')
      assertIsDefined(tableWrapper)
      topScroll.scrollLeft = 10
      fireEvent(topScroll, new UIEvent('scroll', {}))
      fireEvent(tableWrapper, new UIEvent('scroll', {}))
      expect(tableWrapper.scrollLeft).toBe(10)
      topScroll.scrollLeft = 20
      fireEvent(topScroll, new UIEvent('scroll', {}))
      fireEvent(tableWrapper, new UIEvent('scroll', {}))
      expect(tableWrapper.scrollLeft).toBe(20)

      await sleep(30)

      tableWrapper.scrollLeft = 30
      fireEvent(tableWrapper, new UIEvent('scroll', {}))
      fireEvent(topScroll, new UIEvent('scroll', {}))
      expect(topScroll.scrollLeft).toBe(30)
      tableWrapper.scrollLeft = 40
      fireEvent(tableWrapper, new UIEvent('scroll', {}))
      fireEvent(topScroll, new UIEvent('scroll', {}))
      expect(topScroll.scrollLeft).toBe(40)
      app.unmount()
    })

    it('debugName', async () => {
      const { info } = console
      const consoleInfo = jest.fn()
      console.info = consoleInfo
      const DebugApp: React.FC = () => (
        <AntdTableScrollXaxisTop debugName="debug name">
          <div />
        </AntdTableScrollXaxisTop>
      )
      const app = render(<DebugApp />)
      await app.findByRole('scrollbar')
      expect(consoleInfo).toHaveBeenCalledTimes(2)

      console.info = info
      app.unmount()
    })
  })
})
