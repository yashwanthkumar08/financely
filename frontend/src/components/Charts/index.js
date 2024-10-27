import React from 'react';
import { Line, Pie } from '@ant-design/charts';

function ChartComponent({ sortedTransactions }) {
    // Map transactions to the required data format for Line chart
    const data = sortedTransactions.map((item) => ({
        date: item.date,
        amount: item.amount,
        type: item.type,
    }));

    const lineConfig = {
        data,
        autoFit: true,
        xField: 'date',
        yField: 'amount',
        height:250,
        width:400,
        point: {
            shape: 'circle',
            style: {
                fill: (datum) => (datum.type === 'expenditure' ? '#F44336' : '#4CAF50'), // Red for expenditure, Green for income
            },
        },
    
        
    };

    // Filter and accumulate spending data for Pie chart
    const spendingData = sortedTransactions
        .filter((transaction) => transaction.type === 'expenditure')
        .reduce((acc, obj) => {
            const key = obj.tag;
            if (!acc[key]) {
                acc[key] = { tag: obj.tag, amount: obj.amount };
            } else {
                acc[key].amount += obj.amount;
            }
            return acc;
        }, {});

    // Convert spendingData back to array format for Pie chart
    const finalSpendings = Object.values(spendingData);

    const spendingConfig = {
        data: finalSpendings,
        autoFit: true,
        angleField: 'amount',
        colorField: 'tag',
        height:250,
        width:300,
    };

    return (
        <>
        <div className='chart-heading' style={{display:'flex',justifyContent:'center'}}>
        <h1>Chart analysis </h1>
        </div>
        <div className='charts-wrapper'>    
            <div className='chart-container'>
                {/* <h2>Line Chart</h2> */}
                <div className='line-chart'>
                <Line {...lineConfig} />
                </div>
            </div>    

            <div className='pie-chart-container'>
                {/* <h2>Pie Chart</h2> */}
                <div className='pie-chart'>
                <Pie {...spendingConfig} />
                </div>
                
            </div>
        </div>
        </>
    );
}

export default ChartComponent;
