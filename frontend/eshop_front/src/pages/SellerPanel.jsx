import SideProfile from '../components/SideProfile/SideProfile';

function SellerPanel() {
  return (
    <div className="products-container" style={{ display: 'flex', gap: '20px' }}>
      <SideProfile />
      <div className="products-list">
        {/* Ürün listesi burada */}
        <h2>Satıcı</h2>
      </div>
    </div>
  );
}

export default SellerPanel;
