{
// //grok and use chart.js

// import { useEffect, useState } from "react";
// import { Line } from "react-chartjs-2";  // Import Line từ react-chartjs-2
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,  // Để hỗ trợ gradient fill
// } from "chart.js";  // Đăng ký các components cần thiết từ Chart.js
// import { prepareIncomeLineChartData } from "../../util/prepareIncomeLineChartData";

// // Đăng ký các elements
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const IncomeOverview = ({ transactions }) => {
//   const [chartData, setChartData] = useState({
//     labels: [],
//     datasets: [],
//   });

//   useEffect(() => {
//     const preparedData = prepareIncomeLineChartData(transactions);
//     setChartData({
//       labels: preparedData.labels,  // e.g., ['6th Jul', '8th Jul', ...]
//       datasets: [
//         {
//           label: "Income",
//           data: preparedData.data,  // Cumulative amounts
//           borderColor: "rgba(138, 75, 255, 1)",  // Màu đường line (tím như ảnh)
//           backgroundColor: (context) => {
//             const ctx = context.chart.ctx;
//             const gradient = ctx.createLinearGradient(0, 0, 0, 200);
//             gradient.addColorStop(0, "rgba(138, 75, 255, 0.2)");  // Gradient fill như ảnh
//             gradient.addColorStop(1, "rgba(138, 75, 255, 0)");
//             return gradient;
//           },
//           fill: true,  // Fill area dưới đường line
//           tension: 0.4,  // Độ cong của line (như ảnh)
//           pointRadius: 3,  // Kích thước điểm
//         },
//       ],
//     });
//   }, [transactions]);

//   // Tùy chỉnh tooltip để hiển thị như ảnh (Total và Details)
//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { display: false },  // Ẩn legend nếu không cần
//       tooltip: {
//         callbacks: {
//           title: (tooltipItems) => {
//             return tooltipItems[0].label;  // e.g., '8th Jul'
//           },
//           label: (tooltipItem) => {
//             const index = tooltipItem.dataIndex;
//             const details = prepareIncomeLineChartData(transactions).details[index];
//             if (details) {
//               return [
//                 `Total: ${details.total.toLocaleString()}₫`,
//                 'Details:',
//                 ...details.items.map(item => `${item.name}: ${item.amount.toLocaleString()}₫`),
//               ];
//             }
//             return "";
//           },
//         },
//         backgroundColor: "white",
//         titleColor: "black",
//         bodyColor: "black",
//         borderColor: "gray",
//         borderWidth: 1,
//         displayColors: false,  // Ẩn color box trong tooltip
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: { stepSize: 15000 },  // Điều chỉnh tick dựa trên data
//       },
//     },
//   };

//   return (
//     <div className="card">
//       <div className="flex items-center justify-between">
//         <div className="">
//           <h5 className="text-lg">Income Overview</h5>
//           <p className="text-xs text-gray-400 mt-0 5">
//             Track your earning over time and analyze your income trends.
//           </p>
//         </div>
//       </div>
//       <div className="mt-10">
//         {chartData.labels.length > 0 ? (
//           <Line data={chartData} options={options} />
//         ) : (
//           <p>No data available</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default IncomeOverview;
}

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { prepareIncomeLineChartData, prepareIncomeLineChartDataWithGaps } from "../../util/prepareIncomeLineChartData";


const IncomeOverview = ({transactions}) => {
    const [chartData, setChartData] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const result = prepareIncomeLineChartDataWithGaps(transactions);
        console.log(result);
        setChartData(result);
        
        // Trigger animation khi có dữ liệu mới
        if (result.length > 0) {
            setIsAnimating(true);
            // Reset animation sau khi hoàn thành
            setTimeout(() => setIsAnimating(false), result.length * 300 + 1000);
        }
    },[transactions]);

    // Custom Tooltip để hiển thị thông tin khi hover
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                // form hiển thị thống kê income của ngày hôm đó trong area chart
                <div className="bg-white p-3 rounded-lg shadow-xl border-2 border-purple-200">
                    <p className="font-bold text-sm mb-2 text-gray-700">{data.date}</p>
                    <p className="text-purple-600 font-bold text-xl mb-2">
                        Amount: ₫{data.amount.toLocaleString()}
                    </p>
                    {data.transactions && data.transactions.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-1 font-semibold">Details:</p>
                            {data.transactions.map((t, index) => (
                                <div key={index} className="flex items-center justify-between gap-3 mb-1">
                                    <span className="text-xs text-gray-700">{t.icon} {t.name}:</span>
                                    <span className="text-xs font-semibold text-green-600">
                                        ₫{t.amount.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    // Format số tiền trên trục Y
    const formatYAxis = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        }
        if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}K`;
        }
        return value;
    };

    // Tính tổng thu nhập của tháng đó
    const totalIncome = chartData.length > 0 
        ? chartData[chartData.length - 1].cumulative 
        : 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h5 className="text-xl font-bold text-gray-800">
                        Income Overview
                    </h5>
                    <p className="text-sm text-gray-500 mt-1">
                        Track your earning over time and analyze your income trends.
                    </p>
                </div>
                
                {/* Hiển thị tổng thu nhập */}
                <div className="text-right">
                    <p className="text-sm text-gray-500">Total Income</p>
                    <p className="text-2xl font-bold text-purple-600">
                        ₫{totalIncome.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="mt-4">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart 
                            data={chartData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                {/* Gradient cho area fill */}
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                                </linearGradient>
                            </defs>
                            
                            {/* Grid lines */}
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="#e5e7eb" 
                                vertical={false}
                            />
                            
                            {/* X Axis */}
                            <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                stroke="#d1d5db"
                                tickLine={false}
                            />
                            
                            {/* Y Axis */}
                            <YAxis 
                                tickFormatter={formatYAxis}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                stroke="#d1d5db"
                                tickLine={false}
                                axisLine={false}
                            />
                            
                            {/* Tooltip */}
                            <Tooltip 
                                content={<CustomTooltip />}
                                cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '5 5' }}

                                // wrapperStyle để xem thống kê chi tiết của income đó
                                // wrapperStyle={{ pointerEvents: "auto" }}
                            />
                            
                            {/* Area với animation */}
                            <Area 
                                type="monotone" 
                                dataKey="amount" 
                                stroke="#8b5cf6" 
                                strokeWidth={3}
                                fill="url(#colorIncome)"
                                dot={{ 
                                    fill: '#8b5cf6', 
                                    strokeWidth: 2, 
                                    r: 5,
                                    stroke: '#fff'
                                }}
                                activeDot={{ 
                                    r: 7,
                                    fill: '#8b5cf6',
                                    stroke: '#fff',
                                    strokeWidth: 3
                                }}
                                // Animation settings - KEY FEATURE
                                animationDuration={2000}
                                animationEasing="ease-in-out"
                                isAnimationActive={true}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[320px] text-gray-400">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p className="font-medium">No income data available</p>
                        <p className="text-sm mt-1">Add your first income to see the chart</p>
                    </div>
                )}
            </div>

            {/* Statistics summary */}
            {chartData.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Transactions</p>
                            <p className="text-lg font-bold text-gray-800">
                                {transactions.length}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Average</p>
                            <p className="text-lg font-bold text-gray-800">
                                ₫{Math.round(totalIncome / transactions.length).toLocaleString()}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Period</p>
                            <p className="text-lg font-bold text-gray-800">
                                {chartData.length} days
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncomeOverview;