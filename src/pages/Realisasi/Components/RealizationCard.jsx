export const RealizationCard = ({ title, children }) => {
  return (
    <div className={`relative rounded-xl bg-[#59C7FF] h-full pt-4`}>
      <div className={`rounded-xl bg-white h-full`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg text-gray-800 text-[15px] tracking-tight">
              {title}
            </h3>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
