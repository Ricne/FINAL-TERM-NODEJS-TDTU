export function formatPrice(price, locale = 'vi-VN') {
  return new Intl.NumberFormat(locale).format(price) + ' VNĐ';
}