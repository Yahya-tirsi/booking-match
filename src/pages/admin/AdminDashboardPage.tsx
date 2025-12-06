import React from "react";

const OwnerDashboardPage: React.FC = () => {
  return (
    <div className="owner-dashboard">
      <h1>Tableau de Bord Propriétaire</h1>
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Centres Gérés</h3>
            <p>5</p>
          </div>
          <div className="stat-card">
            <h3>Réservations Today</h3>
            <p>24</p>
          </div>
          <div className="stat-card">
            <h3>Revenu Mensuel</h3>
            <p>€2,450</p>
          </div>
        </div>
        {/* Other dashboard components */}
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
