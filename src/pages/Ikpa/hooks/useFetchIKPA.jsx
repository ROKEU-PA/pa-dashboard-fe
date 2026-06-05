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
      let initialYear = year ?? moment().subtract(1, "years").year();
      let initialMonth = month
        ? moment(month, "MMMM").format("MM")
        : moment().subtract(30, "days").format("MM");

      let currentDate = moment(`${initialYear}-${initialMonth}`, "YYYY-MM");
      let foundData = null;
      let attempts = 0;
      const maxAttempts = 12;

      while (!foundData && attempts < maxAttempts) {
        const query = buildQueryString({
          eselon_code: eselonCode,
          search_key: searchKey,
          year: currentDate.year(),
          month: currentDate.format("MM"),
          ikpas: true,
        });

        const response = await apiRequest({
          url: `/pa/ikpa/all?${query}`,
        });

        const result = response?.data;
        if (response?.success && result && result.length !== 0) {
          foundData = result;
          break;
        }
        currentDate.subtract(1, "months");
        attempts++;
      }
      if (foundData) {
        setData(foundData);
      } else {
        console.log(
          "Data tidak ditemukan setelah mengecek beberapa bulan sebelumnya.",
        );
        setData([]);
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
    refetchIkpas: fetchTable,
    loading,
  };
};
