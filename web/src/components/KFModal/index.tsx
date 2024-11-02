/*
 * @Author: 赵伟
 * @Date: 2024-04-15 10:01:29
 * @Description: 自定义 Modal
 */

import { Modal, type ModalProps } from 'antd';
import classNames from 'classnames';
import './index.less';

export interface KFModalProps extends ModalProps {
  image?: string;
}
function KFModal({
  children,
  className = '',
  centered,
  maskClosable,
  ...rest
}: KFModalProps) {
  return (
    <Modal
      className={classNames(['kf-modal', className])}
      {...rest}
      centered={centered ?? true}
      maskClosable={maskClosable ?? false}
    >
      {children}
    </Modal>
  );
}

export default KFModal;
