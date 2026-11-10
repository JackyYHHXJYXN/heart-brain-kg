/* 心梗·脑梗知识图谱 — 内容数据
 * 结构：CATS 分类；NODES 知识点
 *  id   唯一标识（用于链接 #k/<id>）
 *  c    分类 id
 *  t    标题      en 英文名
 *  s    一句话摘要
 *  n    关键数字 [[数值, 说明]]
 *  d    详细解释（段落数组）
 *  k    要点
 *  m    常见误区 [[误区, 事实]]
 *  r    关联知识点 id
 *  ref  权威资料 [[标题, URL, 来源]]
 *  v    视频检索关键词 [[标题, 中文关键词, 英文关键词]]
 *  vl   具体视频/多媒体页面 [[标题, URL, 平台]]
 *  calc 评分计算器（可选）
 * 内容核对日期：2026-11。仅供科普，不能替代医生诊疗。
 */
(function () {
  const doi = (d) => "https://doi.org/" + d;

  const CATS = [
    { id: "base", t: "认识疾病", e: "疾病基础", icon: "🫀", ic: "heart", color: "--c-base" },
    { id: "risk", t: "危险因素", e: "可控与不可控", icon: "⚖️", ic: "scale", color: "--c-risk" },
    { id: "sign", t: "识别症状", e: "早识别", icon: "👁️", ic: "eye", color: "--c-sign" },
    { id: "aid", t: "院前急救", e: "黄金时间", icon: "🚑", ic: "ambulance", color: "--c-aid" },
    { id: "mi", t: "心梗救治", e: "医院内", icon: "❤️‍🩹", ic: "pulse", color: "--c-mi" },
    { id: "st", t: "脑梗救治", e: "医院内", icon: "🧠", ic: "brain", color: "--c-st" },
    { id: "prev", t: "二级预防与康复", e: "防复发", icon: "🛡️", ic: "shield", color: "--c-prev" },
    { id: "tool", t: "评估工具", e: "评分量表", icon: "📏", ic: "ruler", color: "--c-tool" },
  ];

  const NODES = [
    /* ───────────── 认识疾病 ───────────── */
    {
      id: "as", uid: "stroke-mi/as", type: "condition", chk: "2026-11", c: "base", t: "动脉粥样硬化", en: "Atherosclerosis",
      s: "心梗和脑梗共同的“土壤”：血管壁里的脂质斑块。",
      n: [["~85%", "全球心血管死亡中由心梗和卒中导致的比例（WHO）"], ["LDL-C", "形成斑块的核心致病因素"]],
      d: [
        "动脉粥样硬化是一种慢性炎症性疾病。低密度脂蛋白胆固醇（LDL-C）等含载脂蛋白B的颗粒进入受损的动脉内膜，被氧化、被巨噬细胞吞噬，形成泡沫细胞和脂质核心，外面覆盖一层纤维帽，就是“斑块”。",
        "斑块可以几十年没有症状。真正危险的是“易损斑块”：脂质核心大、纤维帽薄、炎症活跃。斑块一旦破裂或表面糜烂，血小板会立刻聚集形成血栓。血栓堵在冠状动脉就是心肌梗死，堵在脑动脉或从颈动脉脱落到脑内就是缺血性卒中（脑梗）。",
        "所以心梗和脑梗是“同一种病在不同器官的表现”。预防它们的核心措施是一样的：降低LDL-C、控制血压和血糖、戒烟、规律运动。",
      ],
      k: ["斑块狭窄程度不等于风险：很多心梗发生在原本狭窄不到50%的血管", "LDL-C 越低、维持时间越长，斑块进展越慢，部分斑块甚至可以缩小", "冠状动脉CT钙化积分（CAC）可以帮助判断无症状人群的斑块负担"],
      m: [["血管堵了70%才危险", "不稳定斑块即使轻度狭窄也可能破裂，突然完全闭塞。"], ["胆固醇高才需要管", "已有动脉粥样硬化的人，无论基线胆固醇多少，都需要强化降脂。"]],
      r: ["acs", "isch", "lipid", "htn", "smoke", "heartbrain"],
      ref: [
        ["WHO：心血管疾病事实清单", "https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)", "世界卫生组织"],
        ["2019 ACC/AHA 心血管病一级预防指南", doi("10.1161/CIR.0000000000000678"), "Circulation 2019"],
        ["MedlinePlus：Atherosclerosis", "https://medlineplus.gov/atherosclerosis.html", "美国国立医学图书馆"],
      ],
      v: [["动脉粥样硬化如何形成（动画）", "动脉粥样硬化 斑块 形成 动画", "atherosclerosis plaque formation animation"]],
    },
    {
      id: "acs", uid: "stroke-mi/acs", type: "condition", chk: "2026-11", c: "base", t: "急性冠脉综合征与心肌梗死", en: "ACS / Myocardial Infarction",
      s: "冠状动脉急性闭塞导致心肌缺血坏死，分为STEMI、NSTEMI和不稳定型心绞痛。",
      n: [["20–40分钟", "冠脉完全闭塞后心肌开始不可逆坏死"], ["6小时", "大部分可挽救心肌在此时间内丢失"], ["5型", "第四版心梗全球定义的分型"]],
      d: [
        "急性冠脉综合征（ACS）包括三种情况：ST段抬高型心肌梗死（STEMI，通常血管完全闭塞，需要立即开通）、非ST段抬高型心肌梗死（NSTEMI，肌钙蛋白升高但心电图无ST抬高），以及不稳定型心绞痛（有缺血症状但肌钙蛋白不升高）。",
        "按《第四版心肌梗死全球定义》，心肌梗死是指“肌钙蛋白升高且有动态变化（至少一次超过正常上限第99百分位）+ 心肌缺血的证据”。它分为5型：1型为斑块破裂/糜烂伴血栓（最常见）；2型为氧供需失衡（如严重贫血、心动过速、低血压）；3型为猝死且来不及检测标志物；4型和5型分别与PCI和搭桥手术相关。",
        "还有一类叫MINOCA（冠脉无阻塞性心梗），即造影没有明显狭窄但确实发生了心梗，多见于女性和年轻人。病因可能是斑块破裂、冠脉痉挛、自发性冠脉夹层（SCAD）等，需要进一步检查明确。",
      ],
      k: ["“时间就是心肌”：开通越早，存活心肌越多，心衰和死亡越少", "心梗后最常见的早期死因是恶性心律失常（室颤），所以发病后应尽快到有除颤条件的地方"],
      m: [["心梗只发生在老年人", "年轻人，尤其是吸烟者、家族性高胆固醇血症患者、使用毒品者，也会发生心梗。"]],
      r: ["as", "mi-sx", "ecg", "trop", "pci", "nste"],
      ref: [
        ["第四版心肌梗死全球定义（Fourth Universal Definition of MI）", doi("10.1161/CIR.0000000000000617"), "Circulation 2018"],
        ["2025 ACC/AHA/ACEP/NAEMSP/SCAI 急性冠脉综合征管理指南", doi("10.1161/CIR.0000000000001309"), "Circulation 2025"],
        ["2023 ESC 急性冠脉综合征管理指南", doi("10.1093/eurheartj/ehad191"), "Eur Heart J 2023"],
        ["NHS：Heart attack", "https://www.nhs.uk/conditions/heart-attack/", "英国国家医疗服务体系"],
      ],
      v: [["心肌梗死是怎么发生的", "心肌梗死 发生机制 动画", "myocardial infarction animation"], ["STEMI与NSTEMI的区别", "STEMI NSTEMI 区别", "STEMI vs NSTEMI explained"]],
    },
    {
      id: "isch", uid: "stroke-mi/isch", type: "condition", chk: "2026-11", c: "base", t: "缺血性卒中（脑梗死）", en: "Ischemic Stroke",
      s: "脑动脉堵塞导致脑组织缺血坏死，约占全部卒中的七成到八成。",
      n: [["190万", "大血管闭塞时每分钟约死亡的神经元数"], ["~70–80%", "缺血性卒中占全部卒中的比例（中国）"], ["第1位", "卒中是中国成人死亡和残疾的首要原因之一"]],
      d: [
        "缺血性卒中就是常说的“脑梗”。按TOAST病因分型主要分为：大动脉粥样硬化型（颈动脉、颅内动脉斑块）、心源性栓塞型（多由房颤引起）、小动脉闭塞型（腔隙性梗死，与高血压关系密切）、其他明确病因型（如动脉夹层），以及病因不明型。",
        "脑组织几乎没有能量储备。血管闭塞后，中心区域的脑组织迅速坏死，这部分叫“梗死核心”。周围还有一圈血流减少但尚未死亡的“缺血半暗带”，这部分是可以挽救的。治疗的目标就是在半暗带死亡之前尽快恢复血流，方法包括静脉溶栓和血管内取栓。",
        "侧支循环好的患者，半暗带可以维持数小时，这就是部分患者在24小时内仍能从取栓中获益的原因。但对个人而言，等待永远是危险的。",
      ],
      k: ["病因分型决定二级预防：房颤需要抗凝，动脉粥样硬化需要抗血小板加强化降脂", "中国人颅内动脉狭窄的比例高于欧美人群", "卒中后最初数天到数周是复发的高峰期"],
      r: ["as", "af", "tia", "befast", "ivt", "evt", "imaging"],
      ref: [
        ["2026 AHA/ASA 急性缺血性卒中早期管理指南", doi("10.1161/STR.0000000000000513"), "Stroke 2026"],
        ["《中国急性缺血性卒中诊治指南2023》解读（原文：中华神经科杂志 2024;57:523–559）", "https://doaj.org/article/a2018a47a732457db8bf4d257ed428d2", "中国卒中杂志 2024 · 开放获取"],
        ["Time is brain — quantified（每分钟190万神经元）", doi("10.1161/01.STR.0000196957.55928.ab"), "Stroke 2006"],
        ["GBD 2021 全球卒中负担", doi("10.1016/S1474-4422(24)00369-7"), "Lancet Neurol 2024"],
      ],
      v: [["脑梗是怎么发生的", "脑梗死 缺血半暗带 科普", "ischemic stroke penumbra animation"]],
    },
    {
      id: "ich", uid: "stroke-mi/ich", type: "condition", chk: "2026-11", c: "base", t: "出血性卒中（脑出血/蛛网膜下腔出血）", en: "Hemorrhagic Stroke",
      s: "脑血管破裂出血，病死率高于脑梗；突发“一生中最剧烈的头痛”要警惕。",
      n: [["~20–30%", "出血性卒中占卒中比例（中国高于欧美）"], ["数秒", "蛛网膜下腔出血的头痛在1分钟内达到顶峰（雷击样）"]],
      d: [
        "脑出血（ICH）最常见的原因是长期高血压导致的小动脉病变，其次是脑淀粉样血管病（多见于老年人脑叶出血）、抗凝药相关出血和血管畸形。血肿在发病后最初几小时内可能继续扩大，所以早期控制血压、逆转抗凝药非常关键。",
        "蛛网膜下腔出血（SAH）多由颅内动脉瘤破裂引起。典型表现是突发、剧烈的“雷击样头痛”，在1分钟内达到最痛，常伴恶心呕吐、颈部僵硬，甚至意识丧失。动脉瘤一旦破裂，再出血的风险很高，需要尽快在有条件的中心进行介入栓塞或开颅夹闭。",
        "仅凭症状无法区分脑梗和脑出血，必须做头颅CT。这也是怀疑卒中时不要在家自行服用阿司匹林的原因。",
      ],
      k: ["怀疑卒中：先CT，再决定治疗", "服用抗凝药（华法林、利伐沙班等）的人发生脑出血，需立即告知医生用药情况以便逆转", "突发剧烈头痛不要“忍一忍”，应立即呼叫急救"],
      r: ["isch", "htn", "ich-tx", "aspirin", "imaging"],
      ref: [
        ["2022 AHA/ASA 自发性脑出血管理指南", doi("10.1161/STR.0000000000000407"), "Stroke 2022"],
        ["2023 AHA/ASA 动脉瘤性蛛网膜下腔出血管理指南", doi("10.1161/STR.0000000000000436"), "Stroke 2023"],
        ["Mayo Clinic：Subarachnoid hemorrhage", "https://www.mayoclinic.org/diseases-conditions/subarachnoid-hemorrhage/symptoms-causes/syc-20361009", "Mayo Clinic"],
      ],
      v: [["脑出血与脑梗的区别", "脑出血 脑梗 区别 科普", "hemorrhagic vs ischemic stroke"]],
    },
    {
      id: "tia", uid: "stroke-mi/tia", type: "condition", chk: "2026-11", c: "base", t: "短暂性脑缺血发作（TIA）", en: "Transient Ischemic Attack",
      s: "短暂性脑缺血发作是脑部某一部分的血液供应暂时中断引起的，是今后不久发生完全性卒中的预警信号；即使症状消失，也需要到医院接受评估。",
      n: [["1.5%", "TIA后2天内卒中风险（现代快速评估体系下）"], ["5.1%", "1年内卒中风险（TIAregistry）"], ["24小时", "应在此时间内完成评估"]],
      d: [
        "TIA是脑或视网膜短暂缺血引起的神经功能障碍，症状通常在1小时内完全恢复，影像学上没有新的梗死灶。它的表现与脑梗完全一样：一侧面部或肢体无力麻木、说话不清、一只眼突然看不见、眩晕走路不稳等。",
        "TIA后数天内是卒中的高危期。研究显示，在有快速TIA门诊的地区，及时评估和治疗可以把早期卒中风险降低约80%。所以TIA不是“没事了”，而是“必须马上处理的急症”。",
        "到医院后一般需要：头颅MRI（DWI序列）、颈部和颅内血管评估（CTA/MRA/超声）、心电图和心律监测（筛查房颤）、血脂血糖检测。高危TIA或轻型卒中患者通常需要短期双联抗血小板治疗。",
      ],
      k: ["症状消失≠病好了，应按卒中流程立即就医", "ABCD2评分可辅助分层，但指南强调所有疑似TIA都应尽快评估", "早期启动双抗、强化降脂和危险因素控制是降低复发的关键"],
      m: [["症状好了就不用去医院", "TIA后48小时内是卒中最高危的时段。"]],
      r: ["isch", "abcd2", "sec-ap", "befast", "af"],
      ref: [
        ["TIAregistry.org：TIA后1年结局", doi("10.1056/NEJMoa1412981"), "N Engl J Med 2016"],
        ["2021 AHA/ASA 卒中/TIA二级预防指南", doi("10.1161/STR.0000000000000375"), "Stroke 2021"],
        ["Mayo Clinic：TIA", "https://www.mayoclinic.org/diseases-conditions/transient-ischemic-attack/symptoms-causes/syc-20355679", "Mayo Clinic"],
      ],
      v: [["TIA 为什么是急症", "短暂性脑缺血发作 科普", "TIA mini stroke warning sign"]],
    },
    {
      id: "af", uid: "stroke-mi/af", type: "condition", chk: "2026-11", c: "base", t: "心房颤动与心源性栓塞", en: "Atrial Fibrillation",
      s: "房颤使卒中风险增加约5倍，房颤相关卒中往往更重、致残率更高。",
      n: [["~5倍", "房颤患者卒中风险增加"], ["~20–25%", "缺血性卒中由心源性栓塞引起的比例"]],
      d: [
        "房颤时心房不能有效收缩，血液在左心耳内淤滞，容易形成血栓。血栓脱落后随血流进入脑动脉，常常堵塞大血管，导致严重的卒中。",
        "很多房颤没有症状（“沉默性房颤”），所以卒中后常需要做长程心电监测来筛查。65岁以上人群建议在体检时摸脉搏或做心电图筛查。智能手表的房颤提醒也有一定的筛查价值，但需要医生确认。",
        "预防房颤卒中最有效的方法是口服抗凝药，而不是阿司匹林。新型口服抗凝药（DOAC）与华法林相比，颅内出血风险更低。",
      ],
      k: ["用CHA₂DS₂-VA（或VASc）评分判断是否需要抗凝", "阿司匹林不能替代抗凝药预防房颤卒中", "心梗后也可能新发房颤，或出现左室血栓，同样有栓塞风险"],
      r: ["isch", "af-oac", "chads", "heartbrain"],
      ref: [
        ["2024 ESC 房颤管理指南", doi("10.1093/eurheartj/ehae176"), "Eur Heart J 2024"],
        ["2023 ACC/AHA/ACCP/HRS 房颤指南", doi("10.1161/CIR.0000000000001193"), "Circulation 2023"],
        ["Mayo Clinic：Atrial fibrillation", "https://www.mayoclinic.org/diseases-conditions/atrial-fibrillation/symptoms-causes/syc-20350624", "Mayo Clinic"],
      ],
      v: [["房颤为什么会引起脑梗", "房颤 脑梗 左心耳 血栓 科普", "atrial fibrillation stroke left atrial appendage"]],
    },
    {
      id: "heartbrain", uid: "stroke-mi/heartbrain", type: "concept", chk: "2026-11", c: "base", t: "心脑同源", en: "Heart–Brain Connection",
      s: "心梗患者容易发生卒中，卒中患者也常合并冠心病，必须一起管理。",
      d: [
        "心梗和脑梗有共同的危险因素（高血压、高LDL-C、糖尿病、吸烟），也有共同的病理基础（动脉粥样硬化和血栓）。一种血管床有病变的人，其他血管床也常有病变，这叫“多血管床疾病”。",
        "两者之间还有直接联系：心梗后左心室室壁瘤或运动减弱可以形成左室血栓，脱落后导致脑栓塞；心梗后新发房颤也会增加卒中风险。反过来，卒中急性期可以出现心肌损伤、心律失常（“脑-心综合征”），卒中患者的远期死因中心脏病占很大比例。",
        "所以无论是心梗还是脑梗，二级预防的“ABCDE”是共通的：抗栓（Antithrombotic）、血压（Blood pressure）、胆固醇（Cholesterol）、糖尿病与戒烟（Diabetes / Cigarettes）、运动与教育（Exercise / Education）。",
      ],
      k: ["卒中患者应评估冠心病风险，心梗患者应评估卒中风险", "共同的二级预防：强化降脂、降压达标、戒烟、运动"],
      r: ["as", "af", "acs", "isch", "lipid-tx", "bp-tx"],
      ref: [
        ["AHA：Life's Essential 8 心血管健康评估", doi("10.1161/CIR.0000000000001078"), "Circulation 2022"],
        ["2024 ESC 慢性冠脉综合征指南", doi("10.1093/eurheartj/ehae177"), "Eur Heart J 2024"],
      ],
      v: [["心脑血管病为什么要一起防", "心脑血管病 共同预防 科普", "heart brain connection stroke heart disease"]],
    },

    /* ───────────── 危险因素 ───────────── */
    {
      id: "htn", uid: "stroke-mi/htn", type: "condition", chk: "2026-11", c: "risk", t: "高血压", en: "Hypertension",
      s: "卒中第一位的可控危险因素；降压收缩压10 mmHg，卒中风险约降27%。",
      n: [["<130/80", "大多数成人的降压目标（2025 AHA/ACC、中国2024指南）"], ["−27%", "收缩压每降10 mmHg对应的卒中风险下降"], ["−20%", "同时对应的主要心血管事件下降"]],
      d: [
        "长期高血压会损伤动脉内皮，加速动脉粥样硬化，也会造成脑内小动脉玻璃样变，引起腔隙性脑梗和脑出血。中国人群的卒中与高血压的关系比冠心病更强。",
        "2025年美国AHA/ACC高血压指南沿用130/80 mmHg的诊断和治疗界值，对多数成人的目标是<130/80 mmHg，耐受时鼓励收缩压<120 mmHg；并改用PREVENT方程评估10年风险。2024 ESC指南提出，耐受良好的患者收缩压目标为120–129 mmHg。",
        "正确测血压非常重要：安静休息5分钟、坐位、背部有支撑、手臂与心脏同高、袖带大小合适，连续测2次取平均值。家庭自测血压和24小时动态血压比单次诊室测量更可靠。",
      ],
      k: ["多数患者需要两种或以上药物联合，单片复方制剂可提高依从性", "限盐（<5 g/天）和使用低钠盐有明确的降压和减少卒中的证据", "不要自行停药，血压“正常了”往往正是药物在起作用"],
      m: [["没有头晕头痛就不用吃药", "高血压大多没有症状，靠测量才能发现。"], ["降压药吃了会上瘾", "降压药没有成瘾性，停药后血压会回升。"]],
      r: ["isch", "ich", "bp-tx", "le8", "risk-score"],
      ref: [
        ["2025 AHA/ACC 高血压管理指南", doi("10.1161/HYP.0000000000000249"), "Hypertension 2025"],
        ["2024 ESC 血压升高与高血压管理指南", doi("10.1093/eurheartj/ehae178"), "Eur Heart J 2024"],
        ["降压与心血管结局的荟萃分析（每降10 mmHg）", doi("10.1016/S0140-6736(15)01225-8"), "Lancet 2016"],
        ["WHO：高血压事实清单", "https://www.who.int/news-room/fact-sheets/detail/hypertension", "世界卫生组织"],
      ],
      v: [["如何正确在家测血压", "家庭 正确测量血压 方法", "how to measure blood pressure at home correctly"]],
    },
    {
      id: "lipid", uid: "stroke-mi/lipid", type: "marker", chk: "2026-11", c: "risk", t: "血脂与LDL-C", en: "LDL Cholesterol",
      s: "LDL-C是动脉粥样硬化的“元凶”，越低越好、越早越好。",
      n: [["−22%", "LDL-C每降低1 mmol/L，主要血管事件下降（CTT）"], ["<1.4 mmol/L", "极高危人群目标，且较基线降低≥50%"], ["<2.6 mmol/L", "高危人群目标"]],
      d: [
        "大量遗传学、流行病学和临床试验证据都证明，LDL-C本身就是动脉粥样硬化的致病因素。LDL-C的累积暴露（浓度×年数）越大，斑块越多。",
        "血脂化验单上的“参考范围”是给普通人群的，不适用于已经发生心梗、脑梗或合并糖尿病的高危人群。2019/2025 ESC/EAS血脂指南规定：极高危人群（如已有动脉粥样硬化性心血管病）LDL-C目标<1.4 mmol/L，并且较基线下降≥50%；2年内再次发生事件者可考虑<1.0 mmol/L。",
        "除了LDL-C，非HDL胆固醇和载脂蛋白B（ApoB）能更全面地反映致动脉粥样硬化颗粒的数量，尤其适用于甘油三酯高、糖尿病或肥胖的人。",
      ],
      k: ["报告单上没有箭头不等于达标，要看个人目标值", "家族性高胆固醇血症（LDL-C≥4.9 mmol/L）应筛查家人", "成年后至少检测一次脂蛋白(a)"],
      r: ["as", "lpa", "lipid-tx", "risk-score"],
      ref: [
        ["2025 ESC/EAS 血脂异常管理指南重点更新", doi("10.1093/eurheartj/ehaf190"), "Eur Heart J 2025"],
        ["CTT：强化降脂的荟萃分析", doi("10.1016/S0140-6736(10)61350-5"), "Lancet 2010"],
        ["2018 AHA/ACC 胆固醇管理指南", doi("10.1161/CIR.0000000000000625"), "Circulation 2018"],
        ["MedlinePlus：LDL: The \"Bad\" Cholesterol", "https://medlineplus.gov/ldlthebadcholesterol.html", "美国国立医学图书馆"],
      ],
      v: [["看懂血脂化验单", "血脂化验单 LDL 怎么看", "LDL cholesterol explained"]],
    },
    {
      id: "lpa", uid: "stroke-mi/lpa", type: "marker", chk: "2026-11", c: "risk", t: "脂蛋白(a)", en: "Lipoprotein(a)",
      s: "主要由基因决定的独立危险因素，约每5人中有1人升高，一生至少查一次。",
      n: [["~20%", "人群中Lp(a)升高的比例"], ["1次", "成人一生至少检测一次（ESC/EAS 2025）"]],
      d: [
        "Lp(a)是一种结构类似LDL、额外带有载脂蛋白(a)的脂蛋白，水平约90%由遗传决定，饮食和运动几乎改变不了。它既促进动脉粥样硬化，又有促血栓和促炎作用，与心梗、卒中和主动脉瓣狭窄相关。",
        "目前还没有获批的专门降低Lp(a)的药物，多种针对Lp(a)的药物（如pelacarsen、olpasiran、lepodisiran等）正在进行III期结局研究。现阶段，Lp(a)高的人应该更积极地控制其他危险因素，尤其是把LDL-C降得更低。PCSK9抑制剂可使Lp(a)降低约20–30%。",
      ],
      k: ["早发心梗/卒中或有家族史者尤其应检测", "Lp(a)高 → 更严格控制LDL-C、血压和其他危险因素", "家族成员应同时筛查"],
      r: ["lipid", "lipid-tx", "as"],
      ref: [
        ["AHA：Lipoprotein(a)", "https://www.heart.org/en/health-topics/cholesterol/genetic-conditions/lipoprotein-a", "美国心脏协会"],
        ["2025 ESC/EAS 血脂指南重点更新", doi("10.1093/eurheartj/ehaf190"), "Eur Heart J 2025"],
      ],
      v: [["脂蛋白a是什么", "脂蛋白a Lp(a) 科普", "lipoprotein(a) explained"]],
    },
    {
      id: "dm", uid: "stroke-mi/dm", type: "condition", chk: "2026-11", c: "risk", t: "糖尿病与代谢异常", en: "Diabetes & Metabolic Risk",
      s: "糖尿病使心梗和卒中风险约翻倍，且心梗症状常常不典型。",
      n: [["~2倍", "糖尿病患者心血管事件风险"], ["HbA1c ~7%", "多数成人的血糖控制目标（需个体化）"]],
      d: [
        "高血糖通过损伤血管内皮、促进炎症和血栓形成，加速动脉粥样硬化。糖尿病患者常同时合并高血压、血脂异常和肥胖，风险叠加。",
        "糖尿病会损伤神经，使心梗时胸痛不明显，可能只表现为乏力、气短、恶心或血糖突然波动，这被称为“无痛性心肌缺血”。",
        "现代糖尿病治疗已经从“只看血糖”转向“保护心肾”：对合并心血管病的患者，优先选择被证实能减少心血管事件的SGLT2抑制剂或GLP-1受体激动剂。",
      ],
      k: ["糖尿病患者应同时管理血压、血脂和体重", "SGLT2i、GLP-1RA具有独立于降糖之外的心血管获益", "警惕不典型心梗症状"],
      r: ["cardio-metab", "mi-atyp", "le8", "lipid"],
      ref: [
        ["ADA：Standards of Care in Diabetes（年度更新）", "https://diabetesjournals.org/care/issue/49/Supplement_1", "美国糖尿病协会"],
        ["2023 ESC 糖尿病患者心血管病管理指南", doi("10.1093/eurheartj/ehad192"), "Eur Heart J 2023"],
      ],
      v: [["糖尿病与心血管病", "糖尿病 心血管 并发症 科普", "diabetes and heart disease"]],
    },
    {
      id: "smoke", uid: "stroke-mi/smoke", type: "lifestyle", chk: "2026-11", c: "risk", t: "吸烟与二手烟", en: "Smoking",
      s: "吸烟使心梗风险成倍增加；戒烟是性价比最高的“治疗”。",
      n: [["~1年", "戒烟后冠心病额外风险约下降一半"], ["5–15年", "戒烟后卒中风险逐渐接近不吸烟者"]],
      d: [
        "烟草中的尼古丁、一氧化碳和氧化物质会损伤血管内皮、升高血压心率、增加血小板聚集和血液黏稠度，使斑块更不稳定。即使每天只吸几支烟，风险也明显增加，没有“安全剂量”。",
        "二手烟同样有害。电子烟不是安全的替代品，目前的证据显示它同样会影响血管功能。",
        "心梗后戒烟可显著降低再梗和死亡风险，效果不亚于很多药物。戒烟门诊、尼古丁替代疗法、伐尼克兰等药物可以使戒烟成功率提高数倍。",
      ],
      k: ["“少抽点”不够，要完全戒断", "尽早求助戒烟门诊", "心梗、卒中后住院期间是戒烟的最佳时机"],
      r: ["as", "le8", "acs", "isch"],
      ref: [
        ["WHO：烟草事实清单", "https://www.who.int/news-room/fact-sheets/detail/tobacco", "世界卫生组织"],
        ["CDC：Benefits of Quitting Smoking", "https://www.cdc.gov/tobacco/about/benefits-of-quitting.html", "美国疾控中心"],
      ],
      v: [["戒烟后身体会发生什么变化", "戒烟 身体变化 时间线", "what happens when you quit smoking timeline"]],
    },
    {
      id: "le8", uid: "stroke-mi/le8", type: "lifestyle", chk: "2026-11", c: "risk", t: "生命八要素（健康生活方式）", en: "Life's Essential 8",
      s: "饮食、运动、戒烟、睡眠、体重、血脂、血糖、血压——八项全部达标的人，心脑血管风险最低。",
      n: [["150分钟", "每周中等强度有氧运动"], ["7–9小时", "成人每晚推荐睡眠时间"], ["<5 g", "每日食盐摄入"]],
      d: [
        "美国心脏协会的“生命八要素”（Life's Essential 8）包括4项行为（饮食、身体活动、尼古丁暴露、睡眠）和4项指标（体重指数、血脂、血糖、血压），每项0–100分。分数越高，未来心梗、卒中和死亡的风险越低。",
        "饮食方面，推荐地中海饮食或DASH饮食模式：多蔬果、全谷物、豆类、坚果、鱼类，少红肉和加工肉，少含糖饮料，控制盐。中国居民应特别注意减少盐和腌制食品。",
        "运动方面，每周至少150分钟中等强度（如快走）或75分钟高强度运动，加上每周2次力量训练。久坐本身就是危险因素，每坐1小时起来活动几分钟。",
      ],
      k: ["小改变也有用：每天多走2000步就能带来获益", "睡眠不足和睡眠呼吸暂停都会增加心脑血管风险", "腰围（男≥90 cm、女≥85 cm）比体重更能反映内脏脂肪"],
      r: ["htn", "dm", "smoke", "lipid", "risk-score"],
      ref: [
        ["AHA：Life's Essential 8", "https://www.heart.org/en/healthy-living/healthy-lifestyle/lifes-essential-8", "美国心脏协会"],
        ["Life's Essential 8 科学声明", doi("10.1161/CIR.0000000000001078"), "Circulation 2022"],
        ["NHLBI：DASH饮食计划", "https://www.nhlbi.nih.gov/education/dash-eating-plan", "美国国立心肺血液研究所"],
      ],
      v: [["地中海饮食怎么吃", "地中海饮食 心脏健康", "mediterranean diet heart health"], ["DASH降压饮食", "DASH饮食 降血压", "DASH diet explained"]],
    },

    /* ───────────── 识别症状 ───────────── */
    {
      id: "mi-sx", uid: "stroke-mi/mi-sx", type: "symptom", chk: "2026-11", c: "sign", t: "心梗典型症状", en: "Heart Attack Symptoms",
      s: "胸口压榨感、闷痛超过几分钟不缓解，可放射到手臂、下巴、后背——立即拨打当地急救电话。",
      n: [[">5分钟", "胸痛持续不缓解就应呼叫急救"], ["1小时", "发病后首个小时猝死风险最高"]],
      d: [
        "典型心梗表现为胸骨后或心前区的压榨感、憋闷感、紧缩感或烧灼感，像“大石头压在胸口”。疼痛常放射到左臂、双臂、颈部、下颌、后背或上腹部，持续数分钟以上，休息或含服硝酸甘油不能完全缓解。",
        "常伴随出汗（冷汗）、气短、恶心呕吐、头晕、心慌、濒死感。部分人在心梗前数天到数周会出现活动后胸闷、心绞痛发作越来越频繁等“先兆”。",
        "心梗不一定是“剧痛”。很多人描述为“不舒服”“闷”“胃痛”“喘不上气”，因此容易被当成胃病、颈椎病或劳累。",
      ],
      k: ["疼痛位置可以在胸部以外：下巴、牙、肩、背、上腹", "出现症状后不要自己开车去医院", "即使不确定，也宁可呼叫急救——误报的代价远小于延误"],
      m: [["年轻人胸痛不可能是心梗", "年轻人心梗并不少见。"], ["忍一忍、睡一觉就好了", "心梗等待的每一分钟都在丢失心肌，夜间就医同样必要。"]],
      r: ["mi-atyp", "call120", "aspirin", "ecg", "acs"],
      ref: [
        ["AHA：Warning Signs of a Heart Attack", "https://www.heart.org/en/health-topics/heart-attack/warning-signs-of-a-heart-attack", "美国心脏协会"],
        ["CDC：Heart Attack Symptoms, Risk, and Recovery", "https://www.cdc.gov/heart-disease/about/heart-attack.html", "美国疾控中心"],
        ["MedlinePlus：Heart Attack（多语言）", "https://medlineplus.gov/heartattack.html", "美国国立医学图书馆"],
      ],
      v: [["心梗有哪些信号", "心梗 症状 信号 胸痛 科普", "heart attack warning signs"]],
    },
    {
      id: "mi-atyp", uid: "stroke-mi/mi-atyp", type: "symptom", chk: "2026-11", c: "sign", t: "不典型心梗：女性、老人、糖尿病患者", en: "Atypical Presentations",
      s: "气短、乏力、恶心、背痛、上腹痛也可能是心梗；女性最常见的症状仍是胸痛。",
      d: [
        "女性、老年人、糖尿病患者和慢性肾病患者的心梗症状更容易“不典型”：可能只有气短、极度疲乏、恶心呕吐、上腹或背部不适、出汗、头晕，甚至只有意识改变或晕厥。",
        "需要强调：胸痛或胸部不适仍然是女性心梗最常见的症状。女性只是更常同时伴有其他症状。由于女性和医护人员都容易低估风险，女性心梗的就诊延误和治疗不足更为常见。",
        "此外，年轻女性要了解自发性冠脉夹层（SCAD），它多见于孕期、产后或剧烈情绪/体力应激后，表现与典型心梗相同。",
      ],
      k: ["糖尿病患者突然出现原因不明的气短、乏力，应考虑心脏原因", "老人突发意识改变、跌倒也可能是心梗或卒中", "对女性的胸部不适同样要按心梗流程处理"],
      r: ["mi-sx", "dm", "call120", "acs"],
      ref: [
        ["AHA：Heart Attack Symptoms in Women", "https://www.heart.org/en/health-topics/heart-attack/warning-signs-of-a-heart-attack/heart-attack-symptoms-in-women", "美国心脏协会"],
        ["2025 ACC/AHA ACS指南（症状评估部分）", doi("10.1161/CIR.0000000000001309"), "Circulation 2025"],
      ],
      v: [["女性心梗症状有何不同", "女性 心梗 症状 不典型", "heart attack symptoms in women"]],
    },
    {
      id: "befast", uid: "stroke-mi/befast", type: "symptom", chk: "2026-11", c: "sign", t: "BE FAST 识别卒中", en: "BE FAST",
      s: "平衡、眼睛、面部、手臂、言语——任何一项突然出现异常，马上打急救电话。",
      n: [["B", "Balance：突然走路不稳、眩晕"], ["E", "Eyes：突然一眼或双眼视物模糊/缺损/复视"], ["F", "Face：口角歪斜，笑时一侧不动"], ["A", "Arm：一侧手臂无力，平举后下垂"], ["S", "Speech：说话含糊、听不懂话"], ["T", "Time：立即呼叫急救，记下时间"]],
      d: [
        "卒中症状的关键词是“突然”。FAST（面部、手臂、言语、时间）是全球最常用的公众识别口诀，BE FAST在前面增加了平衡（Balance）和眼睛（Eyes），可以识别更多后循环卒中。",
        "其他需要警惕的“突然”症状还包括：一侧身体麻木、突然意识模糊、突发剧烈头痛（尤其伴呕吐）、突然吞咽困难。",
        "记录“最后看起来正常的时间”非常重要，因为医生要根据它判断能否溶栓或取栓。如果是早晨醒来发现症状，最后正常时间就是前一晚入睡前。",
      ],
      k: ["症状可能很轻，也可能一会儿就好——都要按卒中处理", "不要等症状“观察观察”", "不要喂水喂药，以防误吸"],
      r: ["s120", "isch", "tia", "call120", "onset"],
      ref: [
        ["American Stroke Association：Stroke Symptoms", "https://www.stroke.org/en/about-stroke/stroke-symptoms", "美国卒中协会"],
        ["NHS：Stroke — symptoms (Act FAST)", "https://www.nhs.uk/conditions/stroke/symptoms/", "英国国家医疗服务体系"],
        ["CDC：Signs and Symptoms of Stroke", "https://www.cdc.gov/stroke/signs-symptoms/index.html", "美国疾控中心"],
      ],
      v: [["BE FAST卒中识别口诀", "BE FAST 卒中 识别", "BE FAST stroke symptoms"]],
    },
    {
      id: "s120", uid: "stroke-mi/s120", type: "symptom", chk: "2026-11", c: "sign", t: "中风120", en: "Stroke 1-2-0",
      s: "中国原创的识别口诀：1看一张脸，2查两只手臂，0聆听语言——有异常立即拨打当地急救电话。",
      n: [["1", "看1张脸：口角歪斜、不对称"], ["2", "查2只胳膊：平举时一侧无力"], ["0", "聆（零）听语言：言语不清、表达困难"]],
      d: [
        "“中风120”由复旦大学附属闵行医院赵静教授等在2016年提出，借用中国急救电话号码“120”来记忆卒中三大症状，避免了英文FAST在中文环境中的语言障碍。它于2016年世界卒中日获中国卒中学会推广，并发表于《柳叶刀·神经病学》。",
        "口诀的最后一步就是行动：“明确无误，快打120”。研究显示该口诀在中国公众和医务人员中的知晓率逐年提高。",
        "中风120覆盖面部、手臂、言语三项；如果出现突然眩晕、走路不稳或视力问题，也应该立即呼叫急救（参见BE FAST）。中国大陆以外请拨当地急救电话。",
      ],
      k: ["适合教给家中老人和孩子", "与BE FAST互补使用"],
      r: ["befast", "call120", "isch"],
      ref: [
        ["Stroke 1-2-0: a rapid response programme for stroke in China", doi("10.1016/S1474-4422(16)30283-6"), "Lancet Neurol 2017"],
        ["Stroke 1-2-0：策略与宣传视频发布", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5398414/", "PubMed Central"],
      ],
      vl: [["“中风120”原始宣传视频介绍（论文附视频）", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5398414/", "PMC"]],
      v: [["中风120宣传视频", "中风120 识别 口诀", "Stroke 1-2-0 China"]],
    },

    /* ───────────── 院前急救 ───────────── */
    {
      id: "call120", uid: "stroke-mi/call120", type: "first-aid", chk: "2026-11", c: "aid", t: "立即呼叫急救，不要自己去医院", en: "Call Emergency Services",
      s: "救护车能提前传心电图、预通知医院，并在途中处理心脏骤停。",
      n: [["120", "中国大陆急救电话（出处：中国政府网，第十三条）"], ["999", "英国急救电话（出处：NHS）"], ["999", "香港急救电话（出处：香港消防处）"], ["119", "台湾急救电话（出处：内政部消防署）"], ["112", "欧盟统一紧急号码（出处：意大利卫生部 / 欧盟委员会）"], ["911", "美国/加拿大急救电话（出处：美国国家 911 项目 / 加拿大 CRTC）"], ["000", "澳洲急救电话（出处：澳洲基础设施部）"]],
      d: [
        "很多人觉得打车或自己开车更快，但事实相反。急救人员可以在现场做心电图并远程传给胸痛中心，提前启动导管室，让患者“绕过急诊直达导管室”；对卒中患者，可以提前通知卒中中心，让CT和溶栓团队在门口等候。",
        "心梗早期最大的危险是室颤导致的心脏骤停，救护车上有除颤器，而出租车上没有。卒中患者可能出现呕吐误吸、意识下降，也需要专业监护。",
        "打电话时要说清楚：地址（具体到楼栋门牌）、患者年龄、主要症状、发病时间、是否清醒、既往病史和用药（尤其是抗凝药）。打开门、清理通道、准备好病历和药盒。",
      ],
      k: ["选择有“胸痛中心”或“卒中中心”资质的医院，而不只是最近的医院（由急救人员判断）", "不要让患者自己走动、上下楼", "保持电话畅通，按调度员指导操作"],
      m: [["等子女回来再说", "延误的每一分钟都无法挽回。"]],
      r: ["mi-sx", "befast", "s120", "cpr", "aspirin", "onset"],
      ref: [
        ["《院前医疗急救管理办法》第十三条（中国政府网）", "https://www.gov.cn/zhengce/2013-11/29/content_5713800.htm", "中国政府网"],
        ["When to call 999 - NHS（英国 999）", "https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/", "NHS"],
        ["香港救護服務 - 香港消防處（香港 999）", "https://www.hkfsd.gov.hk/chi/source/safety/Ambulance_Services_in_HK_chi.pdf", "香港消防處"],
        ["119、112 - 內政部消防署（台灣 119）", "https://www.nfa.gov.tw/cht/index.php?code=list&ids=66", "內政部消防署"],
        ["Single European emergency number 112 - 意大利卫生部（欧盟 112）", "https://www.salute.gov.it/new/en/tema/112-118-e-pronto-soccorso/single-european-emergency-number-call-112", "意大利卫生部"],
        ["9-1-1 - 美国国家 911 项目（美国 911）", "https://www.911.gov/calling-911", "美国国家 911 项目（NHTSA）"],
        ["9-1-1 - CRTC（加拿大 911）", "https://crtc.gc.ca/eng/phone/911/can.htm", "加拿大广播电视和电信委员会 CRTC"],
        ["112 - 欧盟委员会（欧盟 112）", "https://digital-strategy.ec.europa.eu/en/policies/112", "欧盟委员会 · 112"],
        ["How to call Triple Zero (000) - 澳洲基础设施部（澳洲 000）", "https://www.infrastructure.gov.au/media-communications/phone/triple-zero/how-call-triple-zero-000", "澳洲基础设施部"],
        ["AHA：Heart attack and stroke — call 911", "https://www.heart.org/en/health-topics/heart-attack/warning-signs-of-a-heart-attack", "美国心脏协会"],
        ["2026 AHA/ASA 急性缺血性卒中指南（院前系统与移动卒中单元）", doi("10.1161/STR.0000000000000513"), "Stroke 2026"],
        ["2025 ACC/AHA ACS指南（院前评估）", doi("10.1161/CIR.0000000000001309"), "Circulation 2025"],
      ],
      v: [["拨打急救电话时要说清楚什么", "拨打急救电话 正确方法", "how to call emergency services"]],
    },
    {
      id: "aspirin", uid: "stroke-mi/aspirin", type: "first-aid", chk: "2026-11", c: "aid", t: "院前阿司匹林：心梗可用，卒中慎用", en: "Prehospital Aspirin",
      s: "疑似心梗、无禁忌时可嚼服阿司匹林；疑似卒中在CT排除出血前不要自行服用。",
      n: [["~23%", "ISIS-2中阿司匹林降低心梗后血管死亡的幅度"]],
      d: [
        "对疑似心梗、没有阿司匹林过敏和活动性出血的成年人，尽早嚼服非肠溶阿司匹林可以抑制血小板聚集、降低死亡率。最好在急救调度员或医生指导下服用；嚼碎比整片吞服起效更快。",
        "疑似卒中则完全不同：卒中可能是脑出血，症状上无法区分，阿司匹林会加重出血。而且卒中患者常有吞咽障碍，喂药喂水可能导致误吸和肺炎。所以疑似卒中时不要喂任何东西，等医院CT结果。",
        "硝酸甘油可以缓解心绞痛，但以下情况不要使用：收缩压<90 mmHg、心率过慢或过快、疑似右室心梗、24–48小时内服用过西地那非/他达拉非等药物。",
      ],
      k: ["心梗：阿司匹林嚼服（无禁忌时）", "卒中：什么都不要喂", "已长期服用阿司匹林的人，也要告诉急救人员"],
      m: [["速效救心丸能代替就医", "任何药物都不能代替开通血管，出现症状应立即呼叫急救。"]],
      r: ["mi-sx", "call120", "dapt", "ich", "befast"],
      ref: [
        ["2023 ESC ACS指南（阿司匹林负荷剂量）", doi("10.1093/eurheartj/ehad191"), "Eur Heart J 2023"],
        ["2025 ACC/AHA ACS指南", doi("10.1161/CIR.0000000000001309"), "Circulation 2025"],
        ["ISIS-2：链激酶与阿司匹林治疗急性心梗", doi("10.1016/S0140-6736(88)92833-4"), "Lancet 1988"],
      ],
      v: [["心梗时能不能吃阿司匹林", "心梗 阿司匹林 嚼服 急救", "aspirin during heart attack"]],
    },
    {
      id: "cpr", uid: "stroke-mi/cpr", type: "first-aid", chk: "2026-11", c: "aid", t: "心肺复苏（CPR）与AED", en: "CPR & AED",
      s: "发现有人倒地无反应、无正常呼吸：呼救、按压、取AED。旁观者CPR可使存活率成倍提高。",
      n: [["100–120次/分", "胸外按压频率"], ["5–6 cm", "成人按压深度"], ["2–3倍", "旁观者CPR可提高的存活机会"]],
      d: [
        "心脏骤停后，每延迟1分钟除颤，存活率下降约7–10%。急救车到达通常需要数分钟以上，所以现场第一目击者的行动最关键。",
        "步骤：①确认环境安全，拍打双肩大声呼喊；②无反应且无呼吸或仅有喘息样呼吸 → 立即拨打当地急救电话并开启免提，让旁人去取AED；③在胸部正中（两乳头连线中点）用掌根按压，双臂伸直，深度5–6 cm，频率100–120次/分，每次让胸廓完全回弹，尽量不中断；④AED到达后立即开机，按语音提示贴电极片、分析、电击，然后马上继续按压。",
        "未经培训者可以只做“单纯胸外按压”（Hands-Only CPR）；受过培训者可按30:2进行按压和人工呼吸。AED会自动判断是否需要电击，普通人也可以安全使用。",
      ],
      k: ["不确定有没有心跳时，就开始按压", "公共场所留意AED位置（地铁站、机场、商场等）", "建议家庭成员参加正规CPR培训（红十字会等）"],
      r: ["call120", "acs", "mi-sx"],
      ref: [
        ["AHA：Hands-Only CPR", "https://cpr.heart.org/en/cpr-courses-and-kits/hands-only-cpr", "美国心脏协会"],
        ["AHA CPR与心血管急救指南（最新版）", "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines", "美国心脏协会"],
        ["ERC：欧洲复苏委员会指南", "https://www.erc.edu/science-research/guidelines", "欧洲复苏委员会"],
      ],
      vl: [["AHA Hands-Only CPR 官方教学视频页", "https://cpr.heart.org/en/cpr-courses-and-kits/hands-only-cpr", "AHA"]],
      v: [["心肺复苏CPR+AED完整教学", "心肺复苏 CPR AED 教学 红十字会", "hands-only CPR AED tutorial"]],
    },
    {
      id: "aid-dont", uid: "stroke-mi/aid-dont", type: "first-aid", chk: "2026-11", c: "aid", t: "急救误区：这些事不要做", en: "First-Aid Myths",
      s: "掐人中、扎手指放血、喂水喂药、拍打摇晃、自行驾车——都可能耽误或加重病情。",
      d: [
        "民间流传的很多“急救方法”没有任何科学依据，反而浪费宝贵时间：扎手指或耳垂放血不能治疗卒中；掐人中对心脏骤停无效；大力摇晃可能加重损伤。",
        "卒中患者常有吞咽障碍，喂水、喂药（包括牛黄类中成药、降压药）可能引起误吸或使血压骤降。急性期血压高往往是身体在维持脑灌注，不要自行快速降压。",
        "心梗患者应保持安静、半卧位，减少活动；不要让其步行、爬楼或自行就医。",
      ],
      k: ["正确做法：呼叫急救 → 记录时间 → 保持患者安全体位 → 必要时CPR", "呕吐的患者应侧卧，防止误吸", "收集正在服用的药物，交给医生"],
      m: [["放血可以救中风", "没有任何证据支持，还会延误治疗。"], ["高血压患者中风了马上吃降压药", "急性期血压管理需在医院根据卒中类型决定。"]],
      r: ["call120", "aspirin", "befast", "cpr", "onset"],
      ref: [
        ["American Stroke Association：Stroke Symptoms", "https://www.stroke.org/en/about-stroke/stroke-symptoms", "美国卒中协会"],
        ["NHS：Stroke", "https://www.nhs.uk/conditions/stroke/", "英国国家医疗服务体系"],
      ],
      v: [["中风急救误区", "中风 急救 误区 放血", "stroke first aid myths"]],
    },
    {
      id: "onset", uid: "stroke-mi/onset", type: "first-aid", chk: "2026-11", c: "aid", t: "记录发病时间与“最后正常时间”", en: "Last Known Well",
      s: "溶栓、取栓都以时间为依据，一个准确的时间点可能决定能否治疗。",
      d: [
        "对卒中患者，医生需要知道“最后一次看到患者正常的时间”（Last Known Well, LKW），而不是“发现症状的时间”。如果夜间睡前正常、早上醒来发病，LKW就是前一晚入睡时间。",
        "对心梗患者，胸痛开始的时间决定再灌注策略：12小时内的STEMI应尽快开通；超过12小时，如果仍有缺血症状或血流动力学不稳定，同样需要紧急处理。",
        "建议用手机拍照或记录：症状开始/最后正常的时间、症状变化、血压血糖（如家里能测）、正在服用的药物（特别是抗凝药最后一次服用时间）。本应用的“急救”页提供一键计时功能。",
      ],
      k: ["时间不确定时，宁可说出可信范围，不要猜测", "醒后卒中和发病时间不明的患者，借助MRI/CT灌注影像仍可能获得治疗机会"],
      r: ["befast", "ivt", "evt", "pci", "call120"],
      ref: [
        ["2026 AHA/ASA 急性缺血性卒中指南", doi("10.1161/STR.0000000000000513"), "Stroke 2026"],
        ["《中国急性缺血性卒中诊治指南2023》解读（原文：中华神经科杂志 2024;57:523–559）", "https://doaj.org/article/a2018a47a732457db8bf4d257ed428d2", "中国卒中杂志 2024 · 开放获取"],
      ],
      v: [["卒中为什么要记住发病时间", "卒中 发病时间 溶栓 时间窗", "stroke last known well time window"]],
    },

    /* ───────────── 心梗救治 ───────────── */
    {
      id: "ecg", uid: "stroke-mi/ecg", type: "test", chk: "2026-11", c: "mi", t: "心电图", en: "12-lead ECG",
      s: "做12导联心电图，用于识别STEMI并决定是否立即开通血管。",
      n: [["12/18导联", "必要时加做右胸和后壁导联"]],
      d: [
        "心电图是胸痛患者最重要、最快速的检查。STEMI表现为相邻导联ST段抬高（或新发左束支传导阻滞等“STEMI等同”表现），提示冠脉大概率完全闭塞，需要立即再灌注治疗。",
        "需要警惕“STEMI等同”和“闭塞性心梗（OMI）”表现：后壁心梗（V1–V3 ST压低）、de Winter T波、Wellens综合征、aVR抬高伴广泛ST压低等。最新指南越来越强调识别冠脉急性闭塞，而不只是机械套用ST抬高标准。",
        "首份心电图正常不能排除心梗，症状持续时应每15–30分钟复查，并结合肌钙蛋白判断。",
      ],
      k: ["院前心电图远程传输可显著缩短开通时间", "心电图正常+症状持续 → 复查心电图和肌钙蛋白"],
      r: ["acs", "trop", "pci", "nste"],
      ref: [
        ["2023 ESC ACS指南", doi("10.1093/eurheartj/ehad191"), "Eur Heart J 2023"],
        ["2025 ACC/AHA ACS指南", doi("10.1161/CIR.0000000000001309"), "Circulation 2025"],
      ],
      v: [["心梗心电图怎么看", "STEMI 心电图 识别", "STEMI ECG recognition"]],
    },
    {
      id: "trop", uid: "stroke-mi/trop", type: "test", chk: "2026-11", c: "mi", t: "高敏肌钙蛋白：0/1小时快速诊断", en: "High-sensitivity Troponin",
      s: "心肌损伤最敏感的标志物，0/1h或0/2h算法可快速排除或确诊心梗。",
      n: [["0/1h", "ESC推荐的快速诊断/排除算法"], ["99th", "诊断阈值：超过正常上限第99百分位"]],
      d: [
        "心肌细胞损伤后会释放肌钙蛋白到血液。高敏肌钙蛋白（hs-cTn）检测能在症状开始后较早期发现微量升高。",
        "ESC推荐0小时和1小时（或0/2小时）检测：如果两次都很低且变化很小，可以安全排除心梗；如果很高或明显上升，基本可以确诊；介于两者之间的需要继续观察（第3小时复查）或进一步检查。",
        "肌钙蛋白升高不全是心梗：心肌炎、肺栓塞、心衰、脓毒症、肾功能不全、剧烈运动后都可能升高。关键在于动态变化和临床情况。",
      ],
      k: ["不同厂家检测的切点不同，要用对应算法", "STEMI不需要等肌钙蛋白结果，应立即开通血管"],
      r: ["acs", "ecg", "nste"],
      ref: [
        ["2023 ESC ACS指南（hs-cTn 0/1h算法）", doi("10.1093/eurheartj/ehad191"), "Eur Heart J 2023"],
        ["第四版心肌梗死全球定义", doi("10.1161/CIR.0000000000000617"), "Circulation 2018"],
      ],
      v: [["肌钙蛋白是什么", "肌钙蛋白 心梗 诊断 科普", "troponin heart attack test explained"]],
    },
    {
      id: "pci", uid: "stroke-mi/pci", type: "treatment", chk: "2026-11", c: "mi", t: "直接PCI", en: "Primary PCI",
      s: "STEMI首选急诊介入开通血管。",
      d: [
        "直接经皮冠状动脉介入治疗（PCI）是通过手腕（桡动脉）或大腿（股动脉）穿刺，把导管送到冠状动脉，用球囊扩张并植入支架，恢复血流。与溶栓相比，它开通率更高、出血更少，是STEMI的首选再灌注方式。",
        "多支病变患者，通常建议在住院期间或短期内完成非罪犯血管的完全血运重建。",
      ],
      k: ["经桡动脉入路出血风险更低，为首选", "术后需要双联抗血小板治疗", "心源性休克时，可能需要机械循环支持"],
      r: ["acs", "ecg", "lysis-mi", "dapt", "crehab"],
      ref: [
        ["2025 ACC/AHA/ACEP/NAEMSP/SCAI ACS指南", doi("10.1161/CIR.0000000000001309"), "Circulation 2025"],
        ["2023 ESC ACS指南", doi("10.1093/eurheartj/ehad191"), "Eur Heart J 2023"],
      ],
      v: [["心脏支架手术是怎么做的（动画）", "心脏支架 PCI 手术 动画", "PCI stent procedure animation"]],
    },
    {
      id: "lysis-mi", uid: "stroke-mi/lysis-mi", type: "treatment", chk: "2026-11", c: "mi", t: "心梗溶栓：无法及时PCI时", en: "Fibrinolysis for STEMI",
      s: "预计无法及时完成PCI时，应在诊断后尽快开始溶栓，随后转运至PCI中心。",
      d: [
        "在偏远地区或无法及时到达PCI中心时，溶栓（如替奈普酶、阿替普酶、瑞替普酶）是挽救心肌的有效方法，越早越好。",
        "溶栓的主要风险是出血，尤其是颅内出血。禁忌证包括近期出血、既往脑出血、近3个月缺血性卒中、主动脉夹层等。",
      ],
      k: ["“药物-介入”策略：先溶栓，再转运造影", "院前溶栓可进一步缩短时间"],
      r: ["pci", "acs", "ecg"],
      ref: [
        ["2023 ESC ACS指南", doi("10.1093/eurheartj/ehad191"), "Eur Heart J 2023"],
        ["2025 ACC/AHA ACS指南", doi("10.1161/CIR.0000000000001309"), "Circulation 2025"],
      ],
      v: [["STEMI溶栓治疗", "心梗 溶栓 STEMI", "STEMI fibrinolysis"]],
    },
    {
      id: "nste", uid: "stroke-mi/nste", type: "condition", chk: "2026-11", c: "mi", t: "NSTE-ACS：危险分层与介入时机", en: "NSTE-ACS",
      s: "非ST抬高心梗根据风险决定造影时机：风险越高，造影越早。",
      d: [
        "NSTE-ACS（NSTEMI和不稳定型心绞痛）的血管通常没有完全闭塞，但同样可能进展。治疗包括抗血小板、抗凝、抗缺血药物，以及根据风险安排冠脉造影。",
        "极高危特征包括：血流动力学不稳定或心源性休克、药物难以控制的反复胸痛、危及生命的心律失常或心脏骤停、急性心衰、ST段动态改变等。",
        "低危患者可先行无创检查（如负荷试验或冠脉CTA）再决定是否需要造影。",
      ],
      k: ["GRACE评分评估住院和远期死亡风险", "老年患者同样可从侵入性策略中获益，但需评估出血和衰弱"],
      r: ["acs", "trop", "grace", "dapt"],
      ref: [
        ["2023 ESC ACS指南", doi("10.1093/eurheartj/ehad191"), "Eur Heart J 2023"],
        ["2025 ACC/AHA ACS指南", doi("10.1161/CIR.0000000000001309"), "Circulation 2025"],
      ],
      v: [["NSTEMI的诊断和治疗", "NSTEMI 非ST段抬高心梗 治疗", "NSTEMI management"]],
    },
    {
      id: "dapt", uid: "stroke-mi/dapt", type: "treatment", chk: "2026-11", c: "mi", t: "心梗后双联抗血小板（DAPT）", en: "Dual Antiplatelet Therapy",
      s: "阿司匹林+P2Y12抑制剂（替格瑞洛/普拉格雷/氯吡格雷）可依出血风险个体化调整。",
      d: [
        "ACS后，冠脉内的斑块和新植入的支架都容易形成血栓。双联抗血小板（阿司匹林+P2Y12抑制剂）可以显著降低再梗和支架内血栓风险，但会增加出血。",
        "东亚人群出血风险较高，有时会使用P2Y12抑制剂“降阶”策略。",
        "绝对不要自行停药，尤其是支架后早期。需要拔牙、做胃肠镜或手术前，一定要先咨询心内科医生。",
      ],
      k: ["DAPT期间注意黑便、呕血、牙龈和皮下出血", "必要时联用质子泵抑制剂保护胃黏膜", "DAPT结束后通常需要长期单药抗血小板"],
      m: [["支架放好了，可以停药了", "过早停药是支架内血栓最重要的原因之一，后果可能致命。"]],
      r: ["pci", "acs", "aspirin", "sec-ap"],
      ref: [
        ["2025 ACC/AHA ACS指南", doi("10.1161/CIR.0000000000001309"), "Circulation 2025"],
        ["2023 ESC ACS指南", doi("10.1093/eurheartj/ehad191"), "Eur Heart J 2023"],
      ],
      v: [["心脏支架后为什么要吃双抗", "支架术后 双抗 阿司匹林 替格瑞洛", "dual antiplatelet therapy after stent"]],
    },

    /* ───────────── 脑梗救治 ───────────── */
    {
      id: "imaging", uid: "stroke-mi/imaging", type: "test", chk: "2026-11", c: "st", t: "卒中影像：CT、CTA、灌注与MRI", en: "Stroke Imaging",
      s: "到院后第一时间做头颅CT排除出血，再用CTA找大血管闭塞，必要时用灌注影像扩展时间窗。",
      n: [["ASPECTS", "评估早期缺血范围（0–10分）"]],
      d: [
        "平扫CT可以迅速排除脑出血，是决定能否溶栓的前提。CT血管成像（CTA）可以发现颈内动脉、大脑中动脉、基底动脉等大血管闭塞（LVO），这类患者需要取栓。",
        "CT灌注（CTP）或MRI（DWI-FLAIR不匹配、DWI-灌注不匹配）可以区分已经死亡的“梗死核心”和仍可挽救的“半暗带”，用于发病时间不明、醒后卒中或超过常规时间窗的患者。",
        "2026 AHA/ASA指南强调“平行流程”：不要为了等待额外影像或化验而推迟溶栓，溶栓和取栓评估同步进行。",
      ],
      k: ["多数患者溶栓前只需要血糖结果，不必等其他化验", "有条件的中心可在导管室直接做影像（直达导管室）"],
      r: ["isch", "ivt", "evt", "ich", "onset"],
      ref: [
        ["2026 AHA/ASA 急性缺血性卒中指南", doi("10.1161/STR.0000000000000513"), "Stroke 2026"],
        ["《中国急性缺血性卒中诊治指南2023》解读（原文：中华神经科杂志 2024;57:523–559）", "https://doaj.org/article/a2018a47a732457db8bf4d257ed428d2", "中国卒中杂志 2024 · 开放获取"],
      ],
      v: [["CT灌注在卒中中的作用", "CT灌注 卒中 核心 半暗带", "CT perfusion stroke core penumbra"]],
    },
    {
      id: "ivt", uid: "stroke-mi/ivt", type: "treatment", chk: "2026-11", c: "st", t: "静脉溶栓：阿替普酶与替奈普酶", en: "IV Thrombolysis",
      s: "发病4.5小时内符合条件的患者应尽快溶栓。",
      n: [["4.5小时", "标准溶栓时间窗"]],
      d: [
        "静脉溶栓药物可以溶解血栓、恢复血流。发病4.5小时内、排除脑出血和其他禁忌证的患者，越早治疗获益越大。",
        "AcT、TRACE-2（中国）等研究证明替奈普酶疗效不劣于阿替普酶。",
        "对醒后卒中或发病时间不明者，MRI显示DWI-FLAIR不匹配或灌注影像提示存在可挽救脑组织时，仍可考虑溶栓（部分患者至4.5–9小时）。轻型非致残性卒中（如单纯感觉障碍）通常不建议溶栓，可选择双抗治疗。",
      ],
      k: ["溶栓后24小时内严密监测血压（<180/105 mmHg）和神经功能", "主要风险是症状性颅内出血（约2–7%）", "大血管闭塞患者溶栓后应同时准备取栓，不要等待溶栓效果"],
      r: ["isch", "imaging", "evt", "onset", "nihss"],
      ref: [
        ["2026 AHA/ASA 急性缺血性卒中指南", doi("10.1161/STR.0000000000000513"), "Stroke 2026"],
        ["AcT：替奈普酶 vs 阿替普酶", doi("10.1016/S0140-6736(22)01054-6"), "Lancet 2022"],
        ["TRACE-2：中国替奈普酶研究", doi("10.1016/S0140-6736(22)02600-9"), "Lancet 2023"],
        ["《中国急性缺血性卒中诊治指南2023》解读（原文：中华神经科杂志 2024;57:523–559）", "https://doaj.org/article/a2018a47a732457db8bf4d257ed428d2", "中国卒中杂志 2024 · 开放获取"],
      ],
      v: [["脑梗溶栓是怎么回事", "脑梗 溶栓 时间窗 科普", "stroke thrombolysis tPA tenecteplase explained"]],
    },
    {
      id: "evt", uid: "stroke-mi/evt", type: "treatment", chk: "2026-11", c: "st", t: "血管内取栓", en: "Endovascular Thrombectomy",
      s: "大血管闭塞的“特效疗法”：每约2.6例治疗就有1例致残程度减轻；时间窗可达24小时。",
      n: [["2.6", "需治疗人数：每治疗2.6人有1人残疾程度降低（HERMES）"], ["0–24小时", "影像筛选后的前循环取栓时间窗"], ["ASPECTS 3–5", "大核心梗死患者也可能获益"]],
      d: [
        "取栓是通过股动脉或桡动脉把微导管送到脑内闭塞的大血管，用支架取栓装置或抽吸导管把血栓取出来。2015年5项随机试验（汇总为HERMES分析）证明，对前循环大血管闭塞，取栓+常规治疗明显优于单纯药物治疗。",
        "DAWN和DEFUSE 3研究把时间窗扩展到6–24小时（需要影像证明存在可挽救脑组织）。2022–2024年的SELECT2、ANGEL-ASPECT、RESCUE-Japan LIMIT等研究证明，大面积梗死核心的患者取栓仍然获益。ATTENTION和BAOCHE（均以中国中心为主）证明基底动脉闭塞取栓有效。",
        "2026 AHA/ASA指南对前循环LVO在6–24小时、基底动脉闭塞（NIHSS≥10）在24小时内取栓给予强推荐，并推荐移动卒中单元。对于没有取栓能力的医院，应“先溶栓、再转运”（drip-and-ship）。",
      ],
      k: ["取栓前符合条件者仍应先溶栓，两者不冲突", "NIHSS≥6常提示可能存在大血管闭塞", "术后需监测出血转化和脑水肿"],
      r: ["imaging", "ivt", "isch", "nihss", "mrs"],
      ref: [
        ["HERMES：取栓的个体数据荟萃分析", doi("10.1016/S0140-6736(16)00163-X"), "Lancet 2016"],
        ["DAWN：6–24小时取栓", doi("10.1056/NEJMoa1706442"), "N Engl J Med 2018"],
        ["DEFUSE 3：6–16小时灌注筛选取栓", doi("10.1056/NEJMoa1713973"), "N Engl J Med 2018"],
        ["SELECT2：大核心梗死取栓", doi("10.1056/NEJMoa2214403"), "N Engl J Med 2023"],
        ["ANGEL-ASPECT：大核心梗死取栓（中国）", doi("10.1056/NEJMoa2213379"), "N Engl J Med 2023"],
        ["ATTENTION：基底动脉闭塞取栓（中国）", doi("10.1056/NEJMoa2206317"), "N Engl J Med 2022"],
        ["BAOCHE：基底动脉闭塞6–24小时取栓", doi("10.1056/NEJMoa2207576"), "N Engl J Med 2022"],
        ["2026 AHA/ASA 急性缺血性卒中指南", doi("10.1161/STR.0000000000000513"), "Stroke 2026"],
      ],
      v: [["脑梗取栓手术动画", "脑血管 取栓 手术 动画", "mechanical thrombectomy stroke animation"]],
    },
    {
      id: "ich-tx", uid: "stroke-mi/ich-tx", type: "treatment", chk: "2026-11", c: "st", t: "脑出血急性期治疗", en: "Acute ICH Management",
      s: "尽早控制血压、逆转抗凝、管理血糖和体温——INTERACT3“集束化管理”改善预后。",
      n: [["<140 mmHg", "收缩压目标（1小时内达标），避免过度波动"], ["INTERACT3", "集束化护理改善功能结局的研究"]],
      d: [
        "脑出血后数小时内血肿可能扩大，是病情恶化的重要原因。早期把收缩压控制在140 mmHg左右（避免降到110 mmHg以下或剧烈波动）可以减少血肿扩大。",
        "INTERACT3研究（主要在中国等中低收入国家开展）证明，“集束化管理”——快速降压、控制高血糖、治疗发热、及时逆转抗凝——可以改善功能结局并降低死亡率。",
        "服用华法林者用凝血酶原复合物（PCC）+维生素K逆转；达比加群用依达赛珠单抗；Xa因子抑制剂（利伐沙班、阿哌沙班等）可用andexanet alfa或PCC。部分患者需要神经外科手术，如小脑出血伴脑干受压、脑积水，或微创血肿清除。",
      ],
      k: ["告知医生所有抗凝/抗血小板药及最后服药时间", "脑出血后在合适时机重新评估抗栓需求（如房颤）"],
      r: ["ich", "htn", "unit", "af-oac"],
      ref: [
        ["INTERACT3：脑出血集束化护理", doi("10.1016/S0140-6736(23)00806-1"), "Lancet 2023"],
        ["2022 AHA/ASA 自发性脑出血指南", doi("10.1161/STR.0000000000000407"), "Stroke 2022"],
      ],
      v: [["脑出血急性期如何治疗", "脑出血 急性期 治疗 降压", "intracerebral hemorrhage management"]],
    },
    {
      id: "unit", uid: "stroke-mi/unit", type: "treatment", chk: "2026-11", c: "st", t: "卒中单元与早期并发症管理", en: "Stroke Unit Care",
      s: "多学科卒中单元可降低死亡和残疾；吞咽筛查、防跌倒、防血栓、早期康复缺一不可。",
      d: [
        "卒中单元是由神经科医生、护士、康复治疗师、营养师等组成的专门病区。Cochrane系统评价显示，与普通病房相比，卒中单元能降低患者死亡、依赖和需要长期机构照护的比例。",
        "关键措施包括：进食前进行吞咽功能筛查（预防吸入性肺炎）；监测血糖（避免高血糖和低血糖）、体温；预防深静脉血栓（间歇充气加压装置）；监测心律以发现房颤；预防压疮和跌倒；尽早评估康复需求。",
        "需要注意的是，2026 AHA/ASA指南不推荐卒中后24小时内进行非常早期、高强度的下床活动，康复应循序渐进。",
      ],
      k: ["吞咽筛查通过前不要经口进食、饮水、服药", "家属可参与康复训练与护理培训"],
      r: ["isch", "ich-tx", "srehab", "af"],
      ref: [
        ["Cochrane：卒中单元的有效性", doi("10.1002/14651858.CD000197.pub4"), "Cochrane 2020"],
        ["2026 AHA/ASA 急性缺血性卒中指南", doi("10.1161/STR.0000000000000513"), "Stroke 2026"],
      ],
      v: [["卒中后吞咽障碍护理", "卒中 吞咽障碍 筛查 护理", "stroke dysphagia screening"]],
    },

    /* ───────────── 二级预防与康复 ───────────── */
    {
      id: "lipid-tx", uid: "stroke-mi/lipid-tx", type: "treatment", chk: "2026-11", c: "prev", t: "强化降脂治疗", en: "Lipid-lowering Therapy",
      s: "他汀为基础，不达标时联用依折麦布、PCSK9抑制剂或贝派地酸；目标LDL-C<1.4 mmol/L。",
      n: [["<1.4 mmol/L", "心梗/动脉粥样硬化性卒中后LDL-C目标（ESC）"], ["≥50%", "同时较基线降低幅度"], ["4–6周", "调整治疗后复查血脂"]],
      d: [
        "中国人对高剂量他汀的耐受性略差，中等强度他汀联合依折麦布是常用方案。指南支持对极高危患者早期就开始联合治疗，而不是逐步加量。",
        "仍未达标者加用PCSK9抑制剂（依洛尤单抗、阿利西尤单抗）或小干扰RNA药物英克司兰。贝派地酸适用于他汀不耐受者，CLEAR Outcomes研究证明其能减少心血管事件。",
        "他汀的肌肉症状常被高估，真正不能耐受的人很少。出现不适时应与医生沟通换药或调整剂量，而不是自行停药。",
      ],
      k: ["降脂是终身治疗", "治疗目标看LDL-C数值，而不是“正常范围”", "定期复查肝功能和肌酸激酶（必要时）"],
      m: [["血脂正常了就可以停他汀", "停药后LDL-C会回升，斑块风险随之回来。"]],
      r: ["lipid", "lpa", "as", "heartbrain"],
      ref: [
        ["2025 ESC/EAS 血脂指南重点更新", doi("10.1093/eurheartj/ehaf190"), "Eur Heart J 2025"],
        ["CTT 荟萃分析", doi("10.1016/S0140-6736(10)61350-5"), "Lancet 2010"],
        ["CLEAR Outcomes：贝派地酸", doi("10.1056/NEJMoa2215024"), "N Engl J Med 2023"],
      ],
      v: [["他汀类药物的真相", "他汀 副作用 真相 科普", "statins myths and facts"]],
    },
    {
      id: "sec-ap", uid: "stroke-mi/sec-ap", type: "treatment", chk: "2026-11", c: "prev", t: "卒中/TIA后抗血小板治疗", en: "Antiplatelet after Stroke/TIA",
      s: "轻型卒中/高危TIA：阿司匹林+氯吡格雷双抗，之后单药长期维持。",
      n: [["~60%", "中国人群CYP2C19功能缺失等位基因携带比例（影响氯吡格雷疗效）"]],
      d: [
        "CHANCE-2研究发现，对携带CYP2C19功能缺失等位基因的患者（中国人中很常见），替格瑞洛+阿司匹林优于氯吡格雷+阿司匹林。",
        "双抗结束后长期使用单一抗血小板药物（阿司匹林或氯吡格雷）。心源性栓塞（如房颤）患者应使用抗凝药而不是抗血小板药。",
      ],
      r: ["tia", "isch", "abcd2", "af-oac", "dapt"],
      ref: [
        ["CHANCE：氯吡格雷+阿司匹林", doi("10.1056/NEJMoa1215340"), "N Engl J Med 2013"],
        ["POINT 研究", doi("10.1056/NEJMoa1800410"), "N Engl J Med 2018"],
        ["CHANCE-2：替格瑞洛 vs 氯吡格雷（CYP2C19携带者）", doi("10.1056/NEJMoa2111749"), "N Engl J Med 2021"],
        ["2021 AHA/ASA 卒中二级预防指南", doi("10.1161/STR.0000000000000375"), "Stroke 2021"],
      ],
      v: [["脑梗后怎么吃抗血小板药", "脑梗 双抗 氯吡格雷 阿司匹林", "dual antiplatelet minor stroke TIA CHANCE"]],
    },
    {
      id: "af-oac", uid: "stroke-mi/af-oac", type: "treatment", chk: "2026-11", c: "prev", t: "房颤抗凝与左心耳封堵", en: "Anticoagulation in AF",
      s: "新型口服抗凝药（DOAC）是首选；房颤相关卒中后可早期启动抗凝。",
      n: [["~2/3", "抗凝可降低房颤卒中风险的幅度（与不治疗相比）"], ["早期", "ELAN研究：轻中度卒中后48小时内启动DOAC是安全的"]],
      d: [
        "对有卒中风险的房颤患者，口服抗凝药可以把卒中风险降低约三分之二。达比加群、利伐沙班、阿哌沙班、艾多沙班等DOAC与华法林相比，颅内出血更少、无需频繁抽血监测INR，是首选（机械瓣和中重度二尖瓣狭窄除外，这两种情况仍用华法林）。",
        "过去房颤卒中后常推迟数周才开始抗凝。ELAN、OPTIMAS等研究表明，根据梗死大小早期启动DOAC（轻中度卒中48小时内，大面积梗死在第6–7天）并不增加出血，还可能减少复发。",
        "长期抗凝有禁忌（如反复严重出血）的患者，可以考虑经皮左心耳封堵术。",
      ],
      k: ["DOAC剂量需要根据肾功能、年龄、体重调整，不要随意减量", "漏服、擅自停药都会增加卒中风险", "用HAS-BLED评估出血风险是为了纠正可控因素，而不是决定不抗凝"],
      r: ["af", "chads", "isch", "ich-tx"],
      ref: [
        ["2024 ESC 房颤指南", doi("10.1093/eurheartj/ehae176"), "Eur Heart J 2024"],
        ["2023 ACC/AHA/ACCP/HRS 房颤指南", doi("10.1161/CIR.0000000000001193"), "Circulation 2023"],
        ["ELAN：房颤卒中后早期 vs 晚期DOAC", doi("10.1056/NEJMoa2303048"), "N Engl J Med 2023"],
      ],
      v: [["房颤为什么要吃抗凝药", "房颤 抗凝药 新型口服抗凝药 科普", "atrial fibrillation anticoagulation explained"]],
    },
    {
      id: "bp-tx", uid: "stroke-mi/bp-tx", type: "treatment", chk: "2026-11", c: "prev", t: "心梗/卒中后的血压管理", en: "BP Control after MI/Stroke",
      s: "长期目标一般<130/80 mmHg；家庭自测血压，选择有心脑保护证据的药物。",
      n: [["<130/80", "多数心梗/卒中后患者的长期目标"], ["每天2次", "家庭血压：早晨服药前、晚上睡前"]],
      d: [
        "卒中后几天到几周病情稳定后，应开始或恢复降压治疗。2021 AHA/ASA卒中二级预防指南推荐多数患者血压目标<130/80 mmHg；颅内大动脉重度狭窄者需要个体化目标。",
        "心梗后常用β受体阻滞剂、ACEI/ARB（或ARNI，尤其在射血分数降低时）、醛固酮受体拮抗剂。这些药物不仅降压，还能改善心脏重构，有独立的预后获益。",
        "卒中后常用ACEI/ARB、钙通道阻滞剂、噻嗪类利尿剂，多数患者需要联合用药。",
      ],
      k: ["血压控制要平稳，避免大幅波动", "体位性低血压（站立时头晕）要告诉医生", "同时坚持限盐与运动"],
      r: ["htn", "heartbrain", "crehab"],
      ref: [
        ["2021 AHA/ASA 卒中二级预防指南", doi("10.1161/STR.0000000000000375"), "Stroke 2021"],
        ["2025 AHA/ACC 高血压指南", doi("10.1161/HYP.0000000000000249"), "Hypertension 2025"],
      ],
      v: [["脑梗后血压控制多少合适", "脑梗 二级预防 血压 目标", "blood pressure target after stroke"]],
    },
    {
      id: "cardio-metab", uid: "stroke-mi/cardio-metab", type: "treatment", chk: "2026-11", c: "prev", t: "心血管获益的降糖/减重药物", en: "SGLT2i & GLP-1RA",
      s: "SGLT2抑制剂、GLP-1受体激动剂不只降糖，还能减少心血管事件；司美格鲁肽在非糖尿病肥胖心血管病患者中降低MACE 20%。",
      n: [["−20%", "SELECT研究：司美格鲁肽降低主要心血管事件"]],
      d: [
        "GLP-1受体激动剂（如司美格鲁肽、度拉糖肽、利拉鲁肽）在2型糖尿病患者中可减少心梗、卒中和心血管死亡。SELECT研究进一步证明，对没有糖尿病但已有心血管病的超重/肥胖患者，司美格鲁肽可使主要心血管事件减少20%。",
        "SGLT2抑制剂（达格列净、恩格列净等）可以降低心衰住院和肾病进展，对心梗后合并心衰或糖尿病的患者很有价值。",
        "这些药物需要医生评估后使用，注意胃肠道反应、低血糖（联合胰岛素/磺脲类时）、生殖道感染等不良反应。",
      ],
      k: ["已有心血管病的2型糖尿病患者，优先选择有心血管获益证据的药物", "体重管理是二级预防的重要组成部分"],
      r: ["dm", "le8", "heartbrain"],
      ref: [
        ["SELECT：司美格鲁肽与心血管结局", doi("10.1056/NEJMoa2307563"), "N Engl J Med 2023"],
        ["2023 ESC 糖尿病患者心血管病指南", doi("10.1093/eurheartj/ehad192"), "Eur Heart J 2023"],
      ],
      v: [["GLP-1药物与心血管保护", "司美格鲁肽 心血管 获益", "GLP-1 semaglutide heart benefits"]],
    },
    {
      id: "extra", uid: "stroke-mi/extra", type: "treatment", chk: "2026-11", c: "prev", t: "其他获益措施：疫苗与抗炎治疗", en: "Vaccines & Anti-inflammation",
      s: "心梗后接种流感疫苗可降低死亡；低剂量秋水仙碱的证据存在分歧，需医生评估。",
      d: [
        "流感会诱发心梗和卒中。IAMI研究显示，心梗后早期接种流感疫苗可降低全因死亡和心血管死亡。2023 ESC ACS指南建议ACS患者接种流感疫苗（IIa类推荐）。",
      ],
      k: ["每年秋季接种流感疫苗", "肺炎球菌疫苗、新冠疫苗也建议按当地推荐接种"],
      r: ["acs", "as", "crehab"],
      ref: [
        ["IAMI：心梗后流感疫苗", doi("10.1161/CIRCULATIONAHA.121.057042"), "Circulation 2021"],
        ["COLCOT：秋水仙碱", doi("10.1056/NEJMoa1912388"), "N Engl J Med 2019"],
        ["CLEAR SYNERGY：心梗后秋水仙碱", doi("10.1056/NEJMoa2405922"), "N Engl J Med 2025"],
      ],
      v: [["流感疫苗与心脏保护", "流感疫苗 心梗 保护", "flu vaccine heart attack protection"]],
    },
    {
      id: "crehab", uid: "stroke-mi/crehab", type: "rehab", chk: "2026-11", c: "prev", t: "心脏康复", en: "Cardiac Rehabilitation",
      s: "运动训练+危险因素管理+心理支持，可降低约四分之一的心血管死亡，却被严重低估使用。",
      n: [["−26%", "心脏康复降低心血管死亡（Cochrane 2021，RR≈0.74）"], ["I类", "各大指南的最高级推荐"]],
      d: [
        "心脏康复是一套综合项目，包括在专业人员监护下的运动训练、营养指导、戒烟、血压血脂血糖管理、用药教育和心理支持。它适用于心梗、PCI、搭桥、心衰等患者。",
        "通常在出院后1–3周开始门诊康复，持续约12周（36次）。无法到中心的患者可以参加家庭或远程康复，效果相当。",
        "康复期运动强度通常从低强度开始（如说话时能完整说句子的强度），逐步增加，以运动负荷试验或心肺运动试验结果指导。",
      ],
      k: ["出院时主动向医生询问康复转诊", "运动中出现胸痛、明显气短、头晕应立即停止", "恢复性生活、驾驶和工作的时间请咨询医生"],
      r: ["pci", "acs", "mental", "le8"],
      ref: [
        ["Cochrane：冠心病运动康复", doi("10.1002/14651858.CD001800.pub4"), "Cochrane 2021"],
        ["AHA：Cardiac Rehab", "https://www.heart.org/en/health-topics/cardiac-rehab", "美国心脏协会"],
      ],
      v: [["心梗后康复运动", "心脏康复 运动 心梗后", "cardiac rehabilitation exercise after heart attack"]],
    },
    {
      id: "srehab", uid: "stroke-mi/srehab", type: "rehab", chk: "2026-11", c: "prev", t: "卒中康复", en: "Stroke Rehabilitation",
      s: "康复越早、越系统，功能恢复越好；前3–6个月是恢复最快的时期。",
      n: [["3–6个月", "神经功能恢复最快的时期"], ["多学科", "运动、言语、吞咽、认知、心理康复"]],
      d: [
        "卒中后大脑具有可塑性，邻近和对侧的神经网络可以部分代偿受损功能。康复训练的目的是充分利用这一窗口期。",
        "常见的康复内容包括：肢体运动和步行训练、上肢精细功能训练（如强制性运动疗法）、言语和吞咽训练、认知训练、日常生活活动训练，以及预防肩痛、痉挛和跌倒。",
        "卒中后抑郁很常见（约三分之一患者），会影响康复积极性，需要筛查和治疗。家庭支持和照护者培训同样重要。",
      ],
      k: ["病情稳定后尽早开始，但避免24小时内高强度活动", "出院后持续进行社区或家庭康复", "6个月后仍可继续进步，不要放弃"],
      r: ["unit", "mrs", "mental", "isch"],
      ref: [
        ["2016 AHA/ASA 成人卒中康复指南", doi("10.1161/STR.0000000000000098"), "Stroke 2016"],
        ["NHS：Stroke — recovery", "https://www.nhs.uk/conditions/stroke/recovery/", "英国国家医疗服务体系"],
      ],
      v: [["脑梗后家庭康复训练", "脑卒中 偏瘫 家庭康复 训练", "stroke rehabilitation exercises at home"]],
    },
    {
      id: "mental", uid: "stroke-mi/mental", type: "rehab", chk: "2026-11", c: "prev", t: "心理健康与回归生活", en: "Mental Health & Return to Life",
      s: "心梗、卒中后抑郁和焦虑常见，会使复发和死亡风险增加，需要主动识别和治疗。",
      d: [
        "约20–30%的心梗患者和约三分之一的卒中患者会出现抑郁，焦虑和睡眠障碍也很常见。抑郁会降低服药和康复依从性，与较高的复发和死亡风险相关。",
        "推荐用PHQ-9等量表定期筛查。心理咨询、认知行为治疗、运动和必要的药物治疗（如SSRI类抗抑郁药）都是有效手段。",
        "回归生活方面：多数心梗后患者在病情稳定、能轻松爬两层楼时可恢复性生活；驾驶通常需要停1–4周（取决于治疗方式和当地法规）；卒中后驾驶需要评估视野、反应和肢体功能。",
      ],
      k: ["情绪低落、失眠、兴趣丧失超过两周应就医", "照护者也需要心理支持"],
      r: ["crehab", "srehab"],
      ref: [
        ["2024 ESC 慢性冠脉综合征指南（社会心理因素）", doi("10.1093/eurheartj/ehae177"), "Eur Heart J 2024"],
        ["2021 AHA/ASA 卒中二级预防指南", doi("10.1161/STR.0000000000000375"), "Stroke 2021"],
      ],
      v: [["心梗/中风后的心理调适", "卒中后抑郁 心梗后 焦虑 心理", "depression after heart attack stroke"]],
    },

    /* ───────────── 评估工具 ───────────── */
    {
      id: "risk-score", uid: "stroke-mi/risk-score", type: "tool", chk: "2026-11", c: "tool", t: "心血管风险评估：China-PAR / PREVENT / SCORE2", en: "CVD Risk Calculators",
      s: "用年龄、性别、血压、血脂、血糖、吸烟等估算10年心梗和卒中风险，指导一级预防。",
      d: [
        "China-PAR模型基于中国人群队列开发，可以估算10年和终生动脉粥样硬化性心血管病风险，更适合中国人。美国2023年推出PREVENT方程（纳入肾功能，并可估算心衰风险），2025 AHA/ACC高血压指南已改用它；欧洲使用SCORE2和SCORE2-OP（70岁以上）。",
        "已经发生过心梗或卒中的人不需要用这些工具，他们已属于极高危人群。冠脉钙化积分、Lp(a)、家族史、慢性肾病等可以用来调整风险等级。",
      ],
      k: ["10年风险≥10%通常为高危", "年轻人10年风险低但终生风险可能很高，应关注终生风险"],
      r: ["htn", "lipid", "le8", "lpa"],
      ref: [
        ["China-PAR 风险预测模型", doi("10.1161/CIRCULATIONAHA.116.022367"), "Circulation 2016"],
        ["AHA PREVENT 方程", doi("10.1161/CIRCULATIONAHA.123.067626"), "Circulation 2024"],
        ["SCORE2 风险模型", doi("10.1093/eurheartj/ehab309"), "Eur Heart J 2021"],
      ],
      v: [["如何评估自己的心血管风险", "心血管 风险评估 10年风险", "cardiovascular risk calculator explained"]],
    },
    {
      id: "grace", uid: "stroke-mi/grace", type: "tool", chk: "2026-11", c: "tool", t: "GRACE 评分", en: "GRACE Score",
      s: "评估急性冠脉综合征患者院内和6个月死亡风险，>140分为高危。",
      d: [
        "GRACE评分纳入年龄、心率、收缩压、血肌酐、Killip心功能分级、入院时心脏骤停、ST段偏移、心肌标志物升高等8项，用于NSTE-ACS的风险分层，指导侵入性治疗的时机。",
        "评分需由医生在医院计算。患者需要知道的是：评分越高，越需要早期介入和更积极的治疗。",
      ],
      r: ["nste", "acs"],
      ref: [
        ["MDCalc：GRACE ACS Risk and Mortality Calculator", "https://www.mdcalc.com/calc/1099/grace-acs-risk-mortality-calculator", "MDCalc"],
        ["2023 ESC ACS指南", doi("10.1093/eurheartj/ehad191"), "Eur Heart J 2023"],
      ],
      v: [["GRACE评分讲解", "GRACE评分 ACS 危险分层", "GRACE score ACS explained"]],
    },
    {
      id: "nihss", uid: "stroke-mi/nihss", type: "tool", chk: "2026-11", c: "tool", t: "NIHSS 卒中量表", en: "NIH Stroke Scale",
      s: "评估卒中严重程度（0–42分），指导溶栓/取栓决策并预测预后。",
      n: [["0–42", "分数越高越严重"], ["≥6", "常提示可能存在大血管闭塞"], ["≤3", "常定义为轻型卒中"]],
      d: [
        "NIHSS共11项，包括意识水平、凝视、视野、面瘫、上下肢运动、共济失调、感觉、语言、构音和忽视。经过培训的医护人员几分钟即可完成。",
        "NIHSS用于判断卒中严重程度、是否可能有大血管闭塞，以及跟踪病情变化。需要注意，后循环卒中（如眩晕、共济失调为主）时NIHSS可能偏低，不能据此低估病情。",
      ],
      r: ["ivt", "evt", "sec-ap", "mrs"],
      ref: [
        ["NINDS：NIH Stroke Scale（官方量表PDF）", "https://www.ninds.nih.gov/sites/default/files/documents/NIH-Stroke-Scale_updatedFeb2024_508.pdf", "美国国立神经疾病与卒中研究所"],
        ["MDCalc：NIH Stroke Scale/Score", "https://www.mdcalc.com/calc/715/nih-stroke-scale-score-nihss", "MDCalc"],
      ],
      v: [["NIHSS评分演示", "NIHSS 评分 演示 培训", "NIHSS stroke scale demonstration"]],
    },
    {
      id: "abcd2", uid: "stroke-mi/abcd2", type: "tool", chk: "2026-11", c: "tool", t: "ABCD² 评分（TIA）", en: "ABCD² Score",
      s: "评估TIA后短期卒中风险：≥4分为高危。所有疑似TIA都应尽快就医。",
      d: [
        "ABCD²评分包括年龄（Age）、血压（Blood pressure）、临床症状（Clinical features）、持续时间（Duration）和糖尿病（Diabetes），总分0–7分。原始研究中，0–3分、4–5分、6–7分对应的2天卒中风险分别约为1%、4%和8%。",
        "它主要用于分诊和研究分组（如CHANCE研究纳入ABCD²≥4的TIA）。但低分不代表安全：房颤或颈动脉重度狭窄的低分患者同样高危。",
      ],
      calc: {
        title: "ABCD² 自测（仅供参考）",
        items: [
          ["年龄 ≥60 岁", 1],
          ["就诊时血压 ≥140/90 mmHg", 1],
          ["一侧肢体无力", 2, "c"],
          ["仅言语障碍、无肢体无力", 1, "c"],
          ["症状持续 ≥60 分钟", 2, "d"],
          ["症状持续 10–59 分钟", 1, "d"],
          ["糖尿病", 1],
        ],
        bands: [[0, 3, "低危（2天卒中风险约1%）", "low"], [4, 5, "中危（2天约4%）", "mid"], [6, 7, "高危（2天约8%）", "high"]],
        note: "同组选项（症状类型、持续时间）只能选一项。无论得分高低，疑似TIA都应在24小时内就医评估。",
      },
      r: ["tia", "sec-ap"],
      ref: [
        ["ABCD² 评分原始研究", doi("10.1016/S0140-6736(07)60150-0"), "Lancet 2007"],
        ["MDCalc：ABCD² Score for TIA", "https://www.mdcalc.com/calc/357/abcd2-score-tia", "MDCalc"],
      ],
      v: [["ABCD2评分", "ABCD2 评分 TIA", "ABCD2 score TIA"]],
    },
    {
      id: "chads", uid: "stroke-mi/chads", type: "tool", chk: "2026-11", c: "tool", t: "CHA₂DS₂-VA 评分（房颤卒中风险）", en: "CHA₂DS₂-VA / VASc",
      s: "评估房颤患者的卒中风险：2024 ESC推荐CHA₂DS₂-VA ≥2分应抗凝，1分应考虑。",
      d: [
        "CHA₂DS₂-VASc包括心衰、高血压、年龄、糖尿病、既往卒中/TIA/血栓栓塞、血管疾病和女性。2024 ESC房颤指南去掉了“女性”一项，改为CHA₂DS₂-VA，因为女性本身并不独立增加风险，且便于非二元性别人群使用。美国2023指南仍使用CHA₂DS₂-VASc（男性≥2、女性≥3推荐抗凝）。",
        "HAS-BLED用于评估出血风险，目的在于发现并纠正可控的出血因素（如血压控制不佳、合用NSAID、饮酒），而不是作为不抗凝的理由。",
      ],
      calc: {
        title: "CHA₂DS₂-VA 自测（仅供参考）",
        items: [
          ["充血性心衰（C）", 1],
          ["高血压（H）", 1],
          ["年龄 ≥75 岁（A₂）", 2, "a"],
          ["年龄 65–74 岁（A）", 1, "a"],
          ["糖尿病（D）", 1],
          ["既往卒中/TIA/血栓栓塞（S₂）", 2],
          ["血管疾病：心梗、外周动脉病、主动脉斑块（V）", 1],
        ],
        bands: [[0, 0, "低风险：通常不需要抗凝", "low"], [1, 1, "应考虑口服抗凝（与医生讨论）", "mid"], [2, 8, "推荐口服抗凝", "high"]],
        note: "年龄两项只能选一项。本工具仅适用于已确诊房颤者，用药决策请由医生制定。",
      },
      r: ["af", "af-oac"],
      ref: [
        ["2024 ESC 房颤指南（CHA₂DS₂-VA）", doi("10.1093/eurheartj/ehae176"), "Eur Heart J 2024"],
        ["MDCalc：CHA₂DS₂-VASc Score", "https://www.mdcalc.com/calc/801/cha2ds2-vasc-score-atrial-fibrillation-stroke-risk", "MDCalc"],
      ],
      v: [["房颤抗凝评分怎么算", "CHA2DS2-VASc 评分 房颤", "CHA2DS2-VASc score explained"]],
    },
    {
      id: "mrs", uid: "stroke-mi/mrs", type: "tool", chk: "2026-11", c: "tool", t: "改良Rankin量表（mRS）", en: "Modified Rankin Scale",
      s: "衡量卒中后残疾程度（0–6分），是几乎所有卒中试验的主要结局指标。",
      n: [["0", "完全无症状"], ["1", "有症状但无明显残疾，能完成日常工作"], ["2", "轻度残疾，生活自理"], ["3", "中度残疾，需要部分帮助，可独立行走"], ["4", "中重度残疾，不能独立行走和生活"], ["5", "重度残疾，卧床、失禁，需持续照护"], ["6", "死亡"]],
      d: [
        "mRS通常在卒中后90天评估。0–2分被认为是“功能独立”的良好结局。溶栓、取栓等治疗的疗效，大多是用mRS的改善来衡量的。",
        "了解mRS有助于患者和家属理解医生所说的“预后”，以及“治疗后功能独立的概率”是什么意思。",
      ],
      r: ["evt", "ivt", "srehab", "nihss"],
      ref: [
        ["HERMES：取栓的mRS获益", doi("10.1016/S0140-6736(16)00163-X"), "Lancet 2016"],
      ],
      v: [["改良Rankin量表", "mRS 改良Rankin量表", "modified Rankin scale"]],
    },
  ];

  window.KG = {
    META: {
      id: "stroke-mi",
      rootIc: "pulse",
      title: "心梗·脑梗知识图谱",
      rootLabel: "心梗·脑梗",
      tagline: "早识别、快急救、防复发",
      eyebrow: "时间就是心肌 · 时间就是大脑",
    },
    CATS, NODES, REVIEWED: "2026-11",
  };
})();
