import React from "react";
import { Card, Row, Col } from "antd";
import "./styles.css";

function Cards({
  showModal,
  totalIncome,
  totalExpenditure,
  totalBalance,
  recentIncome,
  recentExpenditure,
}) {
  const tagColors = {
    food: { background: "#222255", text: "#9D80D4" },       // Colors for Food tag
    education: { background: "#682c2b", text: "#BB0C1C" },  // Colors for Education tag
    office: { background: "#2596be", text: "#ED1F97" },     // Colors for Office tag
    // Add more tag types and colors as needed
  };

  
  return (
    <div style={{ margin: '0 auto', padding: '0 65px' }}>
      <Row className="my-row">
        <Card className="my-card" title="Recent Income">
          <div className="income-card">
            <div className="recent-entries">
              {/* Check if there is data for recentIncome */}
              {recentIncome && recentIncome.length > 0 ? (
                <>
                  <div className="header-row">
                    <span className="header-name">Name</span>
                    <span className="header-amount">Amount</span>
                  </div>
                  {recentIncome.map((item, index) => (
                    <div key={index} className="entry-item">
                      <span className="entry-name">{item.name}</span>
                      <span className="entry-amount">₹{item.amount}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{color:'white',fontStyle:'italic'}}>No Transactions Available</div> // Display message if no data
              )}
            </div>
          </div>
        </Card>

        <Card className="my-card" title="Recent Expenditure">
          <div className="expenditure-card">
            <div className="recent-entries">
              {/* Check if there is data for recentExpenditure */}
              {recentExpenditure && recentExpenditure.length > 0 ? (
                <>
                  <div className="header-row">
                    <span className="header-name">Name</span>
                    <span className="header-tag">Tag</span>
                    <span className="header-amount">Amount</span>
                  </div>
                  {recentExpenditure.map((item, index) => (
                    <div key={index} className="entry-item">
                      <span className="entry-name">{item.name}</span>
                      <span
                        className="entry-tag"
                        style={{
                          backgroundColor: tagColors[item.tag]?.background || '#ccc',
                          color: tagColors[item.tag]?.text || '#000',
                        }}
                      >
                        {item.tag}
                      </span>
                      <span className="entry-amount">₹{item.amount}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{color:'white',fontStyle:'italic'}}>No Transactions Available</div> // Display message if no data
              )}
            </div>
          </div>
        </Card>

        <Card className="my-card" title="Balance">
          <div className="balance-card">
            {/* Display balance if available, else show a message */}
            {totalBalance !== 0 ? (
              <p className="balance-value">₹{totalBalance}</p>
            ) : (
              <div style={{color:'white',fontStyle:'italic'}}>No Balance Available</div> // Display message if no balance
            )}
          </div>
        </Card>
      </Row>
    </div>
  );
}

export default Cards;
