export const PTUKCard = ({ title, icon, color, value, className }) => {
  return (
    <div className={`relative rounded-xl ${color} h-full pl-2 ${className}`}>
      <div className={`rounded-xl bg-white h-full`}>
        <div className="p-4">
          <div className="flex flex-col justify-between mb-3">
            <div className={`rounded-full p-1 ${color} h-fit w-fit`}>
              {icon}
            </div>
            <span className="font-medium text-lg text-gray-800  tracking-tight">
              {title}
            </span>
            <span className="font-bold text-[1.5rem] text-gray-800  tracking-tight">
              {value}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
