import React, { useContext, useEffect, useState } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";
import { apiRequest } from "@/services/APIHelper";
import { AppContext } from "@/contexts/AppContext";
import moment from "moment";
import TablePagination from "@/components/TablePagination";
import { buildQueryString } from "@/services/GeneralHelper";
import Input from "@/components/Input";
import Select from "@/components/Select";
import User from "@/components/User";

const columns = [
  { key: "kode_satker", label: "Kode Satker" },
  { key: "unit_satker", label: "Unit Kerja" },
  { key: "new", label: "Baru" },
  { key: "reject", label: "Revisi" },
  { key: "approved", label: "Telah Diuji" },
  { key: "sp2d", label: "SP2D" },
  { key: "total", label: "Total" },
  { key: "arsip", label: "Total Arsip" },
];

const columnsTT = [
  { key: "spp_number", label: "Nomor SPP" },
  { key: "jenis_spp", label: "Jenis SPP" },
  { key: "unit_satker", label: "Unit Kerja" },
  { key: "created_at", label: "Tanggal Pengiriman" },
  { key: "time_at", label: "Jam" },
  { key: "created_by", label: "Pengirim" },
  { key: "status", label: "Status" },
];

function TandaTerimaPage() {
  const { userData } = useContext(AppContext);
  const [dataTable, setDataTable] = useState([]);
  const [dataReceiptTable, setDataReceiptTable] = useState([]);
  const [filter, setFilter] = useState({
    tahun: "",
    kode_satker: "",
    searchKey: "",
    startDate: null,
    endDate: null,
  });
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectOpen, setSelectOpen] = useState(false);
  const [units, setUnits] = useState([]);

  const handleDateChange = (key, value) => {
    setFilter((prev) => {
      const newFilter = { ...prev, [key]: value };
      if (
        key === "startDate" &&
        newFilter.endDate &&
        value > newFilter.endDate
      ) {
        newFilter.endDate = null;
      }

      return newFilter;
    });
  };

  const fetchCount = async () => {
    try {
      const data = await apiRequest({ url: `/api/archive/summary/status` });
      let result = data.data;
      if (data.success) {
        setDataTable(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReceipt = async () => {
    try {
      const isUser = userData?.role === "user";
      const query = buildQueryString({
        biro_code: isUser ? userData.biro_code : filter.kode_satker,
        search_key: filter.searchKey,
        page: page + 1,
        per_page: rowsPerPage,
        sort_by: sortBy,
        sort_dir: sortDir,
        start_date: filter.startDate
          ? moment(filter.startDate).format("YYYY-MM-DD").toString()
          : "",
        end_date: filter.endDate
          ? moment(filter.endDate).format("YYYY-MM-DD").toString()
          : "",
      });
      const data = await apiRequest({
        url: `/api/archive/summary/receipt?${query}`,
      });
      let result = data.data;
      if (data.success) {
        setDataReceiptTable(result?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCount();
    fetchReceipt();
  }, [
    filter.kode_satker,
    filter.searchKey,
    page + 1,
    rowsPerPage,
    sortBy,
    sortDir,
    filter.startDate,
    filter.endDate,
  ]);

  return (
    <div>
      <div className="flex justify-between">
        <Breadcrumbs items={[{ name: "Status", path: "/status" }]} />
        <User name={userData?.name} previlege={userData?.role.toUpperCase()} />
      </div>
      <Title>Tanda Terima SPP</Title>
      <Paper
        elevation={3}
        // style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <h3>Tanda Terima</h3>
        <br></br>
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: "1rem",
            justifyContent: "left",
          }}
        >
          <Input
            label="Search"
            style={{ width: "200px" }}
            name="Search"
            value={filter.searchKey}
            onChange={(e) => handleDateChange("searchKey", e.target.value)}
          />
          <Select
            label="Unit Kerja"
            name="kode_satker"
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                kode_satker: e.target.value,
              }))
            }
            value={
              userData?.role === "user"
                ? userData?.biro_code
                : filter.kode_satker
            }
            options={
              userData?.role === "user"
                ? dataTable
                    .filter((q) => q.kode_satker === userData.biro_code)
                    .map((q) => ({
                      label: q.unit_satker,
                      value: q.kode_satker,
                    }))
                : dataTable.map((q) => ({
                    label: q.unit_satker,
                    value: q.kode_satker,
                  }))
            }
            style={{ width: "400px" }}
            isOpen={selectOpen}
            setIsOpen={setSelectOpen}
            disabled={userData.role === "user"}
          />
        </div>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHeader>
            <TableRow>
              {columnsTT.map((col) => (
                <TableCell
                  key={col.key}
                  component="th"
                  scope="col"
                  align="center"
                  style={{ cursor: col.sortable ? "pointer" : "default" }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataReceiptTable.map((row, index) => (
              <TableRow key={index}>
                {columnsTT.map((col) => {
                  if (col.key === "status") {
                    return (
                      <TableCell key={col.key} align="center">
                        {row?.[col.key] === "approved"
                          ? "Telah Diuji"
                          : row?.[col.key] === "reject"
                          ? "Ditolak"
                          : row?.[col.key] === "sp2d"
                          ? "SP2D"
                          : "Baru"}
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={col.key} align="center">
                      {row[col.key] ?? "-"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(value) => {
            setRowsPerPage(value);
            setPage(0); // reset to first page when rows per page changes
          }}
        />
      </Paper>
      <br></br>
      <Paper
        elevation={3}
        // style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <h3>Status SPP Unit Kerja</h3>
        <br></br>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  component="th"
                  scope="col"
                  align="center"
                  style={{ cursor: col.sortable ? "pointer" : "default" }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {(userData?.role === "user"
              ? dataTable.filter(
                  (row) => row.kode_satker === userData.biro_code
                )
              : dataTable
            ).map((row, index) => (
              <TableRow key={index}>
                {columns.map((col) => {
                  if (col.key === "unit_satker") {
                    return (
                      <TableCell key={col.key} align="left">
                        {row?.["unit_satker"]}
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={col.key} align="center">
                      {row[col.key] ?? "-"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default TandaTerimaPage;
