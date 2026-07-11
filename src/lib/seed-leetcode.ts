/**
 * 种子数据 - LeetCode 150 热题
 */
import { getDb, isSeeded } from './db';

export function seedLeetCode() {
  const db = getDb();
  const count = (db.prepare('SELECT COUNT(*) as c FROM leetcode_problems').get() as { c: number }).c;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT OR IGNORE INTO leetcode_problems (id, title, title_cn, difficulty, category, tags, description, leetcode_url, solution_hint)
    VALUES (@id, @title, @title_cn, @difficulty, @category, @tags, @description, @leetcode_url, @solution_hint)
  `);

  const U = 'https://leetcode.com/problems';
  const problems = [
    // ===== 数组 (25题) =====
    { id: 1, title: 'Two Sum', title_cn: '两数之和', difficulty: 'Easy', category: '数组', tags: '哈希表', description: '给定整数数组和目标值，找出和为目标值的两个数下标', leetcode_url: `${U}/two-sum/`, solution_hint: '哈希表记录遍历过的数字及下标，查找target-num' },
    { id: 26, title: 'Remove Duplicates from Sorted Array', title_cn: '删除有序数组重复项', difficulty: 'Easy', category: '数组', tags: '双指针', description: '原地删除有序数组中的重复元素', leetcode_url: `${U}/remove-duplicates-from-sorted-array/`, solution_hint: '快慢指针，快指针遍历，慢指针记录不重复元素' },
    { id: 27, title: 'Remove Element', title_cn: '移除元素', difficulty: 'Easy', category: '数组', tags: '双指针', description: '移除数组中所有等于val的元素', leetcode_url: `${U}/remove-element/`, solution_hint: '双指针覆盖法' },
    { id: 36, title: 'Valid Sudoku', title_cn: '有效的数独', difficulty: 'Medium', category: '数组', tags: '哈希表,矩阵', description: '判断9x9数独是否有效', leetcode_url: `${U}/valid-sudoku/`, solution_hint: '三个哈希集合分别检查行列宫格' },
    { id: 49, title: 'Group Anagrams', title_cn: '字母异位词分组', difficulty: 'Medium', category: '数组', tags: '哈希表,排序', description: '将字母异位词组合在一起', leetcode_url: `${U}/group-anagrams/`, solution_hint: '排序后的字符串作为哈希表键' },
    { id: 121, title: 'Best Time to Buy and Sell Stock', title_cn: '买卖股票最佳时机', difficulty: 'Easy', category: '数组', tags: '动态规划', description: '一次交易的最大利润', leetcode_url: `${U}/best-time-to-buy-and-sell-stock/`, solution_hint: '记录历史最低价，计算当前卖出利润' },
    { id: 169, title: 'Majority Element', title_cn: '多数元素', difficulty: 'Easy', category: '数组', tags: '分治,投票', description: '找出出现次数>n/2的元素', leetcode_url: `${U}/majority-element/`, solution_hint: 'Boyer-Moore投票算法' },
    { id: 189, title: 'Rotate Array', title_cn: '轮转数组', difficulty: 'Medium', category: '数组', tags: '数学,双指针', description: '将数组向右轮转k步', leetcode_url: `${U}/rotate-array/`, solution_hint: '三次反转法' },
    { id: 217, title: 'Contains Duplicate', title_cn: '存在重复元素', difficulty: 'Easy', category: '数组', tags: '哈希表', description: '判断数组是否有重复元素', leetcode_url: `${U}/contains-duplicate/`, solution_hint: 'HashSet或排序后比较相邻' },
    { id: 238, title: 'Product of Array Except Self', title_cn: '除自身以外数组的乘积', difficulty: 'Medium', category: '数组', tags: '前缀和', description: '每个元素为其余元素之积，不能用除法', leetcode_url: `${U}/product-of-array-except-self/`, solution_hint: '左右前缀积相乘' },
    { id: 242, title: 'Valid Anagram', title_cn: '有效的字母异位词', difficulty: 'Easy', category: '数组', tags: '哈希表,排序', description: '判断两个字符串是否为字母异位词', leetcode_url: `${U}/valid-anagram/`, solution_hint: '字符计数法' },
    { id: 274, title: 'H-Index', title_cn: 'H指数', difficulty: 'Medium', category: '数组', tags: '排序,计数', description: '计算研究者的H指数', leetcode_url: `${U}/h-index/`, solution_hint: '排序后从后往前找满足条件的最大h' },
    { id: 42, title: 'Trapping Rain Water', title_cn: '接雨水', difficulty: 'Hard', category: '数组', tags: '双指针,单调栈', description: '柱状图能接多少雨水', leetcode_url: `${U}/trapping-rain-water/`, solution_hint: '双指针法或单调栈' },
    { id: 55, title: 'Jump Game', title_cn: '跳跃游戏', difficulty: 'Medium', category: '数组', tags: '贪心', description: '能否到达最后一个下标', leetcode_url: `${U}/jump-game/`, solution_hint: '贪心维护最远可达位置' },
    { id: 45, title: 'Jump Game II', title_cn: '跳跃游戏II', difficulty: 'Medium', category: '数组', tags: '贪心,BFS', description: '到达最后位置的最少跳跃次数', leetcode_url: `${U}/jump-game-ii/`, solution_hint: '贪心BFS维护当前范围和下一跳最远' },
    { id: 134, title: 'Gas Station', title_cn: '加油站', difficulty: 'Medium', category: '数组', tags: '贪心', description: '能否绕环路行驶一周', leetcode_url: `${U}/gas-station/`, solution_hint: '总油量>=总消耗则有解，从亏油最多站的后一站出发' },
    { id: 135, title: 'Candy', title_cn: '分发糖果', difficulty: 'Hard', category: '数组', tags: '贪心', description: '相邻评分高的孩子得更多糖果', leetcode_url: `${U}/candy/`, solution_hint: '左右两次遍历取最大值' },
    // ===== 字符串/滑动窗口 (12题) =====
    { id: 3, title: 'Longest Substring Without Repeating', title_cn: '无重复字符最长子串', difficulty: 'Medium', category: '滑动窗口', tags: '哈希表,滑动窗口', description: '不含重复字符的最长子串长度', leetcode_url: `${U}/longest-substring-without-repeating-characters/`, solution_hint: '滑动窗口+HashSet' },
    { id: 5, title: 'Longest Palindromic Substring', title_cn: '最长回文子串', difficulty: 'Medium', category: '字符串', tags: '动态规划,中心扩展', description: '找到最长回文子串', leetcode_url: `${U}/longest-palindromic-substring/`, solution_hint: '中心扩展法' },
    { id: 6, title: 'Zigzag Conversion', title_cn: 'Z字形变换', difficulty: 'Medium', category: '字符串', tags: '模拟', description: '按Z字形排列后按行读取', leetcode_url: `${U}/zigzag-conversion/`, solution_hint: '模拟按行收集字符' },
    { id: 14, title: 'Longest Common Prefix', title_cn: '最长公共前缀', difficulty: 'Easy', category: '字符串', tags: '数组', description: '找出字符串数组的最长公共前缀', leetcode_url: `${U}/longest-common-prefix/`, solution_hint: '逐字符比较' },
    { id: 438, title: 'Find All Anagrams in a String', title_cn: '找到字符串中所有字母异位词', difficulty: 'Medium', category: '滑动窗口', tags: '哈希表,滑动窗口', description: '找到所有异位词起始索引', leetcode_url: `${U}/find-all-anagrams-in-a-string/`, solution_hint: '固定窗口+字符计数' },
    { id: 76, title: 'Minimum Window Substring', title_cn: '最小覆盖子串', difficulty: 'Hard', category: '滑动窗口', tags: '哈希表,滑动窗口', description: '包含目标串所有字符的最小子串', leetcode_url: `${U}/minimum-window-substring/`, solution_hint: '滑动窗口+哈希表计数' },
    { id: 125, title: 'Valid Palindrome', title_cn: '验证回文串', difficulty: 'Easy', category: '字符串', tags: '双指针', description: '忽略非字母数字判断回文', leetcode_url: `${U}/valid-palindrome/`, solution_hint: '双指针从两端向中间' },
    { id: 151, title: 'Reverse Words in a String', title_cn: '反转字符串中单词', difficulty: 'Medium', category: '字符串', tags: '双指针', description: '反转单词顺序', leetcode_url: `${U}/reverse-words-in-a-string/`, solution_hint: '先整体反转再逐词反转' },
    { id: 242, title: 'Valid Anagram', title_cn: '字母异位词', difficulty: 'Easy', category: '字符串', tags: '哈希表', description: '判断字母异位词', leetcode_url: `${U}/valid-anagram/`, solution_hint: '字符计数' },
    { id: 209, title: 'Minimum Size Subarray Sum', title_cn: '长度最小子数组', difficulty: 'Medium', category: '滑动窗口', tags: '滑动窗口,前缀和', description: '和>=target的最短连续子数组', leetcode_url: `${U}/minimum-size-subarray-sum/`, solution_hint: '滑动窗口右扩左缩' },
    { id: 239, title: 'Sliding Window Maximum', title_cn: '滑动窗口最大值', difficulty: 'Hard', category: '滑动窗口', tags: '单调队列', description: '每个滑动窗口的最大值', leetcode_url: `${U}/sliding-window-maximum/`, solution_hint: '单调递减双端队列' },
    // ===== 双指针 (5题) =====
    { id: 167, title: 'Two Sum II', title_cn: '两数之和II', difficulty: 'Medium', category: '双指针', tags: '数组,二分', description: '有序数组中找两数之和', leetcode_url: `${U}/two-sum-ii-input-array-is-sorted/`, solution_hint: '左右双指针相向移动' },
    { id: 15, title: '3Sum', title_cn: '三数之和', difficulty: 'Medium', category: '双指针', tags: '排序,去重', description: '找出所有和为0的三元组', leetcode_url: `${U}/3sum/`, solution_hint: '排序+固定一数+双指针' },
    { id: 11, title: 'Container With Most Water', title_cn: '盛最多水容器', difficulty: 'Medium', category: '双指针', tags: '贪心', description: '两条线使容器盛水最多', leetcode_url: `${U}/container-with-most-water/`, solution_hint: '每次移动较短的线' },
    { id: 334, title: 'Increasing Triplet Subsequence', title_cn: '递增三元子序列', difficulty: 'Medium', category: '双指针', tags: '贪心', description: '是否存在递增三元子序列', leetcode_url: `${U}/increasing-triplet-subsequence/`, solution_hint: '维护两个最小值' },
    // ===== 矩阵 (5题) =====
    { id: 54, title: 'Spiral Matrix', title_cn: '螺旋矩阵', difficulty: 'Medium', category: '矩阵', tags: '模拟', description: '按螺旋顺序遍历矩阵', leetcode_url: `${U}/spiral-matrix/`, solution_hint: '四边界收缩' },
    { id: 48, title: 'Rotate Image', title_cn: '旋转图像', difficulty: 'Medium', category: '矩阵', tags: '数学', description: '顺时针旋转90度', leetcode_url: `${U}/rotate-image/`, solution_hint: '先转置再水平翻转' },
    { id: 240, title: 'Search a 2D Matrix II', title_cn: '搜索二维矩阵II', difficulty: 'Medium', category: '矩阵', tags: '二分', description: '行列均有序的矩阵搜索', leetcode_url: `${U}/search-a-2d-matrix-ii/`, solution_hint: '右上角开始搜索' },
    { id: 73, title: 'Set Matrix Zeroes', title_cn: '矩阵置零', difficulty: 'Medium', category: '矩阵', tags: '哈希表', description: '包含0的行列全部置零', leetcode_url: `${U}/set-matrix-zeroes/`, solution_hint: '用第一行第一列做标记' },
    { id: 289, title: 'Game of Life', title_cn: '生命游戏', difficulty: 'Medium', category: '矩阵', tags: '模拟', description: '根据规则更新细胞状态', leetcode_url: `${U}/game-of-life/`, solution_hint: '用位运算同时存储当前和下一状态' },
    // ===== 链表 (14题) =====
    { id: 160, title: 'Intersection of Two Linked Lists', title_cn: '相交链表', difficulty: 'Easy', category: '链表', tags: '双指针', description: '找两链表相交节点', leetcode_url: `${U}/intersection-of-two-linked-lists/`, solution_hint: '双指针走完自己走对方' },
    { id: 206, title: 'Reverse Linked List', title_cn: '反转链表', difficulty: 'Easy', category: '链表', tags: '递归', description: '反转单链表', leetcode_url: `${U}/reverse-linked-list/`, solution_hint: 'prev/curr/nxt三指针' },
    { id: 234, title: 'Palindrome Linked List', title_cn: '回文链表', difficulty: 'Easy', category: '链表', tags: '双指针', description: '判断链表是否回文', leetcode_url: `${U}/palindrome-linked-list/`, solution_hint: '快慢指针找中点反转后半' },
    { id: 141, title: 'Linked List Cycle', title_cn: '环形链表', difficulty: 'Easy', category: '链表', tags: '快慢指针', description: '判断链表是否有环', leetcode_url: `${U}/linked-list-cycle/`, solution_hint: '快慢指针' },
    { id: 142, title: 'Linked List Cycle II', title_cn: '环形链表II', difficulty: 'Medium', category: '链表', tags: '快慢指针', description: '找环形链表入环节点', leetcode_url: `${U}/linked-list-cycle-ii/`, solution_hint: '相遇后一个从头走同速相遇即入环' },
    { id: 21, title: 'Merge Two Sorted Lists', title_cn: '合并两个有序链表', difficulty: 'Easy', category: '链表', tags: '递归', description: '合并两个有序链表', leetcode_url: `${U}/merge-two-sorted-lists/`, solution_hint: '虚拟头节点+双指针' },
    { id: 2, title: 'Add Two Numbers', title_cn: '两数相加', difficulty: 'Medium', category: '链表', tags: '数学', description: '逆序存储的两数相加', leetcode_url: `${U}/add-two-numbers/`, solution_hint: '逐位相加处理进位' },
    { id: 19, title: 'Remove Nth Node From End', title_cn: '删除倒数第N个节点', difficulty: 'Medium', category: '链表', tags: '双指针', description: '删除链表倒数第N个节点', leetcode_url: `${U}/remove-nth-node-from-end-of-list/`, solution_hint: '快指针先走N步' },
    { id: 24, title: 'Swap Nodes in Pairs', title_cn: '两两交换链表节点', difficulty: 'Medium', category: '链表', tags: '递归', description: '两两交换相邻节点', leetcode_url: `${U}/swap-nodes-in-pairs/`, solution_hint: '递归或迭代每次处理两个' },
    { id: 25, title: 'Reverse Nodes in k-Group', title_cn: 'K个一组翻转链表', difficulty: 'Hard', category: '链表', tags: '递归', description: '每k个节点一组翻转', leetcode_url: `${U}/reverse-nodes-in-k-group/`, solution_hint: '判断够k个则翻转递归后续' },
    { id: 138, title: 'Copy List with Random Pointer', title_cn: '复制带随机指针链表', difficulty: 'Medium', category: '链表', tags: '哈希表', description: '深拷贝带随机指针的链表', leetcode_url: `${U}/copy-list-with-random-pointer/`, solution_hint: '三步法插入复制设置随机拆分' },
    { id: 23, title: 'Merge k Sorted Lists', title_cn: '合并K个升序链表', difficulty: 'Hard', category: '链表', tags: '堆,分治', description: '合并K个升序链表', leetcode_url: `${U}/merge-k-sorted-lists/`, solution_hint: '最小堆或分治归并' },
    { id: 148, title: 'Sort List', title_cn: '排序链表', difficulty: 'Medium', category: '链表', tags: '归并排序', description: '链表升序排序', leetcode_url: `${U}/sort-list/`, solution_hint: '归并排序快慢指针找中点' },
    { id: 143, title: 'Reorder List', title_cn: '重排链表', difficulty: 'Medium', category: '链表', tags: '双指针', description: '按L0→Ln→L1→Ln-1重排', leetcode_url: `${U}/reorder-list/`, solution_hint: '找中点反转后半交替合并' },
    // ===== 二叉树 (18题) =====
    { id: 104, title: 'Maximum Depth of Binary Tree', title_cn: '二叉树最大深度', difficulty: 'Easy', category: '二叉树', tags: 'DFS,BFS', description: '求二叉树最大深度', leetcode_url: `${U}/maximum-depth-of-binary-tree/`, solution_hint: '递归1+max(left,right)' },
    { id: 100, title: 'Same Tree', title_cn: '相同的树', difficulty: 'Easy', category: '二叉树', tags: 'DFS', description: '判断两棵树是否相同', leetcode_url: `${U}/same-tree/`, solution_hint: '递归比较节点值和子树' },
    { id: 226, title: 'Invert Binary Tree', title_cn: '翻转二叉树', difficulty: 'Easy', category: '二叉树', tags: 'DFS', description: '翻转二叉树', leetcode_url: `${U}/invert-binary-tree/`, solution_hint: '递归交换左右子树' },
    { id: 101, title: 'Symmetric Tree', title_cn: '对称二叉树', difficulty: 'Easy', category: '二叉树', tags: 'DFS,BFS', description: '判断二叉树是否对称', leetcode_url: `${U}/symmetric-tree/`, solution_hint: '递归比较左左和右右' },
    { id: 105, title: 'Construct BT from Preorder and Inorder', title_cn: '前序中序构造二叉树', difficulty: 'Medium', category: '二叉树', tags: '分治', description: '前序+中序构造二叉树', leetcode_url: `${U}/construct-binary-tree-from-preorder-and-inorder-traversal/`, solution_hint: '前序首元素为根在中序定位递归' },
    { id: 106, title: 'Construct BT from Inorder and Postorder', title_cn: '中序后序构造二叉树', difficulty: 'Medium', category: '二叉树', tags: '分治', description: '中序+后序构造二叉树', leetcode_url: `${U}/construct-binary-tree-from-inorder-and-postorder-traversal/`, solution_hint: '后序末元素为根递归构建' },
    { id: 117, title: 'Populating Next Right Pointers II', title_cn: '填充右指针II', difficulty: 'Medium', category: '二叉树', tags: 'BFS', description: '连接每层节点next指针', leetcode_url: `${U}/populating-next-right-pointers-in-each-node-ii/`, solution_hint: '利用next指针逐层遍历' },
    { id: 114, title: 'Flatten BT to Linked List', title_cn: '二叉树展开为链表', difficulty: 'Medium', category: '二叉树', tags: '栈', description: '展开为右斜链表', leetcode_url: `${U}/flatten-binary-tree-to-linked-list/`, solution_hint: '前序遍历逆过程' },
    { id: 112, title: 'Path Sum', title_cn: '路径总和', difficulty: 'Easy', category: '二叉树', tags: 'DFS', description: '根到叶路径和等于目标值', leetcode_url: `${U}/path-sum/`, solution_hint: '递归每层减当前值' },
    { id: 129, title: 'Sum Root to Leaf Numbers', title_cn: '根到叶数字之和', difficulty: 'Medium', category: '二叉树', tags: 'DFS', description: '所有根到叶路径数字之和', leetcode_url: `${U}/sum-root-to-leaf-numbers/`, solution_hint: 'DFS传递累积值' },
    { id: 236, title: 'Lowest Common Ancestor of BT', title_cn: '最近公共祖先', difficulty: 'Medium', category: '二叉树', tags: 'DFS', description: '二叉树两节点最近公共祖先', leetcode_url: `${U}/lowest-common-ancestor-of-a-binary-tree/`, solution_hint: '递归左右子树查找p和q' },
    { id: 199, title: 'Binary Tree Right Side View', title_cn: '二叉树右视图', difficulty: 'Medium', category: '二叉树', tags: 'BFS', description: '返回右视图', leetcode_url: `${U}/binary-tree-right-side-view/`, solution_hint: 'BFS每层取最后一个' },
    { id: 144, title: 'Binary Tree Preorder Traversal', title_cn: '前序遍历', difficulty: 'Easy', category: '二叉树', tags: '栈', description: '前序遍历', leetcode_url: `${U}/binary-tree-preorder-traversal/`, solution_hint: '递归或栈迭代' },
    { id: 94, title: 'Binary Tree Inorder Traversal', title_cn: '中序遍历', difficulty: 'Easy', category: '二叉树', tags: '栈', description: '中序遍历', leetcode_url: `${U}/binary-tree-inorder-traversal/`, solution_hint: '递归或栈迭代' },
    { id: 145, title: 'Binary Tree Postorder Traversal', title_cn: '后序遍历', difficulty: 'Easy', category: '二叉树', tags: '栈', description: '后序遍历', leetcode_url: `${U}/binary-tree-postorder-traversal/`, solution_hint: '递归或双栈法' },
    { id: 222, title: 'Count Univalue Subtrees', title_cn: '路径总和III', difficulty: 'Medium', category: '二叉树', tags: 'DFS,前缀和', description: '路径和等于目标值的路径数', leetcode_url: `${U}/path-sum-iii/`, solution_hint: '前缀和+哈希表' },
    { id: 297, title: 'Serialize and Deserialize BT', title_cn: '序列化反序列化二叉树', difficulty: 'Hard', category: '二叉树', tags: 'BFS,设计', description: '序列化和反序列化', leetcode_url: `${U}/serialize-and-deserialize-binary-tree/`, solution_hint: 'BFS层序或DFS前序' },
    // ===== 图论 (8题) =====
    { id: 200, title: 'Number of Islands', title_cn: '岛屿数量', difficulty: 'Medium', category: '图论', tags: 'DFS,BFS,并查集', description: '计算岛屿数量', leetcode_url: `${U}/number-of-islands/`, solution_hint: 'DFS/BFS标记已访问陆地' },
    { id: 130, title: 'Surrounded Regions', title_cn: '被围绕的区域', difficulty: 'Medium', category: '图论', tags: 'DFS,BFS', description: '被围绕的O变为X', leetcode_url: `${U}/surrounded-regions/`, solution_hint: '从边界O反向DFS标记' },
    { id: 133, title: 'Clone Graph', title_cn: '克隆图', difficulty: 'Medium', category: '图论', tags: 'DFS,BFS,哈希表', description: '深拷贝无向连通图', leetcode_url: `${U}/clone-graph/`, solution_hint: 'DFS+哈希表记录已克隆节点' },
    { id: 399, title: 'Evaluate Division', title_cn: '除法求值', difficulty: 'Medium', category: '图论', tags: 'DFS,BFS,并查集', description: '根据等式计算除法', leetcode_url: `${U}/evaluate-division/`, solution_hint: '建图+DFS搜索路径' },
    { id: 207, title: 'Course Schedule', title_cn: '课程表', difficulty: 'Medium', category: '图论', tags: '拓扑排序,DFS', description: '能否完成所有课程', leetcode_url: `${U}/course-schedule/`, solution_hint: '拓扑排序检测环' },
    { id: 210, title: 'Course Schedule II', title_cn: '课程表II', difficulty: 'Medium', category: '图论', tags: '拓扑排序', description: '完成课程的顺序', leetcode_url: `${U}/course-schedule-ii/`, solution_hint: '拓扑排序输出顺序' },
    { id: 547, title: 'Number of Provinces', title_cn: '省份数量', difficulty: 'Medium', category: '图论', tags: 'DFS,并查集', description: '计算省份数量', leetcode_url: `${U}/number-of-provinces/`, solution_hint: 'DFS或并查集' },
    { id: 208, title: 'Implement Trie', title_cn: '实现前缀树', difficulty: 'Medium', category: '图论', tags: '设计,前缀树', description: '实现前缀树', leetcode_url: `${U}/implement-trie-prefix-tree/`, solution_hint: '每节点26子节点指针' },
    // ===== 回溯 (10题) =====
    { id: 78, title: 'Subsets', title_cn: '子集', difficulty: 'Medium', category: '回溯', tags: '位运算', description: '返回所有子集', leetcode_url: `${U}/subsets/`, solution_hint: '每个元素选或不选' },
    { id: 39, title: 'Combination Sum', title_cn: '组合总和', difficulty: 'Medium', category: '回溯', tags: '数组', description: '和为目标值的所有组合', leetcode_url: `${U}/combination-sum/`, solution_hint: '回溯+剪枝' },
    { id: 46, title: 'Permutations', title_cn: '全排列', difficulty: 'Medium', category: '回溯', tags: '数组', description: '所有全排列', leetcode_url: `${U}/permutations/`, solution_hint: '回溯维护已选集合' },
    { id: 22, title: 'Generate Parentheses', title_cn: '括号生成', difficulty: 'Medium', category: '回溯', tags: '动态规划', description: '所有有效括号组合', leetcode_url: `${U}/generate-parentheses/`, solution_hint: '回溯维护左右括号计数' },
    { id: 79, title: 'Word Search', title_cn: '单词搜索', difficulty: 'Medium', category: '回溯', tags: '矩阵', description: '矩阵中搜索单词', leetcode_url: `${U}/word-search/`, solution_hint: 'DFS回溯+标记已访问' },
    { id: 131, title: 'Palindrome Partitioning', title_cn: '分割回文串', difficulty: 'Medium', category: '回溯', tags: '动态规划', description: '分割成回文子串', leetcode_url: `${U}/palindrome-partitioning/`, solution_hint: '回溯每次切一个回文前缀' },
    { id: 51, title: 'N-Queens', title_cn: 'N皇后', difficulty: 'Hard', category: '回溯', tags: '数组', description: 'N皇后所有解法', leetcode_url: `${U}/n-queens/`, solution_hint: '逐行放置皇后回溯' },
    { id: 37, title: 'Sudoku Solver', title_cn: '解数独', difficulty: 'Hard', category: '回溯', tags: '矩阵', description: '解数独', leetcode_url: `${U}/sudoku-solver/`, solution_hint: '逐空格尝试1-9回溯' },
    { id: 40, title: 'Combination Sum II', title_cn: '组合总和II', difficulty: 'Medium', category: '回溯', tags: '排序', description: '不可重复使用的组合总和', leetcode_url: `${U}/combination-sum-ii/`, solution_hint: '排序+同层去重' },
    { id: 77, title: 'Combinations', title_cn: '组合', difficulty: 'Medium', category: '回溯', tags: '数组', description: '从1到n中选k个数的组合', leetcode_url: `${U}/combinations/`, solution_hint: '经典回溯+剪枝' },
    // ===== 二分查找 (7题) =====
    { id: 35, title: 'Search Insert Position', title_cn: '搜索插入位置', difficulty: 'Easy', category: '二分查找', tags: '数组', description: '目标值应插入位置', leetcode_url: `${U}/search-insert-position/`, solution_hint: '标准二分' },
    { id: 74, title: 'Search a 2D Matrix', title_cn: '搜索二维矩阵', difficulty: 'Medium', category: '二分查找', tags: '矩阵', description: '二维矩阵搜索', leetcode_url: `${U}/search-a-2d-matrix/`, solution_hint: '视为一维数组二分' },
    { id: 34, title: 'Find First and Last Position', title_cn: '查找元素首末位置', difficulty: 'Medium', category: '二分查找', tags: '数组', description: '目标值起止位置', leetcode_url: `${U}/find-first-and-last-position-of-element-in-sorted-array/`, solution_hint: '两次二分找左右边界' },
    { id: 33, title: 'Search in Rotated Sorted Array', title_cn: '搜索旋转排序数组', difficulty: 'Medium', category: '二分查找', tags: '数组', description: '旋转数组中搜索', leetcode_url: `${U}/search-in-rotated-sorted-array/`, solution_hint: '判断目标在哪半段再二分' },
    { id: 153, title: 'Find Minimum in Rotated Sorted Array', title_cn: '旋转数组最小值', difficulty: 'Medium', category: '二分查找', tags: '数组', description: '旋转数组最小值', leetcode_url: `${U}/find-minimum-in-rotated-sorted-array/`, solution_hint: '比较mid和right' },
    { id: 4, title: 'Median of Two Sorted Arrays', title_cn: '两正序数组中位数', difficulty: 'Hard', category: '二分查找', tags: '分治', description: '两个有序数组中位数', leetcode_url: `${U}/median-of-two-sorted-arrays/`, solution_hint: '二分较短数组分割点' },
    { id: 287, title: 'Find the Duplicate Number', title_cn: '寻找重复数', difficulty: 'Medium', category: '二分查找', tags: '快慢指针', description: '找数组中重复的数', leetcode_url: `${U}/find-the-duplicate-number/`, solution_hint: '快慢指针判环' },
    // ===== 栈 (7题) =====
    { id: 20, title: 'Valid Parentheses', title_cn: '有效括号', difficulty: 'Easy', category: '栈', tags: '字符串', description: '判断括号是否有效', leetcode_url: `${U}/valid-parentheses/`, solution_hint: '栈匹配括号' },
    { id: 71, title: 'Simplify Path', title_cn: '简化路径', difficulty: 'Medium', category: '栈', tags: '字符串', description: '简化Unix路径', leetcode_url: `${U}/simplify-path/`, solution_hint: '栈处理目录名' },
    { id: 155, title: 'Min Stack', title_cn: '最小栈', difficulty: 'Medium', category: '栈', tags: '设计', description: '支持获取最小值的栈', leetcode_url: `${U}/min-stack/`, solution_hint: '辅助栈记录最小值' },
    { id: 394, title: 'Decode String', title_cn: '字符串解码', difficulty: 'Medium', category: '栈', tags: '递归', description: '解码k[encoded]格式', leetcode_url: `${U}/decode-string/`, solution_hint: '双栈数字和字符串' },
    { id: 739, title: 'Daily Temperatures', title_cn: '每日温度', difficulty: 'Medium', category: '栈', tags: '单调栈', description: '等多少天更暖和', leetcode_url: `${U}/daily-temperatures/`, solution_hint: '单调递减栈' },
    { id: 853, title: 'Car Fleet', title_cn: '车队', difficulty: 'Medium', category: '栈', tags: '排序', description: '到达终点车队数', leetcode_url: `${U}/car-fleet/`, solution_hint: '按位置排序从后算到达时间' },
    { id: 84, title: 'Largest Rectangle in Histogram', title_cn: '柱状图最大矩形', difficulty: 'Hard', category: '栈', tags: '单调栈', description: '柱状图最大矩形面积', leetcode_url: `${U}/largest-rectangle-in-histogram/`, solution_hint: '单调栈找左右边界' },
    // ===== 堆 (4题) =====
    { id: 215, title: 'Kth Largest Element', title_cn: '第K大元素', difficulty: 'Medium', category: '堆', tags: '快速选择', description: '数组中第K大元素', leetcode_url: `${U}/kth-largest-element-in-an-array/`, solution_hint: '最小堆或快速选择' },
    { id: 347, title: 'Top K Frequent Elements', title_cn: '前K个高频元素', difficulty: 'Medium', category: '堆', tags: '桶排序', description: '频率最高的K个元素', leetcode_url: `${U}/top-k-frequent-elements/`, solution_hint: '哈希计数+最小堆' },
    { id: 973, title: 'K Closest Points to Origin', title_cn: '最接近原点K个点', difficulty: 'Medium', category: '堆', tags: '几何', description: '离原点最近的K个点', leetcode_url: `${U}/k-closest-points-to-origin/`, solution_hint: '最大堆维护K个最近点' },
    { id: 295, title: 'Find Median from Data Stream', title_cn: '数据流中位数', difficulty: 'Hard', category: '堆', tags: '设计', description: '随时获取中位数', leetcode_url: `${U}/find-median-from-data-stream/`, solution_hint: '大顶堆+小顶堆' },
    // ===== 哈希表 (5题) =====
    { id: 380, title: 'Insert Delete GetRandom O(1)', title_cn: 'O(1)插入删除随机', difficulty: 'Medium', category: '哈希表', tags: '设计,随机化', description: 'O(1)时间增删随机', leetcode_url: `${U}/insert-delete-getrandom-o1/`, solution_hint: '哈希表+数组交换删除' },
    { id: 128, title: 'Longest Consecutive Sequence', title_cn: '最长连续序列', difficulty: 'Medium', category: '哈希表', tags: '并查集', description: '最长连续元素序列长度', leetcode_url: `${U}/longest-consecutive-sequence/`, solution_hint: 'HashSet只从序列起点扩展' },
    { id: 349, title: 'Intersection of Two Arrays', title_cn: '两数组交集', difficulty: 'Easy', category: '哈希表', tags: '双指针', description: '两个数组的交集', leetcode_url: `${U}/intersection-of-two-arrays/`, solution_hint: 'HashSet' },
    { id: 170, title: 'Two Sum III', title_cn: '两数之和III', difficulty: 'Easy', category: '哈希表', tags: '设计', description: '设计TwoSum数据结构', leetcode_url: `${U}/two-sum-iii-data-structure-design/`, solution_hint: 'HashMap存元素及计数' },
    { id: 290, title: 'Word Pattern', title_cn: '单词规律', difficulty: 'Easy', category: '哈希表', tags: '字符串', description: '判断是否遵循pattern', leetcode_url: `${U}/word-pattern/`, solution_hint: '双HashMap双向映射' },
    // ===== 动态规划 (20题) =====
    { id: 70, title: 'Climbing Stairs', title_cn: '爬楼梯', difficulty: 'Easy', category: '动态规划', tags: '记忆化', description: '爬楼梯方法数', leetcode_url: `${U}/climbing-stairs/`, solution_hint: 'dp[i]=dp[i-1]+dp[i-2]' },
    { id: 198, title: 'House Robber', title_cn: '打家劫舍', difficulty: 'Medium', category: '动态规划', tags: '数组', description: '不偷相邻房屋最大金额', leetcode_url: `${U}/house-robber/`, solution_hint: 'dp[i]=max(dp[i-1],dp[i-2]+nums[i])' },
    { id: 213, title: 'House Robber II', title_cn: '打家劫舍II', difficulty: 'Medium', category: '动态规划', tags: '环形', description: '环形房屋打家劫舍', leetcode_url: `${U}/house-robber-ii/`, solution_hint: '分两种情况取max' },
    { id: 647, title: 'Palindromic Substrings', title_cn: '回文子串数', difficulty: 'Medium', category: '动态规划', tags: '中心扩展', description: '回文子串数量', leetcode_url: `${U}/palindromic-substrings/`, solution_hint: '中心扩展法' },
    { id: 91, title: 'Decode Ways', title_cn: '解码方法', difficulty: 'Medium', category: '动态规划', tags: '字符串', description: '数字字符串解码方式数', leetcode_url: `${U}/decode-ways/`, solution_hint: 'dp取决于dp[i-1]和dp[i-2]' },
    { id: 139, title: 'Word Break', title_cn: '单词拆分', difficulty: 'Medium', category: '动态规划', tags: '哈希表', description: '能否拆分为字典单词', leetcode_url: `${U}/word-break/`, solution_hint: 'dp[i]表示前i字符能否拆分' },
    { id: 300, title: 'Longest Increasing Subsequence', title_cn: '最长递增子序列', difficulty: 'Medium', category: '动态规划', tags: '二分', description: 'LIS长度', leetcode_url: `${U}/longest-increasing-subsequence/`, solution_hint: 'dp[i]以nums[i]结尾的LIS' },
    { id: 322, title: 'Coin Change', title_cn: '零钱兑换', difficulty: 'Medium', category: '动态规划', tags: 'BFS', description: '凑目标金额最少硬币', leetcode_url: `${U}/coin-change/`, solution_hint: 'dp[amount]=min(dp[amount-coin])+1' },
    { id: 152, title: 'Maximum Product Subarray', title_cn: '乘积最大子数组', difficulty: 'Medium', category: '动态规划', tags: '数组', description: '乘积最大的连续子数组', leetcode_url: `${U}/maximum-product-subarray/`, solution_hint: '维护最大最小乘积' },
    { id: 120, title: 'Triangle', title_cn: '三角形最小路径和', difficulty: 'Medium', category: '动态规划', tags: '数组', description: '顶到底最小路径和', leetcode_url: `${U}/triangle/`, solution_hint: '自底向上DP' },
    { id: 221, title: 'Maximal Square', title_cn: '最大正方形', difficulty: 'Medium', category: '动态规划', tags: '矩阵', description: '全1最大正方形', leetcode_url: `${U}/maximal-square/`, solution_hint: 'dp[i][j]=min(三邻居)+1' },
    { id: 416, title: 'Partition Equal Subset Sum', title_cn: '分割等和子集', difficulty: 'Medium', category: '动态规划', tags: '0-1背包', description: '能否分成和相等两子集', leetcode_url: `${U}/partition-equal-subset-sum/`, solution_hint: '0-1背包' },
    { id: 62, title: 'Unique Paths', title_cn: '不同路径', difficulty: 'Medium', category: '动态规划', tags: '组合数学', description: '左上到右下路径数', leetcode_url: `${U}/unique-paths/`, solution_hint: 'dp[i][j]=dp[i-1][j]+dp[i][j-1]' },
    { id: 64, title: 'Minimum Path Sum', title_cn: '最小路径和', difficulty: 'Medium', category: '动态规划', tags: '矩阵', description: '最小路径和', leetcode_url: `${U}/minimum-path-sum/`, solution_hint: 'grid[i][j]+min(上,左)' },
    { id: 53, title: 'Maximum Subarray', title_cn: '最大子数组和', difficulty: 'Medium', category: '动态规划', tags: '分治', description: '和最大的连续子数组', leetcode_url: `${U}/maximum-subarray/`, solution_hint: 'Kadane算法' },
    { id: 10, title: 'Regular Expression Matching', title_cn: '正则表达式匹配', difficulty: 'Hard', category: '动态规划', tags: '递归', description: '实现.和*的正则匹配', leetcode_url: `${U}/regular-expression-matching/`, solution_hint: '二维DP' },
    { id: 44, title: 'Wildcard Matching', title_cn: '通配符匹配', difficulty: 'Hard', category: '动态规划', tags: '贪心', description: '实现?和*的通配符匹配', leetcode_url: `${U}/wildcard-matching/`, solution_hint: '二维DP或贪心' },
    { id: 312, title: 'Burst Balloons', title_cn: '戳气球', difficulty: 'Hard', category: '动态规划', tags: '区间DP', description: '戳气球最大硬币数', leetcode_url: `${U}/burst-balloons/`, solution_hint: '区间DP最后戳哪个' },
    { id: 32, title: 'Longest Valid Parentheses', title_cn: '最长有效括号', difficulty: 'Hard', category: '动态规划', tags: '栈', description: '最长有效括号长度', leetcode_url: `${U}/longest-valid-parentheses/`, solution_hint: 'DP或栈' },
    { id: 115, title: 'Distinct Subsequences', title_cn: '不同的子序列', difficulty: 'Hard', category: '动态规划', tags: '字符串', description: 's中t出现的次数', leetcode_url: `${U}/distinct-subsequences/`, solution_hint: '二维DP' },
    // ===== 贪心 (5题) =====
    { id: 763, title: 'Partition Labels', title_cn: '划分字母区间', difficulty: 'Medium', category: '贪心', tags: '哈希表', description: '划分尽可能多区间', leetcode_url: `${U}/partition-labels/`, solution_hint: '记录字符最后位置' },
    { id: 678, title: 'Valid Parenthesis String', title_cn: '有效括号字符串', difficulty: 'Medium', category: '贪心', tags: '栈', description: '含*的括号是否有效', leetcode_url: `${U}/valid-parenthesis-string/`, solution_hint: '维护括号计数范围' },
    { id: 330, title: 'Patching Array', title_cn: '按要求补齐数组', difficulty: 'Hard', category: '贪心', tags: '数组', description: '最少添加使1-n都能表示', leetcode_url: `${U}/patching-array/`, solution_hint: '贪心维护覆盖范围' },
    { id: 406, title: 'Queue Reconstruction by Height', title_cn: '根据身高重建队列', difficulty: 'Medium', category: '贪心', tags: '排序', description: '按身高重建队列', leetcode_url: `${U}/queue-reconstruction-by-height/`, solution_hint: '先高后矮逐个插入' },
    { id: 435, title: 'Non-overlapping Intervals', title_cn: '无重叠区间', difficulty: 'Medium', category: '贪心', tags: '排序', description: '移除最少使区间不重叠', leetcode_url: `${U}/non-overlapping-intervals/`, solution_hint: '按终点排序贪心选择' },
    // ===== 区间 (3题) =====
    { id: 56, title: 'Merge Intervals', title_cn: '合并区间', difficulty: 'Medium', category: '区间', tags: '排序', description: '合并所有重叠区间', leetcode_url: `${U}/merge-intervals/`, solution_hint: '按起点排序逐个合并' },
    { id: 57, title: 'Insert Interval', title_cn: '插入区间', difficulty: 'Medium', category: '区间', tags: '数组', description: '有序区间中插入新区间', leetcode_url: `${U}/insert-interval/`, solution_hint: '找重叠区间合并' },
    { id: 452, title: 'Minimum Number of Arrows', title_cn: '最少箭数射爆气球', difficulty: 'Medium', category: '区间', tags: '排序', description: '最少箭数射爆所有气球', leetcode_url: `${U}/minimum-number-of-arrows-to-burst-balloons/`, solution_hint: '按终点排序贪心' },
    // ===== 位运算 (6题) =====
    { id: 338, title: 'Counting Bits', title_cn: '比特位计数', difficulty: 'Easy', category: '位运算', tags: '动态规划', description: '0到n每个数二进制1的个数', leetcode_url: `${U}/counting-bits/`, solution_hint: 'dp[i]=dp[i>>1]+(i&1)' },
    { id: 136, title: 'Single Number', title_cn: '只出现一次的数字', difficulty: 'Easy', category: '位运算', tags: '异或', description: '找出只出现一次的数字', leetcode_url: `${U}/single-number/`, solution_hint: '异或运算' },
    { id: 137, title: 'Single Number II', title_cn: '只出现一次II', difficulty: 'Medium', category: '位运算', tags: '计数', description: '其他出现三次找一次的', leetcode_url: `${U}/single-number-ii/`, solution_hint: '每位1计数模3' },
    { id: 260, title: 'Single Number III', title_cn: '只出现一次III', difficulty: 'Medium', category: '位运算', tags: '分组', description: '两个只出现一次的数', leetcode_url: `${U}/single-number-iii/`, solution_hint: '异或后按位分组' },
    { id: 268, title: 'Missing Number', title_cn: '丢失的数字', difficulty: 'Easy', category: '位运算', tags: '数学', description: '0到n中缺失的数字', leetcode_url: `${U}/missing-number/`, solution_hint: '异或或求和' },
    { id: 190, title: 'Reverse Bits', title_cn: '颠倒二进制位', difficulty: 'Easy', category: '位运算', tags: '分治', description: '颠倒32位二进制', leetcode_url: `${U}/reverse-bits/`, solution_hint: '逐位颠倒' },
  ];

  const seedAll = db.transaction(() => {
    for (const p of problems) insert.run(p);
  });
  seedAll();
}
