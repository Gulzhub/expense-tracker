import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseSummary from "./components/ExpenseSummary";

function App() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [dateRange, setDateRange] = useState([startOfMonth, new Date()]);

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("sleek-expenses");
    if (savedExpenses) {
      return JSON.parse(savedExpenses).map((expense) => ({
        ...expense,
        date: new Date(expense.date),
      }));
    } else {
      return [];
    }
  });

  // saving the expenses and loading it everytime there is a change in the  expenses state

  useEffect(() => {
    localStorage.setItem("sleek-expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (newExpense) => {
    console.log("added");
    setExpenses([newExpense, ...expenses]);
  };
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const [start, end] = dateRange;

    //if only one date is selected
    const endDate = end || start;

    // Normalize times to Midnight (00:00:00) for accurate day comparison as this gave me the most headache in getting the dates right
    const targetDate = new Date(expenseDate);
    targetDate.setHours(0, 0, 0, 0);

    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);

    const endDateNormalized = new Date(endDate);
    endDateNormalized.setHours(23, 59, 59, 999);
    // End of that day

    return targetDate >= startDate && targetDate <= endDateNormalized;
  });

  // Delete an expense(by ID)
  const deleteExpense = (id) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id),
    );
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Sleek Spend</h1>
        <p style={{ color: "#a1a1aa" }}>Track your daily expenses with style</p>
      </div>

      <div className="grid-layout">
        {/* LEFT COLUMN */}
        <div className="main-content">
          <ExpenseForm onAddExpense={addExpense} />
          <ExpenseList
            expenses={filteredExpenses}
            onDeleteExpense={deleteExpense}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="sidebar">
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
              Select Date Range
            </h3>
            <Calendar
              onChange={setDateRange}
              value={dateRange}
              selectRange={true}
              className="dark-calendar"
            />
          </div>
          <ExpenseSummary expenses={filteredExpenses} dateRange={dateRange} />
        </div>
      </div>
    </div>
  );
}

export default App;
