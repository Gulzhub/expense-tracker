function ExpenseSummary({ expenses, dateRange }) {
  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  const totalCount = expenses.length;

  const categoryTotals = expenses.reduce((acc, item) => {
    // If this category doesn't exist in our list yet, start at 0
    const currentTotal = acc[item.category] || 0;
    acc[item.category] = currentTotal + item.amount;
    return acc;
  }, {});

  // 4. Sort categories (Highest spending first)
  const sortedCategories = Object.entries(categoryTotals).sort(
    ([, amountA], [, amountB]) => amountB - amountA,
  );
  const getDateLabel = () => {
    if (!dateRange || !dateRange[0]) return "All Time";

    const [start, end] = dateRange;
    const endDate = end || start; // Handle single-day selection

    // Check if the range is exactly "Today"
    const today = new Date();
    const isToday =
      start.getDate() === today.getDate() &&
      start.getMonth() === today.getMonth() &&
      start.getFullYear() === today.getFullYear() &&
      endDate.getDate() === today.getDate();

    if (isToday) return "Today";

    const options = { month: "short", day: "numeric", year: "numeric" };

    // If start and end are the same day, show just one date
    if (start.toDateString() === endDate.toDateString()) {
      return start.toLocaleDateString("en-US", options);
    }

    // Otherwise show range "Jan 1, 2026 - Jan 5, 2026"
    return `${start.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString("en-US", options)}`;
  };
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Summary</h3>
        {/* Shows today's date dynamically */}
        <span
          style={{ fontSize: "0.8rem", color: "#a1a1aa", alignSelf: "center" }}
        >
          {getDateLabel()}
        </span>
      </div>

      {/* BIG TOTAL */}
      <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>
          ₹ {totalAmount.toFixed(2)}
        </h1>
        <span style={{ color: "#a1a1aa" }}>
          {totalCount} {totalCount === 1 ? "expense" : "expenses"}
        </span>
      </div>

      {/* CATEGORY BARS */}
      <div style={{ borderTop: "1px solid #27272a", paddingTop: "1rem" }}>
        <h4
          style={{
            color: "#a1a1aa",
            marginTop: 0,
            fontSize: "0.8rem",
            textTransform: "uppercase",
          }}
        >
          Category Breakdown
        </h4>

        {sortedCategories.length === 0 ? (
          <p
            style={{
              color: "#52525b",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            No data yet
          </p>
        ) : (
          sortedCategories.map(([category, amount]) => {
            // Calculate width percentage (Avoid dividing by zero)
            const percentage =
              totalAmount > 0 ? (amount / totalAmount) * 100 : 0;

            return (
              <div key={category} style={{ marginBottom: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.4rem",
                    fontSize: "0.9rem",
                  }}
                >
                  <span>{category}</span>
                  <span>₹ {amount.toFixed(2)}</span>
                </div>
                {/* The Grey Bar Background */}
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    background: "#27272a",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  {/* The Blue Progress Bar */}
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: "100%",
                      background: "#3b82f6",
                      transition: "width 0.5s ease-in-out", // Smooth animation
                    }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ExpenseSummary;
