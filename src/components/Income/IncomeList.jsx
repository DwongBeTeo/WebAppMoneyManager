import { Download, Mail } from "lucide-react";
import TransactionInfoCard from "../TransactionInfoCard.jsx";
import moment from "moment";
const IncomeList = ({transactions, onDelete, onDownload, onEmail}) => {
    return( 
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Income List</h5>
                <div className="flex items-center justify-end gap-2">
                    <button className="card-btn" onClick={onEmail}>
                        <Mail size={20} className="text-base" /> Email
                    </button>
                    <button className="card-btn" onClick={onDownload}>
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