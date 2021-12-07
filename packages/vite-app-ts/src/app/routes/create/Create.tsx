import { Button, Form, Card, Input, Select, InputNumber } from 'antd';
import { FC } from 'react';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import MongoDBController from '~~/controllers/mongodbController';
const { Option } = Select;

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

  const onFinish = async (values: any) => {
    console.log('Success:', values);
    const db = new MongoDBController();
    console.log(db.test());
    const testObj = values;
    console.log(db.newParty(values));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ padding: 24 }}>
      <div>
        <Card title="Create Party" style={{ width: '30vw' }}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off">
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name Required.' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="desc" rules={[{ required: true, message: 'Description Required.' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Funding" name="fundAmount" rules={[{ required: true, message: 'Funding Required.' }]}>
              <InputNumber />
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
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};
