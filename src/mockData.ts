export const columns: any = Array(6)
  .fill(1)
  .map((_v, i) => {
    const col: any = {
      title: `title${i + 1}`,
      dataIndex: `title${i + 1}`,
      width: 400,
      align: 'center',
      // fixed: i === 4 ? 'right' : undefined,
    }
    if (i < 2) {
      col.children = [
        {
          title: `title${i + 1}-1`,
          width: 300,
          align: 'center',
          dataIndex: `title${i + 1}-1`,
          fixed: i === 0,
        },
        {
          title: `title${i + 1}-2`,
          align: 'center',
          width: 300,
          dataIndex: `title${i + 1}-2`,
        },
      ]
    }
    return col
  })

export const dataSource = Array(20)
  .fill(1)
  .map((_v, i) => ({
    key: i + 1,
    title1: i + 1,
    title2: i + 1,
    title3: i + 1,
  }))
