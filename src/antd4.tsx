import { render } from 'react-dom'
import { Table, Card } from 'antd'

import { columns, dataSource } from './mockData'

import { ScrollOnTableTop } from '.'

const App = () => (
  <Card title={<h2>ant 4 example</h2>}>
    <ScrollOnTableTop className="ant4-wrapper">
      <Table scroll={{ x: 'max-content', y: 400 }} columns={columns} dataSource={dataSource} />
    </ScrollOnTableTop>
  </Card>
)

render(<App />, document.getElementById('app'))
