const DashboardSection = ({ title, children }) => (
  <div className="mt-8">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      {title}
    </h2>
    {children}
  </div>
);

export default DashboardSection;
