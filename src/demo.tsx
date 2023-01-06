import { render } from 'react-dom'
import { Table, Card } from 'antd'

import { columns, dataSource } from './mockData'

import { AntdTableScrollXaxisTop } from '.'

const App = () => (
  <Card title={<h2>Antd V4 example</h2>}>
    <AntdTableScrollXaxisTop controlColumns debugName="antd4" className="ant4-wrapper">
      <Table scroll={{ x: 'max-content' }} columns={columns} dataSource={dataSource} pagination={false} sticky />
    </AntdTableScrollXaxisTop>
  </Card>
)

render(<App />, document.getElementById('app'))