const DashboardSection = ({ title, children }) => (
  <div className="mt-5">
    <h2 className="mb-2 text-base font-semibold text-gray-800">
      {title}
    </h2>
    {children}
  </div>
);

export default DashboardSection;
