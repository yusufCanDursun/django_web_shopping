import SideProfile from '../components/SideProfile/SideProfile';

function Products() {
  return (
    <div className="products-container">
      <SideProfile />
      <div className="products-list">
        {/* Ürün listesi burada */}
        <h2>Ürünler</h2>
      </div>
    </div>
  );
}

export default Products;
