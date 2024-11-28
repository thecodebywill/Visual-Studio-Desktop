import React from 'react';

interface ProductItemProps {
  image: string;
  title: string;
  description: string;
}

const ProductItem: React.FC<ProductItemProps> = ({ image, title, description }) => {
  return (
    <div className="product-item">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ProductItem;
