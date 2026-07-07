# 安装

## 系统要求

- **Node.js**: >= 21.0.0，或 **Bun** >= 1.0
- **Chrome** 已运行并登录目标网站（浏览器命令需要）

## 通过 npm 安装（推荐）

```bash
npm install -g @toy-box/opencli
```

## 从源码安装

```bash
git clone git@github.com:jackwener/toycli.git
cd toycli
npm install
npm run build
npm link
toycli list
```

## 更新

```bash
npm install -g @toy-box/opencli@latest

# 如果你在用打包发布的 ToyCLI skills，也一起刷新
npx skills add jackwener/toycli
```

如果你只装了部分 skill，也可以只刷新自己在用的：

```bash
npx skills add jackwener/toycli --skill toycli-adapter-author
npx skills add jackwener/toycli --skill toycli-autofix
npx skills add jackwener/toycli --skill toycli-browser
npx skills add jackwener/toycli --skill toycli-browser-sitemap
npx skills add jackwener/toycli --skill toycli-sitemap-author
npx skills add jackwener/toycli --skill toycli-usage
npx skills add jackwener/toycli --skill smart-search
```

## 验证安装

```bash
toycli --version
toycli list
toycli doctor
```
