import { apiRequest } from "@/services/APIHelper";
import { buildQueryString } from "@/services/GeneralHelper";
import { useEffect, useState } from "react";

export const useFetchBMN = () => {
  const [dataAsset, setDataAsset] = useState(null);
  const [dataGrant, setDataGrant] = useState(null);
  const [dataType, setDataType] = useState(null);

  const fetchAsset = async () => {
    try {
      const query = buildQueryString({
        psp: false,
      });
      const data = await apiRequest({
        url: `/bmn/asset?${query}`,
      });
      let result = data?.asset_condition;
      if (data.success) {
        setDataAsset(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGrant = async () => {
    try {
      const data = await apiRequest({
        url: `/bmn/grant`,
      });
      let result = data?.data;
      if (data.success) {
        setDataGrant(result);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchType = async () => {
    try {
      const data = await apiRequest({
        url: `/bmn/type`,
      });
      let result = data?.data;
      if (data.success) {
        setDataType(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAsset();
    fetchGrant();
    fetchType();
  }, []);

  return {
    dataAsset,
    dataGrant,
    dataType,
    refetchAsset: fetchAsset,
    refetchGrant: fetchGrant,
    refetchType: fetchAsset,
  };
};
