import Paper from "@/components/Paper";
import Table from "@/components/Table";
import { TableBody } from "@/components/TableBody";
import TableCell from "@/components/TableCell";
import TableHeader from "@/components/TableHeader";
import TableRow from "@/components/TableRow";
import TableSortLabel from "@/components/TableSortLabel";
import { useBudgetExecution } from "./useBudgetExecution";

export const TableBudgetExecution = ({ dataTable }) => {
  const { state, getIKPAColor } = useBudgetExecution("Hello");
  return (
    <Paper>
      <Table
        sx={{ minWidth: 650 }}
        style={{ fontSize: 10 }}
        aria-label="simple table"
      >
        <TableHeader>
          <TableRow>
            {dataTable.columns.map((col) => (
              <TableCell
                key={col.key}
                component="th"
                scope="col"
                align="center"
              >
                <div className={col.style}>{col.label}</div>
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataTable.data.map((item, index) => (
            <TableRow sx={{ fontWeight: "bold" }}>
              <TableCell align="center">{item.eselon}</TableCell>
              <TableCell align="center">{item.revisiDipa}</TableCell>
              <TableCell align="center">{item.deviasiHalIII}</TableCell>
              <TableCell align="center">{item.realisasiAnggaran}</TableCell>
              <TableCell align="center">{item.belanjaKontraktual}</TableCell>
              <TableCell align="center">{item.penyelesaianTagihan}</TableCell>
              <TableCell align="center">{item.pengelolaanUPTUP}</TableCell>
              <TableCell align="center">{item.dispensasiSPM}</TableCell>
              <TableCell align="center">{item.capaianOutput}</TableCell>
              <TableCell align="center">
                <div
                  className={`p-1 rounded font-semibold ${getIKPAColor(
                    item.nilaiIKPA
                  )}`}
                >
                  {item.nilaiIKPA}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};
