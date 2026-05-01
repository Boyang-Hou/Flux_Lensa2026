# Lensa Mock 数据系统

## 📦 已创建的文件

### 核心文件

1. **`src/services/mockData.ts`** - Mock 数据定义
   - 8 个预设学习场景
   - 完整的标注、练习题、反馈数据
   - 场景包括：桌子、书本、苹果、摩托车、咖啡、房子、水、手机

2. **`src/services/mockApi.ts`** - Mock API 服务
   - 模拟所有 4 个后端 API 接口
   - 模拟网络延迟（500-2000ms）
   - 模拟 AI 生成延迟（3000-6000ms）

3. **`src/services/api.ts`** - API 调用层（已修改）
   - 自动切换 Mock/真实 API
   - 开发环境默认启用 Mock
   - 生产环境使用真实 API

### 配置文件

4. **`.env.development`** - 开发环境配置
   - `VITE_USE_MOCK=true` - 启用 Mock

5. **`.env.production`** - 生产环境配置
   - `VITE_USE_MOCK=false` - 禁用 Mock

### 辅助文件

6. **`src/components/MockScenarioSelector.tsx`** - 场景选择器组件
   - 可视化选择 Mock 场景
   - 查看场景详情
   - 测试答案反馈

7. **`src/services/mockIndex.ts`** - 导出文件
   - 统一导出 Mock 相关功能

8. **`src/testMock.ts`** - 测试脚本
   - 测试所有 Mock API 功能
   - 可在浏览器控制台运行

9. **`MOCK_USAGE.md`** - 使用文档
   - 详细的使用说明
   - 常见问题解答

10. **`src/App.example.tsx`** - 示例代码
    - 展示如何使用 MockScenarioSelector

## 🚀 快速开始

### 1. 启动开发服务器

```bash
cd react
npm install
npm run dev
```

Mock 数据会自动启用！

### 2. 在应用中使用 MockScenarioSelector

```tsx
import { MockScenarioSelector } from './services/mockIndex';

function App() {
  return (
    <div>
      {import.meta.env.DEV && <MockScenarioSelector />}
      {/* 你的应用内容 */}
    </div>
  );
}
```

### 3. 测试 Mock API

在浏览器控制台运行：

```javascript
testMockApi()
```

## 📊 Mock 数据统计

| 类型 | 数量 | 说明 |
|------|------|------|
| 学习场景 | 8 个 | 涵盖日常生活常见物品 |
| 印尼语词汇 | 24 个 | 每个场景 3 个新词汇 |
| API 接口 | 4 个 | 完整模拟后端功能 |
| 延迟模拟 | 2 种 | 普通延迟 + AI 生成延迟 |

## 🎯 功能特性

### ✅ 已实现

- [x] 完整的 Mock 数据系统
- [x] 8 个预设学习场景
- [x] 自动切换 Mock/真实 API
- [x] 模拟网络延迟
- [x] 可视化场景选择器
- [x] 测试脚本
- [x] 详细文档

### 🔄 Mock API 行为

| API | 延迟 | 行为 |
|-----|------|------|
| POST /api/generate | 500-2000ms | 随机选择场景，返回标注 |
| GET /api/render | 3000-6000ms | 返回随机 Unsplash 图片 |
| POST /api/evaluate | 500ms | 检查答案，返回反馈 |
| GET /api/export_anki | 0ms | 返回 base64 .apkg 文件 |

## 📝 使用示例

### 示例 1: 查看所有场景

```typescript
import { mockScenarios } from './services/mockData';

mockScenarios.forEach(scenario => {
  console.log(`${scenario.name}: ${scenario.annotations[0].object}`);
});
```

### 示例 2: 使用特定场景

```typescript
import { mockApi } from './services/mockApi';

// 设置特定场景
mockApi.setScenario('table');

// 生成标注
const result = await mockApi.generateAnnotations(file, userId);
```

### 示例 3: 测试答案评估

```typescript
import { mockApi } from './services/mockApi';

// 测试正确答案
const feedback = await mockApi.evaluateAnswer(sessionId, 'meja');
console.log(feedback); // "✅ Benar! 非常好！meja 是桌子的意思"
```

## 🎨 场景列表

| ID | 名称 | 印尼语 | 中文 | 新词汇 |
|----|------|--------|------|--------|
| table | 桌子场景 | meja | 桌子 | meja, dari, kayu |
| book | 书本场景 | buku | 书 | buku, bahasa, Indonesia |
| apple | 苹果场景 | apel | 苹果 | apel, merah, buah |
| motorcycle | 摩托车场景 | motor | 摩托车 | motor, jalan, roda |
| coffee | 咖啡场景 | kopi | 咖啡 | kopi, panas, minum |
| house | 房屋场景 | rumah | 房子 | rumah, tinggal, bagus |
| water | 水场景 | air | 水 | air, mineral, botol |
| phone | 手机场景 | ponsel | 手机 | ponsel, pintar, telepon |

## 🔧 自定义 Mock

### 添加新场景

在 `mockData.ts` 中添加：

```typescript
{
  id: 'computer',
  name: '电脑场景',
  description: '一台笔记本电脑',
  annotations: [{
    object: 'komputer',
    label: '电脑',
    new_words: ['komputer', 'laptop', 'elektronik'],
  }],
  caption: '这是一台笔记本电脑',
  outputTask: 'Saya menggunakan ____ (电脑)',
  feedback: {
    correct: '正确！komputer 是电脑的意思',
    incorrect: '提示：这是一种电子设备',
  },
}
```

### 修改延迟

在 `mockApi.ts` 中修改：

```typescript
const MOCK_DELAY_MIN = 500;
const MOCK_DELAY_MAX = 2000;
const RENDER_DELAY_MIN = 3000;
const RENDER_DELAY_MAX = 6000;
```

## 📚 相关文档

- [MOCK_USAGE.md](./MOCK_USAGE.md) - 详细使用指南
- [README.md](../README.md) - 项目总览
- [Jianhao_Tasks.md](../Jianhao_Tasks.md) - 任务文档

## 💡 提示

1. **开发环境自动启用**：无需手动配置
2. **生产环境自动禁用**：确保使用真实 API
3. **可视化测试**：使用 MockScenarioSelector 组件
4. **控制台测试**：运行 `testMockApi()` 函数
5. **自定义场景**：在 mockData.ts 中添加

## 🐛 故障排查

### Mock 没有生效？

1. 检查 `.env.development` 文件
2. 确认 `VITE_USE_MOCK=true`
3. 重启开发服务器

### 看不到 MockScenarioSelector？

1. 确认在开发环境（`npm run dev`）
2. 检查 `import.meta.env.DEV` 是否为 `true`
3. 在 App.tsx 中添加组件

### 图片加载失败？

Mock 使用的是 Unsplash 图片，可能需要网络连接。如果加载失败，可以：
1. 使用本地图片
2. 使用占位图服务（如 placeholder.com）

## 📞 联系方式

- 前端开发：Jianhao
- 后端开发：Boyang
- QA 测试：Wilson

---

**创建日期**: 2026-05-01  
**版本**: v1.0  
**维护者**: Jianhao
