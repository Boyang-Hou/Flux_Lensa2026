import { MockScenarioSelector } from './services/mockIndex';

function App() {
  return (
    <div>
      {/* 仅在开发环境显示 Mock 场景选择器 */}
      {import.meta.env.DEV && (
        <MockScenarioSelector 
          onScenarioSelect={(scenario) => {
            console.log('Selected scenario:', scenario);
          }}
        />
      )}
      
      {/* 原有的应用内容 */}
      {/* ... */}
    </div>
  );
}

export default App;
