export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /** for debug info, should not be used in production mode */
  debugName?: string
  /**
   * for antd ConfigProvider prop `prefixCls`
   * Only use this when you custom a different prefixCls
   * @default 'ant'
   * */
  prefixCls?: string
}
