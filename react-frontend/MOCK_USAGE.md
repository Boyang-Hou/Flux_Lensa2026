# Mock 数据使用指南

## 📋 概述

本项目提供了完整的 mock 数据系统，方便前端开发者在没有后端 API 的情况下进行开发和测试。

## 🚀 快速开始

### 开发环境（自动启用 Mock）

```bash
cd react
npm install
npm run dev
```

开发环境下，Mock 数据会自动启用。

### 生产环境（禁用 Mock）

```bash
npm run build
```

生产环境下，Mock 数据会被禁用，会调用真实的后端 API。

## 📁 文件结构

```
react/src/services/
├── api.ts              # API 调用层（自动切换 Mock/真实 API）
├── mockApi.ts          # Mock API 服务
└── mockData.ts         # Mock 数据定义
```

## 🎭 Mock 场景

系统提供了 8 个预设的学习场景：

| 场景 ID | 场景名称 | 印尼语词汇 | 中文含义 |
|---------|---------|-----------|---------|
| table | 桌子场景 | meja | 桌子 |
| book | 书本场景 | buku | 书 |
| apple | 苹果场景 | apel | 苹果 |
| motorcycle | 摩托车场景 | motor | 摩托车 |
| coffee | 咖啡场景 | kopi | 咖啡 |
| house | 房屋场景 | rumah | 房子 |
| water | 水场景 | air | 水 |
| phone | 手机场景 | ponsel | 手机 |

## ⚙️ 配置说明

### 环境变量

**`.env.development`**（开发环境）：
```env
VITE_USE_MOCK=true
VITE_API_BASE=https://placeholder.ngrok.io
```

**`.env.production`**（生产环境）：
```env
VITE_USE_MOCK=false
VITE_API_BASE=https://your-ngrok-url.ngrok.io
```

### 手动控制 Mock

你也可以在代码中手动控制是否使用 Mock：

```typescript
// 在 api.ts 中修改
const USE_MOCK = true; // 强制启用 Mock
const USE_MOCK = false; // 强制禁用 Mock
```

## 🎯 Mock API 行为

### 1. 生成标注（POST /api/generate）

- **延迟**：500-2000ms（模拟网络延迟）
- **行为**：随机选择一个场景，返回对应的标注数据
- **返回数据**：
  ```json
  {
    "session_id": "mock-session-1234567890-abc123",
    "annotations": [
      {
        "object": "meja",
        "label": "桌子",
        "new_words": ["meja", "dari", "kayu"]
      }
    ],
    "caption": "这是一张木制桌子",
    "output_task": "Ini adalah ____ (桌子)"
  }
  ```

### 2. 生成美图（GET /api/render）

- **延迟**：3000-6000ms（模拟 AI 生成时间）
- **行为**：返回一个随机的 Unsplash 图片 URL
- **返回数据**：
  ```json
  {
    "rendered_image_url": "https://images.unsplash.com/photo-xxx?w=800"
  }
  ```

### 3. 评估答案（POST /api/evaluate）

- **延迟**：500ms
- **行为**：检查用户答案是否正确，返回反馈
- **返回数据**：
  ```json
  {
    "is_correct": true,
    "feedback": "非常好！meja 是桌子的意思"
  }
  ```

### 4. 导出 Anki（GET /api/export_anki）

- **延迟**：无
- **行为**：返回一个 base64 编码的 .apkg 文件
- **返回数据**：Data URL（可直接下载）

## 🧪 测试场景

### 测试正确答案

1. 上传任意图片
2. 查看生成的标注和练习题
3. 在填空题中输入正确的印尼语单词（如 `meja`）
4. 应该看到 "✅ Benar!" 的反馈

### 测试错误答案

1. 上传任意图片
2. 在填空题中输入错误的答案（如 `xyz`）
3. 应该看到 "🔄 Coba lagi:" 的反馈，并给出提示

### 测试 Anki 导出

1. 点击"导出 Anki"按钮
2. 应该下载一个 `lensa_anki.apkg` 文件
3. 可以导入 Anki 应用（虽然是 mock 数据）

## 🔧 自定义 Mock 数据

### 添加新场景

在 `mockData.ts` 中添加新的场景：

```typescript
export const mockScenarios: MockScenario[] = [
  // ... 现有场景
  {
    id: 'computer',
    name: '电脑场景',
    description: '一台笔记本电脑',
    annotations: [
      {
        object: 'komputer',
        label: '电脑',
        new_words: ['komputer', 'laptop', 'elektronik'],
      },
    ],
    caption: '这是一台笔记本电脑',
    outputTask: 'Saya menggunakan ____ (电脑)',
    feedback: {
      correct: '正确！komputer 是电脑的意思',
      incorrect: '提示：这是一种电子设备',
    },
  },
];
```

### 修改延迟时间

在 `mockApi.ts` 中修改：

```typescript
const MOCK_DELAY_MIN = 500;      // 最小延迟（毫秒）
const MOCK_DELAY_MAX = 2000;     // 最大延迟（毫秒）
const RENDER_DELAY_MIN = 3000;   // 渲染最小延迟
const RENDER_DELAY_MAX = 6000;   // 渲染最大延迟
```

### 使用特定场景

如果你想测试特定场景，可以在 `mockApi.ts` 中修改：

```typescript
async generateAnnotations(file: File, userId: string) {
  // 强制使用特定场景
  this.currentScenario = mockScenarios.find(s => s.id === 'table');
  // ...
}
```

## 📊 Mock 数据统计

- **场景数量**：8 个
- **词汇总数**：24 个
- **覆盖主题**：家具、学习、食物、交通、饮品、住房、生活用品、电子设备

## 🐛 常见问题

### Q: Mock 数据没有生效？

**A**: 检查以下几点：
1. 确认 `.env.development` 文件存在
2. 确认 `VITE_USE_MOCK=true`
3. 重启开发服务器（`npm run dev`）

### Q: 如何查看当前是否在使用 Mock？

**A**: 在浏览器控制台中查看网络请求：
- Mock 模式：不会有真实的 API 请求
- 真实模式：会看到 `https://your-ngrok-url.ngrok.io/api/...` 的请求

### Q: Mock 数据可以用于生产环境吗？

**A**: 不可以。Mock 数据仅用于开发和测试。生产环境必须配置真实的后端 API。

## 📝 注意事项

1. **Mock 数据仅用于开发**：生产环境必须使用真实 API
2. **图片 URL 是临时的**：Unsplash 图片 URL 可能会失效
3. **Session 管理**：Mock 的 session 是内存中的，刷新页面会丢失
4. **Anki 文件是示例**：Mock 的 .apkg 文件不是真实的 Anki 卡片包

## 🎓 学习建议

使用 Mock 数据时，建议：

1. **测试各种场景**：尝试所有 8 个场景，确保 UI 正确显示
2. **测试边界情况**：空输入、超长输入、特殊字符等
3. **测试网络延迟**：观察加载状态的显示
4. **测试错误处理**：模拟网络错误、超时等情况

## 📞 联系方式

如有问题，请联系：
- 前端开发：Jianhao
- 后端开发：Boyang
- QA 测试：Wilson
