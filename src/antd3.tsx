// import React from 'react'
import { render } from 'react-dom'
import { Table, Card } from 'antd3'

import { columns, dataSource } from './mockData'

import { AntdTableScrollXaxisTop } from '.'

if ((global as any).antd3 && window.location.pathname === '/antd3.html') {
  const App = () => (
    <Card title={<h2>Antd 3 example</h2>}>
      <AntdTableScrollXaxisTop debugName="antd3" className="ant3-wrapper">
        <Table scroll={{ x: 'auto', y: 300 }} columns={columns} dataSource={dataSource} />
      </AntdTableScrollXaxisTop>
      <AntdTableScrollXaxisTop>
        <div />
      </AntdTableScrollXaxisTop>
    </Card>
  )
  render(<App />, document.getElementById('app'))
}
