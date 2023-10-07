import React from 'react';

class ErrorBoundary extends React.Component {
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log('getDerivedStateFromError--error', error);
    // 更新状态，以便下一次渲染将显示后备 UI。
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // 示例“组件堆栈”：
    //   在 ComponentThatThrows 中（由 App 创建）
    //   在 ErrorBoundary 中（由 APP 创建）
    //   在 div 中（由 APP 创建）
    //   在 App 中
    console.log('componentDidCatch--error', error, info);
  }

  render() {
    console.log('errorboundary--this.props.children', this.props);
    if (this.state.hasError) {
      // 你可以渲染任何自定义后备 UI
      return this.props.fallback;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
