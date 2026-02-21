import { useEffect, useState } from "react";

function ExpenseList({ expenses, onDeleteExpense }) {
  const [visibleCount, setVisibleCount] = useState(3);
  useEffect(() => {
    setVisibleCount(3);
  }, [expenses]);

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  const visibleExpenses = sortedExpenses.slice(0, visibleCount);

  const groupedExpenses = visibleExpenses.reduce((groups, expense) => {
    // Get date string (e.g., "2026-02-01")
    const dateKey = expense.date.toLocaleDateString();

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(expense);
    return groups;
  }, {});
  // groupedExpenses makes the expenses list into a list of objects with datas as the keys and the expense as its values

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const sortedDates = Object.keys(groupedExpenses).sort(
    (a, b) => new Date(b) - new Date(a),
  );

  return (
    <div className="expense-list">
      <h3 style={{ color: "#a1a1aa", marginBottom: "1.5rem" }}>
        Recent Transactions
      </h3>

      {expenses.length === 0 ? (
        <p style={{ textAlign: "center", color: "#52525b" }}>
          No expenses found
        </p>
      ) : (
        <>
          {sortedDates.map((dateKey) => {
            const dailyExpenses = groupedExpenses[dateKey];
            const dailyTotal = dailyExpenses.reduce(
              (sum, item) => sum + item.amount,
              0,
            );

            return (
              <div key={dateKey} style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.8rem",
                    padding: "0 0.5rem",
                  }}
                >
                  <span
                    style={{
                      color: "#e4e4e7",
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {formatDateHeader(dateKey)}
                  </span>
                  <span style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>
                    ₹ {dailyTotal.toFixed(2)}
                  </span>
                </div>

                {/* Items */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.8rem",
                  }}
                >
                  {dailyExpenses.map((item) => (
                    <div
                      key={item.id}
                      className="card"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1rem",
                        margin: 0,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        {/* THE DELETE BUTTON */}
                        <button
                          onClick={() => {
                            if (window.confirm("Delete this expense?")) {
                              onDeleteExpense(item.id);
                            }
                          }}
                          className="delete-btn"
                          title="Delete Expense"
                        >
                          ✕
                        </button>

                        <div>
                          <div style={{ fontWeight: "bold" }}>{item.title}</div>
                          <div style={{ fontSize: "0.8rem", color: "#a1a1aa" }}>
                            {item.category} •{" "}
                            {item.date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: "bold", color: "white" }}>
                        ₹ {item.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* LOAD MORE BUTTON */}
          {visibleCount < expenses.length && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)} // Show 5 more
              className="load-more-btn"
            >
              Load More ({expenses.length - visibleCount} remaining)
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default ExpenseList;
