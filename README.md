# Scroll-antd-table-xaxis-top

Too much table data ?

Need scroll down too much to scroll to see the scrollbar then move to see the right part of table.

Do not worry, laowang can help you 🤘, just try this one.

Work with antd v3 and v4, automatically!

- [scroll-antd-table-xaxis-top](#scroll-antd-table-xaxis-top)
  - [Install](#Install)
  - [Demo](#demo)
    - [Before](#before)
    - [After](#After)
    - [live](#live)
  - [Example](#Example)
  - [Api](#api)

## Install

```sh
yarn add antd-table-scroll-xaxis-top
```

Worked with antd 3 / 4, and react > 16.8

## Demo

### Before

![./doc/before.gif](https://github.com/superwf/antd-table-scroll-xaxis-top/raw/master/doc/before.gif)

### After

![./doc/after.gif](https://github.com/superwf/antd-table-scroll-xaxis-top/raw/master/doc/after.gif)

### Live

- [antd3 live demo](https://superwf.github.io/demo/antd3.html)

- [antd4 live demo](https://superwf.github.io/demo/antd4.html)

## Example

```typescript
import { Table, Card } from 'antd'
import { AntdTableScrollXaxisTop } from 'antd-table-scroll-xaxis-top'

// ... in compoent
  <AntdTableScrollXaxisTop>
    <Table scroll={{ x: 'max-content' }} columns={columns} dataSource={dataSource} pagination={false} />
  </AntdTableScrollXaxisTop>
```

## Api

| prop | type | required | description |
| ---- | ---- | -------- | ----------- |
| prefixCls | string | no | same with antd ConfigProvider prefixCls, unless you have a customized version antd, you should not use it |
| debugName | string | no | show some debug info with this for prefix |
| children | Table | yes | antd Table, must one and only one Table child |
| className and more |  | no | all div acceptable props can be used |

## General questions

- Why my table does not has xaxis scroll bar after use this?

  - Set each column with a confirm width, as `{ title: 'xxx', dataIndex: 'yyy', width: 200 }`

  - Set Table prop `scroll`, as `scroll={{ x: 'max-content' }}`
