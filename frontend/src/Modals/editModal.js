import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, DatePicker, Select, message } from "antd";
import moment from "moment";

function EditModal({
  isModalVisible,
  handleModalCancel,
  onFinish,
  transaction,
}) {
  const [form] = Form.useForm();
  const [isTagDisabled, setIsTagDisabled] = useState(false);

  useEffect(() => {
    if (transaction) {
      console.log("entered use effect", transaction);
      const transactionWithFormattedDate = {
        ...transaction,
        date: transaction.date ? moment(transaction.date, "YYYY-MM-DD") : null, // Convert date to moment object
      };

      form.setFieldsValue(transactionWithFormattedDate);
      console.log("form values set", form);
      setIsTagDisabled(transaction.type === "income"); // Disable tag if type is income
    }
  }, [transaction, form]);

  const handleTypeChange = (value) => {
    setIsTagDisabled(value === "income");
  };

  const handleFormFinish = (values) => {
    onFinish(values); // Call onFinish with form values
    form.resetFields(); // Reset form after submission
  };

  return (
    <Modal
      title="Edit Transaction"
      visible={isModalVisible}
      onCancel={handleModalCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFormFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction!",
            },
          ]}
        >
          <Input type="text" />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please input the amount!" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select the date!" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: "Please select a type!" }]}
        >
          <Select onChange={handleTypeChange}>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expenditure">Expenditure</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Tag"
          name="tag"
          rules={[
            {
              required: !isTagDisabled,
              message: "Please select or add a tag!",
            },
          ]}
        >
          <Select
            disabled={isTagDisabled}
            mode="tags"
            placeholder="Select or add a tag"
          >
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="education">Education</Select.Option>
            <Select.Option value="office">Office</Select.Option>
            {/* Add more predefined tags here */}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditModal;
