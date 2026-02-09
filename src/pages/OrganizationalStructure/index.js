import React, { useState,useEffect, useRef, useContext, useCallback,
} from "react";
import { Camera, User, Check, X,
} from "lucide-react";
import { AppContext } from "@/contexts/AppContext";
import Card from "@/components/Card";
import { apiRequest } from "@/services/APIHelper";

const initialData = {
  id: "kepala_biro",
  name: "Memuat...",
  role: "Kepala Biro Keuangan dan BMN",
  image: null,
  expanded: true,
  children: [
    {
      id: "kabag_tata_usaha",
      name: "Memuat...",
      role: "Kepala Sub-Bagian Tata Usaha",
      image: null,
      expanded: false,
      children: [],
    },
    {
      id: "koordinator_pelaksanaan_anggaran",
      name: "Memuat...",
      role: "Koordinator Pelaksana Anggaran",
      image: null,
      expanded: false,
      children: [],
    },
    {
      id: "koordinator_akuntansi_pelaporan",
      name: "Memuat...",
      role: "Koordinator Akutansi Pelaporan",
      image: null,
      expanded: false,
      children: [],
    },
    {
      id: "koordinator_ptuk",
      name: "Memuat...",
      role: "Koordinator PTUK",
      image: null,
      expanded: false,
      children: [],
    },
    {
      id: "koordinator_bmn",
      name: "Memuat...",
      role: "Kepala Bagian Barang Milik Negara",
      image: null,
      expanded: false,
      children: [],
    },
  ],
};

const TreeNode = ({ node, onUpdate, onToggle, canEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({
    name: node.name,
    role: node.role,
  });
  const fileInputRef = useRef(null);
  const isKepalaBiro = node.id === "kepala_biro";

  useEffect(() => {
    setTempData({ name: node.name, role: node.role });
  }, [node.name, node.role]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 120;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        onUpdate(node.id, { image: compressedBase64 }, file);
      };
    };
  };

  const saveInfo = () => {
    onUpdate(node.id, { name: tempData.name, role: tempData.role });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center relative">
      <div className="relative flex flex-col items-center group">
        {node.id !== "kepala_biro" && (
          <div className="w-0.5 h-3 bg-blue-400"></div>
        )}
        <div className="relative flex items-center">
          <div className="relative">
            <div className="w-40 h-40 rounded-full border-[4px] border-blue-400 p-1 bg-white shadow-xl relative z-10 flex items-center justify-center overflow-hidden">
              {node.image ? (
                <img
                  src={node.image}
                  className="w-full h-full object-cover rounded-full"
                  alt="profile"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="bg-gray-100 w-full h-full flex items-center justify-center rounded-full text-gray-400">
                  <User size={40} />
                </div>
              )}
              {canEdit && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-full"
                  >
                    <Camera size={20} className="mb-1" />
                    <span className="text-[8px] text-white/80 font-light uppercase tracking-tighter text-center px-2">
                      ukuran 700 x 700 px
                    </span>
                  </button>
                </>
              )}
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-400 rotate-45 z-0 shadow-md"></div>
          </div>
        </div>
        <div className="mt-6 text-center bg-white p-1 rounded-xl min-w-[200px] shadow-sm border border-gray-100 z-10">
          {isEditing && canEdit ? (
            <div className="flex flex-col gap-1">
              <input
                className="text-xs font-bold border-b border-blue-400 focus:outline-none text-center"
                value={tempData.name}
                onChange={(e) =>
                  setTempData({ ...tempData, name: e.target.value })
                }
                autoFocus
              />
              <div className="flex justify-center gap-2 mt-1">
                <button onClick={saveInfo} className="text-green-500">
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="group/text">
              <div
                onClick={() => setIsEditing(true)}
                className="cursor-pointer hover:bg-gray-100 transition-colors rounded-lg p-1"
              >
                <h3
                  className={`text-black-800  font-black tracking-tight 
                  ${isKepalaBiro ? "text-[20px] mb-1" : "text-[16px]"}`}>
                  {node.name}
                </h3>
                <p
                  className={`text-gray-500  font-bold tracking-wider
                  ${isKepalaBiro ? "text-[14px]" : "text-[10px]"}`}>
                  {node.role}
                </p>
              </div>
              {(node.id.startsWith("koordinator_") ||
                node.children?.length > 0) &&
                node.id !== "kepala_biro" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(node.id);
                    }}
                    className=" w-full px-3 py-1.5 bg-gradient-to-r from-[#38bdf8] to-[#3b82f6] hover:bg-blue-800 text-white text-[9px] font-bold rounded-md transition-colors shadow-sm flex items-center justify-center gap-1 uppercase"
                  >
                    <span>{node.expanded ? "▲" : "▼"}</span>
                    <span>{node.expanded ? "TUTUP" : "LIAT SUBKOOR"}</span>
                  </button>
                )}
            </div>
          )}
        </div>
      </div>

      {node.children?.length > 0 && node.expanded && (
        <div className="relative flex flex-col items-center w-full">
          <div
            className={`w-0.5 bg-blue-400 relative ${
              node.children.some((c) => c.id === "kabag_tata_usaha")
                ? "h-[320px]"
                : "h-8"
            }`}
          >
            {node.children.map((child) => {
              if (child.id === "kabag_tata_usaha") {
                return (
                  <div
                    key={child.id}
                    className="absolute top-[15px] right-0 flex items-center"
                  >
                    <div className="w-32 h-0.5 bg-blue-400"></div>
                    <div className="absolute right-32 translate-x-1/2 translate-y-1/2">
                      <TreeNode
                        node={child}
                        onUpdate={onUpdate}
                        onToggle={onToggle}
                        canEdit={canEdit}
                      />
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
          <div className="flex justify-center gap-10 relative px-10">
            {node.children.map((child, index, allChildren) => {
              if (child.id === "kabag_tata_usaha") return null;

              const siblingNodes = allChildren.filter(
                (c) => c.id !== "kabag_tata_usaha"
              );
              const currentIndex = siblingNodes.findIndex(
                (s) => s.id === child.id
              );

              return (
                <div
                  key={child.id}
                  className="relative flex flex-col items-center"
                >
                  {siblingNodes.length > 1 && (
                    <div
                      className={`absolute top-0 h-0.5 bg-blue-400 z-0 ${
                        currentIndex === 0
                          ? "left-1/2 right-[-32px]"
                          : currentIndex === siblingNodes.length - 1
                          ? "left-[-32px] right-1/2"
                          : "left-[-32px] right-[-32px]"
                      }`}
                    ></div>
                  )}

                  <div className="w-0.5 h-0 bg-blue-400"></div>

                  <TreeNode
                    node={child}
                    onUpdate={onUpdate}
                    onToggle={onToggle}
                    canEdit={canEdit}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default function OrganizationalStructure() {
  const chartRef = useRef(null);
  const { userData, token } = useContext(AppContext);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  const canEdit =
    userData?.role === "super_admin" || userData?.role === "admin";

  const getSafeToken = useCallback(() => {
    const savedAuth = JSON.parse(sessionStorage.getItem("auth") || "{}");
    return (
      localStorage.getItem("token") ||
      token ||
      savedAuth?.accessToken ||
      savedAuth?.token ||
      null
    );
  }, [token]);

  const mergeApiToStructure = useCallback((structure, apiData) => {
    if (!Array.isArray(apiData)) return structure;
    const buildNode = (node) => {
      const selfData = apiData.find(
        (item) => String(item.key) === String(node.id)
      );
      return {
        ...node,
        name:
          selfData?.name && selfData.name !== "null"
            ? selfData.name
            : node.name,
        role: selfData?.position || selfData?.role || node.role,
        image: selfData?.picture?.url || selfData?.picture_url || node.image,
        expanded: node.id === "kepala_biro",
        children:
          node.id === "kepala_biro"
            ? (node.children || []).map((child) => buildNode(child))
            : [],
      };
    };
    return buildNode(JSON.parse(JSON.stringify(structure)));
  }, []);

  const fetchEmployeeData = useCallback(async () => {
    const activeToken = getSafeToken();
    try {
      const result = await apiRequest({
        url: "/administration/organigram?main=true",
        method: "GET",
        token: activeToken,
      });
      if (result?.success && Array.isArray(result.data)) {
        setData(mergeApiToStructure(initialData, result.data));
      }
    } catch (err) {
      console.error("Gagal sinkron database:", err);
    } finally {
      setLoading(false);
    }
  }, [getSafeToken, mergeApiToStructure]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  const toggleNode = async (id) => {
    const activeToken = getSafeToken();
    const findAndExpand = async (node) => {
      if (node.id === id) {
        if (!node.expanded) {
          try {
            const trimmedId = id.replace("koordinator_", "");
            const resOrg = await apiRequest({
              url: `/administration/organigram?main=false&sub_section=${trimmedId}`,
              method: "GET",
              token: activeToken,
            });
            if (resOrg?.success && Array.isArray(resOrg.data)) {
              const freshChildren = resOrg.data.map((item) => ({
                id: String(item.key),
                name: item.name || "Staf",
                role: item.position || "Staf",
                image: item.picture?.url || null,
                expanded: false,
                children: [],
              }));
              return { ...node, expanded: true, children: freshChildren };
            }
          } catch (err) {
            console.error("Error toggle:", err);
          }
        }
        return { ...node, expanded: !node.expanded };
      }
      if (node.children) {
        const updatedChildren = await Promise.all(
          node.children.map((c) => findAndExpand(c))
        );
        return { ...node, children: updatedChildren };
      }
      return node;
    };
    const updatedData = await findAndExpand(data);
    setData(updatedData);
  };

  const updateNode = async (id, updates = {}, file = null) => {
    const activeToken = getSafeToken();

    let currentNode;
    const findNode = (n) => {
      if (n.id === id) {
        currentNode = n;
        return;
      }
      n.children?.forEach(findNode);
    };
    findNode(data);

    const finalName =
      updates.name !== undefined ? updates.name : currentNode?.name;
    const updateTree = (node) => {
      if (node.id === id) {
        return {
          ...node,
          ...updates,
          image: file ? URL.createObjectURL(file) : updates.image || node.image,
        };
      }
      if (node.children)
        return { ...node, children: node.children.map(updateTree) };
      return node;
    };
    setData((prev) => updateTree(prev));

    const formData = new FormData();
    formData.append("key", id);

    if (finalName) {
      formData.append("name", finalName);
    }

    if (file) {
      formData.append("picture", file);
    }

    try {
      await apiRequest({
        url: "/administration/structure/add",
        method: "POST",
        options: { body: formData },
        isMultiType: true,
        token: activeToken,
      });
    } catch (err) {
      console.error("Gagal sinkron database:", err);
    }
  };

  if (loading && data.name === "Memuat...")
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="max-h-[860px]">
      <Card className="bg-white shadow-2xl rounded-[40px] flex flex-col relative overflow-hidden">
        <div className="overflow-auto h-full w-full flex bg-slate-50/20">
          <div
            ref={chartRef}
            className="inline-flex flex-col items-center min-w-fit m-auto bg-white"
          >
            <TreeNode
              node={data}
              onUpdate={updateNode}
              onToggle={toggleNode}
              canEdit={canEdit}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
