# 抽奖系统更新说明 - V1.3

## 受控管理端实现思路

### 实现方式
- **URL参数控制**：通过在URL中添加 `?controlled=1` 参数来解锁受控模式
- **支持两种格式**：
  - `http://domain.com?controlled=1#/admin`
  - `http://domain.com#/admin?controlled=1`

### 实现原理
1. **参数检测**：在 `AdminPage.tsx` 中通过 `useEffect` 钩子检测URL参数
2. **状态管理**：将检测结果存储在 `controlledModeUnlocked` 状态中
3. **功能解锁**：根据 `controlledModeUnlocked` 状态条件渲染必中/禁中/权重功能

### 核心代码
```typescript
// 受控模式解锁：通过 URL 参数 ?controlled=1 解锁必中/禁中/权重功能
const [controlledModeUnlocked, setControlledModeUnlocked] = useState(false);

useEffect(() => {
  // 先尝试从 location.search 获取（标准格式）
  let params = new URLSearchParams(window.location.search);
  if (params.get('controlled') === '1') {
    setControlledModeUnlocked(true);
    return;
  }
  // 再尝试从 hash 中解析（hash 路由格式）
  const hash = window.location.hash;
  const hashQueryIndex = hash.indexOf('?');
  if (hashQueryIndex !== -1) {
    params = new URLSearchParams(hash.slice(hashQueryIndex));
    setControlledModeUnlocked(params.get('controlled') === '1');
  }
}, []);
```

### 功能特点
- **必中设置**：可以为特定人员设置必中特定奖项
- **禁中设置**：可以将特定人员加入黑名单，禁止中奖
- **权重设置**：可以为不同人员设置不同的中奖权重

## 触控屏操作实现思路

### 实现可行性
- **技术基础**：现有系统使用 React 和 Framer Motion，支持触摸事件
- **交互逻辑**：可以通过触摸手势实现页面切换和操作

### 实现方案
1. **页面切换**：
   - 左右滑动：切换不同页面（欢迎页 → 奖项页 → 抽奖页 → 结果页）
   - 上下滑动：在抽奖页中切换不同奖项

2. **抽奖操作**：
   - 点击/触摸抽奖区域：开始/停止抽奖
   - 长按：快速连续抽奖

3. **奖项跳转**：
   - 双击：快速跳转到下一个奖项
   - 三击：返回上一个奖项

### 技术实现
- **触摸事件监听**：使用 `touchstart`、`touchmove`、`touchend` 事件
- **手势识别**：实现简单的手势识别逻辑，如滑动方向、滑动距离、点击次数
- **状态管理**：通过 `useLotteryStore` 管理应用状态

### 优势
- **操作便捷**：在触控设备上无需键盘，通过触摸手势即可完成所有操作
- **响应迅速**：触摸操作的响应速度快，提升用户体验
- **交互直观**：手势操作符合用户的直觉，易于学习和使用

### 注意事项
- **兼容性**：需要考虑不同触控设备的触摸事件差异
- **灵敏度**：需要调整手势识别的灵敏度，确保操作的准确性
- **反馈**：需要提供适当的视觉反馈，让用户知道操作是否成功

## 总结

本次更新实现了受控管理端功能，通过URL参数解锁高级控制功能，同时为触控设备操作提供了可行的实现方案。这些功能的添加将提升抽奖系统的灵活性和用户体验，满足不同场景下的使用需求。