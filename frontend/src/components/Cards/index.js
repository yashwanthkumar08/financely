import React from "react";
import { Card, Row } from "antd";
import "./styles.css";
import Button from "../Button";

function Cards({ showModal, totalIncome, totalExpenditure,totalBalance }) {
  return (
    <div>
      <Row className="my-row">
      <Card className="my-card">
  <div className="income-card">
    <h3 className="card-title">Income</h3>
    <p className="card-value">₹{totalIncome}</p>
  </div>
</Card>
        <Card className="my-card" title="Track your expenses">
          <Button text="Add" blue={true} onClick={showModal} />
        </Card>
        <Card className="my-card">
  <div className="expenditure-card">
    <h3 className="expenditure-title">Expenditure</h3>
    <p className="expenditure-value">₹{totalExpenditure}</p>
    <h3 className="balance-title">Balance</h3>
    <p className="balance-value">₹{totalBalance}</p>
  </div>
</Card>

      </Row>
    </div>
  );
}

export default Cards;
