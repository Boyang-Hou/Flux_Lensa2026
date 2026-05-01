interface AnkiExportProps {
  ankiUrl: string;
  userId: string;
}

export default function AnkiExport({ ankiUrl, userId }: AnkiExportProps) {
  return (
    <div className="anki-section">
      {userId ? (
        <a
          href={ankiUrl}
          download="lensa_anki.apkg"
          className="lensa-btn lensa-btn-accent"
          target="_blank"
          rel="noopener noreferrer"
        >
          📥 下载 Anki 卡片包
        </a>
      ) : (
        <p className="anki-warning">请先输入用户 ID</p>
      )}
    </div>
  );
}
