import { useState } from "react";

function ExpenseForm({ onAddExpense }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); //stop page refresh
    if (!amount) {
      alert("Please enter an amount or title!");
      return;
    }

    const newExpense = {
      id: Date.now(),
      title: title,
      amount: parseFloat(amount),
      category: category,
      date: new Date(),
    };

    onAddExpense(newExpense);
    setAmount("");
    setTitle("");
  };

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Add New Expense</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              placeholder="₹ 0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Shopping</option>
              <option>Utilities</option>
              <option>Housing</option>
              <option>Healthcare</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            placeholder="What was this expense for?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary">
          + Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
