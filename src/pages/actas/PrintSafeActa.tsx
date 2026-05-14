import React from "react";
import { ActaData } from "../../types/types";
import { CEM_HEADER_CONFIG } from "../../../constants";

interface Props {
  data: ActaData;
}

const safe = (value?: any) => {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "—";
  }

  return value || "—";
};

const buildAccesorios = (data: ActaData) => {
  const accesorios = [...(data.accesorios || [])];

  return accesorios
    .map((acc) => {
      if (acc === "CELULAR") {
        return `CELULAR (${[
          data.celularMarcaNombre,
          data.celularModelo,
          data.celularNumero,
          data.celularOperadorNombre,
          data.celularImei ? `IMEI: ${data.celularImei}` : null,
        ]
          .filter(Boolean)
          .join(" // ")})`;
      }

      if (acc === "DIADEMAS") {
        return `DIADEMAS (${[
          data.diademaMarcaNombre,
          data.diademaSerial,
        ]
          .filter(Boolean)
          .join(" // ")})`;
      }

      return acc;
    })
    .join(", ");
};

const PrintSafeActa: React.FC<Props> = ({ data }) => {
  return (
    <div
      id="pdf-content"
      style={{
        width: "794px",
        minHeight: "1123px",
        background: "#ffffff",
        color: "#000000",
        padding: "48px",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "18px",
        }}
      >
        <tbody>
          <tr>
            {/* LOGO */}
            <td
              style={{
                border: "1px solid #000",
                width: "33%",
                padding: "10px",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <img
                src="https://res.cloudinary.com/dbhbuhjum/image/upload/f_auto,q_auto/descarga_moi2yv"
                alt="logo"
                 crossOrigin="anonymous"
                style={{
                  maxWidth: "120px",
                  height: "80px",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </td>

            {/* TITLE */}
            <td
              style={{
                border: "1px solid #000",
                width: "33%",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "18px",
                padding: "10px",
              }}
            >
              FORMATO ACTA DE ENTREGA
              <br />
              DE EQUIPOS
            </td>

            {/* CONFIG */}
            <td
              style={{
                border: "1px solid #000",
                width: "34%",
                padding: 0,
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        borderBottom: "1px solid #000",
                        borderRight: "1px solid #000",
                        padding: "8px",
                        fontWeight: "bold",
                        width: "50%",
                      }}
                    >
                      Código:
                    </td>

                    <td
                      style={{
                        borderBottom: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {CEM_HEADER_CONFIG.codigo}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style={{
                        borderBottom: "1px solid #000",
                        borderRight: "1px solid #000",
                        padding: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      Versión:
                    </td>

                    <td
                      style={{
                        borderBottom: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {CEM_HEADER_CONFIG.version}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style={{
                        borderRight: "1px solid #000",
                        padding: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      Fecha:
                    </td>

                    <td
                      style={{
                        padding: "8px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {CEM_HEADER_CONFIG.fechaFormato}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* FECHA */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
          fontWeight: "bold",
        }}
      >
        <span>FECHA: {safe(data.fecha)}</span>

        <span style={{ color: "#777" }}>
          # {safe(data.actaNumber)}
        </span>
      </div>

      {/* CAMPOS */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "18px",
        }}
      >
        <tbody>
          {[
            ["Nombre", data.recibidoPorNombre],
            ["Cargo", data.cargo],
            ["Sede", data.sede],
            [
              "Equipo",
              [data.laptopMarcaNombre, data.equipo]
                .filter(Boolean)
                .join(" "),
            ],
            ["Serial", data.laptopSerial],
            ["Accesorios", buildAccesorios(data)],
            ["Estado", data.estado],
            ["Observaciones", data.observaciones],
          ].map(([label, value], idx) => (
            <tr key={idx}>
              <td
                style={{
                  border: "1px solid #000",
                  padding: "10px",
                  width: "140px",
                  fontWeight: "bold",
                  background: "#f5f5f5",
                }}
              >
                {label}
              </td>

              <td
                style={{
                  border: "1px solid #000",
                  padding: "10px",
                  textTransform: "uppercase",
                }}
              >
                {safe(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TEXTO */}
      <div
        style={{
          textAlign: "center",
          fontStyle: "italic",
          marginBottom: "26px",
          fontSize: "11px",
        }}
      >
        "La persona que firma se hará responsable de los bienes entregados."
      </div>

      {/* FIRMAS */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "30px",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                border: "1px solid #000",
                textAlign: "center",
                fontWeight: "bold",
                padding: "10px",
              }}
            >
              Recibido por
            </td>

            <td
              style={{
                border: "1px solid #000",
                textAlign: "center",
                fontWeight: "bold",
                padding: "10px",
              }}
            >
              Entregado por
            </td>
          </tr>

          <tr>
            {/* RECIBIDO */}
            <td
              style={{
                border: "1px solid #000",
                height: "140px",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              {data.recibidoPorFirma ? (
                <img
                  src={data.recibidoPorFirma}
                  alt="firma recibido"
                  style={{
                    width: "180px",
                    height: "70px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <>
                  <div
                    style={{
                      width: "200px",
                      borderBottom: "1px solid #000",
                      margin: "0 auto 10px auto",
                    }}
                  />

                  <span
                    style={{
                      fontSize: "10px",
                      color: "#888",
                      fontWeight: "bold",
                    }}
                  >
                    CLICK PARA FIRMAR
                  </span>
                </>
              )}
            </td>

            {/* ENTREGADO */}
            <td
              style={{
                border: "1px solid #000",
                height: "140px",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              {data.entregadoPorFirma ? (
                <img
                  src={data.entregadoPorFirma}
                  alt="firma entregado"
                  style={{
                    width: "180px",
                    height: "70px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <>
                  <div
                    style={{
                      width: "200px",
                      borderBottom: "1px solid #000",
                      margin: "0 auto 10px auto",
                    }}
                  />

                  <span
                    style={{
                      fontSize: "10px",
                      color: "#888",
                      fontWeight: "bold",
                    }}
                  >
                    CLICK PARA FIRMAR
                  </span>
                </>
              )}
            </td>
          </tr>

          <tr>
            {/* INFO RECIBIDO */}
            <td
              style={{
                border: "1px solid #000",
                padding: "10px",
                fontSize: "11px",
              }}
            >
              <div>
                <strong>Nombre:</strong>{" "}
                {safe(data.recibidoPorNombre)}
              </div>

              <div>
                <strong>CC:</strong>{" "}
                {safe(data.recibidoPorCC)}
              </div>
            </td>

            {/* INFO ENTREGADO */}
            <td
              style={{
                border: "1px solid #000",
                padding: "10px",
                fontSize: "11px",
              }}
            >
              <div>
                <strong>Nombre:</strong>{" "}
                {safe(data.entregadoPorNombre)}
              </div>

              <div>
                <strong>CC:</strong>{" "}
                {safe(data.entregadoPorCC)}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* VISTO BUENO */}
      <div style={{ marginTop: "40px" }}>
        <div
          style={{
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          V.° B.°
        </div>

        <div
          style={{
            width: "180px",
            borderTop: "1px solid #000",
            paddingTop: "6px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "11px",
          }}
        >
          {safe(data.vistoBueno)}
        </div>
      </div>
    </div>
  );
};

export default PrintSafeActa;