import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import { AppContext } from "@/contexts/AppContext";
import { fetchMenu } from "./menuHooks";
import { useAuth } from "@/contexts/AuthContexts";

function MenuPage() {
  const { auth } = useAuth();
  const { subPage } = useParams();
  const { handleChangeMenu, listMenu, setListMenu, userData, isAdmin } =
    useContext(AppContext);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const menuData = await fetchMenu(auth?.accessToken);
        setListMenu(menuData.data);
      } catch (error) {
        console.error("Error loading menu:", error);
      }
    };

    loadMenu();
  }, [setListMenu]);

  return (
    <div style={{ padding: "10px 1rem" }}>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full"
        // style={{
        //   display: "flex",
        //   flexWrap: "wrap",
        //   justifyContent: "space-between",
        //   gap: 20,
        // }}
      >
        {listMenu &&
          listMenu.map((data, index) => (
            <Link
              to={
                subPage
                  ? (() => {
                      const pathParts = data.path.split("/").filter(Boolean);
                      const base = "/" + pathParts[0];
                      const end = pathParts.slice(1).join("/");
                      return `${base}/${subPage}/${end}`;
                    })()
                  : data.path
              }
              style={{
                textDecoration: "none",
                pointerEvents:
                  !isAdmin &&
                  !userData?.access_code?.includes(Number(data.code))
                    ? "none"
                    : "auto",
              }}
              key={index}
              onClick={() => handleChangeMenu(data)}
            >
              <div
                className={`card ${
                  !isAdmin &&
                  !userData?.access_code?.includes(Number(data.code))
                    ? "card-disabled"
                    : ""
                }`}
              >
                <div className="card-number">{data.code}</div>
                <div className="card-title">{data.name}</div>
              </div>
            </Link>
          ))}
      </div>

      <style>
        {`
          .card {
            width: 100%;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            border-radius: 6px;
            overflow: hidden;
          }

          .card:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
            font-weight: 600;
          }

          .card-number {
            height: 100px;
            background: #4CD4B0;
            color: #2bb490;
            font-weight: 900;
            font-size: 100px;
            display: flex;
            align-items: center;
          }

          .card-title {
            background: white;
            padding: 20px;
          }
          .card-disabled {
            opacity: 0.5;
            pointer-events: none;
            cursor: not-allowed;
            filter: grayscale(0.4);
          }
          
          .card-disabled:hover {
            transform: none;
            box-shadow: none;
            font-weight: normal;
          }
          
        `}
      </style>
    </div>
  );
}

export default MenuPage;
