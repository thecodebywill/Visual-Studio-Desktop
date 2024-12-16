import styles from "./product.module.css";

interface ProductItemProps {
  image: string;
  title: string;
  description: string;
}

const ProductItem: React.FC<ProductItemProps> = ({
  image,
  title,
  description,
}) => {
  return (
    <div className={styles.productItem}>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ProductItem;
