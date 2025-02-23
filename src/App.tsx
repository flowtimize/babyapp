import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Trash2, Camera, Clock, Printer, Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useIntl } from 'react-intl';
import { LanguageSwitcher } from './components/LanguageSwitcher';

interface PhotoData {
  month: number;
  url: string;
}

function App() {
  const intl = useIntl();
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [draggedMonth, setDraggedMonth] = useState<number | null>(null);
  const [currentExample, setCurrentExample] = useState(0);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const uploaderRef = useRef<HTMLDivElement>(null);
  const [babyName, setBabyName] = useState<string>('');

  const examples = [
    {
      titleId: 'app.example.classic.title',
      descriptionId: 'app.example.classic.description',
      image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=1200&auto=format&fit=crop&q=80"
    },
    {
      titleId: 'app.example.modern.title',
      descriptionId: 'app.example.modern.description',
      image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&auto=format&fit=crop&q=80"
    },
    {
      titleId: 'app.example.collection.title',
      descriptionId: 'app.example.collection.description',
      image: "https://images.unsplash.com/photo-1612462766564-895ea3388d2b?w=1200&auto=format&fit=crop&q=80"
    }
  ];

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % examples.length);
  };

  const prevExample = () => {
    setCurrentExample((prev) => (prev - 1 + examples.length) % examples.length);
  };

  const handlePhotoUpload = (month: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotos(prev => {
        const newPhotos = prev.filter(p => p.month !== month);
        return [...newPhotos, { month, url }].sort((a, b) => a.month - b.month);
      });
    }
  };

  const removePhoto = (month: number) => {
    setPhotos(prev => prev.filter(p => p.month !== month));
  };

  const handleDragStart = (month: number) => {
    setDraggedMonth(month);
  };

  const handleDrop = (targetMonth: number) => {
    if (draggedMonth === null) return;
    
    setPhotos(prev => {
      const newPhotos = [...prev];
      const draggedPhoto = newPhotos.find(p => p.month === draggedMonth);
      const targetPhoto = newPhotos.find(p => p.month === targetMonth);
      
      if (draggedPhoto && targetPhoto) {
        const draggedIndex = newPhotos.indexOf(draggedPhoto);
        const targetIndex = newPhotos.indexOf(targetPhoto);
        
        [newPhotos[draggedIndex], newPhotos[targetIndex]] = 
        [newPhotos[targetIndex], newPhotos[draggedIndex]];
        
        newPhotos[draggedIndex].month = draggedMonth;
        newPhotos[targetIndex].month = targetMonth;
      }
      
      return newPhotos;
    });
    setDraggedMonth(null);
  };

  const handlePrint = () => {
    setShowPrintPreview(true);
  };

  const scrollToUploader = () => {
    uploaderRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const printContent = (
    <div className="relative p-4 print:p-0 bg-[#FAF9F6]">
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url('https://www.transparenttextures.com/patterns/white-paper.png')`,
          backgroundRepeat: 'repeat'
        }}
      />
      <h1 className="font-handwriting text-7xl text-gray-800 text-center mb-16 print:mb-12">
        {babyName && `${babyName} - `}{intl.formatMessage({ id: 'app.firstYear' })}
      </h1>
      <div className="grid grid-cols-4 gap-8 print:gap-6 max-w-[297mm] mx-auto">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
          const photo = photos.find(p => p.month === month);
          return (
            <div key={month} className="relative">
              {/* Polaroid-style frame */}
              <div className="relative bg-white p-4 shadow-lg rotate-1 hover:rotate-0 transition-transform">
                <div className="aspect-square">
                  {photo ? (
                    <div className="w-full h-full overflow-hidden relative">
                      <img
                        src={photo.url}
                        alt={intl.formatMessage({ id: 'app.month.placeholder' }, { number: month })}
                        className="w-full h-full object-cover absolute inset-0"
                        loading="eager"
                        style={{
                          display: 'block',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          minWidth: '100%',
                          minHeight: '100%',
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200">
                      <span className="text-gray-400 text-sm">
                        {intl.formatMessage({ id: 'app.month.placeholder' }, { number: month })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Large number overlay - moved to front */}
              <div className="absolute -right-2 -bottom-2 text-[60px] sm:text-[80px] md:text-[120px] font-serif text-[#C0A080] opacity-80 pointer-events-none select-none z-10">
                {month}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <LanguageSwitcher />
      
      {/* Print-only content */}
      <div className="hidden print:block">
        <div id="printArea" className="bg-white" ref={printRef}>
          {printContent}
        </div>
      </div>

      {/* Print Preview Modal */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center print:hidden">
          <div className="bg-white w-[1200px] max-w-[95vw] max-h-[95vh] overflow-auto rounded-lg shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {intl.formatMessage({ id: 'app.print.preview.title' })}
              </h2>
              <button 
                onClick={() => setShowPrintPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <div className="bg-white" style={{ aspectRatio: '1.414', width: '100%' }}>
                {printContent}
              </div>
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Printer size={20} />
                  {intl.formatMessage({ id: 'app.print.now' })}
                </button>
                <button
                  onClick={() => setShowPrintPreview(false)}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {intl.formatMessage({ id: 'app.print.cancel' })}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content (hidden during print) */}
      <div className="print:hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 to-white py-16 md:py-0">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 h-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-blue-100 rounded-lg transform rotate-3"></div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {intl.formatMessage({ id: 'app.title' })
                .split(/<blue>|<\/blue>/)
                .map((part, index) => 
                  index === 1 ? 
                    <span key={index} className="text-blue-600">{part}</span> : 
                    part
                )}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 leading-relaxed">
              {intl.formatMessage({ id: 'app.description' })}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={scrollToUploader}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
              >
                <Camera size={24} />
                {intl.formatMessage({ id: 'app.start' })}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
                <Clock className="w-10 h-10 md:w-12 md:h-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {intl.formatMessage({ id: 'app.features.milestones' })}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {intl.formatMessage({ id: 'app.features.milestones.desc' })}
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
                <Upload className="w-10 h-10 md:w-12 md:h-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {intl.formatMessage({ id: 'app.features.upload' })}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {intl.formatMessage({ id: 'app.features.upload.desc' })}
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
                <Printer className="w-10 h-10 md:w-12 md:h-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {intl.formatMessage({ id: 'app.features.print' })}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {intl.formatMessage({ id: 'app.features.print.desc' })}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
            <button
              onClick={scrollToUploader}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </section>

        {/* Instructions Section */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                {intl.formatMessage({ id: 'app.instructions.title' })}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-blue-800">
                <li>{intl.formatMessage({ id: 'app.instructions.1' })}</li>
                <li>{intl.formatMessage({ id: 'app.instructions.2' })}</li>
                <li>{intl.formatMessage({ id: 'app.instructions.3' })}</li>
                <li>{intl.formatMessage({ id: 'app.instructions.4' })}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {intl.formatMessage({ id: 'app.examples.title' })}
              </h2>
              <p className="text-xl text-gray-600">
                {intl.formatMessage({ id: 'app.examples.subtitle' })}
              </p>
            </div>

            <div className="relative">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-lg">
                <img 
                  src={examples[currentExample].image}
                  alt={intl.formatMessage({ id: examples[currentExample].titleId })}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                  <h3 className="text-white text-2xl font-bold mb-2">
                    {intl.formatMessage({ id: examples[currentExample].titleId })}
                  </h3>
                  <p className="text-white/90">
                    {intl.formatMessage({ id: examples[currentExample].descriptionId })}
                  </p>
                </div>
              </div>

              <button 
                onClick={prevExample}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextExample}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
              >
                <ChevronRight size={24} />
              </button>

              <div className="flex justify-center mt-4 gap-2">
                {examples.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentExample(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentExample ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Baby Name Input */}
        <section ref={uploaderRef} className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-xl mx-auto mb-12">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <label htmlFor="babyName" className="block text-sm font-medium text-gray-700 mb-2">
                  {intl.formatMessage({ id: 'app.babyName.label' })}
                </label>
                <input
                  type="text"
                  id="babyName"
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  placeholder={intl.formatMessage({ id: 'app.babyName.placeholder' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {intl.formatMessage({ id: 'app.babyName.help' })}
                </p>
              </div>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {intl.formatMessage({ id: 'app.create.collection' })}
              </h2>
              <p className="text-lg text-gray-600">
                {intl.formatMessage({ id: 'app.create.description' })}
              </p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                const photo = photos.find(p => p.month === month);
                
                return (
                  <div
                    key={month}
                    className="aspect-square relative group"
                    draggable={!!photo}
                    onDragStart={() => handleDragStart(month)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(month)}
                  >
                    <div className="absolute inset-0 bg-white rounded-lg shadow-md overflow-hidden">
                      {photo ? (
                        <>
                          <img
                            src={photo.url}
                            alt={intl.formatMessage({ id: 'app.month.placeholder' }, { number: month })}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removePhoto(month)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-50 transition-colors">
                          <ImageIcon size={32} className="text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">
                            {intl.formatMessage({ id: 'app.month.placeholder' }, { number: month })}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(month, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm text-sm font-medium text-gray-700">
                      {intl.formatMessage({ id: 'app.month.placeholder' }, { number: month })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-16 flex justify-center">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={20} />
                {intl.formatMessage({ id: 'app.print.button' })}
              </button>
            </div>
          </div>
        </section>

        <footer className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-600 flex items-center justify-center gap-2">
              BabyCollage - {intl.formatMessage({ id: 'app.footer' })}
            </p>
          </div>
        </footer>
      </div>

      <style>{`
        @media print {
          @page {
            size: A3 landscape;  /* or A2 if needed */
            margin: 10mm;
            bleed: 3mm;
          }
          
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }

          #printArea {
            width: 100% !important;
            max-width: 420mm !important; /* A3 width - margins */
            margin: 0 auto !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          img {
            display: block !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            max-resolution: 300dpi;
          }

          .print-hide {
            display: none !important;
          }

          h1 {
            margin-bottom: 8mm !important;
          }

          .grid {
            grid-gap: 6mm !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;