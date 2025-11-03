import Paper from "@/components/Paper";
import Table from "@/components/Table";
import { TableBody } from "@/components/TableBody";
import TableCell from "@/components/TableCell";
import TableHeader from "@/components/TableHeader";
import TableRow from "@/components/TableRow";
import { formatNumber } from "@/services/GeneralHelper";

export const TableStateProperty = ({ dataTable }) => {
  return (
    <Paper>
      <div className="overflow-x-auto max-w-full md:max-w-[90vw] lg:max-w-[83vw]">
        <Table
          className="min-w-max w-full border-collapse"
          sx={{ minWidth: 650 }}
          style={{ fontSize: 10 }}
          aria-label="simple table"
        >
          <TableHeader>
            <TableRow>
              {dataTable.columns.map((col, index) => (
                <TableCell
                  key={index}
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
              <TableRow key={index} sx={{ fontWeight: "bold" }}>
                <TableCell align="center">{item.name}</TableCell>
                <TableCell align="center">{formatNumber(item.baik)}</TableCell>
                <TableCell align="center">
                  {formatNumber(item.rusakRingan)}
                </TableCell>
                {item.rusakBerat !== undefined && (
                  <TableCell align="center">
                    {formatNumber(item.rusakBerat)}
                  </TableCell>
                )}
                <TableCell align="center">{formatNumber(item.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
};
