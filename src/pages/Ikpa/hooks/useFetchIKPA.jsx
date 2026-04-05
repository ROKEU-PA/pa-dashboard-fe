import { apiRequest } from "@/services/APIHelper";
import { buildQueryString } from "@/services/GeneralHelper";
import moment from "moment";
import { useState } from "react";

export const useFetchIKPA = ({ eselonCode, searchKey }) => {
  const [data, setData] = useState(null);

  const fetchTable = async () => {
    try {
      const query = buildQueryString({
        eselon_code: eselonCode,
        search_key: searchKey,
        year: moment().subtract(1, "years").year(),
        month: moment().subtract(30, "days").format("M"),
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
    }
  };

  return {
    data,
    refetch: fetchTable,
  };
};
