import { PushpinOutlined } from '@ant-design/icons'

export const ERROR_TEXT = 'only support one antd v4 Table element'

export const FIXED_OPTION = [
  {
    label: (
      <span title="左固定">
        <PushpinOutlined />
      </span>
    ),
    value: 'left',
  },
  {
    label: (
      <span title="右固定" className="atsxt-fix-column-right">
        <PushpinOutlined />
      </span>
    ),
    value: 'right',
  },
]

export const EMPTY_COLUMNS = []
