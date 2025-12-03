import { Download, Mail } from "lucide-react";
import TransactionInfoCard from "../TransactionInfoCard.jsx";
import moment from "moment";
import { useState } from "react";
const IncomeList = ({transactions, onDelete, onDownload, onEmail}) => {
    const [loading, setLoading] = useState(false);
    const handleEmail = async () => {
        setLoading(true);
        try {
            await onEmail();
        } finally {
            setLoading(false);
        }
    }

    const handleDownload = async () => {
        setLoading(true);
        try {
            await onDownload();
        } finally {
            setLoading(false);
        }
    }
    return(
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Income List</h5>
                <div className="flex items-center justify-end gap-2">
                    <button className="card-btn" onClick={handleEmail}>
                        <Mail size={20} className="text-base" /> Email
                    </button>
                    <button className="card-btn" onClick={handleDownload}>
                        <Download size={20} className="text-base" /> DownLoad
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* display the incomes */}
                {transactions?.map((income) => (
                    <TransactionInfoCard 
                        key={income.id}
                        title={income.name}
                        icon={income.icon}
                        date={moment(income.date).format('Do-MMMM-YYYY')}
                        amount={income.amount}
                        type='income'
                        onDelete={() => onDelete(income.id)}
                    />
                ))}

            </div>
        </div>
    )
}

export default IncomeList;