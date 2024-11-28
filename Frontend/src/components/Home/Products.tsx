import React from 'react';
import ProductItem from './ProductItem';
import pesaImg from '../../assets/pesa.png';
import globalImg from '../../assets/global.png';
import transactionsImg from '../../assets/transactions.png';

const Products = () => {
  return (
    <section id="Products" className="products">
      <div className="bubbles"></div>
      <h2>Product Features</h2>
      <div className="product-list">
        <ProductItem 
          image={pesaImg}
          title="Low transaction costs"
          description="Providing low transaction costs leveraging the Celo Network."
        />
        <ProductItem 
          image={globalImg}
          title="Cross-border payments with minimal fees"
          description="Facilitating cross-border payments with minimal fees."
        />
        <ProductItem 
          image={transactionsImg}
          title="Fast transactions"
          description="Enabling fast transactions with seconds confirmation times."
        />
      </div>
    </section>
  );
};

export default Products;
