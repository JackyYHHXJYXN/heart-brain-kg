# 改内容与发布流程

1. **新开 Claude 对话**，项目文件夹选 `~/Documents/medical-kg`。说明要改哪个图谱、改什么（附来源更好）。
2. Claude 修改后运行校验、本地预览检查，并提交到本地（不会自动推送）。
3. **发布（每次都需要你单独授权）：**
   1. 打开 https://github.com/settings/personal-access-tokens/new
   2. Token name 随意；Expiration 选 7 天；Repository access 选 **Only select repositories → heart-brain-kg**
   3. Permissions → Repository permissions：**Contents: Read and write**、**Metadata: Read-only**
   4. 生成后复制令牌，在项目文件夹的终端执行（Claude 会给你完整命令）：
      ```bash
      git -c credential.helper= push origin main
      ```
      提示用户名填 `JackyYHHXJYXN`，密码处粘贴令牌（不会显示）。
   5. 推送成功后，回 https://github.com/settings/personal-access-tokens 删除该令牌。
4. 等 1–2 分钟，用户重新打开即是新版。Claude 会用 `curl` 验证线上文件和 `og:image`。
5. 如果改了封面图或标题，社交平台缓存需手动刷新（微信没有官方刷新工具，换一次链接参数如 `?v=2` 可强制刷新）。

## 回滚
线上出问题时，让 Claude 用 `git revert <提交>` 生成回滚提交，再按上面流程推送一次。
