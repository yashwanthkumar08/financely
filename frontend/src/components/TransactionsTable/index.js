import { Button, Input, message, Select, Table } from "antd";
import React, { useState } from "react";
import { unparse } from "papaparse";
import EditModal from "../../Modals/editModal"; // Import the EditModal
import searchImg from "../../assets/search.svg";
import "./styles.css"; // Link to CSS

function TransactionsTable({ transactions, fetchTransactions }) {
  const [search, setSearch] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Manage modal visibility
  const [currentTransaction, setCurrentTransaction] = useState(null); // Store the current transaction to edit
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const { Option } = Select;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            onClick={() => handleEdit(record)}
            style={{ marginRight: "8px" }}
          >
            Edit
          </Button>
          <Button onClick={() => handleDelete(record._id)}>Delete</Button>
        </>
      ),
    },
  ];

  let filteredTransactions = transactions.filter(
    (item) =>
      (item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.amount.toString().includes(search) || // Convert amount to string
        item.date.includes(search) ||
        item.tag[0]?.toLowerCase().includes(search.toLowerCase())) &&
      item.type.includes(typeFilter) // Check if tag is not null and then search
  );

  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  const handleEdit = (transaction) => {
    setCurrentTransaction(transaction); // Set the transaction to be edited
    setIsEditModalVisible(true); // Show the modal
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false); // Hide the modal
    setCurrentTransaction(null); // Reset the current transaction
  };

  const handleEditSubmit = async (values) => {
    values.date = values.date.toISOString().split("T")[0]; // Convert date to YYYY-MM-DD

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/edit-transactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentTransaction,
          ...values,
          transaction_id: currentTransaction._id,
        }), // Send the transaction ID
      }
    );

    if (response.ok) {
      fetchTransactions(); // Refetch the transactions after editing
      message.success("Transaction edited successfully");
      handleEditModalCancel(); // Close the modal after success
    } else {
      message.error("Failed to edit transaction.");
    }
  };

  const handleDelete = async (transactionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (!confirmDelete) return;

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/delete-transactions`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transaction_id: transactionId }), // Send the transaction ID
      }
    );

    if (response.ok) {
      message.success("Transaction deleted successfully!");
      fetchTransactions();
    } else {
      message.error("Failed to delete transaction.");
    }
  };

  const handleFilterAndSortChange = (value) => {
    if (value === "income" || value === "expenditure") {
      setTypeFilter(value);
      setSortKey(""); // Reset sort when changing type filter
    } else {
      setSortKey(value);
      setTypeFilter(""); // Reset filter when changing sort option
    }
  };

  function exportCSV() {
    var csv = unparse({
      fields: ["name", "amount", "date", "tag", "type"],
      data: transactions,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="transactions-container">
      <div className="transactions-header">

        <div className="input-flex">
          {/* <img src={searchImg} width="16" alt="Search" /> */}
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
          />
        </div>
        <div className="filter-sort">
        <Select
          className="select-input"
          onChange={handleFilterAndSortChange}
          placeholder="Filter or Sort"
          allowClear
        >
          <Option value="">All Types</Option>
          <Option value="income">Income</Option>
          <Option value="expenditure">Expense</Option>
          <Option value="date">Sort by Date</Option>
          <Option value="amount">Sort by Amount</Option>
        </Select>
        </div>
        
      </div>

      <div className="transactions-controls">
        <div className="export-buttons">
          <button className="export-button" onClick={exportCSV}>
            Export to CSV
          </button>
        </div>
      </div>


      <div className="table-container">
        <Table
          dataSource={sortedTransactions}
          columns={columns}
          style={{ width: "100%" }}
        />
      </div>

      {/* Render the EditModal */}
      <EditModal
        isModalVisible={isEditModalVisible}
        handleModalCancel={handleEditModalCancel}
        onFinish={handleEditSubmit}
        transaction={currentTransaction} // Pass the current transaction
      />
    </div>
  );
}

export default TransactionsTable;
