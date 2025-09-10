"use client";
import React, { useState } from 'react';

type DropZoneProps = {
  onFiles: (files: FileList) => void;
};

export default function DropZone({ onFiles }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 hover:scale-105 ${
        isDragOver
          ? 'border-sky-400 bg-sky-50 scale-105'
          : 'border-gray-300 hover:border-sky-300 hover:bg-sky-50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />
      
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-sky-400 to-amber-400 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {isDragOver ? 'Drop your files here' : 'Upload Resume Files'}
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your resume files here, or click to browse
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span className="px-3 py-1 bg-gray-100 rounded-full">PDF</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">DOC</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">DOCX</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">TXT</span>
          </div>
        </div>
      </div>
    </div>
  );
}


