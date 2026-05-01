import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

interface CameraUploadProps {
  onCapture?: (file: File) => void;
  disabled?: boolean;
}

export default function CameraUpload({ onCapture, disabled }: CameraUploadProps) {
  const { t } = useSettings();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'drag'>('camera');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((file: File | undefined) => {
    if (!file) return;
    setSelectedFile(file);
    setPreview((currentPreview) => {
      if (currentPreview) URL.revokeObjectURL(currentPreview);
      return URL.createObjectURL(file);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event.target.files?.[0]);
  };

  const handleGenerate = () => {
    if (selectedFile) onCapture?.(selectedFile);
  };

  const handleClear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  return (
    <section className="camera-upload-section">
      <div className="upload-copy">
        <span className="eyebrow">{t.upload.eyebrow}</span>
        <h2>{t.upload.title}</h2>
        <p>{t.upload.subtitle}</p>
      </div>

      <div className="upload-tabs">
        <button
          className={`upload-tab ${activeTab === 'camera' ? 'active' : ''}`}
          onClick={() => setActiveTab('camera')}
        >
          {t.upload.camera}
        </button>
        <button
          className={`upload-tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          {t.upload.upload}
        </button>
        <button
          className={`upload-tab ${activeTab === 'drag' ? 'active' : ''}`}
          onClick={() => setActiveTab('drag')}
        >
          {t.upload.drag}
        </button>
      </div>

      <div
        className={`upload-area ${isDragging ? 'dragging' : ''} ${preview ? 'has-preview' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt={t.upload.previewAlt} className="upload-preview-img" />
        ) : (
          <div className="upload-placeholder">
            <div className="camera-icon-circle">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <p className="placeholder-title">{t.upload.placeholderTitle}</p>
            <p className="placeholder-hint">{t.upload.placeholderHint}</p>
          </div>
        )}
      </div>

      <div className="upload-actions">
        {activeTab !== 'drag' && (
          <label className="upload-btn primary">
            {preview ? t.upload.chooseAgain : activeTab === 'camera' ? t.upload.openCamera : t.upload.chooseImage}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture={activeTab === 'camera' ? 'environment' : undefined}
              onChange={handleInputChange}
              disabled={disabled}
              className="file-input"
            />
          </label>
        )}

        {preview && (
          <button className="upload-btn secondary" onClick={handleClear} disabled={disabled}>
            {t.upload.clear}
          </button>
        )}

        <button
          className="upload-btn generate"
          onClick={preview ? handleGenerate : () => fileRef.current?.click()}
          disabled={disabled || (preview ? !selectedFile : activeTab === 'drag')}
        >
          {disabled ? t.upload.generating : preview ? t.upload.generate : t.upload.chooseFirst}
        </button>
      </div>
    </section>
  );
}
