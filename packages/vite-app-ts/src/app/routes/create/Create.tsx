import { Button, Form, Card, Input, Select, InputNumber, Space } from 'antd';
import { FC } from 'react';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import MongoDBController from '~~/controllers/mongodbController';
const { Option } = Select;
const { TextArea } = Input;

export interface CreateProps {
  mainnetProvider: StaticJsonRpcProvider;
  yourCurrentBalance: any;
  price: number;
}

export const Create: FC<CreateProps> = (props) => {
  const handleStrategyChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const handleTypeChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  interface Ballot {}
  interface Voter {
    address: string;
    ballot: Ballot;
  }

  const onFinish = async (values: any) => {
    console.log(values);
    const votersStruct = {};
    const db = new MongoDBController();
    db.newParty(values);
  };

  const onFinishFailed = (err: any) => {
    console.log('Failed:', err);
  };

  return (
    <div style={{ padding: 24 }}>
      <Space align="center">
        <Card title="Create Party" style={{ minWidth: '324px', maxWidth: '800px', width: '80vw' }}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off">
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name Required.' }]}>
              <Input placeholder="Party Name" />
            </Form.Item>
            <Form.Item label="Description" name="desc" rules={[{ required: true, message: 'Description Required.' }]}>
              <TextArea rows={3} placeholder="Describe the party" />
            </Form.Item>
            <Form.Item label="Funding" name="fundAmount" rules={[{ required: true, message: 'Funding Required.' }]}>
              <InputNumber placeholder="0.01" />
            </Form.Item>
            <Form.Item label="Type" name="fundType" rules={[{ required: true, message: 'Funding Type Required.' }]}>
              <Select style={{ width: 120 }} onChange={handleTypeChange}>
                <Option value="ETH">ETH</Option>
                <Option value="DAI">DAI</Option>
                <Option value="GTC">GTC</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Strategy" name="strategy" rules={[{ required: true, message: 'Strategy Required.' }]}>
              <Select style={{ width: 120 }} onChange={handleStrategyChange}>
                <Option value="Linear">Linear</Option>
                <Option value="Quadratic">Quadratic</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Participants"
              name="participants"
              rules={[{ required: true, message: 'Particpant(s) Required.' }]}>
              <TextArea rows={3} placeholder="Address/ENS" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
};
