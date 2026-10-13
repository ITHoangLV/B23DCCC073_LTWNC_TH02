export function Spinner() {
  return (
    <div className="loading-state" role="status" aria-label="Đang tải">
      <div className="loading-spinner" />
      <span>Đang tải...</span>
    </div>
  );
}
