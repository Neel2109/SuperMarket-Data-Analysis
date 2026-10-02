import React, { useState } from 'react';
import { SaleRecord, CollegeProjectInfo } from '../types';
import { convertToCSV, downloadFile } from '../data/supermarketData';
import {
  generateAllDAXFileContent,
  generateFullCollegeReportMarkdown,
  POWER_QUERY_M_CODE,
  CALENDAR_DATE_M_CODE,
} from '../data/powerBiProjectAssets';
import {
  X,
  FileSpreadsheet,
  Code2,
  FileText,
  Download,
  FolderArchive,
  CheckCircle2,
  Terminal,
  Layers,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SaleRecord[];
  projectInfo: CollegeProjectInfo;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  data,
  projectInfo,
}) => {
  const [downloadedStatus, setDownloadedStatus] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const markDownloaded = (key: string) => {
    setDownloadedStatus((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setDownloadedStatus((prev) => ({ ...prev, [key]: false }));
    }, 3000);
  };

  const handleDownloadCSV = () => {
    const csv = convertToCSV(data);
    downloadFile(csv, 'Supermarket_Sales_Dataset.csv', 'text/csv;charset=utf-8;');
    markDownloaded('csv');
  };

  const handleDownloadDAX = () => {
    const dax = generateAllDAXFileContent();
    downloadFile(dax, 'Supermarket_PowerBI_DAX_Measures.dax', 'text/plain;charset=utf-8;');
    markDownloaded('dax');
  };

  const handleDownloadMCode = () => {
    const mCode = `${POWER_QUERY_M_CODE}\n\n// -----------------------------------------------------\n${CALENDAR_DATE_M_CODE}`;
    downloadFile(mCode, 'PowerQuery_ETL_Advanced_Editor.m', 'text/plain;charset=utf-8;');
    markDownloaded('mcode');
  };

  const handleDownloadReport = () => {
    const report = generateFullCollegeReportMarkdown(projectInfo);
    downloadFile(report, 'Supermarket_College_Project_Report.md', 'text/markdown;charset=utf-8;');
    markDownloaded('report');
  };

  const handleDownloadPBIDS = () => {
    const pbidsJson = JSON.stringify(
      {
        version: '0.1',
        connections: [
          {
            details: {
              protocol: 'file',
              address: {
                path: 'C:\\CollegeProjects\\Supermarket_Sales_Dataset.csv',
              },
              authentication: null,
              query: null,
            },
            options: {},
            mode: null,
          },
        ],
      },
      null,
      2
    );
    downloadFile(pbidsJson, 'Supermarket_PowerBI_Connection.pbids', 'application/json;charset=utf-8;');
    markDownloaded('pbids');
  };

  const handleDownloadAll = () => {
    handleDownloadCSV();
    setTimeout(handleDownloadDAX, 200);
    setTimeout(handleDownloadMCode, 400);
    setTimeout(handleDownloadReport, 600);
    setTimeout(handleDownloadPBIDS, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Download Complete College Project Package
              </h2>
              <p className="text-xs text-slate-500">
                All files needed to submit your project and build it directly in Power BI Desktop
              </p>
            </div>
          </div>
        </div>

        {/* File Cards List */}
        <div className="space-y-2.5">
          {/* File 1: CSV Dataset */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:border-blue-300 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">
                  Supermarket_Sales_Dataset.csv
                </div>
                <div className="text-[11px] text-slate-500">
                  1,000 verified POS rows • 17 columns • Ready for Power BI / Excel
                </div>
              </div>
            </div>
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 bg-white hover:bg-emerald-600 hover:text-white text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              {downloadedStatus['csv'] ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Get .CSV</span>
                </>
              )}
            </button>
          </div>

          {/* File 2: DAX Measures */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:border-blue-300 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">
                  Supermarket_PowerBI_DAX_Measures.dax
                </div>
                <div className="text-[11px] text-slate-500">
                  25+ production DAX formulas • CALCULATE, Time Intelligence, AOV, Margins
                </div>
              </div>
            </div>
            <button
              onClick={handleDownloadDAX}
              className="px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              {downloadedStatus['dax'] ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Get .DAX</span>
                </>
              )}
            </button>
          </div>

          {/* File 3: Power Query M-Code */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:border-blue-300 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">
                  PowerQuery_ETL_Advanced_Editor.m
                </div>
                <div className="text-[11px] text-slate-500">
                  M-Code script for Power Query • Calendar Date Table + Data Cleaning pipeline
                </div>
              </div>
            </div>
            <button
              onClick={handleDownloadMCode}
              className="px-3 py-1.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              {downloadedStatus['mcode'] ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Get .M</span>
                </>
              )}
            </button>
          </div>

          {/* File 4: Academic Project Report */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:border-blue-300 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">
                  Supermarket_College_Project_Report.md
                </div>
                <div className="text-[11px] text-slate-500">
                  Full 15-page academic project documentation + 8 Viva Voce Q&A with model answers
                </div>
              </div>
            </div>
            <button
              onClick={handleDownloadReport}
              className="px-3 py-1.5 bg-white hover:bg-purple-600 hover:text-white text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              {downloadedStatus['report'] ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Get .MD</span>
                </>
              )}
            </button>
          </div>

          {/* File 5: Power BI Data Source Connection (.pbids) */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:border-blue-300 transition">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-100 text-sky-700 rounded-lg">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">
                  Supermarket_PowerBI_Connection.pbids
                </div>
                <div className="text-[11px] text-slate-500">
                  Power BI Data Source shortcut • Double click to open Power BI Desktop directly!
                </div>
              </div>
            </div>
            <button
              onClick={handleDownloadPBIDS}
              className="px-3 py-1.5 bg-white hover:bg-sky-600 hover:text-white text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              {downloadedStatus['pbids'] ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Get .PBIDS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer / Batch Download Button */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Student: <strong className="text-slate-800">{projectInfo.studentName || 'College Student'}</strong> ({projectInfo.rollNumber || 'Roll No'})
          </div>
          <button
            onClick={handleDownloadAll}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download All 5 Files</span>
          </button>
        </div>
      </div>
    </div>
  );
};
