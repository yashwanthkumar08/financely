import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  PieChart,
  Pie,
  Cell as PieCell,
  Tooltip as PieTooltip,
} from "recharts"; // Import Pie components
import "./styles.css";

function ChartComponent({ sortedTransactions }) {
  // Prepare data for the Recharts bar chart for spending trend
  const barData = sortedTransactions.map((item) => {
    const date = new Date(item.date);
    const formattedDate = `${date.getMonth() + 1}/${date
      .getFullYear()
      .toString()
      .slice(-2)}`; // Format as mm/yy
    return {
      date: formattedDate,
      category: item.tag,
      amount: item.amount,
    };
  });

  // Prepare data for the second Recharts pie chart (tag vs amount for expenditures only)
  const tagData = sortedTransactions
    .filter((item) => item.type === "expenditure") // Filter for expenditures only
    .reduce((acc, item) => {
      if (!acc[item.tag]) {
        acc[item.tag] = { tag: item.tag, amount: 0 };
      }
      acc[item.tag].amount += item.amount;
      return acc;
    }, {});

  const finalTagData = Object.values(tagData);

  // Calculate total expenditure
  const totalExpenditure = finalTagData.reduce(
    (acc, item) => acc + item.amount,
    0
  );

  // Add percentage property for each tag
  finalTagData.forEach((item) => {
    item.percentage = ((item.amount / totalExpenditure) * 100).toFixed(2); // Calculate percentage and format it
  });

  // Recharts bar chart configuration
  const barColors = ["#00a885", "#d8fffb", "#00c7ab", "#124241"];

  const spendingTrendChart = (
    <ResponsiveContainer width={600} height={250}>
      <BarChart
        data={barData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="date" stroke="#d3d3d3" />
        <YAxis stroke="#d3d3d3" />
        <Tooltip
          content={({ payload }) => {
            if (payload && payload.length > 0) {
              const { category, date, amount } = payload[0].payload; // Extract tag, date, and amount
              return (
                <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
                  <p><strong>Tag:</strong> {category}</p>
                  <p><strong>Date:</strong> {date}</p>
                  <p><strong>Amount:</strong> ${amount}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="amount" barSize={20}>
          {barData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  // Pie chart for expenditures by tag with percentage on hover
  const pieColors = ["#00a885", "#d8fffb", "#00c7ab", "#124241"]; // You can customize these colors
  const tagVsAmountPieChart = (
    <ResponsiveContainer width={600} height={250}>
      <PieChart>
        <Pie
          data={finalTagData}
          dataKey="amount"
          nameKey="tag"
          outerRadius={100}
          fill="#8884d8"
          labelLine={false} // Disable label lines for hover
          label={({ percent, name }) => null} // Do not show labels by default
        >
          {finalTagData.map((entry, index) => (
            <PieCell
              key={`cell-${index}`}
              fill={pieColors[index % pieColors.length]}
            />
          ))}
        </Pie>
        <PieTooltip
          formatter={(value, name, props) => {
            const percentage = props.payload.percentage; // Access percentage from the payload
            return [
              `${name}:${percentage}% (${value}₹)`, // Show tag and amount
            ];
          }}
          contentStyle={{ backgroundColor: "white", color: "black", padding: "10px", borderRadius: "5px" }} // Tooltip style
        />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <>
      <div
        className="chart-heading"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <h1 style={{ color: "white" }}>Chart Analysis</h1>
      </div>
      <div className="charts-wrapper">
        <div className="bar-chart">
          <h2 style={{ color: "white" }}>Spending Trend</h2>
          <div className="chart-container">{spendingTrendChart}</div>
        </div>

        <div className="bar-chart">
          <h2 style={{ color: "white" }}>Expenditures by Tag (Pie Chart)</h2>
          <div className="pie-chart-container">
            {tagVsAmountPieChart} {/* Pie chart with hover-based tooltips */}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChartComponent;
