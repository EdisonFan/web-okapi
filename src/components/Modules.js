import React from 'react'
import { Table, Icon, Divider, Button } from 'antd';

const columns = [{
  title: '序号',
  dataIndex: 'index',
  key: 'index',
  render: (text, record, index) => index+1,
},{
  title: '模块名称',
  dataIndex: 'name',
  key: 'name',
  render: text => <a href="javascript:;">{text}</a>,
}, {
  title: '模块ID',
  dataIndex: 'id',
  key: 'id',
},{
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="javascript:;">部署</a>
      <Divider type="vertical" />
      <a href="javascript:;">删除</a>
      <Divider type="vertical" />
      <a href="javascript:;" className="ant-dropdown-link">
        租客
      </a>
    </span>
  ),
}];

const data = [{
  key: '0',
  name: 'okapi-2.0.1-SNAPSHOT',
  id: 'okapi-2.0.1-SNAPSHOT',
  address: 'New York No. 1 Lake Park',
},{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];
const Modules = () => (
  <div>
    <div style={{margin:'10'}}>
      
      <Button type="primary">新增</Button>
    </div>
    <Table pagination={false} columns={columns} dataSource={data} />
   
  </div>
)

export default Modules
