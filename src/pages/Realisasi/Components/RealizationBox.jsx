import { Wallet } from "lucide-react";

export const RealizationBox = ({
  border,
  title,
  value,
  delta,
  bgIcon,
  main = false,
  deltaClassName,
}) => {
  return (
    <div
      className={`${border} rounded-lg p-2 flex m-1 shadow-sm justify-between ${main && "!min-h-[70px]"}`}
    >
      {main && (
        <div className={`${bgIcon} rounded-full p-4`}>
          <Wallet color={"#ffffff"} />
        </div>
      )}
      <span className="font-semibold text-lg flex items-center content-center">
        {title}
      </span>
      <div
        className={`flex text-end ${main ? "flex-col" : "gap-2"} items-end place-content-center`}
      >
        <span className="font-medium text-lg">{value}</span>
        {delta && (
          <span
            className={` text-base ${deltaClassName} w-fit px-2 rounded-lg`}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
};
