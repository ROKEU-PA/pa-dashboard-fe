import { apiRequest } from "@/services/APIHelper";
import { buildQueryString } from "@/services/GeneralHelper";
import moment from "moment";
import { useEffect, useState } from "react";

export const useFetchIKPAV2 = ({ level, month, year }) => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const fetchIkpa = async () => {
    try {
      setLoading(true);
      let initialYear = year ?? moment().subtract(1, "years").year();
      let initialMonth = month
        ? moment(month, "MMMM").format("MM")
        : moment().subtract(30, "days").format("MM");

      let currentDate = moment(`${initialYear}-${initialMonth}`, "YYYY-MM");
      let foundData = null;
      let det = null;
      let attempts = 0;
      const maxAttempts = 12;

      while (!foundData && attempts < maxAttempts) {
        const query = buildQueryString({
          level: level,
          year: currentDate.year(),
          month: currentDate.format("MM"),
        });

        const response = await apiRequest({
          url: `/pa/ikpa/list?${query}`,
        });

        const result = response?.data;
        const lengthList = result.list.length;
        if (response?.success && result && lengthList !== 0) {
          foundData = result.list;
          det = result;
          break;
        }
        currentDate.subtract(1, "months");
        attempts++;
      }
      if (foundData) {
        setData(foundData);
        setMeta({
          target: det.target_tahunan,
          periode: det.periode,
          lastDownload: det.last_download,
        });
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
    fetchIkpa();
  }, [level, month, year]);

  return {
    data,
    refetch: fetchIkpa,
    loading,
    meta,
  };
};
