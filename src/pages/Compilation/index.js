import React, { useContext, useEffect, useState } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TablePagination from "@/components/TablePagination";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Breadcrumbs from "@/components/Breadcrumbs";
import Modal from "@/components/Modal";
import themeColors from "@/constants/color";
import Input from "@/components/Input";
import Select from "@/components/Select";
import DatePickerInput from "@/components/DatePickerInput";
import TableSortLabel from "@/components/TableSortLabel";
import { buildQueryString, validationSchema } from "@/services/GeneralHelper";
import moment from "moment";
import { apiRequest } from "@/services/APIHelper";
import { AppContext } from "@/contexts/AppContext";

const columns = [
  { key: "biro_code", label: "Satker/Unit" },
  { key: "spp_number", label: "No. SPP" },
  { key: "type", label: "Jenis SPP", sortable: true },
  { key: "year", label: "Tahun", sortable: true },
  { key: "created_at", label: "Tanggal Pengiriman", sortable: true },
  { key: "uraian-spp", label: "Uraian SPP" },
  { key: "document", label: "Dokumen" },
  { key: "description", label: "Keterangan" },
];

function CompilationPage() {
  const { userData } = useContext(AppContext);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [dataTable, setDataTable] = useState([]);
  const [pdfToOpen, setPDFtoOpen] = useState(null);
  const [filter, setFilter] = useState({
    year: "",
    searchKey: "",
    startDate: "",
    endDate: "",
  });

  const handleSortChange = (key) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    }
  };

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

  const fetchTable = async () => {
    try {
      const query = buildQueryString({
        biro_code: userData?.biro_code,
        year: filter.year,
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
        url: `/api/archive/compilation?${query}`,
      });
      let result = data?.data;
      if (data.success) {
        setTotalPages(result?.last_page);
        setDataTable(result?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTable();
  }, [
    filter.year,
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
      <Breadcrumbs items={[{ name: "Kompilasi", path: "/compilation" }]} />
      <Title>Kompilasi</Title>
      <Paper
        elevation={3}
        // style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div
          style={{
            float: "left",
            display: "flex",
            gap: 10,
            marginBottom: "1rem",
          }}
        >
          <Input
            label="Search"
            style={{ width: "200px" }}
            name="Search"
            value={filter.searchKey}
            onChange={(e) => handleDateChange("searchKey", e.target.value)}
          />
          <Input
            label="Tahun"
            style={{ width: "200px" }}
            name="Tahun"
            value={filter.year}
            validate={validationSchema.tahun}
            onChange={(e) => handleDateChange("year", e.target.value)}
          />
          <DatePickerInput
            label="Start Date"
            selected={filter.startDate}
            onChange={(date) => handleDateChange("startDate", date)}
            selectsStart
            startDate={filter.startDate}
            endDate={filter.endDate}
          />
          <DatePickerInput
            label="End Date"
            selected={filter.endDate}
            onChange={(date) => handleDateChange("endDate", date)}
            selectsEnd
            startDate={filter.startDate}
            endDate={filter.endDate}
            minDate={filter.startDate}
          />
        </div>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  component="th"
                  scope="col"
                  align="center"
                  onClick={() => col.sortable && handleSortChange(col.key)}
                  style={{ cursor: col.sortable ? "pointer" : "default" }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortBy === col.key}
                      direction={sortDir}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataTable.map((row) => (
              <TableRow
                key={row.no}
                sx={{
                  "&:lastChild td, &:lastChild th": { borderBottom: "none" },
                }}
              >
                <TableCell align="center">{row?.["biro_code"]}</TableCell>
                <TableCell align="center">{row?.["spp_number"]}</TableCell>
                <TableCell align="center">{row?.["type"]}</TableCell>
                <TableCell align="center">{row?.["year"]}</TableCell>
                <TableCell align="center">
                  {moment(row?.["created_at"]).format("YYYY/MM/DD")}
                </TableCell>
                <TableCell align="center">{row?.["description"]}</TableCell>
                <TableCell
                  align="center"
                  onClick={() => {
                    if (typeof row.document.url === "string") {
                      setIsOpenModal(true);
                      setPDFtoOpen(row.document?.url);
                    }
                  }}
                  style={{
                    color: themeColors.primary.light,
                    cursor:
                      typeof row.document.url === "string"
                        ? "pointer"
                        : "default",
                  }}
                >
                    {row.document?.filename}
                </TableCell>
                <TableCell align="center">Revisi ke-{row.rev}</TableCell>
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
      <Modal open={isOpenModal} onClose={() => setIsOpenModal(false)} title="">
        <iframe
          src={pdfToOpen}
          style={{ width: "100%", height: "500px" }}
          title="PDF Viewer"
        />
        {/* <CustomPDFViewer pdfSource="/pdf-tester.pdf" /> */}
        {/* <CustomPDFViewer pdfSource="http://localhost:3000/pdf-tester.pdf" /> */}
        {/* <CustomPDFViewer pdfSource="https://drive.google.com/uc?export=download&id=1a3XHkey6ROiKEBxXV1sjnPeiTbRPZfyP" /> */}
      </Modal>
    </div>
  );
}

export default CompilationPage;
