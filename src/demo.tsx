import React from 'react'
import { render } from 'react-dom'
import { Table, Card } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { Table as Table3 } from 'antd3'
import { ScrollOnTableTop } from './index'

const columns: ColumnProps<any>[] = [
  {
    title: 'title1',
    dataIndex: 'title1',
    width: 1000,
  },
  {
    title: 'title2',
    dataIndex: 'title2',
    width: 1000,
  },
]

const dataSource = [
  {
    key: '1',
    title1: '1',
    title2: '1',
  },
  {
    key: '2',
    title1: '2',
    title2: '2',
  },
]

customElements.define(
  'antd3-container',
  class extends HTMLElement {
    constructor() {
      super()
      const template = document.getElementById('antd3-container').content
      const root = this.attachShadow({ mode: 'open' }).appendChild(template.cloneNode(true))
      fetch('https://unpkg.com/antd@3.26.20/dist/antd.min.css')
        .then(res => res.text())
        .then(styleContent => {
          const styleNode = document.createElement('style')
          styleNode.textContent = styleContent
          root.appendChild(styleNode)
        })
    }
  },
)

const App = () => (
  <Card>
    <iframe src="./antd3.html">
      <ScrollOnTableTop debugName="antd3" className="ant3-wrapper">
        <Table3 scroll={{ y: 400 }} columns={columns as any} dataSource={dataSource} />
      </ScrollOnTableTop>
    </iframe>
    <ScrollOnTableTop debugName="antd4" className="ant4-wrapper">
      <Table scroll={{ y: 400 }} columns={columns} dataSource={dataSource} />
    </ScrollOnTableTop>
  </Card>
)

render(<App />, document.getElementById('app'))
