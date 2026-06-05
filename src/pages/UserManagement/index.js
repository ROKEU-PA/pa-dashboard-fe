/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import Table from "@/components/Table";
import TableRow from "@/components/TableRow";
import TablePagination from "@/components/TablePagination";
import TableHeader from "@/components/TableHeader";
import TableCell from "@/components/TableCell";
import { TableBody } from "@/components/TableBody";
import Paper from "@/components/Paper";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Input from "@/components/Input";
import { Plus, Settings, Trash2, UserRoundSearch } from "lucide-react";
import { cryptoEncrypter, validationSchema } from "@/services/GeneralHelper";
import { toast } from "react-toastify";
import Chip from "@/components/Chip";
import Dialog from "@/components/Dialog";
import { apiRequest } from "@/services/APIHelper";
import { fetchHelperGET } from "@/services/FetchHelper";
import MultiSelect from "@/components/MultiSelect";
import { AppContext } from "@/contexts/AppContext";
import moment from "moment";

const columns = [
  { key: "username", label: "Username" },
  { key: "access", label: "Nama Biro" },
  { key: "name", label: "Nama" },
  { key: "status", label: "Status" },
  { key: "privilege", label: "Tipe Akses" },
  { key: "action", label: "Action" },
];

const mapTableData = (data) => {
  let arr = [];
  data.forEach((item, i) => {
    arr.push({
      ...item,
      id: item.id,
      username: item.biro_code,
      privilege: item.role,
    });
  });

  return arr;
};

function UserManagementPage() {
  const { listMenu, userData } = useContext(AppContext);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [variantModal, setVariantModal] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [multiSelectTwoOpen, setMultiSelectTwoOpen] = useState(false);

  const [searchKey, setSearchKey] = useState("");
  const [tableData, setTableData] = useState();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    privilege: "",
    access_code: [],
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(e.target.value, name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitData = async (formData) => {
    try {
      const payload = {
        kode_biro: formData?.username,
        role: formData.privilege,
        password: cryptoEncrypter(formData.password),
        access: JSON.stringify(formData?.access_code),
        nama: formData?.name,
      };
      // console.log(payload);

      const result = await apiRequest({
        url: "/user/register",
        method: "POST",
        options: {
          body: payload,
        },
      });
      if (result.success) {
        toast.success("Pengguna berhasil diperbaharui!");
        setIsOpenModal(false);
        setFormData({
          username: "",
          name: "",
          privilege: "",
          access_code: [],
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
        kode_biro: formData?.username,
        role: formData.privilege,
        nama: formData?.name,
        access: JSON.stringify(formData?.access_code),
      };
      if (formData.password) {
        Object.assign(payload, {
          password: cryptoEncrypter(formData?.password),
        });
      }

      const result = await apiRequest({
        url: `/user/edit/${formData?.id}`,
        method: "POST",
        options: {
          body: payload,
        },
      });
      if (result.success) {
        toast.success("Pengguna berhasil ditambahkan!");
        setIsOpenModal(false);
        setFormData({
          username: "",
          name: "",
          privilege: "",
          access_code: [],
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
        !formData.username ||
        !formData.name ||
        !formData.privilege ||
        !formData.access_code
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
        localStorage.getItem("token"),
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
      <Paper
        elevation={3}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="text-sm md:text-base gap-2"
        >
          <Button
            onClick={() => {
              setIsOpenModal(true);
              setVariantModal("Add");
              setFormData({
                username: "",
                name: "",
                privilege: "",
                access_code: [],
                password: "",
              });
            }}
            style={{ width: "fit-content" }}
            variant="danger"
            icon={<Plus size={20} />}
          >
            Tambah Akun
          </Button>
          <div
            style={{
              display: "flex ",
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
        <div className="overflow-x-auto text-sm md:text-base">
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
                    {row?.username}
                  </TableCell>
                  <TableCell align="center">{row?.access}</TableCell>
                  <TableCell align="center">{row?.name}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={
                        row.last_activity &&
                        moment(row.last_activity).isAfter(
                          moment().subtract(5, "minutes"),
                        )
                          ? "Online"
                          : "Offline"
                      }
                      style={{
                        color:
                          row.last_activity &&
                          moment(row.last_activity).isAfter(
                            moment().subtract(5, "minutes"),
                          )
                            ? "green"
                            : "white",
                        fontWeight: "bold",
                        backgroundColor:
                          row.last_activity &&
                          moment(row.last_activity).isAfter(
                            moment().subtract(5, "minutes"),
                          )
                            ? "#E7FEE7"
                            : "#858585ff",
                      }}
                    />{" "}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row?.["privilege"]?.toUpperCase()}
                      style={{
                        backgroundColor:
                          row?.["privilege"] === "super_admin"
                            ? "#858585ff"
                            : row?.["privilege"] === "admin"
                              ? "#fef5c3ff"
                              : row?.["privilege"] === "user"
                                ? "#cee3f9ff"
                                : row?.["privilege"] === "pic"
                                  ? "#E7FEE7"
                                  : row?.["privilege"] === "guest"
                                    ? "#FEDCE1"
                                    : "#000000",
                        color:
                          row?.["privilege"] === "super_admin"
                            ? "#000000"
                            : row?.["privilege"] === "admin"
                              ? "#FFD700"
                              : row?.["privilege"] === "user"
                                ? "#007BFF"
                                : row?.["privilege"] === "pic"
                                  ? "#28A745"
                                  : row?.["privilege"] === "guest"
                                    ? "#FF4C4C"
                                    : "#FFFFFF",
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
        </div>
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
        width="80%"
        maxWidth="95vw"
        className="md:text-base text-sm"
      >
        {/* {console.log(formData)} */}
        <div
          style={{
            width: "100%",
            overflowY: "auto",
            maxHeight: "480px",
          }}
        >
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
              label="Username"
              name="username"
              value={formData["username"]}
              onChange={handleChange}
              validate={validationSchema.onlyNumber}
              required
              disabled={variantModal === "Detail"}
              placeholder="Masukkan Kode Akun"
            />
            <Input
              label="Nama Akun"
              name="name"
              disabled={variantModal === "Detail"}
              value={formData["name"]}
              onChange={handleChange}
              required
              placeholder="Masukkan Nama Akun"
            />
            {variantModal !== "Detail" && (
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData["password"] || ""}
                onChange={handleChange}
                // validate={validationSchema.password}
                placeholder="Masukkan password"
              />
            )}
            <MultiSelect
              label="Akses Satker"
              name="access"
              value={
                Array.isArray(formData.access_code)
                  ? listMenu
                      .filter((item) =>
                        formData.access_code.includes(item.code),
                      )
                      .map((item) => ({
                        label: item.name,
                        value: item.code,
                      }))
                  : []
              }
              onChange={(selectedOptions) =>
                setFormData((prev) => ({
                  ...prev,
                  access_code: Array.isArray(selectedOptions)
                    ? selectedOptions.map((opt) => opt.value)
                    : [],
                }))
              }
              options={listMenu.map((q) => ({
                label: q.name,
                value: q.code,
              }))}
              isOpen={multiSelectTwoOpen}
              setIsOpen={(open) => {
                if (open) {
                  setSelectOpen(false);
                }
                setMultiSelectTwoOpen(open);
              }}
            />

            <Select
              label="Role"
              name="privilege"
              disabled={variantModal === "Detail"}
              value={formData["privilege"]}
              onChange={handleChange}
              isOpen={selectOpen}
              setIsOpen={(open) => {
                setSelectOpen(open);
              }}
              required
              options={[
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
                { label: "PIC", value: "pic" },
                { label: "Guest", value: "guest" },
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
        </div>
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
