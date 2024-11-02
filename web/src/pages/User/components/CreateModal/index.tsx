import KFModal from '@/components/KFModal';
import { getUserInfoReq, pathUserReq, postUserReq } from '@/services/user';
import { to } from '@/utils/promise';
import { Form, Input, InputNumber, message, type ModalProps } from 'antd';
import { useEffect } from 'react';

type FormData = Omit<User, 'id'>;

interface CreateModalProps extends Omit<ModalProps, 'onOk'> {
  id?: number;
  onOk: () => void;
}

function CreateModal({ id, onOk, ...rest }: CreateModalProps) {
  const modalTitle = id ? '新增用户' : '修改用户';
  const [form] = Form.useForm<FormData>();

  useEffect(() => {
    if (id) {
      getUserInfo(id);
    }
  }, [id]);

  const getUserInfo = async (id: number) => {
    const [res] = await to(getUserInfoReq(id));
    if (res && res.data) {
      form.setFieldsValue(res.data);
    }
  };

  const onFinish = async (formData: FormData) => {
    if (id) {
      const [res] = await to(pathUserReq(id, formData));
      if (res) {
        message.success('修改成功');
        onOk();
      }
    } else {
      const [res] = await to(postUserReq(formData));
      if (res) {
        message.success('新增成功');
        onOk();
      }
    }
  };

  return (
    <KFModal
      {...rest}
      title={modalTitle}
      destroyOnClose={true}
      width={500}
      okButtonProps={{
        htmlType: 'submit',
        form: 'form',
      }}
    >
      <Form
        name="form"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input placeholder="请输入姓名" maxLength={20} showCount allowClear />
        </Form.Item>
        <Form.Item
          label="年龄"
          name="age"
          rules={[{ required: true, message: '请输入年龄' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入年龄"
            min={1}
          />
        </Form.Item>
      </Form>
    </KFModal>
  );
}

export default CreateModal;
