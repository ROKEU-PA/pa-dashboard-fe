import React, { useContext, useEffect, useState } from "react";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";
import Card from "@/components/Card";
import { Database } from "lucide-react";
import DonutChart from "./DonutChart";
import BarChart from "./BarChart";
import moment from "moment";
import { formatCurrency, formatNumber } from "@/services/GeneralHelper";
import User from "@/components/User";
import { AssetConditions, dataTable } from "./constants";
import { TableStateProperty } from "./Table";
import { apiRequest } from "@/services/APIHelper";
import { AppContext } from "@/contexts/AppContext";

function StateProperty() {
  const dataset = [
    { name: "Completed", value: 320 },
    { name: "In Progress", value: 180 },
    { name: "Blocked", value: 60 },
    { name: "Backlog", value: 140 },
  ];
  const { userData } = useContext(AppContext);
  const [assetEs1, setAssetEs1] = useState({ columns: [], data: [] });
  const [pspEs1, setPspEs1] = useState({
    columns: [
      {
        label: "Eselon 1",
        style: "bg-[#2E70FD] rounded p-2 text-white",
      },
      {
        label: "Sudah PSP",
      },
      {
        label: "Belum PSP",
      },
      {
        label: "Total",
        style: "bg-[#FF0000] rounded p-2 text-white",
      },
    ],
    data: [
      {
        eselon_code: "02601",
        asset_value: 16184055648805,
        updated_at: "2025-09-04T12:56:59.000000Z",
        updated_by: {
          user_id: "68333017010677a4b20435ac",
          name: "Rokeu BMN Admin",
        },
        id: "68b989ee5d54095fa7e57118",
        name: "Sekretariat Jenderal",
        baik: 23378,
        rusakRingan: 9,
        total: 28328,
      },
      {
        eselon_code: "02602",
        asset_value: 0,
        updated_at: "2025-09-04T12:56:59.000000Z",
        updated_by: {
          user_id: "68333017010677a4b20435ac",
          name: "Rokeu BMN Admin",
        },
        id: "68b989ee5d54095fa7e5711a",
        name: "Inspektorat Jenderal",
        baik: 1257,
        rusakRingan: 32,
        total: 1289,
      },
      {
        eselon_code: "02604",
        asset_value: 0,
        updated_at: "2025-09-04T12:56:59.000000Z",
        updated_by: {
          user_id: "68333017010677a4b20435ac",
          name: "Rokeu BMN Admin",
        },
        id: "68b989ee5d54095fa7e5711c",
        name: "Ditjen Binapenta",
        baik: 35171,
        rusakRingan: 16,
        total: 40198,
      },
      {
        eselon_code: "02605",
        asset_value: 0,
        updated_at: "2025-09-04T12:56:59.000000Z",
        updated_by: {
          user_id: "68333017010677a4b20435ac",
          name: "Rokeu BMN Admin",
        },
        id: "68b989ee5d54095fa7e5711e",
        name: "PHI dan Jamsostek",
        baik: 3039,
        rusakRingan: 0,
        total: 10438,
      },
      {
        eselon_code: "02608",
        asset_value: 0,
        updated_at: "2025-09-04T12:56:59.000000Z",
        updated_by: {
          user_id: "68333017010677a4b20435ac",
          name: "Rokeu BMN Admin",
        },
        id: "68b989ee5d54095fa7e57120",
        name: "Binwasnaker dan K3",
        baik: 20986,
        rusakRingan: 46,
        total: 27072,
      },
      {
        eselon_code: "02611",
        asset_value: 0,
        updated_at: "2025-09-04T12:56:59.000000Z",
        updated_by: {
          user_id: "68333017010677a4b20435ac",
          name: "Rokeu BMN Admin",
        },
        id: "68b989ee5d54095fa7e57122",
        name: "Barenbang",
        baik: 2725,
        rusakRingan: 0,
        total: 2766,
      },
      {
        eselon_code: "02613",
        asset_value: 0,
        updated_at: "2025-09-04T12:56:59.000000Z",
        updated_by: {
          user_id: "68333017010677a4b20435ac",
          name: "Rokeu BMN Admin",
        },
        id: "68b989ee5d54095fa7e57124",
        name: "Binalavotas",
        baik: 394135,
        rusakRingan: 1192,
        total: 420038,
      },
    ],
  });
  const [typeBMNEs1, settTypeBMNEs1] = useState({
    columns: [
      {
        label: "Eselon 1",
        style: "bg-[#2E70FD] rounded p-2 text-white",
      },
      {
        label: "Alat Angkutan Bermotor",
      },
      {
        label: "Alat Besar",
      },
      {
        label: "Alat Persenjataan",
      },
      {
        label: "Aset Tak Berwujud",
      },
      {
        label: "Aset Tetap Lainnya",
      },
      {
        label: "Aset Tetap Renovasi",
      },
      {
        label: "Bangunan Air",
      },
      {
        label: "Bangunan dan Gedung",
      },
      {
        label: "Instalasi dan Jaringan",
      },
      {
        label: "Jalan dan Jembatan",
      },
      {
        label: "KDP",
      },
      {
        label: "Mesin Peralatan Khusus TIK",
      },
      {
        label: "Mesin Peralatan Non TIK",
      },
      {
        label: "Rumah Negara",
      },
      {
        label: "Tanah",
      },
    ],
    data: [
      {
        eselon_code: "02601",
        asset_value: 16184055648805,
        updated_at: "2025-09-04T12:56:59.000000Z",
        updated_by: {
          user_id: "68333017010677a4b20435ac",
          name: "Rokeu BMN Admin",
        },
        id: "68b989ee5d54095fa7e57118",
        name: "Sekretariat Jenderal",
        baik: 23378,
        rusakRingan: 9,
        total: 28328,
      },
      {
        eselon_code: "02602",
        asset_value: 0,
        updated_at: "2025-09-04T12:56:59.000000Z",
        updated_by: {
          user_id: "68333017010677a4b20435ac",
          name: "Rokeu BMN Admin",
        },
        id: "68b989ee5d54095fa7e5711a",
        name: "Inspektorat Jenderal",
        baik: 1257,
        rusakRingan: 32,
        total: 1289,
      },
      {
        eselon_code: "02604",
        asset_value: 0,
        updated_at: "2025-09-04T12:56:59.000000Z",
        updated_by: {
          user_id: "68333017010677a4b20435ac",
          name: "Rokeu BMN Admin",
        },
        id: "68b989ee5d54095fa7e5711c",
        name: "Ditjen Binapenta",
        baik: 35171,
        rusakRingan: 16,
        total: 40198,
      },
      {
        eselon_code: "02605",
        asset_value: 0,
        updated_at: "2025-09-04T12:56:59.000000Z",
        updated_by: {
          user_id: "68333017010677a4b20435ac",
          name: "Rokeu BMN Admin",
        },
        id: "68b989ee5d54095fa7e5711e",
        name: "PHI dan Jamsostek",
        baik: 3039,
        rusakRingan: 0,
        total: 10438,
      },
      {
        eselon_code: "02608",
        asset_value: 0,
        updated_at: "2025-09-04T12:56:59.000000Z",
        updated_by: {
          user_id: "68333017010677a4b20435ac",
          name: "Rokeu BMN Admin",
        },
        id: "68b989ee5d54095fa7e57120",
        name: "Binwasnaker dan K3",
        baik: 20986,
        rusakRingan: 46,
        total: 27072,
      },
      {
        eselon_code: "02611",
        asset_value: 0,
        updated_at: "2025-09-04T12:56:59.000000Z",
        updated_by: {
          user_id: "68333017010677a4b20435ac",
          name: "Rokeu BMN Admin",
        },
        id: "68b989ee5d54095fa7e57122",
        name: "Barenbang",
        baik: 2725,
        rusakRingan: 0,
        total: 2766,
      },
      {
        eselon_code: "02613",
        asset_value: 0,
        updated_at: "2025-09-04T12:56:59.000000Z",
        updated_by: {
          user_id: "68333017010677a4b20435ac",
          name: "Rokeu BMN Admin",
        },
        id: "68b989ee5d54095fa7e57124",
        name: "Binalavotas",
        baik: 394135,
        rusakRingan: 1192,
        total: 420038,
      },
    ],
  });
  const [statusPsp, setStatusPsp] = useState([
    {
      title: "Total Aset",
      value: 530129,
      containerStyle:
        "bg-blue-400 rounded px-2 w-[60%] text-white text-center items-center",
    },
    {
      title: "Sudah PSP",
      value: 336300,
    },
    {
      title: "Belum PSP",
      value: 193826,
    },
  ]);
  const [valStatusPsp, setValStatusPsp] = useState([
    {
      title: "Sudah PSP",
      value: 12849958013451,
    },
    {
      title: "Belum PSP",
      value: 3334097635354,
    },
  ]);
  const [progHibah, setProgHibah] = useState([
    {
      title: "Total SK Hibah",
      value: 12849958013451,
    },
    {
      title: "Belum Persetujuan",
      value: 3334097635354,
    },
    {
      title: "Batal Hibah",
      value: 3334097635354,
    },
  ]);
  const [condAsset, setCondAsset] = useState([]);
  const [valCondAsset, setValCondAsset] = useState([
    {
      title: "Kondisi Baik",
      value: 15831069013295,
    },
    {
      title: "Rusak Ringan",
      value: 44324520161,
    },
    {
      title: "Rusak Berat",
      value: 311936315249,
    },
  ]);
  const [months, setMonth] = useState([]);
  const [values, setValues] = useState([]);
  const [selectOpen, setSelectOpen] = useState(false);
  const [year, setYear] = useState("2025");

  const assetData = async () => {
    try {
      const data = await apiRequest({
        url: `/api/bmn/asset`,
      });
      const list = data?.data;

      const mapped = list.map((item, index) => {
        const constantItem = dataTable?.data?.[index];

        return {
          ...item,
          name: constantItem?.name || item.name,
        };
      });

      setAssetEs1({
        columns: dataTable.columns,
        data: mapped,
      });

      setCondAsset(data?.asset_condition);
    } catch (error) {
      console.error(error);
    }
  };

  const pnbpGraph = async () => {
    try {
      const data = await apiRequest({
        url: `/api/bmn/pnbp?tahun=` + year,
      });
      setMonth(
        data?.data?.years.length === 0
          ? [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ]
          : data?.data?.years
      );
      setValues(
        data?.data?.values.length === 0
          ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
          : data?.data?.values.map((v) => Number(v))
      );
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    assetData();
    pnbpGraph();
  }, [year]);
  console.log(assetEs1);
  return (
    <div>
      <div className="flex justify-between">
        <Breadcrumbs
          items={[
            { name: "Barang Milik Negara", path: "/barang-milik-negara" },
          ]}
        />
        <User name={"Mas Febri"} previlege={"Administrator"} />
      </div>
      <Title>Dashboard Barang Milik Negara</Title>
      <div className="grid grid-cols-[50%_50%] gap-4 mr-4 mb-4">
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold color-[#B7B7B7]">
              Status Penetapan Status Penggunaan
            </span>
          </div>
          <div className="grid grid-cols-[40%_60%] gap-2">
            <DonutChart
              data={dataset}
              height="h-72"
              good={statusPsp[1]?.value ?? 0}
              mid={statusPsp[2]?.value ?? 0}
            />
            <div className="flex flex-col gap-2 ml-4 mt-10">
              {statusPsp
                .filter((item) => item.title === "Total Aset")
                .map((item) => (
                  <div
                    key={item.title}
                    className={`${item.style} flex flex-col`}
                  >
                    <div
                      className={`flex gap-2 items-center font-bold ${item.containerStyle}`}
                    >
                      <span
                        style={{
                          color:
                            item.title?.toLowerCase() === "total aset"
                              ? "#FFFFFF"
                              : "#bcbcbcff",
                        }}
                      >
                        {item.title}
                      </span>
                    </div>
                    <span className="text-3xl font-semibold">
                      {formatNumber(item.value)}
                    </span>
                  </div>
                ))}
              <br></br>
              <div className="grid grid-cols-2 gap-2">
                {statusPsp
                  .filter(
                    (item) =>
                      item.title === "Sudah PSP" || item.title === "Belum PSP"
                  )
                  .map((item) => (
                    <div
                      key={item.title}
                      className={`${item.style} flex flex-col`}
                    >
                      <div
                        className={`flex gap-2 items-center font-bold ${item.containerStyle}`}
                      >
                        <span
                          style={{
                            color: "#bcbcbcff",
                          }}
                        >
                          {item.title}
                        </span>
                      </div>
                      <span className="text-3xl font-semibold">
                        {formatNumber(item.value)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Card>
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold color-[#B7B7B7]">
              Nilai BMN Berdasarkan Status PSP
            </span>
          </div>
          <div className="grid grid-cols-[60%_40%] gap-2">
            <div className="grid grid-cols-1 ml-5 mt-10">
              {valStatusPsp.map((item) => (
                <div key="info" className={`${item.style} flex flex-col`}>
                  <div
                    className={`flex gap-2 items-center font-bold ${item.containerStyle}`}
                  >
                    <span className="text" style={{ color: "#bcbcbcff" }}>
                      {item.title}
                    </span>
                  </div>
                  <span className={`text-3xl font-semibold`}>
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 ml-4">
              <DonutChart
                data={dataset}
                height="h-72"
                good={valStatusPsp[0]?.value ?? 0}
                mid={valStatusPsp[1]?.value ?? 0}
              />
            </div>
          </div>
        </Card>
        <Card className="flex flex-col col-span-2">
          <span className="text-xl font-bold color-[#B7B7B7] mb-4">
            Rincian Status PSP per Eselon 1
          </span>
          <TableStateProperty dataTable={pspEs1} />
        </Card>
      </div>
      <div className="grid grid-cols-[50%_50%] gap-4 mr-4 mb-4">
        {/* <Card className="">
          <div className="grid grid-cols-[90%_10%] items-center mb-4">
            <span className="font-bold text-xl">
              PNBP yang Berkaitan dengan Aset
            </span>
            <Select
              isOpen={selectOpen}
              setIsOpen={setSelectOpen}
              placeholder=""
              innerHeight="3rem"
              name="year"
              onChange={(e) => setYear(e.target.value)}
              value={year}
              options={[
                { label: "2025", value: "2025" },
                { label: "2024", value: "2024" },
                { label: "2023", value: "2023" },
              ]}
            />
          </div>
          <div className="items-center">
            <BarChart
              data={dataset}
              height="h-72"
              years={months}
              values={values}
            />
          </div>
        </Card> */}
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold color-[#B7B7B7]">
              Kondisi Aset
            </span>
          </div>
          <div className="grid grid-cols-[40%_60%] gap-2">
            <DonutChart
              data={dataset}
              height="h-72"
              good={condAsset[1]?.value ?? 0}
              mid={condAsset[2]?.value ?? 0}
              damage={condAsset[3]?.value ?? 0}
            />
            <div className="grid grid-cols-2 ">
              {condAsset.map((item) => (
                <div key="info" className={`${item.style} flex flex-col`}>
                  <div
                    className={`flex gap-2 items-center font-bold ${item.containerStyle}`}
                  >
                    <span
                      className="text"
                      style={{
                        color:
                          item.title?.toLowerCase() === "total aset"
                            ? "#FFFFFF"
                            : "#bcbcbcff",
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <span className={`text-3xl font-semibold`}>
                    {item.title === "Nilai Aset"
                      ? formatCurrency(item.value)
                      : formatNumber(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold color-[#B7B7B7]">
              Nilai Aset Berdasarkan Kondisi
            </span>
          </div>
          <div className="grid grid-cols-[60%_40%] gap-2">
            <div className="grid grid-cols-1 ml-5">
              {valCondAsset.map((item) => (
                <div key="info" className={`${item.style} flex flex-col`}>
                  <div
                    className={`flex gap-2 items-center font-bold ${item.containerStyle}`}
                  >
                    <span className="text" style={{ color: "#bcbcbcff" }}>
                      {item.title}
                    </span>
                  </div>
                  <span className={`text-3xl font-semibold`}>
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 ml-4">
              <DonutChart
                data={dataset}
                height="h-72"
                good={valCondAsset[0]?.value ?? 0}
                mid={valCondAsset[1]?.value ?? 0}
                damage={valCondAsset[2]?.value ?? 0}
              />
            </div>
          </div>
        </Card>
        <Card className="flex flex-col col-span-2">
          <span className="text-xl font-bold color-[#B7B7B7] mb-4">
            Rincian Kondisi Aset per Eselon 1
          </span>
          <TableStateProperty dataTable={assetEs1} />
        </Card>
        <Card className="flex flex-col col-span-2">
          <span className="text-xl font-bold color-[#B7B7B7] mb-4">
            Jumlah Jenis BMN per Eselon I
          </span>
          <TableStateProperty dataTable={typeBMNEs1} />
        </Card>
      </div>
      <div className="grid grid-cols-[50%_50%] gap-4 mr-4">
        <Card className="">
          <div className="grid grid-cols-[90%_10%] items-center mb-4">
            <span className="font-bold text-xl">Total Nilai Hibah 526</span>
          </div>
          <div className="items-center">
            <BarChart
              data={dataset}
              height="h-72"
              years={months}
              values={values}
            />
          </div>
        </Card>
        <Card className="">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold color-[#B7B7B7]">
              Progress Hibah 526
            </span>
          </div>
          <div className="grid grid-cols-[40%_60%] gap-2">
            <div className="grid grid-cols-1">
              <DonutChart
                data={dataset}
                height="h-72"
                good={progHibah[0]?.value ?? 0}
                mid={progHibah[1]?.value ?? 0}
              />
            </div>
            <div className="grid grid-cols-1 ml-5 mt-10">
              {progHibah.map((item) => (
                <div key="info" className={`${item.style} flex flex-col`}>
                  <div
                    className={`flex gap-2 items-center font-bold ${item.containerStyle}`}
                  >
                    <span className="text" style={{ color: "#bcbcbcff" }}>
                      {item.title}
                    </span>
                  </div>
                  <span className={`text-3xl font-semibold`}>
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default StateProperty;
