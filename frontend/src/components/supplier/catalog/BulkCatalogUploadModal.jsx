import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
  Layers,
  ArrowRight,
  PackageCheck,
  Search,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { downloadBulkProductTemplateCsv, parseProductsCsv } from '../../../utils/csvExport';
import supplierApiService from '../../../services/supplierApiService';

export default function BulkCatalogUploadModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [previewSearch, setPreviewSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    downloadBulkProductTemplateCsv();
    toast.success('📥 Sample CSV template downloaded! Open in Microsoft Excel or Google Sheets.');
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv') && !selectedFile.type.includes('csv') && !selectedFile.type.includes('text')) {
      toast.error('Please upload a valid .csv file format');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const result = parseProductsCsv(text);
        setParsedData(result);
        if (result.errors.length > 0) {
          toast.warning(`Parsed ${result.validRows} products. ${result.errors.length} issue(s) detected.`);
        } else {
          toast.success(`🎉 Successfully validated ${result.validRows} products from CSV!`);
        }
      } catch (err) {
        console.error('CSV Parsing Error:', err);
        toast.error(err.message || 'Failed to parse CSV file. Please check template format.');
        setParsedData(null);
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read file from disk');
    };
    reader.readAsText(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setParsedData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleBulkSubmit = async () => {
    if (!parsedData || !parsedData.products || parsedData.products.length === 0) {
      toast.error('No valid products to import.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await supplierApiService.bulkUploadSupplierProducts(parsedData.products);
      toast.success(res.message || `🎉 Successfully imported ${parsedData.products.length} products to live catalog!`);
      if (onSuccess) onSuccess(res.count || parsedData.products.length);
      onClose();
    } catch (err) {
      console.error('Bulk upload submission error:', err);
      toast.error(err.message || 'Failed to import products to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPreview = (parsedData?.products || []).filter((p) => {
    if (!previewSearch.trim()) return true;
    const q = previewSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* 1. Modal Top Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-pink-50/50 via-white to-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#d82a62] to-[#b7004d] text-white flex items-center justify-center shrink-0 shadow-md shadow-pink-500/20">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Bulk Catalog Mass Import
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-pink-100 text-[#b7004d] text-[10px] font-bold uppercase tracking-wider">
                  Excel / CSV
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Download sample template, fill multiple wholesale products, and publish 50+ items in 1-click.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Step 1 & Step 2 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1: Download Template */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-[#b7004d] text-white text-xs font-black flex items-center justify-center">1</span>
                  <h3 className="text-sm font-black text-slate-900">Download Catalog Template</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Use our standardized spreadsheet template pre-configured with required columns: Title, Category, Price, MRP, Stock, SKU, Sizes, Colors &amp; Thickness.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#b7004d]" />
                  <span>Download Sample Template (.CSV)</span>
                </button>
              </div>
            </div>

            {/* Step 2: Upload CSV File */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-lg bg-[#b7004d] text-white text-xs font-black flex items-center justify-center">2</span>
                  <h3 className="text-sm font-black text-slate-900">Upload Completed File</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Drop your saved CSV spreadsheet here. Automated validator checks price, stock, and creates variant matrices immediately.
                </p>
              </div>

              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {!file ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#b7004d] hover:bg-[#96003f] text-white font-bold text-xs shadow-md shadow-pink-600/20 transition active:scale-95 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Choose CSV File</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-800 truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">({Math.round(file.size / 1024)} KB)</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-bold text-[#b7004d] hover:underline px-1.5"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={handleClearFile}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Drag & Drop Zone if no file loaded */}
          {!file && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                dragActive
                  ? 'border-[#b7004d] bg-pink-50/50 scale-[1.01]'
                  : 'border-slate-300 hover:border-[#b7004d] bg-slate-50/40 hover:bg-pink-50/20'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-pink-100 text-[#b7004d] flex items-center justify-center mb-3">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-black text-slate-800">
                Drag &amp; Drop your Product CSV here
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                or click to browse from your computer. Supports unlimited products per spreadsheet.
              </p>
            </div>
          )}

          {/* Step 3: Interactive Live Preview & Validation Matrix */}
          {parsedData && (
            <div className="space-y-4">
              
              {/* Validation Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      Ready to Publish: {parsedData.validRows} / {parsedData.totalRows} Product(s)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      All products validated. Colors and sizes are mapped to multi-variant inventory matrices.
                    </p>
                  </div>
                </div>

                {/* Filter / Search within preview */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={previewSearch}
                    onChange={(e) => setPreviewSearch(e.target.value)}
                    placeholder="Search preview rows..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#b7004d]"
                  />
                </div>
              </div>

              {/* Warning box if errors occurred */}
              {parsedData.errors && parsedData.errors.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-amber-900">
                      {parsedData.errors.length} Row(s) Skipped Due to Validation Errors:
                    </span>
                    <ul className="list-disc pl-4 mt-1 text-amber-800 space-y-0.5 max-h-24 overflow-y-auto">
                      {parsedData.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Parsed Products Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-600 sticky top-0 font-bold uppercase tracking-wider text-[10px] z-10">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Product Title</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Price / MRP</th>
                        <th className="py-2.5 px-3">Stock &amp; SKU</th>
                        <th className="py-2.5 px-3">Sizes</th>
                        <th className="py-2.5 px-3">Colors</th>
                        <th className="py-2.5 px-3">Variants</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPreview.map((item, idx) => {
                        const variantCount = Math.max(1, (item.colors?.length || 1) * (item.sizes?.length || 1));
                        return (
                          <tr key={idx} className="hover:bg-pink-50/20 transition-colors">
                            <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{item.rowNumber}</td>
                            <td className="py-2.5 px-3 max-w-[200px]">
                              <p className="font-bold text-slate-900 truncate" title={item.title}>
                                {item.title}
                              </p>
                              <span className="text-[10px] text-slate-400">{item.images?.length || 1} image(s)</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[10px]">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-black text-slate-900">₹{item.price}</div>
                              {item.mrp && <div className="text-[10px] text-slate-400 line-through">₹{item.mrp}</div>}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-800">{item.stock} units</div>
                              <span className="font-mono text-[10px] text-slate-500 uppercase">{item.sku}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex flex-wrap gap-1 max-w-[120px]">
                                {(item.sizes || []).slice(0, 3).map((s, sIdx) => (
                                  <span key={sIdx} className="px-1.5 py-0.2 bg-slate-100 text-slate-700 text-[10px] rounded font-bold">
                                    {s}
                                  </span>
                                ))}
                                {item.sizes?.length > 3 && (
                                  <span className="text-[10px] text-slate-400">+{item.sizes.length - 3}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex flex-wrap gap-1 max-w-[120px]">
                                {(item.colors || []).slice(0, 2).map((c, cIdx) => (
                                  <span key={cIdx} className="px-1.5 py-0.2 bg-pink-50 text-[#b7004d] text-[10px] rounded font-bold">
                                    {c}
                                  </span>
                                ))}
                                {item.colors?.length > 2 && (
                                  <span className="text-[10px] text-slate-400">+{item.colors.length - 2}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                {variantCount} SKUs
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Valid
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 shrink-0">
          <div className="text-xs text-slate-500">
            {parsedData ? (
              <span>
                <strong className="text-slate-900">{parsedData.validRows} products</strong> ready for live catalog publishing.
              </span>
            ) : (
              <span>Download sample template to review column structure.</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleBulkSubmit}
              disabled={!parsedData || parsedData.validRows === 0 || isSubmitting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#d82a62] to-[#b7004d] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-pink-600/20 transition active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Publishing Products...</span>
                </>
              ) : (
                <>
                  <PackageCheck className="w-4 h-4" />
                  <span>
                    Publish {parsedData?.validRows ? `${parsedData.validRows} Products` : 'Catalog'} Now
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
