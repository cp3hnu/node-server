import { deleteUserReq, getUserListReq } from '@/services/user';
import { openAntdModal } from '@/utils/modal';
import { to } from '@/utils/promise';
import tableCellRender, { TableCellValueType } from '@/utils/table';
import { PageContainer } from '@ant-design/pro-components';
import { App, Button, Input, Table, type TableProps } from 'antd';
import { type SearchProps } from 'antd/es/input';
import { useEffect, useState } from 'react';
import CreateModal from './components/CreateModal';
import styles from './index.less';

function UsersList() {
  const { message } = App.useApp();
  const [searchText, setSearchText] = useState('');
  const [inputText, setInputText] = useState('');
  const [tableData, setTableData] = useState<User[]>([]);

  useEffect(() => {
    getUserList();
  }, [searchText]);

  // 获取用户列表
  const getUserList = async () => {
    const params: { name: string } = {
      name: searchText,
    };
    const [res] = await to(getUserListReq(params));
    if (res && res.data) {
      setTableData(res.data);
    }
  };

  const createOrEditUser = (id?: number) => {
    const { close } = openAntdModal(CreateModal, {
      id,
      onOk: () => {
        close();
        getUserList();
      },
    });
  };

  const deleteUser = async (id: number) => {
    const [res] = await to(deleteUserReq(id));
    if (res) {
      message.success('删除成功');
      getUserList();
    }
  };

  // 搜索
  const onSearch: SearchProps['onSearch'] = (value) => {
    setSearchText(value);
  };

  const columns: TableProps<User>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
      render: tableCellRender(false),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: tableCellRender(false),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: '10%',
      render: tableCellRender(false),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '20%',
      render: tableCellRender(false, TableCellValueType.Date),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '20%',
      render: tableCellRender(false, TableCellValueType.Date),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 200,
      key: 'operation',
      render: (_: any, record: User) => (
        <div>
          <Button
            type="link"
            size="small"
            key="edit"
            onClick={() => createOrEditUser(record.id)}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            key="remove"
            danger
            onClick={() => deleteUser(record.id)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer ghost>
      <div className={styles['users-list']}>
        <div className={styles['users-list__content']}>
          <div className={styles['users-list__content__filter']}>
            <Input.Search
              placeholder="输入用户名"
              onSearch={onSearch}
              onChange={(e) => setInputText(e.target.value)}
              style={{ width: 300 }}
              value={inputText}
              allowClear
            />
            <Button
              style={{ marginLeft: '20px' }}
              type="default"
              onClick={() => createOrEditUser()}
            >
              新增用户
            </Button>
          </div>
          <div className={styles['users-list__content__table']}>
            <Table
              dataSource={tableData}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default UsersList;
