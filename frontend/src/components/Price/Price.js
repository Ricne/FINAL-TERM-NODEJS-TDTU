import React from 'react';

export default function Price({ price, locale }) {
  const formatPrice = () => {
    return new Intl.NumberFormat(locale).format(price) + ' VNĐ';
  };

  return <span>{formatPrice()}</span>;
}

Price.defaultProps = {
  locale: 'vi-VN',
};
