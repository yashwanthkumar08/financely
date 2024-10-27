import React, { useState } from "react";
import { Button, Modal, Form, Input, DatePicker, Select, message } from "antd";

function AddModal({
  isModalVisible,
  handleModalCancel,
  onFinish,
  totalIncome,
}) {
  const [form] = Form.useForm();
  const [isTagDisabled, setIsTagDisabled] = useState(false);

  // Function to handle the "Type" change
  const handleTypeChange = (value) => {
    // Disable the "Tag" field if "Income" is selected
    setIsTagDisabled(value === "income");
  };

  // Validate the amount before calling onFinish
  const validateAndFinish = (values) => {
    if (values.type === "expenditure" && values.amount > totalIncome) {
      message.error("Expenditure cannot exceed total income!");
      return; // Prevent submission
    }
    onFinish(values); // Proceed with the original onFinish if validation passes
    form.resetFields(); // Reset form after submission
  };

  return (
    <Modal
      style={{ fontWeight: 600, top: "10%" }}
      title="Enter data"
      visible={isModalVisible}
      onCancel={handleModalCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={validateAndFinish} // Change to validateAndFinish
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction!",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>

        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please input the amount!" }]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>

        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please select the date!" }]}
        >
          <DatePicker className="custom-input" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          style={{ fontWeight: 600 }}
          rules={[{ required: true, message: "Please select a type!" }]}
        >
          <Select className="select-input-3" onChange={handleTypeChange}>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expenditure">Expenditure</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Tag"
          name="tag"
          style={{ fontWeight: 600 }}
          rules={[
            {
              required: !isTagDisabled,
              message: "Please select or add a tag!",
            },
          ]}
        >
          <Select
            className="select-input-2"
            disabled={isTagDisabled}
            mode="tags" // Enable the ability to add custom tags
            placeholder="Select or add a tag"
          >
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="education">Education</Select.Option>
            <Select.Option value="office">Office</Select.Option>
            {/* Add more predefined tags here */}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddModal;
