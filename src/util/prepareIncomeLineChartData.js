{
// // Grok and use chart.js
// // prepareIncomeLineChartData.js
// // This function prepares data for the income line chart, including labels, cumulative amounts for the line,
// // and daily details for tooltips.
// export const prepareIncomeLineChartData = (transactions) => {
//   if (!transactions || transactions.length === 0) {
//     return {
//       labels: [],
//       data: [],
//       details: [],
//     };
//   }

//   // Helper function to add ordinal suffix to day (e.g., 6th, 8th)
//   const ordinal = (day) => {
//     if (day > 3 && day < 21) return `${day}th`;
//     switch (day % 10) {
//       case 1:
//         return `${day}st`;
//       case 2:
//         return `${day}nd`;
//       case 3:
//         return `${day}rd`;
//       default:
//         return `${day}th`;
//     }
//   };

//   // Sort transactions by date
//   const sortedTransactions = [...transactions].sort(
//     (a, b) => new Date(a.date) - new Date(b.date)
//   );

//   // Group transactions by date
//   const groups = {};
//   sortedTransactions.forEach((tx) => {
//     const dateKey = tx.date; // Assuming date is in 'YYYY-MM-DD' format
//     if (!groups[dateKey]) {
//       groups[dateKey] = { total: 0, items: [] };
//     }
//     groups[dateKey].total += tx.amount;
//     groups[dateKey].items.push({ name: tx.name, amount: tx.amount });
//   });

//   // Get sorted unique dates
//   const dates = Object.keys(groups).sort(
//     (a, b) => new Date(a) - new Date(b)
//   );

//   // Compute cumulative sums and collect details
//   let cumulative = 0;
//   const chartData = [];
//   const chartDetails = [];
//   dates.forEach((date) => {
//     cumulative += groups[date].total;
//     chartData.push(cumulative);
//     chartDetails.push(groups[date]);
//   });

//   // Format labels as '6th Jul'
//   const labels = dates.map((date) => {
//     const d = new Date(date);
//     const day = d.getDate();
//     const month = d.toLocaleString("default", { month: "short" });
//     return `${ordinal(day)} ${month}`;
//   });

//   return {
//     labels,
//     data: chartData, // Cumulative values for the line chart y-axis
//     details: chartDetails, // Array of { total, items: [{name, amount}] } for tooltips
//   };
// };
}

import moment from 'moment';

/**
 * Prepare income data for line chart visualization
 * Groups transactions by date and calculates cumulative totals
 * @param {Array} transactions - Array of income transactions
 * @returns {Array} Formatted data for line chart with date and cumulative amount
 */
export const prepareIncomeLineChartData = (transactions) => {
    if (!transactions || transactions.length === 0) {
        return [];
    }

    // Sort transactions by date (ascending)
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );

    // Group transactions by date and amounts of Income
    const groupedByDate = sortedTransactions.reduce((acc, transaction) => {
        const date = moment(transaction.date).format('DD MMM');
        
        if (!acc[date]) {
            acc[date] = {
                date: date,
                fullDate: transaction.date,
                amount: 0,
                transactions: []
            };
        }
        
        acc[date].amount += transaction.amount;
        acc[date].transactions.push({
            name: transaction.name,
            amount: transaction.amount,
            icon: transaction.icon
        });
        
        return acc;
    }, {});

    // Convert to array and calculate cumulative amounts
    const chartData = Object.values(groupedByDate);
    // cumulative là tính tổng Income tháng đó
    let cumulativeAmount = 0;

    const result = chartData.map((item) => {
        cumulativeAmount += item.amount;
        return {
            date: item.date,
            fullDate: item.fullDate,
            amount: item.amount,
            cumulative: cumulativeAmount,
            transactions: item.transactions
        };
    });

    return result;
};

/**
 * Alternative version: Prepare data with daily intervals (fills gaps)
 * Useful if you want to show a continuous line even for days without transactions
 */
export const prepareIncomeLineChartDataWithGaps = (transactions) => {
    if (!transactions || transactions.length === 0) {
        return [];
    }

    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );

    // Get date range
    const startDate = moment(sortedTransactions[0].date);
    const endDate = moment(sortedTransactions[sortedTransactions.length - 1].date);

    // Group transactions by date
    const transactionsByDate = sortedTransactions.reduce((acc, transaction) => {
        const date = moment(transaction.date).format('YYYY-MM-DD');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
    }, {});

    // Create data for each day
    const chartData = [];
    let cumulativeAmount = 0;
    let currentDate = startDate.clone();

    while (currentDate.isSameOrBefore(endDate)) {
        const dateKey = currentDate.format('YYYY-MM-DD');
        const dayTransactions = transactionsByDate[dateKey] || [];
        const dayAmount = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        cumulativeAmount += dayAmount;

        chartData.push({
            date: currentDate.format('DD MMM'),
            fullDate: dateKey,
            amount: dayAmount,
            cumulative: cumulativeAmount,
            transactions: dayTransactions.map(t => ({
                name: t.name,
                amount: t.amount,
                icon: t.icon
            }))
        });

        currentDate.add(1, 'day');
    }

    return chartData;
};