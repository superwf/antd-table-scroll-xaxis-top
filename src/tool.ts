import { FixedColSet } from './type'

export const getKey = (col: any) => col.key || col.dataIndex

export const sortColByColumnKeys = (columnKeys: string[]) => (a: any, b: any) => {
  const indexA = columnKeys.findIndex(k => k === getKey(a))
  const indexB = columnKeys.findIndex(k => k === getKey(b))
  if (indexB > indexA) {
    return -1
  }
  if (indexB < indexA) {
    return 1
  }
  return 0
}

export const getFixed = (fixedSet: FixedColSet, key: string) => {
  if (fixedSet.left.has(key)) {
    return 'left'
  }
  if (fixedSet.right.has(key)) {
    return 'right'
  }
  return undefined
}
