import { apiRequest } from "@/services/APIHelper";
import { buildQueryString } from "@/services/GeneralHelper";
import moment from "moment";
import { useEffect, useState } from "react";

export const useFetchIKPA = ({ eselonCode, searchKey, month, year }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchTable = async () => {
    try {
      setLoading(true);
      const query = buildQueryString({
        eselon_code: eselonCode,
        search_key: searchKey,
        year: year ?? moment().subtract(1, "years").year(),
        month:
          moment(month, "MMMM").format("MM") ??
          moment().subtract(30, "days").format("M"),
        ikpas: true,
      });
      const data = await apiRequest({
        url: `/pa/ikpa/all?${query}`,
      });
      let result = data?.data;
      if (data.success) {
        setData(result);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTable();
  }, [eselonCode, month, year, searchKey]);

  return {
    data,
    refetch: fetchTable,
    loading,
  };
};
