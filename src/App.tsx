import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Trash2, Camera, Clock, Printer, Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PhotoData {
  month: number;
  url: string;
}

function App() {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [draggedMonth, setDraggedMonth] = useState<number | null>(null);
  const [currentExample, setCurrentExample] = useState(0);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const uploaderRef = useRef<HTMLDivElement>(null);

  const examples = [
    {
      title: "Classic Monthly Grid",
      description: "A beautiful grid layout perfect for framing or creating a photo book",
      image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=1200&auto=format&fit=crop&q=80"
    },
    {
      title: "Modern Timeline",
      description: "See your baby's growth journey in a stunning timeline format",
      image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&auto=format&fit=crop&q=80"
    },
    {
      title: "Month by Month Collection",
      description: "Each milestone beautifully captured and arranged",
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print Preview Modal */}
      {showPrintPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center print:hidden">
          <div className="bg-white w-[1000px] max-w-[90vw] max-h-[90vh] overflow-auto rounded-lg shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Print Preview</h2>
              <button 
                onClick={() => setShowPrintPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8">
              <div id="printArea" className="bg-white" ref={printRef}>
                <div className="p-8">
                  <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    First Year Milestones
                  </h1>
                  <div className="grid grid-cols-4 gap-6">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                      const photo = photos.find(p => p.month === month);
                      return (
                        <div key={month} className="aspect-square">
                          <div className="relative h-full">
                            {photo ? (
                              <div className="w-full h-full rounded-lg shadow-md overflow-hidden">
                                <img
                                  src={photo.url}
                                  alt={`Month ${month}`}
                                  className="w-full h-full object-cover"
                                  style={{ display: 'block' }}
                                />
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                                <span className="text-gray-400">Month {month}</span>
                              </div>
                            )}
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-md text-sm font-medium">
                              Month {month}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Printer size={20} />
                  Print Now
                </button>
                <button
                  onClick={() => setShowPrintPreview(false)}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content (hidden during print) */}
      <div className="print:hidden">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 to-white">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="grid grid-cols-4 gap-4 p-8 h-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-blue-100 rounded-lg transform rotate-3"></div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Capture Your Baby's First Year
              <span className="text-blue-600"> Beautifully</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Create a stunning monthly milestone collection of your baby's first year. 
              Upload, arrange, and print a beautiful keepsake in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={scrollToUploader}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
              >
                <Camera size={24} />
                Start Creating
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
                <Clock className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Monthly Milestones</h3>
                <p className="text-gray-600">Track your baby's growth month by month in a beautiful layout</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
                <Upload className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Easy Upload</h3>
                <p className="text-gray-600">Simple drag and drop interface to arrange your photos</p>
              </div>
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm">
                <Printer className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Print Ready</h3>
                <p className="text-gray-600">Generate a high-quality printable layout instantly</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
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

        {/* Example Outputs Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Beautiful Results</h2>
              <p className="text-xl text-gray-600">See what you can create with our easy-to-use tool</p>
            </div>

            <div className="relative">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-lg">
                <img 
                  src={examples[currentExample].image}
                  alt={examples[currentExample].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                  <h3 className="text-white text-2xl font-bold mb-2">{examples[currentExample].title}</h3>
                  <p className="text-white/90">{examples[currentExample].description}</p>
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

        {/* Photo Uploader Section */}
        <section ref={uploaderRef} className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Create Your Collection</h2>
              <p className="text-lg text-gray-600">Upload your precious moments and create a beautiful timeline</p>
            </div>

            <div className="mb-8 flex justify-end">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={20} />
                Print Layout
              </button>
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
                            alt={`Month ${month}`}
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
                          <span className="text-sm text-gray-500">Month {month}</span>
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
                      Month {month}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Instructions</h2>
              <ul className="list-disc list-inside space-y-2 text-blue-800">
                <li>Click on each box to upload a photo for that month</li>
                <li>Drag and drop photos to rearrange them</li>
                <li>Click the trash icon to remove a photo</li>
                <li>Click "Print Layout" to generate a printable version</li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-600 flex items-center justify-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500" /> for growing families
            </p>
          </div>
        </footer>
      </div>

      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          #printArea {
            display: block !important;
            page-break-inside: avoid;
          }
          #printArea img {
            display: block !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print-hide {
            display: none !important;
          }
          .fixed {
            position: static !important;
          }
          .modal {
            position: static !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;