import { useReducer, useCallback } from 'react';
import { lensaReducer, initialState } from '../hooks/useLensa';
import { generateAnnotations, renderImage, evaluateAnswer, getAnkiDownloadUrl } from '../services/api';

export function useLensaApp() {
  const [state, dispatch] = useReducer(lensaReducer, initialState);

  const handleGenerate = useCallback(async (file: File) => {
    dispatch({ type: 'GENERATE_START' });
    try {
      const result = await generateAnnotations(file, state.userId);
      dispatch({ type: 'GENERATE_SUCCESS', payload: result });
      dispatch({ type: 'RENDER_START' });
      try {
        const renderResult = await renderImage(result.sessionId);
        dispatch({ type: 'RENDER_SUCCESS', payload: renderResult.imageUrl });
      } catch (err: any) {
        dispatch({ type: 'RENDER_ERROR', payload: err.message || '渲染失败' });
      }
    } catch (err: any) {
      dispatch({ type: 'GENERATE_ERROR', payload: err.message || '生成失败' });
    }
  }, [state.userId]);

  const handleSubmitAnswer = useCallback(async (answer: string) => {
    if (!state.sessionId) {
      dispatch({ type: 'SET_FEEDBACK', payload: '请先生成内容' });
      return;
    }
    if (!answer.trim()) {
      dispatch({ type: 'SET_FEEDBACK', payload: '请输入你的回答' });
      return;
    }
    try {
      const result = await evaluateAnswer(state.sessionId, answer);
      const feedbackText = result.is_correct
        ? `✅ Benar! ${result.feedback}`
        : `🔄 Coba lagi: ${result.feedback}`;
      dispatch({ type: 'SET_FEEDBACK', payload: feedbackText });
    } catch (err: any) {
      dispatch({ type: 'SET_FEEDBACK', payload: `⚠️ 评估失败：${err.message}` });
    }
  }, [state.sessionId]);

  const ankiUrl = getAnkiDownloadUrl(state.userId);

  return { state, dispatch, handleGenerate, handleSubmitAnswer, ankiUrl };  // ← 这行是关键
}
