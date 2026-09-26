const NAV_ITEMS = ["Trang chủ", "Lịch sử", "Quản trị", "Liên hệ"];

// Menu giả cho mục đích demo giao diện — không gắn logic điều hướng thật
export default function NavBar() {
  return (
    <div className="sticky top-0 z-30 flex h-12 items-center gap-6 border-b border-line bg-surface px-6">
      <span className="text-[15px] font-bold text-primary">Luyện viết tiếng Việt</span>
      <nav className="flex items-center gap-5">
        {NAV_ITEMS.map((item, index) => (
          <span
            key={item}
            className={`text-[13px] font-medium ${index === 0 ? "text-ink" : "text-neutral"}`}
          >
            {item}
          </span>
        ))}
      </nav>
    </div>
  );
}
