# 乌鸦首屏素材与接入

`PointerScrubVideo.tsx` 是完整、带注释的 React 组件。配套 CSS 必须一起使用。

```tsx
import { PointerScrubVideo } from "./PointerScrubVideo";

// 父容器必须具有实际尺寸；仅这块交互区域使用 touch-action:none。
<div style={{ width: 360, height: 480 }}>
  <PointerScrubVideo
    src="/media/crow-gaze.mp4"
    poster="/media/crow-gaze-poster.webp"
    initialProgress={0.5}
    smoothing={0.15}
    fps={30}
  />
</div>
```

上面两个路径是待提供素材的示例，不是当前仓库已有文件；因此尚未挂到首页。

2026-09-28：用户补充 `/Users/lei/Desktop/未命名.mp4`（960×960，约 2.08 秒）。该片为白底扇翅，不包含有序左右视线。已由 `scripts/prepare-flying-crow.py` 生成 `flying-crow-packed.mp4` 与透明 poster，通过 `FlyingCrow.tsx` 接入首页窗外。此循环与拖动组件独立；眼球拖动仍需对应素材。生成命令：`python scripts/prepare-flying-crow.py /Users/lei/Desktop/未命名.mp4`，依赖 `imageio-ffmpeg numpy pillow`。

## 素材要求

当前首页编排（2026-09-29）：`flying-crow-arrive.mp4` 播放一次约 2.25 秒的扇翅收翅动作，然后接 `flying-crow-rest.mp4`。停留循环长约 11.33 秒，身体使用固定姿态，包含两次正向眨眼，间隔约 5–6 秒。仅飞行片段反向编排，眨眼不倒放；没有时间混帧。构建脚本另需 `opencv-python-headless` 做身体对齐。原来的扑腾循环不再由首页使用。

- 拖动视频必须按“看左 → 看正前方 → 看右”排列，摄像机与身体位置保持固定。
- 普通 MP4 没有透明通道。要保留窗外云景，需要提供蒙版/色键素材并增加合成步骤，或提供云海与乌鸦已合成的视频。不能仅靠 CSS 消除矩形背景。
- 同一个 `currentTime` 同时决定视频里的所有动作。若持续扇翅和眼睛拖动要相互独立，需独立扇翅循环和眼部素材/蒙版，不能对同一个 MP4 同时 `play()` 与 seek。
- 为了平滑反向定位，建议 H.264 全 I 帧、无音轨、`+faststart`。`fastSeek()` 是近似关键帧定位，不保证逐帧精确；本组件在停稳后以 `currentTime` 精确校正。
- 首帧预热为 0.02 秒。左右边界映射到首个安全可显示时间与最后一个可播放帧，避免正好 seek 到 duration 时出现结束帧空白。

## 首页接入位置

在 `WindowJourney` 的 sky 图层之后、cabin 图层之前放入独立乌鸦图层，使窗框遮挡乌鸦。对照参考图，主体位于窗洞左下方，头在窗洞中部、身体底部接近下沿。该层应跟随舷窗穿越进度退出，不覆盖导航或购买按钮。

将交互事件限制在窗洞区域；不要对整个首屏设置 `touch-action:none`，否则手机在整屏都无法纵向滚动。其他区域保留原有滚动穿窗交互。

## 验证

```sh
npx tsc --noEmit
npx eslint src/components/PointerScrubVideo.tsx
node scripts/test-pointer-scrub.cjs
```

自动测试使用确定性的媒体状态模拟，覆盖解码背压、反向 seek、fastSeek 降级、零宽度、离屏暂停、poster 兜底和卸载清理。真实 MP4 的解码流畅度与 iOS Safari 首帧还需要最终素材在真机上验证。
