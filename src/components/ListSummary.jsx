function ListSummary({ total, completed, remaining }) {
  return (
    <div className="list-summary">
      <div>
        <strong>{total}</strong>
        <span>Total</span>
      </div>

      <div>
        <strong>{completed}</strong>
        <span>Completed</span>
      </div>

      <div>
        <strong>{remaining}</strong>
        <span>Remaining</span>
      </div>
    </div>
  );
}

export default ListSummary;
