import { useEffect, useState } from "react";
import EmojiPickPopup from "../EmojiPickPopup";
import Input from "../Input";
import { LoaderCircle } from "lucide-react";

const AddInComeForm = ({onAddIncome, categories, isEditing}) => {
    const [income, setIncome] = useState({
        name: '',
        amount: '',
        date: '',
        icon: '',
        categoryId:'',
    });

    const [loading, setLoading] = useState(false);

    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.name
    }));

    const handleChange = (key, value) => {
        setIncome({...income, [key]: value})
    }

    const handleAddIncome = async () => {
        setLoading(true);
        try {
            await onAddIncome(income)
        } finally {
            setLoading(false);
        }
    }

    //dùng để đặt mặc định category(index:0)
    // useEffect(() => {
    //     if (categories.length > 0 && !income.categoryId) {
    //         setIncome((prev) => ({...prev, categoryId: categories[0].id}))
            
    //     }
    // }, [categories, income.categoryId]);

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
                label='Category'
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
                    onClick={handleAddIncome}
                    disabled={loading}
                    className="add-btn add-btn-fill"
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="animate-spin w-5 h-5"/>
                            {isEditing ? 'Updating...' : 'Adding...'}
                        </>
                    ) : (
                        <>
                            {isEditing ? 'Updating Income' : 'Add Income'}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
export default AddInComeForm;