import { render } from 'react-dom'
import { Table, Card } from 'antd'

import { columns, dataSource } from './mockData'

import { AntdTableScrollXaxisTop } from '.'

if (window.location.pathname.endsWith('/antd4.html')) {
  const App = () => (
    <Card title={<h2>Antd 4 example</h2>}>
      <AntdTableScrollXaxisTop debugName="antd4" className="ant4-wrapper">
        <Table scroll={{ x: 3000 }} columns={columns} dataSource={dataSource} pagination={false} />
      </AntdTableScrollXaxisTop>
    </Card>
  )

  render(<App />, document.getElementById('app'))
}
