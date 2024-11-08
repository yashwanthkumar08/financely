import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Cards from "../components/Cards";
import AddModal from "../Modals/addModal";
import TransactionsTable from "../components/TransactionsTable";
import ChartComponent from "../components/Charts";
import NoTransactions from "../components/NoTransactions";
import AddButton from "../components/AddButton";

const Dashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]); // State to store transactions
  const [totalIncome, setTotalIncome] = useState(0); // State to store total income
  const [totalExpenditure, setTotalExpenditure] = useState(0); // State to store total expenditure
  const [totalBalance, setTotalBalance] = useState(0);
  const [recentIncome, setRecentIncome] = useState([]);
  const [recentExpenditure, setRecentExpenditure] = useState([]);

  // Function to show the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to hide the modal
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Function to fetch transactions from the backend
  const fetchTransactions = async () => {
    try {
      let email = localStorage.getItem("userEmail");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/get-transactions?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            credentials: "include", // Ensure that cookies are sent with the request
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTransactions(data); // Set the fetched data to the transactions state
        calculateRecentTransactions(data); // Update recent transactions
      } else {
        console.error("Failed to fetch transactions:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // Function to calculate total income and expenditure
  const calculateTotals = (transactions) => {
    let income = 0;
    let expenditure = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        income += transaction.amount;
      } else if (transaction.type === "expenditure") {
        expenditure += transaction.amount;
      }
    });

    setTotalIncome(income);
    setTotalExpenditure(expenditure);
    setTotalBalance(income - expenditure);
  };

  // Function to calculate recent income and expenditure
  const calculateRecentTransactions = (transactions) => {
    const incomeEntries = transactions
      .filter((transaction) => transaction.type === "income")
      .map(({ name, amount, date }) => ({
        name,
        amount,
        date,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5); // Keep only the last 5 entries

    const expenditureEntries = transactions
      .filter((transaction) => transaction.type === "expenditure")
      .map(({ name, tag, amount, date }) => ({
        name,
        tag,
        amount,
        date,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5); // Keep only the last 5 entries

    setRecentIncome(incomeEntries);
    setRecentExpenditure(expenditureEntries);
  };

  // Fetch transactions when the component mounts
  useEffect(() => {
    fetchTransactions(); // Fetch transactions on mount
  }, []);

  // Recalculate totals whenever transactions state changes
  useEffect(() => {
    if (transactions.length > 0) {
      calculateTotals(transactions);
    }
  }, [transactions]); // Trigger whenever transactions state changes

  // Function to handle the form submission
  const onFinish = async (values) => {
    let email = localStorage.getItem("userEmail");

    const newTransaction = {
      type: values.type,
      date: values.date.toISOString().split("T")[0],
      amount: parseFloat(values.amount),
      tag: values.tag || "",
      name: values.name,
      email: email,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/add-transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            credentials: "include",
          },
          body: JSON.stringify(newTransaction),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Transaction saved successfully:", result);
        fetchTransactions(); // Fetch updated transactions after a new one is added
        setIsModalVisible(false); // Close the modal after successful save
      } else {
        console.error("Failed to save transaction:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <>
      <div style={{ backgroundColor: "#0b0b0b" }}>
        <Header showLogout={true} />
        <AddButton text="+ New" onClick={showModal} />
        <Cards
          showModal={showModal}
          totalIncome={totalIncome} // Pass total income to Cards
          totalExpenditure={totalExpenditure}
          totalBalance={totalBalance} // Pass total expenditure to Cards
          recentIncome={recentIncome}
          recentExpenditure={recentExpenditure}
        />

        <div
          className="table-heading"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <h1 style={{ color: "white" }}>Transactions</h1>
        </div>

        <TransactionsTable
          transactions={transactions}
          fetchTransactions={fetchTransactions}
        />

        <AddModal
          isModalVisible={isModalVisible}
          handleModalCancel={handleModalCancel}
          onFinish={onFinish}
          totalIncome={totalIncome}
        />
        {transactions.length !== 0 ? (
          <ChartComponent sortedTransactions={transactions} />
        ) : (
          <NoTransactions />
        )}
      </div>
    </>
  );
};

export default Dashboard;
