import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './styles.css';

function ChartComponent({ sortedTransactions }) {
    // Prepare data for the Recharts bar chart for spending trend
    const barData = sortedTransactions.map((item) => {
        const date = new Date(item.date);
        const formattedDate = `${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`; // Format as mm/yy
        return {
            date: formattedDate,
            category: item.tag,
            amount: item.amount,
        };
    });

    // Prepare data for the second Recharts bar chart (tag vs amount for expenditures only)
    const tagData = sortedTransactions
        .filter((item) => item.type === 'expenditure') // Filter for expenditures only
        .reduce((acc, item) => {
            if (!acc[item.tag]) {
                acc[item.tag] = { tag: item.tag, amount: 0 };
            }
            acc[item.tag].amount += item.amount;
            return acc;
        }, {});

    const finalTagData = Object.values(tagData);

    // Recharts bar chart configuration
    const barColors = ['#00a885', '#d8fffb', '#00c7ab', '#124241'];

    const spendingTrendChart = (
        <ResponsiveContainer width={600} height={250}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#d3d3d3" />
                <YAxis stroke="#d3d3d3" />
                <Tooltip />
                <Bar dataKey="amount" barSize={20}> 
                    {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );

    const tagVsAmountChart = (
        <ResponsiveContainer width={600} height={250}>
            <BarChart data={finalTagData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="tag" stroke="#d3d3d3" />
                <YAxis stroke="#d3d3d3" />
                <Tooltip />
                <Bar dataKey="amount" barSize={20}> 
                    {finalTagData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <>
            <div className='chart-heading' style={{ display: 'flex', justifyContent: 'center' }}>
                <h1 style={{ color: 'white' }}>Chart Analysis</h1>
            </div>
            <div className='charts-wrapper'>
                <div className='bar-chart'>
                    <h2 style={{ color: 'white' }}>Spending Trend</h2>
                    <div className='chart-container'>
                        {spendingTrendChart}
                    </div>
                </div>

                <div className='bar-chart'>
                    <h2 style={{ color: 'white'}}>Expenditures by Tag</h2>
                    <div className='chart-container'>
                        {tagVsAmountChart}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChartComponent;
