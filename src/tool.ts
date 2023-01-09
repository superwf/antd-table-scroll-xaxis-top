export const getKey = (col: any) => col.key || col.dataIndex

export const sortColByColumnKeys = (columnKeys: string[]) => (a: any, b: any) => {
  const indexA = columnKeys.findIndex(k => k === getKey(a))
  const indexB = columnKeys.findIndex(k => k === getKey(b))
  console.log(getKey(a), indexA, getKey(b), indexB)
  if (indexB > indexA) {
    return -1
  }
  if (indexB < indexA) {
    return 1
  }
  return 0
}
