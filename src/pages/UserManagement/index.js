/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TablePagination from "@/components/TablePagination";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Title from "@/components/Title";
import Paper from "@/components/Paper";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Input from "@/components/Input";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Plus, Settings, Trash2, UserRoundSearch } from "lucide-react";
import { cryptoEncrypter, validationSchema } from "@/services/GeneralHelper";
import { toast } from "react-toastify";
import Chip from "@/components/Chip";
import Dialog from "@/components/Dialog";
import { apiRequest } from "@/services/APIHelper";
import { fetchHelperGET } from "@/services/FetchHelper";

const columns = [
  { key: "biro-code", label: "Kode Biro" },
  { key: "biro-name", label: "Nama Biro" },
  { key: "privilege", label: "Tipe Akses" },
  { key: "action", label: "Action" },
];

const mapTableData = (data) => {
  let arr = [];
  data.forEach((item, i) => {
    arr.push({
      ...item,
      id: item.id,
      "biro-code": item.biro_code,
      "biro-name": item.name,
      privilege: item.role,
    });
  });

  return arr;
};

function UserManagementPage() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [variantModal, setVariantModal] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [searchKey, setSearchKey] = useState("");
  const [tableData, setTableData] = useState();

  const [formData, setFormData] = useState({
    "biro-code": "",
    "biro-name": "",
    privilege: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target.value, name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitData = async (formData) => {
    try {
      const payload = {
        kode_biro: formData?.["biro-code"],
        role: formData.privilege,
        password: cryptoEncrypter(formData.password),
        nama: formData?.["biro-name"],
      };

      const result = await apiRequest({
        url: "/api/user/register",
        method: "POST",
        options: {
          body: payload,
        },
      });
      if (result.success) {
        toast.success("Pengguna berhasil diperbaharui!");
        setIsOpenModal(false);
        setFormData({
          "biro-code": "",
          "biro-name": "",
          privilege: "",
          password: "",
        });
      } else {
        toast.error("Gagal menambahkan pengguna. Silakan coba lagi.");
      }
    } catch (error) {
      const message = error.response?.message;
      throw new Error(message);
    }
  };

  const editData = async (formData) => {
    try {
      const payload = {
        kode_biro: formData?.["biro-code"],
        role: formData.privilege,
        nama: formData?.["biro-name"],
      };
      if (formData.password) {
        Object.assign(payload, {
          password: cryptoEncrypter(formData?.password),
        });
      }

      const result = await apiRequest({
        url: `/api/user/edit/${formData?.id}`,
        method: "POST",
        options: {
          body: payload,
        },
      });
      console.log(result);
      if (result.success) {
        toast.success("Pengguna berhasil ditambahkan!");
        setIsOpenModal(false);
        setFormData({
          "biro-code": "",
          "biro-name": "",
          privilege: "",
          password: "",
        });
      } else {
        toast.error("Gagal menambahkan pengguna. Silakan coba lagi.");
      }
    } catch (error) {
      return { hasError: true, error };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !formData["biro-code"] ||
        !formData["biro-name"] ||
        !formData.privilege
      ) {
        toast.error("Mohon lengkapi semua field yang diperlukan.");
        return;
      }

      let result =
        variantModal === "Add"
          ? await submitData(formData)
          : await editData(formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      getListUser();
      console.log("res", result);
    } catch (err) {
      console.error(err);
    }
  };

  const getListUser = async () => {
    let urlPath = `https://rokeubmn.kemnaker.go.id/api/user/list?page=${
      page + 1
    }&per_page=${rowsPerPage}`;
    if (searchKey) {
      urlPath += `&search=${searchKey}`;
    }
    try {
      const response = await fetchHelperGET(
        urlPath,
        "GET",
        localStorage.getItem("token")
      );

      if (response?.success) {
        setTableData(mapTableData(response?.data?.data));
        setTotalPage(response?.data?.last_page);
      }
    } catch (err) {
      console.error("Fetch error:", err); // Add this
      toast.error(err);
    } finally {
    }
  };

  const deleteUser = async (id) => {
    try {
      const result = await apiRequest({
        url: "/api/user/delete/" + id,
        method: "DELETE",
      });
      console.log(result);
      getListUser();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getListUser();
  }, [page, rowsPerPage, searchKey]);

  return (
    <div>
      <Breadcrumbs
        items={[{ name: "Manajemen Akun", path: "/user-management" }]}
      />
      <Title>Manajemen Akun</Title>
      <Paper
        elevation={3}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={() => {
              setIsOpenModal(true);
              setVariantModal("Add");
            }}
            style={{ width: "fit-content" }}
            variant="danger"
            icon={<Plus size={20} />}
          >
            Tambah Akun
          </Button>
          <div
            style={{
              display: "flex",
              float: "right",
            }}
          >
            <Input
              label="Search"
              style={{ width: "200px" }}
              name="Search"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
        </div>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHeader>
            <TableRow>
              {columns.map((data) => (
                <TableCell
                  component="th"
                  scope="col"
                  align="center"
                  key={data.key}
                >
                  {data.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData?.map((row) => (
              <TableRow
                key={row.no}
                sx={{
                  "&:lastChild td, &:lastChild th": { borderBottom: "none" },
                }}
              >
                <TableCell component="th" scope="row" align="center">
                  {row?.["biro-code"]}
                </TableCell>
                <TableCell align="center">{row?.["biro-name"]}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={row?.["privilege"]?.toUpperCase()}
                    style={{
                      backgroundColor:
                        row?.["privilege"] === "admin" ? "#FEDCE1" : "#E7FEE7",
                      color:
                        row?.["privilege"] === "admin" ? "#F9203E" : "#06BC09",
                    }}
                  />{" "}
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    onClick={() => {
                      setVariantModal("Detail");
                      setFormData(row);
                      setIsOpenModal(true);
                    }}
                    style={{ width: "fit-content" }}
                    variant="primary"
                    icon={<UserRoundSearch size={18} />}
                  ></Button>
                  <Button
                    onClick={() => {
                      setVariantModal("Edit");
                      setFormData(row);
                      setIsOpenModal(true);
                    }}
                    style={{ width: "fit-content" }}
                    variant="secondary"
                    icon={<Settings size={18} />}
                  ></Button>
                  <Button
                    onClick={() => {
                      setOpenDialog(true);
                      setFormData(row);
                    }}
                    style={{ width: "fit-content" }}
                    variant="danger"
                    icon={<Trash2 size={18} />}
                  ></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          page={page}
          totalPages={totalPage}
          onPageChange={setPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(e)}
        />
      </Paper>
      <Modal
        open={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        title={`Form ${variantModal} Akun`}
      >
        {console.log(formData)}
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <Input
            label="Kode Biro"
            name="biro-code"
            value={formData["biro-code"]}
            onChange={handleChange}
            validate={validationSchema.onlyNumber}
            required
            disabled={variantModal === "Detail"}
            placeholder="Masukkan Kode Biro"
          />
          <Input
            label="Name"
            name="biro-name"
            disabled={variantModal === "Detail"}
            value={formData["biro-name"]}
            onChange={handleChange}
            required
            placeholder="Masukkan Nama Biro"
          />
          {variantModal !== "Detail" && (
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData["password"]}
              onChange={handleChange}
              // validate={validationSchema.password}
              placeholder="Masukkan password"
            />
          )}
          <Select
            label="Role"
            name="privilege"
            disabled={variantModal === "Detail"}
            value={formData["privilege"]}
            onChange={handleChange}
            required
            options={[
              { label: "Admin", value: "admin" },
              { label: "User", value: "user" },
            ]}
          />
          {variantModal === "Add" && (
            <Button type="submit" style={{ float: "right" }}>
              Tambahkan
            </Button>
          )}
          {variantModal === "Edit" && (
            <Button type="submit" style={{ float: "right" }}>
              Edit
            </Button>
          )}
        </form>
      </Modal>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title="Warning!"
        actions={
          <>
            <Button
              onClick={() => setOpenDialog(false)}
              size="medium"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              size="medium"
              onClick={() => {
                deleteUser(formData.id);
                toast.success("Akun berhasil Dihapus!", {
                  position: "top-right",
                });
                setOpenDialog(false);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        Apakah anda yakin akan menghapus akun ini ?
      </Dialog>
    </div>
  );
}

export default UserManagementPage;
