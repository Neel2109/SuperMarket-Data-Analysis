import React, { useState } from 'react';
import { MultiChartSection } from '../MultiChartSection';
import { CollegeProjectInfo } from '../../types';
import { VIVA_QUESTIONS } from '../../data/vivaQuestions';
import { generateFullCollegeReportMarkdown } from '../../data/powerBiProjectAssets';
import { downloadFile } from '../../data/supermarketData';
import {
  GraduationCap,
  Printer,
  Download,
  Save,
  Award,
  Sparkles,
  HelpCircle,
  FileText,
} from 'lucide-react';

interface ProjectReportTabProps {
  projectInfo: CollegeProjectInfo;
  setProjectInfo: React.Dispatch<React.SetStateAction<CollegeProjectInfo>>;
  onSaveToCloud: () => void;
  isSaving: boolean;
}

export const ProjectReportTab: React.FC<ProjectReportTabProps> = ({
  projectInfo,
  setProjectInfo,
  onSaveToCloud,
  isSaving,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'report' | 'viva'>('report');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const md = generateFullCollegeReportMarkdown(projectInfo);
    downloadFile(md, 'Supermarket_PowerBI_College_Project_Report.md', 'text/markdown;charset=utf-8;');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            College Project Documentation & Viva Voce Dossier
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete academic project dossier formatted for university submission, viva presentation, and print evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab(activeSubTab === 'report' ? 'viva' : 'report')}
            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-blue-700 transition flex items-center gap-1.5 border border-blue-200"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>{activeSubTab === 'report' ? 'View Viva Q&A' : 'View Report'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-medium transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .MD</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Editable Student Credentials Form (Hidden during Print) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs print:hidden space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            Student Submission Details (Personalizes Project Report)
          </h3>
          <button
            onClick={onSaveToCloud}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition disabled:opacity-50 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save to Firebase'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 mb-1 font-medium">Student Full Name</label>
            <input
              type="text"
              value={projectInfo.studentName}
              onChange={(e) => setProjectInfo((prev) => ({ ...prev, studentName: e.target.value }))}
              placeholder="e.g. Parvathy S."
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-medium">Roll / Register Number</label>
            <input
              type="text"
              value={projectInfo.rollNumber}
              onChange={(e) => setProjectInfo((prev) => ({ ...prev, rollNumber: e.target.value }))}
              placeholder="e.g. 23MCA1042"
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-medium">Degree / Course</label>
            <input
              type="text"
              value={projectInfo.course}
              onChange={(e) => setProjectInfo((prev) => ({ ...prev, course: e.target.value }))}
              placeholder="e.g. Master of Computer Applications (MCA)"
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-medium">College / University Name</label>
            <input
              type="text"
              value={projectInfo.university}
              onChange={(e) => setProjectInfo((prev) => ({ ...prev, university: e.target.value }))}
              placeholder="e.g. Department of Computer Science, University"
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-medium">Academic Year</label>
            <input
              type="text"
              value={projectInfo.academicYear}
              onChange={(e) => setProjectInfo((prev) => ({ ...prev, academicYear: e.target.value }))}
              placeholder="e.g. 2024 - 2025"
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 mb-1 font-medium">Faculty Guide / Supervisor</label>
            <input
              type="text"
              value={projectInfo.facultyGuide}
              onChange={(e) => setProjectInfo((prev) => ({ ...prev, facultyGuide: e.target.value }))}
              placeholder="e.g. Dr. Rajesh Kumar, Associate Professor"
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'report' ? (
        /* Academic Project Report Document (Clean White Paper Aesthetic) */
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm text-slate-800 print:shadow-none print:border-none print:p-0 space-y-8">
          {/* Document Header */}
          <div className="text-center border-b border-slate-200 pb-8 space-y-3">
            <span className="text-xs uppercase tracking-widest text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block">
              ACADEMIC CAPSTONE PROJECT REPORT
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {projectInfo.projectTitle}
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              A Business Intelligence & Prescriptive Data Analytics Solution in Microsoft Power BI Desktop
            </p>

            {/* Student Credential Badge Box */}
            <div className="mt-6 pt-4 border-t border-slate-200 max-w-xl mx-auto grid grid-cols-2 gap-4 text-xs text-left bg-slate-50 p-4 rounded-xl border">
              <div>
                <span className="text-slate-500 block">Candidate Name:</span>
                <strong className="text-slate-900 text-sm font-bold">{projectInfo.studentName || '[Student Name]'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Roll / Reg Number:</span>
                <strong className="text-slate-900 text-sm font-mono font-bold">{projectInfo.rollNumber || '[Roll No]'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Course / Degree:</span>
                <strong className="text-slate-800">{projectInfo.course || '[Course Name]'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Faculty Advisor:</span>
                <strong className="text-slate-800">{projectInfo.facultyGuide || '[Faculty Guide]'}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block">Institution:</span>
                <strong className="text-slate-800">{projectInfo.university || '[Institution Name]'} ({projectInfo.academicYear})</strong>
              </div>
            </div>
          </div>

          {/* Section 1: Abstract */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900 border-l-4 border-blue-600 pl-3">
              1. Project Abstract
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              This data analytics project presents an end-to-end business intelligence pipeline for retail supermarkets utilizing Microsoft Power BI Desktop. In modern retail ecosystems, high-volume transactional data captured at point-of-sale (POS) registers is frequently siloed. This research cleanses, normalizes, and models 1,000 POS transactions across Myanmar (Yangon, Naypyitaw, Mandalay) into an optimized Star Schema. A VertiPaq-aligned analytical architecture was constructed using 25+ DAX (Data Analysis Expressions) metrics covering sales volume, gross margins, moving averages, and loyalty segmentation. The dashboard provides retail stakeholders with actionable visibility into footfall bottlenecks, category profitability, and customer retention.
            </p>
          </div>

          {/* Section 2: Problem Statement & Objectives */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900 border-l-4 border-blue-600 pl-3">
              2. Problem Statement & Research Objectives
            </h2>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>Problem Statement:</strong> Supermarket chains operate in low-margin environments (~4.76% gross margin) subject to changing consumer basket preferences and staffing bottlenecks. Store managers lacked a unified dashboard capable of cross-filtering branch footfall, customer loyalty participation, and payment channel efficiencies in real-time.
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Design a robust Star Schema data model connecting transactional facts with customer, date, branch, and product dimensions.</li>
                <li>Execute upstream Power Query M-code data extraction, transformation, and type casting.</li>
                <li>Implement advanced DAX measures utilizing CALCULATE, DIVIDE, TOTALYTD, and RANKX.</li>
                <li>Deliver interactive Power BI report pages featuring cross-highlighting, drill-through, and What-If price elasticity simulations.</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Data Architecture & Star Schema */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900 border-l-4 border-blue-600 pl-3">
              3. Data Architecture & Dimensional Modeling
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              The project enforces Ralph Kimball's dimensional modeling methodology. The central fact table <code>Fact_SupermarketSales</code> contains 1,000 rows with foreign keys connecting to four distinct dimension tables:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-blue-700 font-bold font-sans">1. Dim_Date:</span> 90 continuous days supporting Year-To-Date (YTD) and Month-over-Month (MoM) DAX functions.
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-blue-700 font-bold font-sans">2. Dim_Branch:</span> 3 distinct branches (A: Yangon, B: Mandalay, C: Naypyitaw).
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-blue-700 font-bold font-sans">3. Dim_Product:</span> 6 product lines (Fashion, Food & Beverages, Electronic, Sports, Health, Home).
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-blue-700 font-bold font-sans">4. Dim_Customer:</span> Member vs Normal loyalty status.
              </div>
            </div>
          </div>

          {/* Section 4: Key DAX Measures */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900 border-l-4 border-blue-600 pl-3">
              4. Key DAX Expressions Applied
            </h2>
            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-lg font-mono border border-slate-200">
                <span className="text-slate-500 block mb-1 font-sans font-bold">// 1. Safe Profit Margin Calculation</span>
                <span className="text-blue-900 font-semibold">
                  Gross Margin % = DIVIDE ( [Total Sales] - [Total COGS], [Total Sales], 0 )
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-lg font-mono border border-slate-200">
                <span className="text-slate-500 block mb-1 font-sans font-bold">// 2. Loyalty Member Penetration Filter</span>
                <span className="text-blue-900 font-semibold">
                  Member Sales % = DIVIDE ( CALCULATE ( [Total Sales], Fact_SupermarketSales[Customer type] = "Member" ), CALCULATE ( [Total Sales], ALL ( Fact_SupermarketSales[Customer type] ) ), 0 )
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Strategic Business Recommendations */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-blue-900 border-l-4 border-blue-600 pl-3">
              5. Strategic Business Recommendations
            </h2>
            <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-700">
              <li><strong>Dynamic Cashier Staffing:</strong> The footfall heatmap identifies spikes between 13:00-14:00 and 19:00-20:00. Allocating float staff during these intervals directly lowers queue abandonment.</li>
              <li><strong>Loyalty Incentivization:</strong> Loyalty members spend 12% more per checkout than walk-in customers. A targeted 2% cashback rebate on electronic accessories will drive higher lifetime retention.</li>
              <li><strong>Digital Payment Acceleration:</strong> E-Wallet and credit card usage exceeds 66% in Branch A & C. Installing contactless self-checkout kiosks in Yangon will reduce overhead labor costs.</li>
            </ol>
          </div>

          {/* Signatures for Academic Submission */}
          <div className="pt-10 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-center">
            <div>
              <div className="h-14 border-b border-dashed border-slate-400" />
              <span className="block mt-2 font-bold text-slate-900">{projectInfo.studentName || 'Student Signature'}</span>
              <span className="text-[11px] text-slate-500">Candidate Signature</span>
            </div>
            <div>
              <div className="h-14 border-b border-dashed border-slate-400" />
              <span className="block mt-2 font-bold text-slate-900">{projectInfo.facultyGuide || 'Faculty Guide Signature'}</span>
              <span className="text-[11px] text-slate-500">Project Supervisor / External Examiner</span>
            </div>
          </div>
        </div>
      ) : (
        /* Viva Voce Preparation Guide Sub-Tab */
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-1">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              University Viva Voce Defense Question Bank (Top 8 Questions)
            </h3>
            <p className="text-xs text-slate-500">
              Every single question college professors and external examiners typically ask during final Power BI project presentations, accompanied by high-scoring model answers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {VIVA_QUESTIONS.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3 hover:border-blue-300 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{q.question}</h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200 shrink-0">
                    {q.category}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 block mb-1">Model Answer:</strong>
                  {q.answer}
                </div>

                <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Examiner Tip: </strong>
                    {q.examinerTip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
          <MultiChartSection data={[]} title="Project Report Analytics" />
    </div>
  );
};