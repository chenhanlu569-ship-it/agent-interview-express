/**
 * 种子数据 - LeetCode 面试经典 150 题
 * 数据来源: https://leetcode.cn/studyplan/top-interview-150/
 */
import { getDb } from './db';

export function seedLeetCode() {
  const db = getDb();
  const count = (db.prepare('SELECT COUNT(*) as c FROM leetcode_problems').get() as { c: number }).c;
  if (count >= 140) return;

  // 如果已有旧数据，先清除
  if (count > 0) {
    db.prepare('DELETE FROM leetcode_problems').run();
  }

  const insert = db.prepare(`
    INSERT OR IGNORE INTO leetcode_problems (id, title, title_cn, difficulty, category, tags, description, leetcode_url, solution_hint, heat_rating)
    VALUES (@id, @title, @title_cn, @difficulty, @category, @tags, @description, @leetcode_url, @solution_hint, @heat_rating)
  `);

  const U = 'https://leetcode.cn/problems';
  const S = '?envType=study-plan-v2&envId=top-interview-150';

  // 面试热度星级 (5=必刷, 4=重点, 3=常考, 2=了解, 1=选做)
  // 基于 CodeTop 频率、小红书/B站/掘金面经统计、2025-2026跨平台面经汇总综合评定
  // 参考：小红书-果果姐聊AI大厂面试版面经算法TOP20及分类频次
  const H: Record<number, number> = {
    // 5星 必刷 - 跨平台面试出现频率极高(面经提及25+次)
    1:5, 2:5, 3:5, 11:5, 15:5, 20:5, 21:5, 23:5, 42:5, 46:5, 49:5,
    53:5, 56:5, 70:5, 72:5, 76:5, 102:5, 121:5, 124:5, 141:5, 143:5,
    146:5, 200:5, 206:5, 215:5, 236:5, 238:5, 300:5,
    // 4星 重点 - 高频面试题(面经提及10-25次)
    5:4, 19:4, 25:4, 33:4, 34:4, 39:4, 48:4, 54:4, 55:4, 73:4,
    79:4, 82:4, 92:4, 98:4, 105:4, 114:4, 127:4, 128:4, 133:4, 138:4,
    148:4, 150:4, 153:4, 155:4, 198:4, 199:4, 207:4, 208:4, 221:4,
    224:4, 230:4, 232:4, 234:4, 240:4, 295:4, 322:4, 139:4, 4:4,
    // 3星 常考 - 中等频率(面经提及5-10次)
    6:3, 12:3, 13:3, 14:3, 22:3, 26:3, 27:3, 28:3, 36:3, 45:3,
    50:3, 57:3, 61:3, 63:3, 64:3, 66:3, 67:3, 69:3, 71:3, 77:3,
    80:3, 86:3, 88:3, 97:3, 101:3, 103:3, 106:3, 108:3, 112:3, 129:3,
    130:3, 162:3, 167:3, 169:3, 172:3, 189:3, 205:3, 209:3, 210:3, 222:3,
    226:3, 228:3, 242:3, 290:3, 452:3, 17:3, 122:3, 399:3, 470:3,
    // 2星 了解 - 偶尔考察(面经提及1-5次)
    30:2, 35:2, 117:2, 123:2, 135:2, 136:2, 137:2, 149:2, 151:2, 188:2,
    190:2, 191:2, 201:2, 211:2, 212:2, 219:2, 274:2, 289:2, 313:2, 373:2,
    380:2, 383:2, 427:2, 433:2, 52:2, 909:2, 918:2, 637:2,
    // 1星 选做 - 极少考察，有余力再刷
    9:1, 58:1, 68:1, 100:1, 104:1, 125:1, 134:1, 173:1, 392:1, 530:1,
  };

  function hr(id: number): number {
    return H[id] ?? 3;
  }

  const problems = [
    // ===== 数组 / 字符串 (24题) =====
    { id: 88, title: 'Merge Sorted Array', title_cn: '合并两个有序数组', difficulty: 'Easy', category: '数组/字符串', tags: '数组,双指针', description: '将nums2合并到nums1中，保持有序', leetcode_url: `${U}/merge-sorted-array/${S}`, solution_hint: '逆向双指针，从末尾开始填充' },
    { id: 27, title: 'Remove Element', title_cn: '移除元素', difficulty: 'Easy', category: '数组/字符串', tags: '数组,双指针', description: '移除数组中所有等于val的元素', leetcode_url: `${U}/remove-element/${S}`, solution_hint: '快慢指针覆盖法' },
    { id: 26, title: 'Remove Duplicates from Sorted Array', title_cn: '删除有序数组中的重复项', difficulty: 'Easy', category: '数组/字符串', tags: '数组,双指针', description: '原地删除有序数组中的重复元素', leetcode_url: `${U}/remove-duplicates-from-sorted-array/${S}`, solution_hint: '快慢指针，慢指针记录不重复位置' },
    { id: 80, title: 'Remove Duplicates from Sorted Array II', title_cn: '删除有序数组中的重复项 II', difficulty: 'Medium', category: '数组/字符串', tags: '数组,双指针', description: '允许每个元素最多出现两次', leetcode_url: `${U}/remove-duplicates-from-sorted-array-ii/${S}`, solution_hint: '双指针，比较当前元素与慢指针前两位' },
    { id: 169, title: 'Majority Element', title_cn: '多数元素', difficulty: 'Easy', category: '数组/字符串', tags: '数组,分治,投票', description: '找出出现次数超过n/2的元素', leetcode_url: `${U}/majority-element/${S}`, solution_hint: 'Boyer-Moore投票算法' },
    { id: 189, title: 'Rotate Array', title_cn: '轮转数组', difficulty: 'Medium', category: '数组/字符串', tags: '数组,数学', description: '将数组向右轮转k步', leetcode_url: `${U}/rotate-array/${S}`, solution_hint: '三次反转法：整体反转+前k反转+后n-k反转' },
    { id: 121, title: 'Best Time to Buy and Sell Stock', title_cn: '买卖股票的最佳时机', difficulty: 'Easy', category: '数组/字符串', tags: '数组,动态规划', description: '一次交易的最大利润', leetcode_url: `${U}/best-time-to-buy-and-sell-stock/${S}`, solution_hint: '记录历史最低价，计算当前卖出利润' },
    { id: 122, title: 'Best Time to Buy and Sell Stock II', title_cn: '买卖股票的最佳时机 II', difficulty: 'Medium', category: '数组/字符串', tags: '数组,贪心', description: '多次交易的最大利润', leetcode_url: `${U}/best-time-to-buy-and-sell-stock-ii/${S}`, solution_hint: '贪心：所有上涨区间累加' },
    { id: 55, title: 'Jump Game', title_cn: '跳跃游戏', difficulty: 'Medium', category: '数组/字符串', tags: '数组,贪心', description: '判断能否到达最后一个下标', leetcode_url: `${U}/jump-game/${S}`, solution_hint: '贪心维护最远可达位置' },
    { id: 45, title: 'Jump Game II', title_cn: '跳跃游戏 II', difficulty: 'Medium', category: '数组/字符串', tags: '数组,贪心,BFS', description: '到达最后下标的最少跳跃次数', leetcode_url: `${U}/jump-game-ii/${S}`, solution_hint: '贪心BFS，维护当前跳跃边界' },
    { id: 274, title: 'H-Index', title_cn: 'H指数', difficulty: 'Medium', category: '数组/字符串', tags: '数组,排序,计数', description: '计算研究者的H指数', leetcode_url: `${U}/h-index/${S}`, solution_hint: '排序后从后往前找满足h篇>=h次' },
    { id: 380, title: 'Insert Delete GetRandom O(1)', title_cn: 'O(1)时间插入删除和获取随机元素', difficulty: 'Medium', category: '数组/字符串', tags: '数组,哈希表,随机化', description: '设计支持O(1)插入删除和随机获取的数据结构', leetcode_url: `${U}/insert-delete-getrandom-o1/${S}`, solution_hint: '数组+哈希表，删除时用末尾元素覆盖' },
    { id: 238, title: 'Product of Array Except Self', title_cn: '除了自身以外数组的乘积', difficulty: 'Medium', category: '数组/字符串', tags: '数组,前缀积', description: '每个元素为其余元素之积，不能用除法', leetcode_url: `${U}/product-of-array-except-self/${S}`, solution_hint: '左右前缀积相乘' },
    { id: 134, title: 'Gas Station', title_cn: '加油站', difficulty: 'Medium', category: '数组/字符串', tags: '数组,贪心', description: '找到能绕行一圈的起点', leetcode_url: `${U}/gas-station/${S}`, solution_hint: '总油量>=总消耗则必有解，贪心找起点' },
    { id: 135, title: 'Candy', title_cn: '分发糖果', difficulty: 'Hard', category: '数组/字符串', tags: '数组,贪心', description: '相邻评分高的孩子获得更多糖果', leetcode_url: `${U}/candy/${S}`, solution_hint: '两次遍历：左到右+右到左取最大值' },
    { id: 42, title: 'Trapping Rain Water', title_cn: '接雨水', difficulty: 'Hard', category: '数组/字符串', tags: '数组,双指针,栈', description: '计算柱状图能接多少雨水', leetcode_url: `${U}/trapping-rain-water/${S}`, solution_hint: '双指针维护左右最大高度' },
    { id: 13, title: 'Roman to Integer', title_cn: '罗马数字转整数', difficulty: 'Easy', category: '数组/字符串', tags: '字符串,模拟', description: '将罗马数字转换为整数', leetcode_url: `${U}/roman-to-integer/${S}`, solution_hint: '小值在大值左边则减，否则加' },
    { id: 12, title: 'Integer to Roman', title_cn: '整数转罗马数字', difficulty: 'Medium', category: '数组/字符串', tags: '字符串,模拟', description: '将整数转换为罗马数字', leetcode_url: `${U}/integer-to-roman/${S}`, solution_hint: '贪心从大到小匹配' },
    { id: 58, title: 'Length of Last Word', title_cn: '最后一个单词的长度', difficulty: 'Easy', category: '数组/字符串', tags: '字符串', description: '返回字符串中最后一个单词的长度', leetcode_url: `${U}/length-of-last-word/${S}`, solution_hint: '从末尾遍历，跳过空格计数' },
    { id: 14, title: 'Longest Common Prefix', title_cn: '最长公共前缀', difficulty: 'Easy', category: '数组/字符串', tags: '字符串,二分', description: '找出字符串数组的最长公共前缀', leetcode_url: `${U}/longest-common-prefix/${S}`, solution_hint: '逐字符比较或纵向扫描' },
    { id: 151, title: 'Reverse Words in a String', title_cn: '反转字符串中的单词', difficulty: 'Medium', category: '数组/字符串', tags: '字符串,双指针', description: '反转字符串中单词的顺序', leetcode_url: `${U}/reverse-words-in-a-string/${S}`, solution_hint: '先反转整个字符串，再逐个反转单词' },
    { id: 6, title: 'Zigzag Conversion', title_cn: 'Z字形变换', difficulty: 'Medium', category: '数组/字符串', tags: '字符串,模拟', description: '将字符串按Z字形排列后逐行读取', leetcode_url: `${U}/zigzag-conversion/${S}`, solution_hint: '模拟逐行放置，找索引规律' },
    { id: 28, title: 'Find the Index of the First Occurrence in a String', title_cn: '找出字符串中第一个匹配项的下标', difficulty: 'Easy', category: '数组/字符串', tags: '字符串,双指针', description: '在haystack中查找needle的起始位置', leetcode_url: `${U}/find-the-index-of-the-first-occurrence-in-a-string/${S}`, solution_hint: 'KMP算法或暴力匹配' },
    { id: 68, title: 'Text Justification', title_cn: '文本左右对齐', difficulty: 'Hard', category: '数组/字符串', tags: '字符串,模拟', description: '按 maxWidth 对文本进行两端对齐', leetcode_url: `${U}/text-justification/${S}`, solution_hint: '贪心放单词，计算空格均匀分配' },

    // ===== 双指针 (5题) =====
    { id: 125, title: 'Valid Palindrome', title_cn: '验证回文串', difficulty: 'Easy', category: '双指针', tags: '字符串,双指针', description: '判断是否为回文串（只考虑字母数字）', leetcode_url: `${U}/valid-palindrome/${S}`, solution_hint: '双指针从两端向中间比较' },
    { id: 392, title: 'Is Subsequence', title_cn: '判断子序列', difficulty: 'Easy', category: '双指针', tags: '字符串,双指针', description: '判断s是否为t的子序列', leetcode_url: `${U}/is-subsequence/${S}`, solution_hint: '双指针分别遍历两个字符串' },
    { id: 167, title: 'Two Sum II - Input Array Is Sorted', title_cn: '两数之和 II - 输入有序数组', difficulty: 'Medium', category: '双指针', tags: '数组,双指针,二分', description: '有序数组中找两数之和等于target', leetcode_url: `${U}/two-sum-ii-input-array-is-sorted/${S}`, solution_hint: '左右双指针，和大了左移，小了右移' },
    { id: 11, title: 'Container With Most Water', title_cn: '盛最多水的容器', difficulty: 'Medium', category: '双指针', tags: '数组,双指针,贪心', description: '找两条线使容器盛水最多', leetcode_url: `${U}/container-with-most-water/${S}`, solution_hint: '双指针，移动较短的那根' },
    { id: 15, title: '3Sum', title_cn: '三数之和', difficulty: 'Medium', category: '双指针', tags: '数组,双指针,排序', description: '找出数组中所有和为0的三元组', leetcode_url: `${U}/3sum/${S}`, solution_hint: '排序+固定一个数+双指针' },

    // ===== 滑动窗口 (4题) =====
    { id: 209, title: 'Minimum Size Subarray Sum', title_cn: '长度最小的子数组', difficulty: 'Medium', category: '滑动窗口', tags: '数组,滑动窗口,前缀和', description: '找和>=target的最短连续子数组', leetcode_url: `${U}/minimum-size-subarray-sum/${S}`, solution_hint: '滑动窗口，右扩左缩' },
    { id: 3, title: 'Longest Substring Without Repeating Characters', title_cn: '无重复字符的最长子串', difficulty: 'Medium', category: '滑动窗口', tags: '字符串,滑动窗口,哈希表', description: '找不含重复字符的最长子串长度', leetcode_url: `${U}/longest-substring-without-repeating-characters/${S}`, solution_hint: '滑动窗口+HashSet记录字符' },
    { id: 30, title: 'Substring with Concatenation of All Words', title_cn: '串联所有单词的子串', difficulty: 'Hard', category: '滑动窗口', tags: '字符串,滑动窗口,哈希表', description: '找到所有由words串联组成的子串起始位置', leetcode_url: `${U}/substring-with-concatenation-of-all-words/${S}`, solution_hint: '滑动窗口+词频哈希表' },
    { id: 76, title: 'Minimum Window Substring', title_cn: '最小覆盖子串', difficulty: 'Hard', category: '滑动窗口', tags: '字符串,滑动窗口,哈希表', description: '找s中包含t所有字符的最小子串', leetcode_url: `${U}/minimum-window-substring/${S}`, solution_hint: '滑动窗口+字符计数，满足条件时收缩左边界' },

    // ===== 矩阵 (5题) =====
    { id: 36, title: 'Valid Sudoku', title_cn: '有效的数独', difficulty: 'Medium', category: '矩阵', tags: '数组,哈希表,矩阵', description: '判断9x9数独是否有效', leetcode_url: `${U}/valid-sudoku/${S}`, solution_hint: '三个哈希集合分别检查行列宫格' },
    { id: 54, title: 'Spiral Matrix', title_cn: '螺旋矩阵', difficulty: 'Medium', category: '矩阵', tags: '数组,矩阵,模拟', description: '按螺旋顺序返回矩阵元素', leetcode_url: `${U}/spiral-matrix/${S}`, solution_hint: '设定四个边界，依次遍历收缩' },
    { id: 48, title: 'Rotate Image', title_cn: '旋转图像', difficulty: 'Medium', category: '矩阵', tags: '数组,数学,矩阵', description: '将矩阵顺时针旋转90度', leetcode_url: `${U}/rotate-image/${S}`, solution_hint: '先转置再水平翻转' },
    { id: 73, title: 'Set Matrix Zeroes', title_cn: '矩阵置零', difficulty: 'Medium', category: '矩阵', tags: '数组,哈希表,矩阵', description: '元素为0则将其行列全置0', leetcode_url: `${U}/set-matrix-zeroes/${S}`, solution_hint: '用第一行第一列记录标记' },
    { id: 289, title: 'Game of Life', title_cn: '生命游戏', difficulty: 'Medium', category: '矩阵', tags: '数组,矩阵,模拟', description: '根据规则计算细胞下一状态', leetcode_url: `${U}/game-of-life/${S}`, solution_hint: '用位标记同时记录新旧状态' },

    // ===== 哈希表 (9题) =====
    { id: 383, title: 'Ransom Note', title_cn: '赎金信', difficulty: 'Easy', category: '哈希表', tags: '字符串,哈希表,计数', description: '判断ransomNote能否由magazine组成', leetcode_url: `${U}/ransom-note/${S}`, solution_hint: '字符计数比较' },
    { id: 205, title: 'Isomorphic Strings', title_cn: '同构字符串', difficulty: 'Easy', category: '哈希表', tags: '字符串,哈希表', description: '判断两个字符串是否同构', leetcode_url: `${U}/isomorphic-strings/${S}`, solution_hint: '双向映射检查一一对应' },
    { id: 290, title: 'Word Pattern', title_cn: '单词规律', difficulty: 'Easy', category: '哈希表', tags: '字符串,哈希表', description: '判断字符串是否遵循给定模式', leetcode_url: `${U}/word-pattern/${S}`, solution_hint: '双向哈希映射' },
    { id: 242, title: 'Valid Anagram', title_cn: '有效的字母异位词', difficulty: 'Easy', category: '哈希表', tags: '字符串,哈希表,排序', description: '判断两个字符串是否为字母异位词', leetcode_url: `${U}/valid-anagram/${S}`, solution_hint: '字符计数法' },
    { id: 49, title: 'Group Anagrams', title_cn: '字母异位词分组', difficulty: 'Medium', category: '哈希表', tags: '数组,哈希表,排序', description: '将字母异位词组合在一起', leetcode_url: `${U}/group-anagrams/${S}`, solution_hint: '排序后的字符串作为哈希表键' },
    { id: 1, title: 'Two Sum', title_cn: '两数之和', difficulty: 'Easy', category: '哈希表', tags: '数组,哈希表', description: '找出和为目标值的两个数下标', leetcode_url: `${U}/two-sum/${S}`, solution_hint: '哈希表记录遍历过的数字及下标' },
    { id: 202, title: 'Happy Number', title_cn: '快乐数', difficulty: 'Easy', category: '哈希表', tags: '哈希表,数学,双指针', description: '判断一个数是否为快乐数', leetcode_url: `${U}/happy-number/${S}`, solution_hint: '快慢指针检测循环或HashSet' },
    { id: 219, title: 'Contains Duplicate II', title_cn: '存在重复元素 II', difficulty: 'Easy', category: '哈希表', tags: '数组,哈希表,滑动窗口', description: '判断是否存在相邻重复元素且下标差<=k', leetcode_url: `${U}/contains-duplicate-ii/${S}`, solution_hint: '滑动窗口+HashSet维护k大小窗口' },
    { id: 128, title: 'Longest Consecutive Sequence', title_cn: '最长连续序列', difficulty: 'Medium', category: '哈希表', tags: '数组,哈希表', description: '找最长连续元素序列的长度', leetcode_url: `${U}/longest-consecutive-sequence/${S}`, solution_hint: 'HashSet存所有数，从序列起点开始扩展' },

    // ===== 区间 (4题) =====
    { id: 228, title: 'Summary Ranges', title_cn: '汇总区间', difficulty: 'Easy', category: '区间', tags: '数组', description: '将有序无重复数组汇总为区间列表', leetcode_url: `${U}/summary-ranges/${S}`, solution_hint: '遍历找连续区间起止点' },
    { id: 56, title: 'Merge Intervals', title_cn: '合并区间', difficulty: 'Medium', category: '区间', tags: '数组,排序', description: '合并所有重叠区间', leetcode_url: `${U}/merge-intervals/${S}`, solution_hint: '按左端点排序，逐个合并' },
    { id: 57, title: 'Insert Interval', title_cn: '插入区间', difficulty: 'Medium', category: '区间', tags: '数组', description: '插入新区间并合并重叠', leetcode_url: `${U}/insert-interval/${S}`, solution_hint: '分三段处理：不重叠左、合并重叠、不重叠右' },
    { id: 452, title: 'Minimum Number of Arrows to Burst Balloons', title_cn: '用最少数量的箭引爆气球', difficulty: 'Medium', category: '区间', tags: '数组,贪心,排序', description: '找引爆所有气球的最少箭数', leetcode_url: `${U}/minimum-number-of-arrows-to-burst-balloons/${S}`, solution_hint: '按右端点排序，贪心射箭' },

    // ===== 栈 (5题) =====
    { id: 20, title: 'Valid Parentheses', title_cn: '有效的括号', difficulty: 'Easy', category: '栈', tags: '字符串,栈', description: '判断括号字符串是否有效', leetcode_url: `${U}/valid-parentheses/${S}`, solution_hint: '栈匹配，遇到左括号入栈，右括号弹栈比对' },
    { id: 71, title: 'Simplify Path', title_cn: '简化路径', difficulty: 'Medium', category: '栈', tags: '字符串,栈', description: '简化Unix风格绝对路径', leetcode_url: `${U}/simplify-path/${S}`, solution_hint: '用栈处理..和.，最后拼接' },
    { id: 155, title: 'Min Stack', title_cn: '最小栈', difficulty: 'Medium', category: '栈', tags: '栈,设计', description: '设计支持getMin的栈', leetcode_url: `${U}/min-stack/${S}`, solution_hint: '辅助栈同步记录最小值' },
    { id: 150, title: 'Evaluate Reverse Polish Notation', title_cn: '逆波兰表达式求值', difficulty: 'Medium', category: '栈', tags: '数组,数学,栈', description: '计算逆波兰表达式的值', leetcode_url: `${U}/evaluate-reverse-polish-notation/${S}`, solution_hint: '栈：遇到数字入栈，运算符弹出两个数计算' },
    { id: 224, title: 'Basic Calculator', title_cn: '基本计算器', difficulty: 'Hard', category: '栈', tags: '数学,字符串,栈', description: '实现支持+-()的基本计算器', leetcode_url: `${U}/basic-calculator/${S}`, solution_hint: '栈处理括号，记录符号' },

    // ===== 链表 (11题) =====
    { id: 141, title: 'Linked List Cycle', title_cn: '环形链表', difficulty: 'Easy', category: '链表', tags: '链表,双指针', description: '判断链表是否有环', leetcode_url: `${U}/linked-list-cycle/${S}`, solution_hint: '快慢指针，快指针每次走两步' },
    { id: 2, title: 'Add Two Numbers', title_cn: '两数相加', difficulty: 'Medium', category: '链表', tags: '链表,数学', description: '两逆序链表表示的数相加', leetcode_url: `${U}/add-two-numbers/${S}`, solution_hint: '逐位相加处理进位' },
    { id: 21, title: 'Merge Two Sorted Lists', title_cn: '合并两个有序链表', difficulty: 'Easy', category: '链表', tags: '链表,递归', description: '合并两个升序链表', leetcode_url: `${U}/merge-two-sorted-lists/${S}`, solution_hint: '虚拟头节点+双指针' },
    { id: 138, title: 'Copy List with Random Pointer', title_cn: '随机链表的复制', difficulty: 'Medium', category: '链表', tags: '链表,哈希表', description: '深拷贝含随机指针的链表', leetcode_url: `${U}/copy-list-with-random-pointer/${S}`, solution_hint: '哈希表映射或原地拼接拆分法' },
    { id: 92, title: 'Reverse Linked List II', title_cn: '反转链表 II', difficulty: 'Medium', category: '链表', tags: '链表', description: '反转链表从left到right位置', leetcode_url: `${U}/reverse-linked-list-ii/${S}`, solution_hint: '找到left前驱，反转区间后重新连接' },
    { id: 25, title: 'Reverse Nodes in k-Group', title_cn: 'K个一组翻转链表', difficulty: 'Hard', category: '链表', tags: '链表,递归', description: '每k个节点一组翻转链表', leetcode_url: `${U}/reverse-nodes-in-k-group/${S}`, solution_hint: '先判断够k个再翻转，递归连接' },
    { id: 19, title: 'Remove Nth Node From End of List', title_cn: '删除链表的倒数第N个结点', difficulty: 'Medium', category: '链表', tags: '链表,双指针', description: '删除链表倒数第n个节点', leetcode_url: `${U}/remove-nth-node-from-end-of-list/${S}`, solution_hint: '快慢指针，快指针先走n步' },
    { id: 82, title: 'Remove Duplicates from Sorted List II', title_cn: '删除排序链表中的重复元素 II', difficulty: 'Medium', category: '链表', tags: '链表,双指针', description: '删除链表中所有重复节点', leetcode_url: `${U}/remove-duplicates-from-sorted-list-ii/${S}`, solution_hint: '虚拟头节点，检测重复段整体跳过' },
    { id: 61, title: 'Rotate List', title_cn: '旋转链表', difficulty: 'Medium', category: '链表', tags: '链表,双指针', description: '将链表向右旋转k个位置', leetcode_url: `${U}/rotate-list/${S}`, solution_hint: '先成环再在正确位置断开' },
    { id: 86, title: 'Partition List', title_cn: '分隔链表', difficulty: 'Medium', category: '链表', tags: '链表,双指针', description: '小于x的节点排在大于等于x之前', leetcode_url: `${U}/partition-list/${S}`, solution_hint: '两个链表分别收集，最后拼接' },
    { id: 146, title: 'LRU Cache', title_cn: 'LRU缓存', difficulty: 'Medium', category: '链表', tags: '哈希表,链表,设计', description: '设计LRU缓存机制', leetcode_url: `${U}/lru-cache/${S}`, solution_hint: 'HashMap+双向链表，最近访问移到头部' },

    // ===== 二叉树 (14题) =====
    { id: 104, title: 'Maximum Depth of Binary Tree', title_cn: '二叉树的最大深度', difficulty: 'Easy', category: '二叉树', tags: '树,DFS,BFS', description: '求二叉树最大深度', leetcode_url: `${U}/maximum-depth-of-binary-tree/${S}`, solution_hint: '递归：maxDepth = 1 + max(left, right)' },
    { id: 100, title: 'Same Tree', title_cn: '相同的树', difficulty: 'Easy', category: '二叉树', tags: '树,DFS,BFS', description: '判断两棵树是否相同', leetcode_url: `${U}/same-tree/${S}`, solution_hint: '递归比较节点值和子树' },
    { id: 226, title: 'Invert Binary Tree', title_cn: '翻转二叉树', difficulty: 'Easy', category: '二叉树', tags: '树,DFS,BFS,递归', description: '翻转二叉树（镜像）', leetcode_url: `${U}/invert-binary-tree/${S}`, solution_hint: '递归交换左右子树' },
    { id: 101, title: 'Symmetric Tree', title_cn: '对称二叉树', difficulty: 'Easy', category: '二叉树', tags: '树,DFS,BFS', description: '判断二叉树是否镜像对称', leetcode_url: `${U}/symmetric-tree/${S}`, solution_hint: '递归比较左子树左=右子树右' },
    { id: 105, title: 'Construct Binary Tree from Preorder and Inorder Traversal', title_cn: '从前序与中序遍历序列构造二叉树', difficulty: 'Medium', category: '二叉树', tags: '树,数组,哈希表', description: '根据前序和中序遍历构造二叉树', leetcode_url: `${U}/construct-binary-tree-from-preorder-and-inorder-traversal/${S}`, solution_hint: '前序首元素为根，在中序中定位划分左右子树' },
    { id: 106, title: 'Construct Binary Tree from Inorder and Postorder Traversal', title_cn: '从中序与后序遍历序列构造二叉树', difficulty: 'Medium', category: '二叉树', tags: '树,数组,哈希表', description: '根据中序和后序遍历构造二叉树', leetcode_url: `${U}/construct-binary-tree-from-inorder-and-postorder-traversal/${S}`, solution_hint: '后序末元素为根，在中序中定位划分' },
    { id: 117, title: 'Populating Next Right Pointers in Each Node II', title_cn: '填充每个节点的下一个右侧节点指针 II', difficulty: 'Medium', category: '二叉树', tags: '树,链表,BFS', description: '连接每层的next指针', leetcode_url: `${U}/populate-next-right-pointers-in-each-node-ii/${S}`, solution_hint: '层序遍历，利用已建立的next指针' },
    { id: 114, title: 'Flatten Binary Tree to Linked List', title_cn: '二叉树展开为链表', difficulty: 'Medium', category: '二叉树', tags: '树,链表,递归', description: '将二叉树展开为右斜链表', leetcode_url: `${U}/flatten-binary-tree-to-linked-list/${S}`, solution_hint: '前序遍历或原地：左子树最右节点接右子树' },
    { id: 112, title: 'Path Sum', title_cn: '路径总和', difficulty: 'Easy', category: '二叉树', tags: '树,DFS,BFS', description: '判断是否存在根到叶路径和等于target', leetcode_url: `${U}/path-sum/${S}`, solution_hint: '递归，每层减去当前节点值' },
    { id: 129, title: 'Sum Root to Leaf Numbers', title_cn: '求根节点到叶节点数字之和', difficulty: 'Medium', category: '二叉树', tags: '树,DFS', description: '根到叶路径组成数字，求所有数字之和', leetcode_url: `${U}/sum-root-to-leaf-numbers/${S}`, solution_hint: 'DFS传递当前累积值' },
    { id: 124, title: 'Binary Tree Maximum Path Sum', title_cn: '二叉树中的最大路径和', difficulty: 'Hard', category: '二叉树', tags: '树,DFS,动态规划', description: '找二叉树中任意路径的最大和', leetcode_url: `${U}/binary-tree-maximum-path-sum/${S}`, solution_hint: '后序遍历，记录单侧最大贡献值' },
    { id: 173, title: 'Binary Search Tree Iterator', title_cn: '二叉搜索树迭代器', difficulty: 'Medium', category: '二叉树', tags: '树,栈,设计', description: '实现BST的中序遍历迭代器', leetcode_url: `${U}/binary-search-tree-iterator/${S}`, solution_hint: '栈模拟中序遍历' },
    { id: 222, title: 'Count Complete Tree Nodes', title_cn: '完全二叉树的节点个数', difficulty: 'Easy', category: '二叉树', tags: '树,二分', description: '计算完全二叉树的节点数', leetcode_url: `${U}/count-complete-tree-nodes/${S}`, solution_hint: '利用完全二叉树性质，计算左右子树高度' },
    { id: 236, title: 'Lowest Common Ancestor of a Binary Tree', title_cn: '二叉树的最近公共祖先', difficulty: 'Medium', category: '二叉树', tags: '树,DFS', description: '找二叉树中两节点的最近公共祖先', leetcode_url: `${U}/lowest-common-ancestor-of-a-binary-tree/${S}`, solution_hint: '递归：若当前节点是p/q则返回，否则看左右子树' },

    // ===== 二叉树层次遍历 (4题) =====
    { id: 199, title: 'Binary Tree Right Side View', title_cn: '二叉树的右视图', difficulty: 'Medium', category: '二叉树层次遍历', tags: '树,DFS,BFS', description: '返回二叉树右视图看到的节点值', leetcode_url: `${U}/binary-tree-right-side-view/${S}`, solution_hint: 'BFS取每层最后一个' },
    { id: 637, title: 'Average of Levels in Binary Tree', title_cn: '二叉树的层平均值', difficulty: 'Easy', category: '二叉树层次遍历', tags: '树,BFS', description: '返回每层节点的平均值', leetcode_url: `${U}/average-of-levels-in-binary-tree/${S}`, solution_hint: 'BFS层序遍历求和取平均' },
    { id: 102, title: 'Binary Tree Level Order Traversal', title_cn: '二叉树的层序遍历', difficulty: 'Medium', category: '二叉树层次遍历', tags: '树,BFS', description: '按层返回节点值', leetcode_url: `${U}/binary-tree-level-order-traversal/${S}`, solution_hint: 'BFS队列，每层收集结果' },
    { id: 103, title: 'Binary Tree Zigzag Level Order Traversal', title_cn: '二叉树的锯齿形层序遍历', difficulty: 'Medium', category: '二叉树层次遍历', tags: '树,BFS', description: 'Z字形层序遍历', leetcode_url: `${U}/binary-tree-zigzag-level-order-traversal/${S}`, solution_hint: 'BFS，奇数层反转结果' },

    // ===== 二叉搜索树 (3题) =====
    { id: 530, title: 'Minimum Absolute Difference in BST', title_cn: '二叉搜索树的最小绝对差', difficulty: 'Easy', category: '二叉搜索树', tags: '树,DFS,BFS', description: 'BST中任意两节点值的最小差', leetcode_url: `${U}/minimum-absolute-difference-in-bst/${S}`, solution_hint: '中序遍历有序，比较相邻差值' },
    { id: 230, title: 'Kth Smallest Element in a BST', title_cn: '二叉搜索树中第K小的元素', difficulty: 'Medium', category: '二叉搜索树', tags: '树,DFS,BFS', description: '找BST中第k小的元素', leetcode_url: `${U}/kth-smallest-element-in-a-bst/${S}`, solution_hint: '中序遍历第k个节点' },
    { id: 98, title: 'Validate Binary Search Tree', title_cn: '验证二叉搜索树', difficulty: 'Medium', category: '二叉搜索树', tags: '树,DFS', description: '判断是否为有效的BST', leetcode_url: `${U}/validate-binary-search-tree/${S}`, solution_hint: '中序遍历检查递增或递归传递上下界' },

    // ===== 图 (6题) =====
    { id: 200, title: 'Number of Islands', title_cn: '岛屿数量', difficulty: 'Medium', category: '图', tags: '数组,DFS,BFS', description: '计算岛屿数量', leetcode_url: `${U}/number-of-islands/${S}`, solution_hint: 'DFS/BFS标记已访问的陆地' },
    { id: 130, title: 'Surrounded Regions', title_cn: '被围绕的区域', difficulty: 'Medium', category: '图', tags: '数组,DFS,BFS', description: '将被X围绕的O替换为X', leetcode_url: `${U}/surrounded-regions/${S}`, solution_hint: '从边界O开始DFS标记，未标记的O替换为X' },
    { id: 133, title: 'Clone Graph', title_cn: '克隆图', difficulty: 'Medium', category: '图', tags: '图,DFS,BFS', description: '深拷贝无向连通图', leetcode_url: `${U}/clone-graph/${S}`, solution_hint: 'DFS/BFS+HashMap记录已克隆节点' },
    { id: 399, title: 'Evaluate Division', title_cn: '除法求值', difficulty: 'Medium', category: '图', tags: '数组,图,DFS,BFS', description: '根据等式计算除法结果', leetcode_url: `${U}/evaluate-division/${S}`, solution_hint: '建图+DFS/BFS搜索路径乘积' },
    { id: 207, title: 'Course Schedule', title_cn: '课程表', difficulty: 'Medium', category: '图', tags: '图,拓扑排序', description: '判断能否完成所有课程（无环）', leetcode_url: `${U}/course-schedule/${S}`, solution_hint: '拓扑排序或DFS检测环' },
    { id: 210, title: 'Course Schedule II', title_cn: '课程表 II', difficulty: 'Medium', category: '图', tags: '图,拓扑排序', description: '返回课程学习顺序', leetcode_url: `${U}/course-schedule-ii/${S}`, solution_hint: '拓扑排序输出顺序' },

    // ===== 图的广度优先搜索 (3题) =====
    { id: 909, title: 'Snakes and Ladders', title_cn: '蛇梯棋', difficulty: 'Medium', category: '图的广度优先搜索', tags: '数组,BFS,矩阵', description: '求到达终点的最少步数', leetcode_url: `${U}/snakes-and-ladders/${S}`, solution_hint: 'BFS求最短路径' },
    { id: 433, title: 'Minimum Genetic Mutation', title_cn: '最小基因变化', difficulty: 'Medium', category: '图的广度优先搜索', tags: '字符串,BFS', description: '从startGene到endGene的最少变化次数', leetcode_url: `${U}/minimum-genetic-mutation/${S}`, solution_hint: 'BFS，每次变化一个字符' },
    { id: 127, title: 'Word Ladder', title_cn: '单词接龙', difficulty: 'Hard', category: '图的广度优先搜索', tags: '字符串,BFS', description: '找从beginWord到endWord的最短变换序列', leetcode_url: `${U}/word-ladder/${S}`, solution_hint: 'BFS逐字符变换，用HashSet去重' },

    // ===== 字典树 (3题) =====
    { id: 208, title: 'Implement Trie (Prefix Tree)', title_cn: '实现Trie(前缀树)', difficulty: 'Medium', category: '字典树', tags: '设计,字典树', description: '实现前缀树的插入搜索和前缀判断', leetcode_url: `${U}/implement-trie-prefix-tree/${S}`, solution_hint: 'TrieNode数组children[26]+isEnd标记' },
    { id: 211, title: 'Design Add and Search Words Data Structure', title_cn: '添加与搜索单词-数据结构设计', difficulty: 'Medium', category: '字典树', tags: '设计,字典树,DFS', description: '支持添加单词和带.通配符的搜索', leetcode_url: `${U}/design-add-and-search-words-data-structure/${S}`, solution_hint: 'Trie+DFS处理通配符' },
    { id: 212, title: 'Word Search II', title_cn: '单词搜索 II', difficulty: 'Hard', category: '字典树', tags: '字典树,DFS,回溯', description: '在二维网格中找所有单词', leetcode_url: `${U}/word-search-ii/${S}`, solution_hint: 'Trie+DFS回溯+剪枝' },

    // ===== 回溯 (7题) =====
    { id: 17, title: 'Letter Combinations of a Phone Number', title_cn: '电话号码的字母组合', difficulty: 'Medium', category: '回溯', tags: '字符串,回溯', description: '电话号码对应的字母组合', leetcode_url: `${U}/letter-combinations-of-a-phone-number/${S}`, solution_hint: '回溯枚举每个数字对应的字母' },
    { id: 77, title: 'Combinations', title_cn: '组合', difficulty: 'Medium', category: '回溯', tags: '回溯', description: '返回1到n中取k个的所有组合', leetcode_url: `${U}/combinations/${S}`, solution_hint: '回溯+剪枝' },
    { id: 46, title: 'Permutations', title_cn: '全排列', difficulty: 'Medium', category: '回溯', tags: '数组,回溯', description: '返回数组的所有全排列', leetcode_url: `${U}/permutations/${S}`, solution_hint: '回溯交换或used数组' },
    { id: 39, title: 'Combination Sum', title_cn: '组合总和', difficulty: 'Medium', category: '回溯', tags: '数组,回溯', description: '找和为target的所有组合', leetcode_url: `${U}/combination-sum/${S}`, solution_hint: '回溯+可重复选取' },
    { id: 52, title: 'N-Queens II', title_cn: 'N皇后 II', difficulty: 'Hard', category: '回溯', tags: '回溯', description: '计算N皇后的解法总数', leetcode_url: `${U}/n-queens-ii/${S}`, solution_hint: '回溯+位运算优化' },
    { id: 22, title: 'Generate Parentheses', title_cn: '括号生成', difficulty: 'Medium', category: '回溯', tags: '字符串,回溯', description: '生成n对括号的所有有效组合', leetcode_url: `${U}/generate-parentheses/${S}`, solution_hint: '回溯，维护左右括号计数' },
    { id: 79, title: 'Word Search', title_cn: '单词搜索', difficulty: 'Medium', category: '回溯', tags: '数组,回溯,DFS', description: '在二维网格中搜索单词', leetcode_url: `${U}/word-search/${S}`, solution_hint: 'DFS回溯+标记已访问' },

    // ===== 分治 (4题) =====
    { id: 108, title: 'Convert Sorted Array to Binary Search Tree', title_cn: '将有序数组转换为二叉搜索树', difficulty: 'Easy', category: '分治', tags: '树,二分', description: '将有序数组转为高度平衡BST', leetcode_url: `${U}/convert-sorted-array-to-binary-search-tree/${S}`, solution_hint: '取中间元素为根，递归构建左右子树' },
    { id: 148, title: 'Sort List', title_cn: '排序链表', difficulty: 'Medium', category: '分治', tags: '链表,分治,排序', description: '对链表进行升序排序', leetcode_url: `${U}/sort-list/${S}`, solution_hint: '归并排序：快慢指针找中点+合并' },
    { id: 427, title: 'Construct Quad Tree', title_cn: '建立四叉树', difficulty: 'Medium', category: '分治', tags: '树,分治,矩阵', description: '根据网格建立四叉树', leetcode_url: `${U}/construct-quad-tree/${S}`, solution_hint: '递归判断区域是否统一，否则四分' },
    { id: 23, title: 'Merge k Sorted Lists', title_cn: '合并K个升序链表', difficulty: 'Hard', category: '分治', tags: '链表,分治,堆', description: '合并k个升序链表', leetcode_url: `${U}/merge-k-sorted-lists/${S}`, solution_hint: '优先队列或分治归并' },

    // ===== Kadane 算法 (2题) =====
    { id: 53, title: 'Maximum Subarray', title_cn: '最大子数组和', difficulty: 'Medium', category: 'Kadane算法', tags: '数组,分治,动态规划', description: '找和最大的连续子数组', leetcode_url: `${U}/maximum-subarray/${S}`, solution_hint: 'Kadane算法：当前和<0则重置' },
    { id: 918, title: 'Maximum Sum Circular Subarray', title_cn: '环形子数组的最大和', difficulty: 'Medium', category: 'Kadane算法', tags: '数组,分治,动态规划', description: '环形数组的最大子数组和', leetcode_url: `${U}/maximum-sum-circular-subarray/${S}`, solution_hint: 'max(最大子数组和, 总和-最小子数组和)' },

    // ===== 二分查找 (7题) =====
    { id: 35, title: 'Search Insert Position', title_cn: '搜索插入位置', difficulty: 'Easy', category: '二分查找', tags: '数组,二分', description: '在有序数组中找target的插入位置', leetcode_url: `${U}/search-insert-position/${S}`, solution_hint: '标准二分查找' },
    { id: 240, title: 'Search a 2D Matrix II', title_cn: '搜索二维矩阵 II', difficulty: 'Medium', category: '二分查找', tags: '数组,二分,分治', description: '在行列均有序的矩阵中搜索目标值', leetcode_url: `${U}/search-a-2d-matrix-ii/${S}`, solution_hint: '从右上角开始，大了左移，小了下移' },
    { id: 162, title: 'Find Peak Element', title_cn: '寻找峰值', difficulty: 'Medium', category: '二分查找', tags: '数组,二分', description: '找任意一个峰值元素', leetcode_url: `${U}/find-peak-element/${S}`, solution_hint: '二分：mid<mid+1则峰值在右侧' },
    { id: 33, title: 'Search in Rotated Sorted Array', title_cn: '搜索旋转排序数组', difficulty: 'Medium', category: '二分查找', tags: '数组,二分', description: '在旋转排序数组中搜索目标值', leetcode_url: `${U}/search-in-rotated-sorted-array/${S}`, solution_hint: '二分判断哪半段有序' },
    { id: 34, title: 'Find First and Last Position of Element in Sorted Array', title_cn: '在排序数组中查找元素的第一个和最后一个位置', difficulty: 'Medium', category: '二分查找', tags: '数组,二分', description: '找target的起止位置', leetcode_url: `${U}/find-first-and-last-position-of-element-in-sorted-array/${S}`, solution_hint: '两次二分分别找左右边界' },
    { id: 153, title: 'Find Minimum in Rotated Sorted Array', title_cn: '寻找旋转排序数组中的最小值', difficulty: 'Medium', category: '二分查找', tags: '数组,二分', description: '找旋转排序数组中的最小值', leetcode_url: `${U}/find-minimum-in-rotated-sorted-array/${S}`, solution_hint: '二分：mid>right则最小值在右侧' },
    { id: 4, title: 'Median of Two Sorted Arrays', title_cn: '寻找两个正序数组的中位数', difficulty: 'Hard', category: '二分查找', tags: '数组,二分,分治', description: '找两个有序数组的中位数', leetcode_url: `${U}/median-of-two-sorted-arrays/${S}`, solution_hint: '二分较短数组的分割线' },

    // ===== 堆 (4题) =====
    { id: 215, title: 'Kth Largest Element in an Array', title_cn: '数组中的第K个最大元素', difficulty: 'Medium', category: '堆', tags: '数组,分治,堆,排序', description: '找第k大的元素', leetcode_url: `${U}/kth-largest-element-in-an-array/${S}`, solution_hint: '快速选择或最小堆' },
    { id: 313, title: 'Super Ugly Number', title_cn: '超级丑数', difficulty: 'Medium', category: '堆', tags: '数组,数学,堆', description: '找第n个超级丑数', leetcode_url: `${U}/super-ugly-number/${S}`, solution_hint: '堆维护每个质因数的下一个候选值' },
    { id: 373, title: 'Find K Pairs with Smallest Sums', title_cn: '查找和最小的K对数字', difficulty: 'Medium', category: '堆', tags: '数组,堆', description: '找和最小的k对(i,j)', leetcode_url: `${U}/find-k-pairs-with-smallest-sums/${S}`, solution_hint: '最小堆+懒扩展' },
    { id: 295, title: 'Find Median from Data Stream', title_cn: '数据流的中位数', difficulty: 'Hard', category: '堆', tags: '设计,双指针,堆', description: '设计数据结构支持添加和获取中位数', leetcode_url: `${U}/find-median-from-data-stream/${S}`, solution_hint: '大顶堆存小半+小顶堆存大半' },

    // ===== 位运算 (6题) =====
    { id: 67, title: 'Add Binary', title_cn: '二进制求和', difficulty: 'Easy', category: '位运算', tags: '字符串,位运算,模拟', description: '两个二进制字符串相加', leetcode_url: `${U}/add-binary/${S}`, solution_hint: '从末位逐位相加处理进位' },
    { id: 190, title: 'Reverse Bits', title_cn: '颠倒二进制位', difficulty: 'Easy', category: '位运算', tags: '位运算,分治', description: '颠倒32位无符号整数的二进制位', leetcode_url: `${U}/reverse-bits/${S}`, solution_hint: '逐位颠倒或分治' },
    { id: 191, title: 'Number of 1 Bits', title_cn: '位1的个数', difficulty: 'Easy', category: '位运算', tags: '位运算', description: '计算汉明重量（二进制中1的个数）', leetcode_url: `${U}/number-of-1-bits/${S}`, solution_hint: 'n&(n-1)消除最低位1' },
    { id: 136, title: 'Single Number', title_cn: '只出现一次的数字', difficulty: 'Easy', category: '位运算', tags: '数组,位运算', description: '找只出现一次的元素', leetcode_url: `${U}/single-number/${S}`, solution_hint: '全部异或' },
    { id: 137, title: 'Single Number II', title_cn: '只出现一次的数字 II', difficulty: 'Medium', category: '位运算', tags: '数组,位运算', description: '其他元素出现三次，找出现一次的', leetcode_url: `${U}/single-number-ii/${S}`, solution_hint: '统计每位1的个数mod3' },
    { id: 201, title: 'Bitwise AND of Numbers Range', title_cn: '数字范围按位与', difficulty: 'Medium', category: '位运算', tags: '位运算', description: '求[left,right]范围内所有数的按位与', leetcode_url: `${U}/bitwise-and-of-numbers-range/${S}`, solution_hint: '找公共前缀，Brian Kernighan算法' },

    // ===== 数学 (6题) =====
    { id: 9, title: 'Palindrome Number', title_cn: '回文数', difficulty: 'Easy', category: '数学', tags: '数学', description: '判断整数是否为回文数', leetcode_url: `${U}/palindrome-number/${S}`, solution_hint: '反转后半部分数字比较' },
    { id: 66, title: 'Plus One', title_cn: '加一', difficulty: 'Easy', category: '数学', tags: '数组,数学', description: '数组表示的整数加一', leetcode_url: `${U}/plus-one/${S}`, solution_hint: '从末位加1处理进位' },
    { id: 172, title: 'Factorial Trailing Zeroes', title_cn: '阶乘后的零', difficulty: 'Medium', category: '数学', tags: '数学', description: '计算n!中末尾零的个数', leetcode_url: `${U}/factorial-trailing-zeroes/${S}`, solution_hint: '计算因子5的个数' },
    { id: 69, title: 'Sqrt(x)', title_cn: 'x的平方根', difficulty: 'Easy', category: '数学', tags: '数学,二分', description: '计算x的平方根（取整）', leetcode_url: `${U}/sqrtx/${S}`, solution_hint: '二分查找或牛顿迭代' },
    { id: 50, title: 'Pow(x, n)', title_cn: 'Pow(x,n)', difficulty: 'Medium', category: '数学', tags: '数学,递归', description: '实现pow(x,n)', leetcode_url: `${U}/powx-n/${S}`, solution_hint: '快速幂：n为偶数则x^n=(x^2)^(n/2)' },
    { id: 149, title: 'Max Points on a Line', title_cn: '直线上最多的点数', difficulty: 'Hard', category: '数学', tags: '数组,哈希表,数学', description: '找同一直线上最多的点数', leetcode_url: `${U}/max-points-on-a-line/${S}`, solution_hint: '枚举每对点计算斜率，用HashMap统计' },

    // ===== 一维动态规划 (5题) =====
    { id: 70, title: 'Climbing Stairs', title_cn: '爬楼梯', difficulty: 'Easy', category: '一维动态规划', tags: '记忆化,动态规划', description: '每次爬1或2阶，求到顶的方法数', leetcode_url: `${U}/climbing-stairs/${S}`, solution_hint: 'dp[i] = dp[i-1] + dp[i-2]' },
    { id: 198, title: 'House Robber', title_cn: '打家劫舍', difficulty: 'Medium', category: '一维动态规划', tags: '数组,动态规划', description: '不相邻房屋的最大盗窃金额', leetcode_url: `${U}/house-robber/${S}`, solution_hint: 'dp[i] = max(dp[i-1], dp[i-2]+nums[i])' },
    { id: 139, title: 'Word Break', title_cn: '单词拆分', difficulty: 'Medium', category: '一维动态规划', tags: '字符串,动态规划', description: '判断字符串能否被拆分为字典中的单词', leetcode_url: `${U}/word-break/${S}`, solution_hint: 'dp[i]表示前i个字符能否拆分' },
    { id: 322, title: 'Coin Change', title_cn: '零钱兑换', difficulty: 'Medium', category: '一维动态规划', tags: '数组,动态规划', description: '凑成总金额所需的最少硬币数', leetcode_url: `${U}/coin-change/${S}`, solution_hint: 'dp[i] = min(dp[i-coin]+1)' },
    { id: 300, title: 'Longest Increasing Subsequence', title_cn: '最长递增子序列', difficulty: 'Medium', category: '一维动态规划', tags: '数组,动态规划,二分', description: '找最长严格递增子序列长度', leetcode_url: `${U}/longest-increasing-subsequence/${S}`, solution_hint: 'dp[i]表示以i结尾的LIS长度，或贪心+二分' },

    // ===== 多维动态规划 (9题) =====
    { id: 120, title: 'Triangle', title_cn: '三角形最小路径和', difficulty: 'Medium', category: '多维动态规划', tags: '数组,动态规划', description: '找从顶到底的最小路径和', leetcode_url: `${U}/triangle/${S}`, solution_hint: '自底向上dp[j] = min(dp[j],dp[j+1])+triangle[i][j]' },
    { id: 64, title: 'Minimum Path Sum', title_cn: '最小路径和', difficulty: 'Medium', category: '多维动态规划', tags: '数组,动态规划,矩阵', description: '找左上到右下的最小路径和', leetcode_url: `${U}/minimum-path-sum/${S}`, solution_hint: 'dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])' },
    { id: 63, title: 'Unique Paths II', title_cn: '不同路径 II', difficulty: 'Medium', category: '多维动态规划', tags: '数组,动态规划,矩阵', description: '有障碍物的不同路径数', leetcode_url: `${U}/unique-paths-ii/${S}`, solution_hint: 'dp[i][j] = dp[i-1][j] + dp[i][j-1]，障碍物处为0' },
    { id: 5, title: 'Longest Palindromic Substring', title_cn: '最长回文子串', difficulty: 'Medium', category: '多维动态规划', tags: '字符串,动态规划', description: '找最长回文子串', leetcode_url: `${U}/longest-palindromic-substring/${S}`, solution_hint: '中心扩展法或Manacher算法' },
    { id: 97, title: 'Interleaving String', title_cn: '交错字符串', difficulty: 'Medium', category: '多维动态规划', tags: '字符串,动态规划', description: '判断s3是否由s1和s2交错组成', leetcode_url: `${U}/interleaving-string/${S}`, solution_hint: 'dp[i][j]表示s1前i个和s2前j个能否组成s3前i+j个' },
    { id: 72, title: 'Edit Distance', title_cn: '编辑距离', difficulty: 'Medium', category: '多维动态规划', tags: '字符串,动态规划', description: 'word1转换为word2的最少操作数', leetcode_url: `${U}/edit-distance/${S}`, solution_hint: 'dp[i][j] = min(替换,插入,删除)+1' },
    { id: 123, title: 'Best Time to Buy and Sell Stock III', title_cn: '买卖股票的最佳时机 III', difficulty: 'Hard', category: '多维动态规划', tags: '数组,动态规划', description: '最多两笔交易的最大利润', leetcode_url: `${U}/best-time-to-buy-and-sell-stock-iii/${S}`, solution_hint: '维护四个状态：第一次买/卖、第二次买/卖' },
    { id: 188, title: 'Best Time to Buy and Sell Stock IV', title_cn: '买卖股票的最佳时机 IV', difficulty: 'Hard', category: '多维动态规划', tags: '数组,动态规划', description: '最多k笔交易的最大利润', leetcode_url: `${U}/best-time-to-buy-and-sell-stock-iv/${S}`, solution_hint: 'dp[j][0/1]表示第j次交易持有/不持有的最大利润' },
    { id: 221, title: 'Maximal Square', title_cn: '最大正方形', difficulty: 'Medium', category: '多维动态规划', tags: '数组,动态规划,矩阵', description: '找全为1的最大正方形面积', leetcode_url: `${U}/maximal-square/${S}`, solution_hint: 'dp[i][j] = min(上,左,左上)+1' },
  ];

  const insertMany = db.transaction((items: typeof problems) => {
    for (const item of items) {
      insert.run({ ...item, heat_rating: hr(item.id) });
    }
  });

  insertMany(problems);
  console.log(`[Seed] LeetCode 150: 已插入 ${problems.length} 道题目`);
}
