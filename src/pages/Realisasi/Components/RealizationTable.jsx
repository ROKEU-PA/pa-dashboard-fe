import Table from "@/components/Table";
import TableHeader from "@/components/TableHeader";
import TableRow from "@/components/TableRow";
import { columns, dataTables } from "../constants";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Button from "@/components/Button";
import { TableProperties, Upload } from "lucide-react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Card from "@/components/Card";
import { toTitleCase } from "@/utils/text";
import { useRealizationTable } from "../hooks/useRealizationTable";
import { getYears, months } from "@/constants/general";

export const RealizationTable = ({
  filter,
  setFilter,
  es1Data,
  selectOpen,
  setSelectOpen,
  userData,
  setIsOpenModal,
  dataTable,
}) => {
  const {
    selectOpenMonth,
    selectOpenYear,
    setSelectOpenMonth,
    setSelectOpenYear,
  } = useRealizationTable();

  return (
    <Card
      className="min-h-[400px]"
      icon={<TableProperties size={26} color="#D5F1FF" strokeWidth={2} />}
      color="bg-[#59C7FF]"
      title="Persentase Realisasi Anggaran per Eselon 1"
      overflow=""
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: "1rem",
          justifyContent: "space-between",
        }}
      >
        <Input
          label="Search"
          style={{ width: "200px" }}
          name="Search"
          value={filter.searchKey}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              searchKey: e.target.value,
            }))
          }
        />
        <div className="flex gap-2">
          <Select
            label="Bulan"
            name="Month"
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                month: e.target.value,
              }))
            }
            value={filter.month}
            options={months?.map((q) => ({
              label: q,
              value: q,
            }))}
            style={{ width: "7.25rem" }}
            isOpen={selectOpenMonth}
            setIsOpen={setSelectOpenMonth}
          />
          <Select
            label="Tahun"
            name="year"
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                year: e.target.value ?? "",
              }))
            }
            value={filter.year}
            options={getYears()?.map((q) => ({
              label: q,
              value: q,
            }))}
            style={{ width: "7.25rem" }}
            isOpen={selectOpenYear}
            setIsOpen={setSelectOpenYear}
          />
          <Select
            label="Eselon 1"
            name="eselon_code"
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                eselonKey: e.target.value ?? "",
              }))
            }
            value={filter.eselonKey}
            options={es1Data?.map((q) => ({
              label: toTitleCase(q.name),
              value: q.eselon_code,
            }))}
            style={{ width: "20rem" }}
            isOpen={selectOpen}
            setIsOpen={setSelectOpen}
          />
          <div style={{ display: "flex", gap: 10 }}>
            {userData &&
              (userData.role === "admin" ||
                userData.role === "super_admin") && (
                <Button
                  onClick={() => setIsOpenModal(true)}
                  style={{ width: "fit-content" }}
                  variant="secondary"
                  icon={<Upload size={20} />}
                >
                  Import Data IKPA
                </Button>
              )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto max-w-full md:max-w-[90vw] lg:max-w-[83vw]">
        <Table
          className="min-w-max w-full border-collapse"
          sx={{ minWidth: 650 }}
          aria-label="simple table"
        >
          <TableHeader>
            <TableRow>
              {columns.map((col, index) =>
                col.children ? (
                  <TableCell
                    key={index}
                    align="center"
                    colSpan={col.children.length}
                  >
                    {col.label}
                  </TableCell>
                ) : (
                  <TableCell
                    key={index}
                    align="center"
                    rowSpan={col.rowSpan || 1}
                  >
                    {col.label}
                  </TableCell>
                ),
              )}
            </TableRow>

            {/* Baris kedua */}
            <TableRow>
              {columns.map((col) =>
                col.children
                  ? col.children.map((child, idx) => (
                      <TableCell key={child.key || idx} align="center">
                        {child.label}
                      </TableCell>
                    ))
                  : null,
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {dataTable &&
              dataTable.length > 0 &&
              dataTable.map((item, index) => (
                <TableRow key={item.eselon_code}>
                  <TableCell
                    className="w-fit"
                    index={index}
                    align="left"
                    sx={{ fontWeight: "bold" }}
                  >
                    {item.name}
                  </TableCell>
                  <StyledTableCell
                    className="w-fit"
                    index={index}
                    align="right"
                  >
                    Rp. {item.pagu.toLocaleString("id-ID")}
                  </StyledTableCell>
                  <StyledTableCell
                    className="w-fit"
                    index={index}
                    align="right"
                  >
                    Rp. {item.realisasi.toLocaleString("id-ID")}
                    <br />
                    <span style={{ color: "#888", fontSize: "1em" }}>
                      ({item.persen_realisasi.toFixed(2)}%)
                    </span>
                  </StyledTableCell>
                  <StyledTableCell
                    className="w-fit"
                    index={index}
                    align="right"
                  >
                    Rp. {item.sisa.toLocaleString("id-ID")}
                  </StyledTableCell>
                  <StyledTableCell
                    className="w-fit"
                    index={index}
                    align="right"
                  >
                    Rp.{" "}
                    {item.per_jenis["51"]?.pagu?.toLocaleString("id-ID") ?? "-"}
                  </StyledTableCell>
                  <StyledTableCell
                    className="w-fit"
                    index={index}
                    align="right"
                  >
                    {item.per_jenis["51"] ? (
                      <>
                        Rp.{" "}
                        {item.per_jenis["51"].realisasi.toLocaleString("id-ID")}
                        <br />
                        <span style={{ color: "#888", fontSize: "1em" }}>
                          ({item.per_jenis["51"].persentase_real}%)
                        </span>
                      </>
                    ) : (
                      "-"
                    )}
                  </StyledTableCell>
                  <StyledTableCell
                    className="w-fit"
                    index={index}
                    align="right"
                  >
                    Rp.{" "}
                    {item.per_jenis["51"]?.sisa?.toLocaleString("id-ID") ?? "-"}
                  </StyledTableCell>
                  <StyledTableCell
                    className="w-fit"
                    index={index}
                    align="right"
                  >
                    Rp.{" "}
                    {item.per_jenis["52"]?.pagu?.toLocaleString("id-ID") ?? "-"}
                  </StyledTableCell>
                  <StyledTableCell
                    className="w-fit"
                    index={index}
                    align="right"
                  >
                    {item.per_jenis["52"] ? (
                      <>
                        Rp.{" "}
                        {item.per_jenis["52"].realisasi.toLocaleString("id-ID")}
                        <br />
                        <span style={{ color: "#888", fontSize: "1em" }}>
                          ({item.per_jenis["52"].persentase_real}%)
                        </span>
                      </>
                    ) : (
                      "-"
                    )}
                  </StyledTableCell>
                  <StyledTableCell
                    className="w-fit"
                    index={index}
                    align="right"
                  >
                    Rp.{" "}
                    {item.per_jenis["52"]?.sisa?.toLocaleString("id-ID") ?? "-"}
                  </StyledTableCell>
                  <StyledTableCell
                    className="w-fit"
                    index={index}
                    align="right"
                  >
                    Rp.{" "}
                    {item.per_jenis["53"]?.pagu?.toLocaleString("id-ID") ?? "-"}
                  </StyledTableCell>
                  <StyledTableCell
                    className="w-fit"
                    index={index}
                    align="right"
                  >
                    {item.per_jenis["53"] ? (
                      <>
                        Rp.{" "}
                        {item.per_jenis["53"].realisasi.toLocaleString("id-ID")}
                        <br />
                        <span style={{ color: "#888", fontSize: "1em" }}>
                          ({item.per_jenis["53"].persentase_real}%)
                        </span>
                      </>
                    ) : (
                      "-"
                    )}
                  </StyledTableCell>
                  <StyledTableCell
                    className="w-fit"
                    index={index}
                    align="right"
                  >
                    Rp.{" "}
                    {item.per_jenis["53"]?.sisa?.toLocaleString("id-ID") ?? "-"}
                  </StyledTableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

const StyledTableCell = ({ children, className = "", ...props }) => {
  return (
    <TableCell
      {...props}
      className={`
         truncate
        ${className}
      `}
    >
      {children}
    </TableCell>
  );
};
