export const columns: any = Array(6)
  .fill(1)
  .map((_v, i) => ({
    title: `title${i + 1}`,
    dataIndex: `title${i + 1}`,
    width: 1000,
    fixed: i > 4 ? 'right' : undefined,
  }))

export const dataSource = Array(20)
  .fill(1)
  .map((_v, i) => ({
    key: i + 1,
    title1: i + 1,
    title2: i + 1,
    title3: i + 1,
  }))
