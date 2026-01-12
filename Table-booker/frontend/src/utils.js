// 取得日期字串 (YYYY-MM-DD)
export const getDateString = (daysToAdd) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
};

// 用法範例：
// getDateString(1) -> 會得到明天的日期 (例如: 2026-01-13)
// getDateString(2) -> 會得到後天的日期 (例如: 2026-01-14)