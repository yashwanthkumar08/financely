import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Cards from "../components/Cards";
import AddModal from "../Modals/addModal";
import moment from "moment";
import TransactionsTable from "../components/TransactionsTable";
import EditModal from "../Modals/editModal";
import ChartComponent from "../components/Charts";
import NoTransactions from "../components/NoTransactions";

const Dashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]); // State to store transactions
  const [totalIncome, setTotalIncome] = useState(0); // State to store total income
  const [totalExpenditure, setTotalExpenditure] = useState(0); // State to store total expenditure
  const [totalBalance, setTotalBalance] = useState(0);

  // Function to show the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to hide the modal
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const checkSession = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/check-session", {
        method: "GET",
        credentials: "include", // Include credentials
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Current session:", data);
      } else {
        console.error("Failed to check session:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // Function to calculate total income and expenditure
  const calculateTotals = (transactions) => {
    let income = 0;
    let expenditure = 0;
    let balance = 0;
    transactions.forEach((transaction) => {
      // Ensure that you're checking the correct casing of transaction types
      if (transaction.type === "income") {
        income += transaction.amount;
      } else if (transaction.type === "expenditure") {
        expenditure += transaction.amount;
      }
      balance = income - expenditure;
    });

    setTotalIncome(income);
    setTotalExpenditure(expenditure);
    setTotalBalance(balance);
    console.log(balance); //here we have the balance being calculated
  };

  // Fetch transactions from the backend
  const fetchTransactions = async () => {
    try {
      let email = localStorage.getItem("userEmail");
      const response = await fetch(
        `http://127.0.0.1:5000/get-transactions?email=${email}`,
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
      } else {
        console.error("Failed to fetch transactions:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // Fetch transactions when the component mounts
  useEffect(() => {
    const verifySession = async () => {
      //await checkSession(); // Call your checkSession function
      await fetchTransactions(); // Fetch transactions after session check
    };

    verifySession(); // Call the function
  }, []);

  // Recalculate totals whenever transactions state changes
  useEffect(() => {
    if (transactions.length > 0) {
      calculateTotals(transactions);

      // Calculate totals based on updated transactions
    }
  }, [transactions]); // Trigger whenever transactions state changes

  // Function to handle the form submission
  // Function to handle the form submission
  const onFinish = async (values) => {
    let email = localStorage.getItem("userEmail");
    console.log("email - " + email);

    const newTransaction = {
      type: values.type,
      // date: moment(values.date).format("YYYY-MM-DD"),
      date: values.date.toISOString().split("T")[0],
      amount: parseFloat(values.amount),
      tag: values.tag || "",
      name: values.name,
      email: email,
    };
    console.log("transaction date is " + newTransaction.date);

    try {
      const response = await fetch("http://127.0.0.1:5000/add-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include", // Ensure that cookies are sent with the request
        },
        body: JSON.stringify(newTransaction),
      });

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

  let sortedTransactions=transactions.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    })
  return (
    <>
    <div>
      <Header showLogout={true} />
      <Cards
        showModal={showModal}
        totalIncome={totalIncome} // Pass total income to Cards
        totalExpenditure={totalExpenditure}
        totalBalance={totalBalance} // Pass total expenditure to Cards
      />
      {transactions.length!=0?<ChartComponent sortedTransactions={sortedTransactions}/>: <NoTransactions />}
      <AddModal
        isModalVisible={isModalVisible}
        handleModalCancel={handleModalCancel}
        onFinish={onFinish}
        totalIncome={totalIncome}
      />
      <div className="table-heading" style={{display:'flex',justifyContent:'center'}}>
        <h1>Transactions</h1>
      </div>
      <TransactionsTable
        transactions={transactions}
        fetchTransactions={fetchTransactions}
      />
    </div>
    </>
  );
};

export default Dashboard;
