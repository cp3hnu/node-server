/*
 * @Author: 赵伟
 * @Date: 2024-04-13 10:08:35
 * @Description: 以函数的方式打开 Modal
 */
import { ConfigProvider, type ModalProps } from 'antd';
import { globalConfig } from 'antd/es/config-provider';
import zhCN from 'antd/locale/zh_CN';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const destroyFns: (() => void)[] = [];

/**
 * Function to open an Ant Design modal.
 *
 * @param modal - The function that renders the modal content.
 * @param modalProps - The modal properties.
 * @return An object with a destroy method to close the modal.
 */
export const openAntdModal = <T extends Omit<ModalProps, 'onOk'>>(
  modal: (props: T) => React.ReactNode,
  modalProps: T,
) => {
  const CustomModel = modal;
  const container = document.createDocumentFragment();
  const root = createRoot(container);
  const { afterClose, onCancel } = modalProps;
  const global = globalConfig();
  let timeoutId: ReturnType<typeof setTimeout>;

  function destroy() {
    const index = destroyFns.indexOf(close);
    if (index !== -1) {
      destroyFns.splice(index, 1);
    }

    root.unmount();
  }

  function handleAfterClose() {
    afterClose?.();
    // Warning: Attempted to synchronously unmount a root while React was already rendering.
    // React cannot finish unmounting the root until the current render has completed, which may lead to a race condition.
    setTimeout(() => {
      destroy();
    }, 0);
  }

  function handleCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (onCancel) {
      onCancel(e);
    } else {
      close();
    }
  }

  function render(props: T) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      const rootPrefixCls = global.getPrefixCls();
      const iconPrefixCls = global.getIconPrefixCls();
      const theme = global.getTheme();
      const dom = (
        <CustomModel
          {...props}
          onCancel={handleCancel}
          afterClose={handleAfterClose}
        ></CustomModel>
      );

      root.render(
        <ConfigProvider
          prefixCls={rootPrefixCls}
          iconPrefixCls={iconPrefixCls}
          theme={theme}
          locale={zhCN}
        >
          {global.holderRender ? global.holderRender(dom) : dom}
        </ConfigProvider>,
      );
    });
  }

  function close() {
    render({ ...modalProps, open: false });
  }

  render({ ...modalProps, open: true });

  destroyFns.push(close);

  return {
    close,
  };
};

/**
 * Generates a custom hook for managing an Ant Design modal.
 *
 * @param modal - The function that renders the modal content.
 * @param defaultProps - The default modal properties.
 * @return The modal component, open function, and close function.
 */

export const useModal = <T extends ModalProps>(
  modal: (props: T) => React.ReactNode,
  defaultProps?: T,
) => {
  const [visible, setVisible] = useState(false);
  const [props, setProps] = useState<T>(defaultProps || ({} as T));
  const CustomModel = modal;

  const open = (props: T) => {
    setProps((prev) => ({
      ...prev,
      ...props,
    }));
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  return [
    <CustomModel key="modal" open={visible} {...props} />,
    open,
    close,
  ] as const;
};

// 关闭没有手动关闭的 Modal
export const closeAllModals = () => {
  let close = destroyFns.pop();
  while (close) {
    close();
    close = destroyFns.pop();
  }
};
