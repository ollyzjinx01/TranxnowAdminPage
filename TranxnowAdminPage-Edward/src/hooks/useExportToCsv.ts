/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import moment from "moment";

const useExportCSV = () => {
  const exportCSV = (data, headers, filename = "export.csv") => {
    const csvContent = [];

    // Add headers to CSV
    csvContent.push(headers.join(","));

    // Add data rows to CSV
    data.forEach((item, index) => {
      const row = headers.map(header => {
        if (header === "Date" || header === "Time") {
          return moment(item[header.toLowerCase()]).format(
            header === "Date" ? "YYYY-MM-DD" : "LT"
          );
        }
        return item[header?.toLowerCase()];
      });

      csvContent.push([index + 1, ...row].join(","));
    });

    // Create a Blob and download it as a CSV file
    const blob = new Blob([csvContent.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(
        "Your browser does not support the download functionality. Please try another browser."
      );
    }
  };

  return exportCSV;
};

export default useExportCSV;
