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

export const RealizationTable = ({
  filter,
  setFilter,
  es1Data,
  selectOpen,
  setSelectOpen,
  userData,
  setIsOpenModal,
}) => {
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
        <div className="flex">
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
            options={es1Data.map((q) => ({
              label: q.name,
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
            {/* <Button
              onClick={fetchTemplateDownload}
              style={{ width: "fit-content" }}
              variant="primary"
              icon={<Download size={20} />}
            >
              Download Template
            </Button> */}
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
            {/* Baris pertama */}
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
            {dataTables.map((item, index) => (
              <TableRow key={item.eselon_code}>
                {/* Kolom Eselon */}
                <TableCell
                  index={index}
                  align="left"
                  sx={{ fontWeight: "bold" }}
                >
                  {item.name}
                </TableCell>

                {/* --- Kolom Total --- */}
                <TableCell index={index} align="right">
                  {item.pagu.toLocaleString("id-ID")}
                </TableCell>
                <TableCell index={index} align="right">
                  {item.realisasi.toLocaleString("id-ID")}
                  <br />
                  <span style={{ color: "#888", fontSize: "1em" }}>
                    ({item.persen_realisasi.toFixed(2)}%)
                  </span>
                </TableCell>
                <TableCell index={index} align="right">
                  {item.sisa.toLocaleString("id-ID")}
                </TableCell>

                {/* --- Kolom Pegawai (jenis_belanja = 51) --- */}
                <TableCell index={index} align="right">
                  {item.per_jenis["51"]?.pagu?.toLocaleString("id-ID") ?? "-"}
                </TableCell>
                <TableCell index={index} align="right">
                  {item.per_jenis["51"] ? (
                    <>
                      {item.per_jenis["51"].realisasi.toLocaleString("id-ID")}
                      <br />
                      <span style={{ color: "#888", fontSize: "1em" }}>
                        ({item.per_jenis["51"].persentase_real}%)
                      </span>
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell index={index} align="right">
                  {item.per_jenis["51"]?.sisa?.toLocaleString("id-ID") ?? "-"}
                </TableCell>

                {/* --- Kolom Barang (jenis_belanja = 52) --- */}
                <TableCell index={index} align="right">
                  {item.per_jenis["52"]?.pagu?.toLocaleString("id-ID") ?? "-"}
                </TableCell>
                <TableCell index={index} align="right">
                  {item.per_jenis["52"] ? (
                    <>
                      {item.per_jenis["52"].realisasi.toLocaleString("id-ID")}
                      <br />
                      <span style={{ color: "#888", fontSize: "1em" }}>
                        ({item.per_jenis["52"].persentase_real}%)
                      </span>
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell index={index} align="right">
                  {item.per_jenis["52"]?.sisa?.toLocaleString("id-ID") ?? "-"}
                </TableCell>

                {/* --- Kolom Modal (jenis_belanja = 53) --- */}
                <TableCell index={index} align="right">
                  {item.per_jenis["53"]?.pagu?.toLocaleString("id-ID") ?? "-"}
                </TableCell>
                <TableCell index={index} align="right">
                  {item.per_jenis["53"] ? (
                    <>
                      {item.per_jenis["53"].realisasi.toLocaleString("id-ID")}
                      <br />
                      <span style={{ color: "#888", fontSize: "1em" }}>
                        ({item.per_jenis["53"].persentase_real}%)
                      </span>
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell index={index} align="right">
                  {item.per_jenis["53"]?.sisa?.toLocaleString("id-ID") ?? "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
