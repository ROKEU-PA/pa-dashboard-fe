import { apiRequest } from "@/services/APIHelper";
import { buildQueryString } from "@/services/GeneralHelper";
import moment from "moment";
import { useEffect, useState } from "react";

export const useFetchRealization = (eselonCode, searchKey, month, year) => {
  const [data, setData] = useState(null);
  const [dataCard, setDataCard] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTable = async (type) => {
    try {
      setLoading(true);
      const period = {
        year: type === "table" ? year : moment().year(),
        month:
          type === "table"
            ? moment(month, "MMMM").format("MM")
            : moment().subtract(30, "days").format("MM"),
      };

      const query = buildQueryString({
        eselon_code: eselonCode,
        search_key: searchKey,
        year: period?.year,
        month: period?.month,
      });
      const data = await apiRequest({
        url: `/pa/realization/all?${query}`,
      });
      let result = data?.data;
      if (data.success) {
        if (type === "table") {
          setData(result);
        } else {
          setDataCard(result);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTable("table");
    fetchTable("cards");
  }, [eselonCode, month, year, searchKey]);

  return {
    data,
    dataCard,
    loading,
    refetch: fetchTable,
  };
};
