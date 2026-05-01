import { mockApi } from './services/mockApi';

async function testMockApi() {
  console.log('Starting Mock API test');

  const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
  const generateResult = await mockApi.generateAnnotations(mockFile, 'test-user');
  console.log('Session ID:', generateResult.sessionId);
  console.log('Annotations:', generateResult.annotations);
  console.log('Task:', generateResult.task);

  const renderResult = await mockApi.renderImage(generateResult.sessionId);
  console.log('Image URL:', renderResult.imageUrl);

  const correctAnswer = generateResult.annotations[0].object;
  const correctFeedback = await mockApi.evaluateAnswer(generateResult.sessionId, correctAnswer);
  console.log('Correct feedback:', correctFeedback);

  const wrongFeedback = await mockApi.evaluateAnswer(generateResult.sessionId, 'wrong_answer');
  console.log('Wrong feedback:', wrongFeedback);

  const ankiUrl = mockApi.getAnkiDownloadUrl('test-user');
  console.log('Anki URL:', `${ankiUrl.substring(0, 50)}...`);

  const allScenarios = mockApi.getAllScenarios();
  console.log(`Total scenarios: ${allScenarios.length}`);
  allScenarios.forEach((scenario, index) => {
    console.log(`${index + 1}. ${scenario.name}: ${scenario.annotations[0].object} = ${scenario.annotations[0].label}`);
  });

  console.log('Mock API test completed');
}

if (typeof window !== 'undefined') {
  (window as Window & { testMockApi?: typeof testMockApi }).testMockApi = testMockApi;
  console.log('Tip: run testMockApi() in the browser console to test the mock API');
}

export { testMockApi };
