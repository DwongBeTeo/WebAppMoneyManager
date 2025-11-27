import { useState } from "react";
import EmojiPickPopup from "../EmojiPickPopup";
import Input from "../Input";

const AddInComeForm = ({onAddIncome, categories}) => {
    const [income, setIncome] = useState({
        name: '',
        amount: '',
        date: '',
        icon: '',
        categoryId: '',
    });

    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.name
    }));

    const handleChange = (key, value) => {
        setIncome({...income, [key]: value})
    }

    return (
        <div>
            <EmojiPickPopup 
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
            />

            <Input 
                value={income.name}
                onChange={(e) => handleChange('name', e.target.value)}
                label="Income Source"
                placeholder="Salary,Freelance, Bonus, etc."
                type='text'
            />

            <Input 
                label='Cateogry'
                value={income.categoryId}
                onChange={({target}) => handleChange('categoryId', target.value)}
                isSelect={true}
                options={categoryOptions}
            />

            <Input 
                label='Amount'
                value={income.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder='e.g.500.00'
                type='number'
            />

            <Input 
                label='Date'
                value={income.date}
                onChange={(e) => handleChange('date', e.target.value)}
                type='date'
            />

            <div className="flex justify-end mt-6">
                <button
                    onClick={() => onAddIncome(income)}
                    className="add-btn add-btn-fill"
                >
                    Add Income
                </button>
            </div>
        </div>
    )
}
export default AddInComeForm;