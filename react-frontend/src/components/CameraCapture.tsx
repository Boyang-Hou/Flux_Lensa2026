import { useRef, useState, useCallback } from 'react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  disabled: boolean;
}

export default function CameraCapture({ onCapture, disabled }: CameraCaptureProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0]);
  };

  const handleGenerate = () => {
    if (selectedFile) onCapture(selectedFile);
  };

  const handleClear = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  }, []);

  return (
    <div className="camera-capture">
      <div className="camera-frame">
        <div
          className={`camera-preview-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {preview ? (
            <img src={preview} alt="预览" className="camera-preview-img" />
          ) : (
            <div className="camera-placeholder">
              <span className="camera-placeholder-icon">📷</span>
              <p>拍照或上传图片</p>
              <p className="camera-placeholder-hint">支持拖拽上传 / 摄像头拍照</p>
            </div>
          )}
        </div>
      </div>

      <div className="camera-actions">
        <label className="camera-upload-btn">
          {preview ? '🔄 重新选择' : '📸 拍照 / 上传'}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleInputChange}
            disabled={disabled}
            className="camera-file-input"
          />
        </label>
        {preview && (
          <button className="camera-clear-btn" onClick={handleClear} disabled={disabled}>
            ✕ 清除
          </button>
        )}
      </div>

      <button
        className="lensa-btn lensa-btn-primary lensa-btn-full"
        onClick={handleGenerate}
        disabled={!selectedFile || disabled}
      >
        {disabled ? '⏳ 处理中...' : '🔍 生成学习内容'}
      </button>
    </div>
  );
}
