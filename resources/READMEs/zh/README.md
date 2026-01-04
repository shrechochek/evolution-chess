# Evolution Chess
> **Evolution Chess** 是一种国际象棋变体，在该模式中，棋子在吃子后会获得经验值（XP），并进化为新的单位

---

> [!IMPORTANT]
> 🌍 **语言**  
> [🇺🇸(en)](../../../README.md) | [🇷🇺(ru)](../ru/README.md) | [🇺🇦(ua)](../ua/README.md) | 🇨🇳(zh)

> [!NOTE]
> ⚠️ **机器翻译**  
> 本 README 为自动翻译版本。欢迎通过 pull request 的形式对翻译和措辞进行改进 🙌  
> 详情请见 [这里](CONTRIBUTING.md)

---

## 目录
- 🎮 [如何游玩](#如何游玩)
- 🏙 [游戏示例](#游戏示例)
- 🪄 [棋子如何进化](#棋子如何进化)
- 🗂 [如何创建模组](#如何创建模组)
- 🧭 [开发路线图](#开发路线图)
- ⚠️ [已知限制](#已知限制)
- 🧑‍💻 [作者](#作者)
- ⚙️ [引擎](#引擎)
- 🛠 [技术栈](#技术栈)

---

<h2 id="如何游玩">🎮 如何游玩</h2>
你可以通过以下两种方式游玩 Evolution Chess：

1. 🌐 [**在线游玩**](https://shrechochek.github.io/evolution-chess/)
2. 💻 下载仓库并在本地运行

> [!NOTE]
> 你可以与朋友对战，或与 AI 对战

---

<h2 id="游戏示例">🏙 游戏示例</h2>
<img src="../../game-images/game-example-gif-3.gif" width="700">

📸 更多截图：[点击这里](../../game-images)

---

<h2 id="棋子如何进化">🪄 棋子如何进化</h2>
当一个棋子吃掉另一个棋子时，它会获得经验值，并可能进化为新的棋子

[**进化树**](https://miro.com/app/board/uXjVI-ZUrws=/)

---

<h2 id="如何创建模组">🗂 如何创建模组</h2>

### 1. 创建模组文件夹
创建一个包含 `.json` 文件的文件夹

### 2. 添加图片
如果你使用自定义图片：
- 将它们上传到模组内的 `/images` 文件夹（**推荐**）
- 或直接放在模组文件夹中

### 3. 为棋子设置符号
```json
"SYMBOLS": {
  "pawn": "pawn",
  "king": "king",
  "rook": "rook",
  "knight": "knight",
  "bishop": "bishop",
  "queen": "queen",
  "spearman": "spearman",
  "star": "star"
}
```

### 4. 描述棋子信息
```json
"PIECE_TYPES": {
  "pawn": { 
    "name": "spearman", 
    "symbol": "spearman", 
    "desc": "可以攻击正前方格子的兵",
    "role": "pawn", 
    "tier": 1, 
    "xpReq": 1,
    "special": "spear_attack"
  }
}
```

- **`name`** — 棋子的显示名称  
- **`symbol`** — 在 `SYMBOLS` 中定义的符号  
- **`desc`** — 棋子的描述  
- **`role`** — 特殊角色：
  - `king` — 可以王车易位，失去所有国王即失败
  - `pawn` — 可以升变，支持吃过路兵
  - `rook` — 参与王车易位
- **`tier`** — 进化等级  
- **`xpReq`** — 进化所需 XP（`-1` = 不可进化）  
- **`special`** — 特殊能力
  - `spear_attack` — 攻击前方格子
  - `revenge` — 摧毁吃掉它的棋子
  - `teleport` — 传送到任意空格
  - `explode_n` — 在半径 n 内引爆（吃子或被吃时）
  - `detonate_n` — 类似 explode，但不影响兵和国王
  - `explode_all_n` — 无条件引爆半径 n
  - `range_capture` — 不移动即可吃子
  - `swap_ally` — 与同阵营棋子交换位置
- **`ghost`** — 可穿过 n 个棋子
- **`immortal`** — 无法被吃

> [!WARNING]
> 你需要重新实现所有标准棋子的逻辑

> [!TIP]
> 测试模式中已经包含标准棋子的逻辑，可直接使用

### 5. 编写进化树
```json
"EVOLUTION_TREE": {
  "pawn": ["star"],
  "mutant": [],
  "king": [],
  "rook": [],
  "knight": [],
  "bishop": [],
  "queen": []
}
```

---

<h2 id="开发路线图">🧭 开发路线图</h2>

- [x] 可游玩的 Alpha 版本
- [x] 两层进化
- [x] 模组支持
- [x] 自适应引擎
- [x] 移动端 UI 改进
- [x] 更强的引擎
- [ ] 更好的移动端控制
- [ ] 多人在线网站

---

<h2 id="已知限制">⚠️ 已知限制</h2>

- 可能存在视觉 Bug
- 操作尚未完全打磨

---

<h2 id="引擎">⚙️ 引擎</h2>

游戏使用自定义国际象棋引擎

该引擎支持自定义棋子和进化机制

引擎棋力约为 1300 ELO

使用 minimax、alpha–beta 剪枝和走法排序

---

<h2 id="技术栈">🛠 技术栈</h2>

- **前端:** HTML, CSS, JavaScript
- **游戏引擎:** 自定义国际象棋引擎（JavaScript）
- **模组:** 基于 JSON 的模组系统
- **部署:** GitHub Pages

---

<h2 id="作者">🧑‍💻 作者</h2>

- 🧑‍💻 **程序员**: [_shrechochek_](https://github.com/shrechochek)
- 🎨 **美术**: [_Serebr1k_](https://github.com/Serebr1k-code)
