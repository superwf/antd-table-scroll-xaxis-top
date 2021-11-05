// import React from 'react'
import { render } from 'react-dom'
import { Table, Card } from 'antd3'

import { columns, dataSource } from './mockData'

import { ScrollOnTableTop } from '.'

const App = () => (
  <Card title={<h2>ant 3 example</h2>}>
    <ScrollOnTableTop debugName="antd3" className="ant3-wrapper">
      <Table scroll={{ x: 'auto' }} columns={columns} dataSource={dataSource} />
    </ScrollOnTableTop>
  </Card>
)

render(<App />, document.getElementById('app'))
