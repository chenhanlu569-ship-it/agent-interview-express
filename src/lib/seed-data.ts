/**
 * 种子数据 - Java 面试题 + AI Agent 面试题 + 知识条目
 */
import { getDb } from './db';

export function seedJavaQuestions() {
  const db = getDb();
  const count = (db.prepare('SELECT COUNT(*) as c FROM java_questions').get() as { c: number }).c;
  if (count > 0) return;

  const insert = db.prepare(`INSERT INTO java_questions (category, question, answer, tags, importance) VALUES (@category, @question, @answer, @tags, @importance)`);

  const qs = [
    { category: 'Java基础', question: '== 和 equals() 的区别？', answer: '== 比较引用地址（基本类型比较值），equals() 默认比较引用但可被重写（如String比较内容）。重写equals必须重写hashCode。', tags: '基础,比较', importance: 5 },
    { category: 'Java基础', question: 'String、StringBuilder、StringBuffer区别？', answer: 'String不可变，StringBuilder可变非线程安全，StringBuffer可变线程安全。一般用StringBuilder，多线程用StringBuffer。', tags: 'String,线程安全', importance: 5 },
    { category: 'Java基础', question: 'HashMap底层实现原理？', answer: 'JDK1.8: 数组+链表+红黑树。hash(key)定位桶，冲突时链表存储，链表>8且数组>64转红黑树。默认容量16，负载因子0.75，扩容2倍。', tags: '集合,HashMap', importance: 5 },
    { category: 'Java基础', question: 'ArrayList和LinkedList区别？', answer: 'ArrayList动态数组随机访问O(1)插入删除O(n)；LinkedList双向链表随机访问O(n)插入删除O(1)。实际ArrayList因CPU缓存友好大多场景更快。', tags: '集合,数组,链表', importance: 4 },
    { category: 'Java基础', question: 'Java泛型擦除是什么？', answer: '编译后泛型类型被擦除为Object或上界。运行时无法获取泛型实际类型，不能new泛型数组。可通过反射获取字段泛型信息。', tags: '泛型,编译', importance: 4 },
    { category: 'Java基础', question: '接口和抽象类的区别？', answer: '接口支持多实现，方法默认public abstract(JDK8+可default)，字段public static final。抽象类单继承，可有构造器、成员变量、普通方法。is-a用抽象类，can-do用接口。', tags: '接口,抽象类,OOP', importance: 4 },
    { category: 'Java基础', question: 'final、finally、finalize区别？', answer: 'final修饰类不可继承、方法不可重写、变量不可重赋值。finally异常处理保证执行。finalize在GC前调用(JDK9+废弃)。', tags: 'final,finally', importance: 2 },
    { category: '并发编程', question: 'synchronized和ReentrantLock区别？', answer: 'synchronized是JVM内置锁自动释放不可中断。ReentrantLock是API锁需手动unlock，可中断、可超时、支持公平锁和Condition。JDK6后synchronized性能接近。', tags: '锁,synchronized', importance: 5 },
    { category: '并发编程', question: '线程池核心参数？', answer: '7个参数：corePoolSize、maximumPoolSize、keepAliveTime、unit、workQueue、threadFactory、handler。流程：核心未满→创建；核心满→入队；队列满→创建非核心；都满→拒绝策略。', tags: '线程池,ThreadPoolExecutor', importance: 5 },
    { category: '并发编程', question: 'volatile关键字作用？', answer: '保证可见性和有序性，不保证原子性。通过内存屏障实现。典型应用：DCL单例、状态标志。i++不安全需用AtomicInteger。', tags: 'volatile,可见性', importance: 5 },
    { category: '并发编程', question: 'ThreadLocal原理和使用场景？', answer: '每个线程独立变量副本，通过ThreadLocalMap实现。场景：数据库连接、Session管理。注意内存泄漏必须remove()。', tags: 'ThreadLocal,线程隔离', importance: 4 },
    { category: '并发编程', question: 'CAS是什么？有什么问题？', answer: 'Compare And Swap无锁算法，比较内存值与预期值相同则更新。问题：ABA(AtomicStampedReference解决)、自旋开销、只能保证单变量原子性。', tags: 'CAS,无锁', importance: 4 },
    { category: '并发编程', question: 'ConcurrentHashMap实现原理？', answer: 'JDK1.7: Segment分段锁。JDK1.8: Node数组+链表+红黑树，CAS+synchronized锁桶头节点，锁粒度细化到每个桶。', tags: 'ConcurrentHashMap,并发', importance: 5 },
    { category: '并发编程', question: '什么是AQS？', answer: 'AbstractQueuedSynchronizer并发框架基础。核心：volatile int state + CLH双向队列。ReentrantLock/CountDownLatch/Semaphore都基于AQS。', tags: 'AQS,并发框架', importance: 4 },
    { category: 'JVM', question: 'JVM内存结构？', answer: '程序计数器(线程私有)、虚拟机栈(线程私有，方法调用栈帧)、本地方法栈、堆(线程共享，对象分配)、方法区/元空间(类信息常量静态变量)。', tags: 'JVM,内存模型', importance: 5 },
    { category: 'JVM', question: '常见垃圾回收算法？', answer: '标记-清除(碎片多)、标记-复制(新生代)、标记-整理(老年代)、分代收集(新生代用复制，老年代用标记整理)。', tags: 'GC,回收算法', importance: 5 },
    { category: 'JVM', question: '如何判断对象可以被回收？', answer: '引用计数法(循环引用问题)和可达性分析(GC Roots)。GC Roots包括：栈引用、静态变量、常量、JNI引用等。', tags: 'GC,可达性分析', importance: 4 },
    { category: 'JVM', question: '类加载机制和双亲委派？', answer: '加载→验证→准备→解析→初始化。双亲委派：Bootstrap→Extension→Application，子类加载器先委托父类。打破：SPI、OSGi、tomcat。', tags: '类加载,双亲委派', importance: 5 },
    { category: 'JVM', question: 'JVM调优常用参数？', answer: '-Xms/-Xmx堆大小、-Xss栈大小、-XX:NewRatio新生代比例、-XX:+UseG1GC垃圾回收器、-XX:+PrintGCDetails日志、-XX:MetaspaceSize元空间。', tags: 'JVM,调优', importance: 2 },
    { category: 'Spring', question: 'Spring IoC和AOP原理？', answer: 'IoC: 控制反转，BeanFactory管理Bean生命周期，依赖注入解耦。AOP: 面向切面，动态代理(JDK/CGLIB)实现横切关注点(日志、事务)。', tags: 'IoC,AOP,代理', importance: 5 },
    { category: 'Spring', question: 'Spring Bean生命周期？', answer: '实例化→属性填充→Aware回调→BeanPostProcessor前置→InitializingBean/init-method→BeanPostProcessor后置→使用→DisposableBean/destroy-method。', tags: 'Bean,生命周期', importance: 5 },
    { category: 'Spring', question: 'Spring事务传播机制？', answer: '7种传播行为：REQUIRED(默认，有则加入无则新建)、REQUIRES_NEW(总是新建)、SUPPORTS(有则加入无则非事务)、MANDATORY/NOT_SUPPORTED/NEVER/NESTED。', tags: '事务,传播', importance: 4 },
    { category: 'Spring', question: '@Transactional失效场景？', answer: '1.方法非public 2.同类内部调用(无代理) 3.异常被catch 4.数据库不支持事务 5.传播行为设置错误 6.多线程。解决：AopContext或注入自身。', tags: '事务,失效', importance: 5 },
    { category: 'Spring', question: 'SpringBoot自动配置原理？', answer: '@EnableAutoConfiguration→@Import(AutoConfigurationImportSelector)→读取META-INF/spring.factories→条件注解(@ConditionalOnClass等)按需加载。', tags: '自动配置,SpringBoot', importance: 5 },
    { category: '数据库', question: 'MySQL索引类型和B+树？', answer: 'B+树：非叶子节点只存key，叶子节点存数据且双向链表连接。优势：范围查询高效、IO次数少。类型：主键、唯一、普通、联合、全文。', tags: 'MySQL,索引,B+树', importance: 5 },
    { category: '数据库', question: 'MySQL事务ACID和隔离级别？', answer: 'ACID：原子性(undo log)、一致性、隔离性(MVCC/锁)、持久性(redo log)。隔离级别：读未提交→读已提交→可重复读(默认)→串行化。', tags: '事务,ACID,隔离级别', importance: 5 },
    { category: '数据库', question: 'MySQL慢SQL优化思路？', answer: '1.开启慢查询日志 2.explain分析(类型/key/rows/Extra) 3.优化索引(覆盖索引/避免失效) 4.优化SQL(避免SELECT*/子查询改JOIN) 5.分库分表。', tags: 'MySQL,优化,explain', importance: 4 },
    { category: '数据库', question: 'Redis数据结构和应用场景？', answer: 'String(缓存/计数器)、Hash(对象存储)、List(消息队列)、Set(去重/交并集)、ZSet(排行榜)。高级：Bitmap/HyperLogLog/Stream。', tags: 'Redis,数据结构', importance: 5 },
    { category: '数据库', question: 'Redis缓存穿透/击穿/雪崩？', answer: '穿透(查不到→布隆过滤器/缓存空值)、击穿(热点key过期→互斥锁/永不过期)、雪崩(大量key同时过期→过期时间加随机值/多级缓存)。', tags: 'Redis,缓存问题', importance: 5 },
    { category: '设计模式', question: '单例模式几种实现？', answer: '饿汉式(类加载创建)、懒汉式(synchronized)、DCL(双重检查锁+volatile)、静态内部类(推荐)、枚举(最安全)。', tags: '单例,设计模式', importance: 4 },
    { category: '设计模式', question: '工厂模式和抽象工厂区别？', answer: '工厂方法：一个工厂生产一种产品。抽象工厂：一个工厂生产一族产品。简单工厂不属于GoF23种模式。', tags: '工厂,设计模式', importance: 2 },
    { category: '设计模式', question: '观察者模式和发布订阅区别？', answer: '观察者：观察者和被观察者直接耦合(同步)。发布订阅：通过中间消息队列解耦(异步)。发布订阅是观察者模式的进化版。', tags: '观察者,发布订阅', importance: 2 },
    { category: '微服务', question: '微服务核心组件？', answer: '注册中心(Nacos/Eureka)、配置中心(Nacos/Apollo)、网关(Spring Cloud Gateway)、RPC(OpenFeign/Dubbo)、熔断(Sentinel/Hystrix)、链路追踪(SkyWalking)。', tags: '微服务,SpringCloud', importance: 4 },
    { category: '微服务', question: '分布式事务解决方案？', answer: '2PC(强一致性能差)、TCC(try-confirm-cancel)、Saga(长事务编排)、本地消息表(最终一致性)、RocketMQ事务消息。推荐Seata框架。', tags: '分布式事务,Seata', importance: 4 },
    { category: '微服务', question: '服务熔断降级限流区别？', answer: '熔断：下游故障时快速失败(保险丝)。降级：服务不可用时返回兜底数据。限流：控制请求速率保护系统(令牌桶/漏桶)。', tags: '熔断,降级,限流', importance: 4 },
    { category: '消息队列', question: '如何保证消息不丢失？', answer: '生产端：确认机制(confirm/return)。Broker：持久化(磁盘+副本)。消费端：手动ACK+幂等处理。', tags: 'MQ,消息可靠性', importance: 4 },
    { category: '消息队列', question: '如何保证消息顺序消费？', answer: 'RocketMQ：相同业务key路由到同一队列。Kafka：相同key路由到同一partition。单partition单线程消费保证顺序。', tags: 'MQ,顺序消费', importance: 2 },
    { category: 'Java基础', question: 'Java反射机制和应用场景？', answer: '运行时获取类信息并操作对象。核心API：Class/Method/Field/Constructor。应用：框架(Spring IoC)、动态代理、注解处理。性能较低应避免频繁调用。', tags: '反射,框架', importance: 4 },
    { category: 'Java基础', question: 'Java SPI机制是什么？', answer: 'Service Provider Interface，服务提供者可插拔机制。定义接口+META-INF/services/配置文件+ServiceLoader加载。打破双亲委派。应用：JDBC驱动、Dubbo扩展。', tags: 'SPI,可插拔', importance: 2 },
    { category: '并发编程', question: 'CompletableFuture用法和原理？', answer: '异步编程工具，支持链式调用(thenApply/thenCompose/thenCombine)、组合(CompletableFuture.allOf/anyOf)、异常处理(exceptionally/handle)。底层ForkJoinPool。', tags: 'CompletableFuture,异步', importance: 4 },
    { category: '并发编程', question: 'CountDownLatch和CyclicBarrier区别？', answer: 'CountDownLatch：等待其他线程完成，不可重置。CyclicBarrier：互相等待到共同屏障点，可重置，支持barrierAction。CountDownLatch是等人做完，CyclicBarrier是等人到齐。', tags: '并发工具', importance: 2 },
    { category: 'Spring', question: 'Spring循环依赖如何解决？', answer: '三级缓存：singletonObjects(成品)、earlySingletonObjects(半成品)、singletonFactories(工厂)。A依赖B时先暴露A的ObjectFactory，B依赖A时从工厂获取代理对象。构造器注入无法解决。', tags: '循环依赖,三级缓存', importance: 5 },
    { category: '数据库', question: 'MySQL聚簇索引和非聚簇索引？', answer: '聚簇索引：叶子节点存完整数据行(主键索引)。非聚簇(二级索引)：叶子节点存主键值，需回表查询。覆盖索引：查询列都在索引中无需回表。', tags: 'MySQL,索引', importance: 5 },
    { category: '数据库', question: 'Redis持久化RDB和AOF？', answer: 'RDB：快照(子进程fork+COW)，恢复快但可能丢数据。AOF：追加写命令，数据完整但文件大。混合持久化(RDB+AOF增量)是推荐方案。', tags: 'Redis,持久化', importance: 4 },
    { category: 'Java基础', question: 'Java 8-17新特性？', answer: 'Java8: Lambda/Stream/Optional/新日期API。Java9: 模块化/jshell。Java11: HttpClient/var。Java14: switch表达式/record。Java16: Pattern Matching。Java17: sealed class/text block。', tags: '新特性,版本', importance: 1 },
    { category: '微服务', question: '如何设计一个高并发系统？', answer: '缓存(多级缓存)、异步(MQ)、限流(令牌桶)、分库分表、读写分离、CDN、连接池、JVM调优、水平扩展、降级兜底。核心：缓存+异步+水平扩展。', tags: '高并发,架构', importance: 4 },
    { category: '设计模式', question: '策略模式和模板方法区别？', answer: '策略模式：封装算法族，运行时选择(组合)。模板方法：定义算法骨架，子类重写步骤(继承)。策略更灵活可运行时切换，模板适合固定流程。', tags: '策略,模板方法', importance: 1 },
    { category: '消息队列', question: 'Kafka为什么吞吐量高？', answer: '1.顺序写磁盘 2.零拷贝(sendfile) 3.批量发送+压缩 4.分区并行 5.PageCache利用OS缓存 6.消费者组并行消费。', tags: 'Kafka,高性能', importance: 4 },
  ];

  const seedAll = db.transaction(() => { for (const q of qs) insert.run(q); });
  seedAll();
}

export function seedAIQuestions() {
  const db = getDb();
  const count = (db.prepare('SELECT COUNT(*) as c FROM ai_questions').get() as { c: number }).c;
  if (count > 0) return;

  const insert = db.prepare(`INSERT INTO ai_questions (category, question, answer, tags, importance) VALUES (@category, @question, @answer, @tags, @importance)`);

  const qs = [
    { category: 'LLM基础', question: 'Transformer架构的核心组件？', answer: 'Self-Attention(自注意力机制)、Multi-Head Attention(多头注意力)、Position Encoding(位置编码)、Feed-Forward Network(前馈网络)、Layer Normalization(层归一化)、残差连接。核心创新是Self-Attention替代RNN实现并行计算。', tags: 'Transformer,Attention', importance: 5 },
    { category: 'LLM基础', question: '什么是Token？Tokenization怎么做的？', answer: 'Token是模型处理文本的最小单位。常见方法：BPE(Byte Pair Encoding，GPT用)、WordPiece(BERT用)、SentencePiece。将文本拆分为子词单元，平衡词汇表大小和覆盖率。', tags: 'Token,BPE', importance: 5 },
    { category: 'LLM基础', question: 'Temperature和Top-P的作用？', answer: 'Temperature：控制输出随机性，低(0.1)确定性高，高(1.0)更随机。Top-P(Nucleus Sampling)：从累计概率达到P的token中采样。两者配合使用控制生成多样性。', tags: '采样,生成控制', importance: 1 },
    { category: 'Prompt工程', question: '什么是Prompt Engineering？常用技巧？', answer: '通过设计输入提示词引导模型输出。技巧：Zero-shot/Few-shot(示例)、CoT(思维链)、Role-playing(角色设定)、格式约束(JSON输出)、系统提示(System Prompt)设定行为边界。', tags: 'Prompt,CoT', importance: 5 },
    { category: 'Prompt工程', question: '思维链(CoT)是什么？怎么使用？', answer: 'Chain of Thought，让模型展示推理过程。方法：Few-shot CoT(给含推理步骤的示例)、Zero-shot CoT("Let\'s think step by step")。显著提升复杂推理任务准确率。', tags: 'CoT,推理', importance: 5 },
    { category: 'RAG', question: '什么是RAG？核心流程？', answer: 'Retrieval-Augmented Generation，检索增强生成。流程：1.文档切分(Chunking) 2.向量化(Embedding) 3.存入向量数据库 4.用户查询向量化 5.相似度检索 6.将检索结果+问题送入LLM生成回答。解决LLM知识过时和幻觉问题。', tags: 'RAG,检索增强', importance: 5 },
    { category: 'RAG', question: 'RAG中文档切分策略？', answer: '固定大小切分(按token数)、语义切分(按段落/章节)、递归切分(LangChain RecursiveCharacterTextSplitter)。关键参数：chunk_size(512-1024)、chunk_overlap(50-200)。需考虑上下文完整性。', tags: 'Chunking,文档处理', importance: 2 },
    { category: 'RAG', question: '向量数据库有哪些？怎么选？', answer: 'Milvus(开源分布式)、Pinecone(全托管)、Weaviate(图搜索)、Chroma(轻量本地)、Qdrant(Rust高性能)、FAISS(Meta开源库)。选型考虑：规模、延迟、成本、部署方式。', tags: '向量数据库,Embedding', importance: 2 },
    { category: 'Agent框架', question: '什么是AI Agent？和LLM有什么区别？', answer: 'AI Agent = LLM + 工具调用 + 记忆 + 规划。Agent能感知环境、制定计划、使用工具、执行动作并迭代。LLM只做文本生成，Agent具备自主决策和行动能力。', tags: 'Agent,自主决策', importance: 5 },
    { category: 'Agent框架', question: 'LangChain的核心概念？', answer: 'Models(模型封装)、Prompts(提示模板)、Chains(链式调用)、Memory(对话记忆)、Agents(工具调用Agent)、Retrievers(检索器)、Callbacks(回调)。模块化设计，组件可组合。', tags: 'LangChain,框架', importance: 5 },
    { category: 'Agent框架', question: 'LangGraph和LangChain什么关系？', answer: 'LangGraph是LangChain团队开发的有状态Agent编排框架。基于图(Graph)结构定义Agent工作流，支持循环、条件分支、并行执行。比LangChain的AgentExecutor更灵活可控。', tags: 'LangGraph,编排', importance: 5 },
    { category: 'Agent框架', question: 'Function Calling是什么？怎么实现？', answer: '让LLM输出结构化函数调用而非纯文本。模型返回函数名+参数JSON，应用执行函数后将结果返回模型。OpenAI/Anthropic都支持。是Agent工具调用的核心机制。', tags: 'FunctionCalling,工具调用', importance: 5 },
    { category: 'Agent框架', question: 'ReAct模式是什么？', answer: 'Reasoning + Acting。Agent交替进行推理(Thought)和行动(Action)，观察结果(Observation)后继续推理。形成Thought→Action→Observation循环直到得出最终答案。', tags: 'ReAct,推理行动', importance: 5 },
    { category: '记忆系统', question: 'Agent的记忆系统怎么设计？', answer: '短期记忆：对话上下文(滑动窗口/摘要)。长期记忆：向量数据库存储历史交互。工作记忆：当前任务状态。实体记忆：用户偏好和实体信息。分层设计平衡上下文长度和信息保留。', tags: 'Memory,记忆管理', importance: 5 },
    { category: '记忆系统', question: '如何解决LLM上下文窗口限制？', answer: '1.摘要压缩(长对话压缩为摘要) 2.滑动窗口(只保留最近N轮) 3.RAG(外部检索替代记忆) 4.分层记忆(短期+长期) 5.向量检索(语义搜索相关历史)。', tags: '上下文,窗口限制', importance: 2 },
    { category: '模型微调', question: '什么是Fine-tuning？和Prompt Engineering区别？', answer: 'Fine-tuning在预训练模型基础上用特定数据继续训练，改变模型权重。Prompt Engineering不改模型只改输入。Fine-tuning效果好但成本高，Prompt灵活但受模型能力限制。', tags: '微调,Fine-tuning', importance: 4 },
    { category: '模型微调', question: 'LoRA是什么？原理？', answer: 'Low-Rank Adaptation，低秩自适应。冻结预训练权重，在注意力层旁路添加低秩矩阵(A×B)进行微调。大幅减少可训练参数(0.1%-1%)，显存和计算成本显著降低。', tags: 'LoRA,参数高效', importance: 5 },
    { category: '模型微调', question: 'RLHF是什么？训练流程？', answer: 'Reinforcement Learning from Human Feedback。流程：1.SFT(监督微调) 2.训练奖励模型(Reward Model) 3.PPO强化学习优化策略。让模型输出更符合人类偏好。ChatGPT核心技术。', tags: 'RLHF,PPO', importance: 5 },
    { category: '评估与部署', question: '如何评估LLM应用质量？', answer: '自动评估：BLEU/ROUGE(文本相似度)、BERTScore(语义相似度)、GPT-as-Judge。人工评估：准确性、相关性、流畅性、安全性。业务指标：用户满意度、任务完成率。', tags: '评估,指标', importance: 4 },
    { category: '评估与部署', question: 'LLM应用部署架构？', answer: '推理服务(vLLM/TGI/Triton)→API网关(限流/鉴权)→应用层(业务逻辑)→前端。关键考虑：GPU资源管理、模型量化(INT8/INT4)、批处理、缓存、多模型路由。', tags: '部署,vLLM', importance: 4 },
    { category: '安全与对齐', question: 'LLM的安全风险有哪些？', answer: '提示注入(Prompt Injection)、数据泄露、幻觉(Hallucination)、偏见输出、越狱(Jailbreak)、模型窃取。防护：输入过滤、输出审核、权限控制、对齐训练。', tags: '安全,对齐', importance: 5 },
    { category: '安全与对齐', question: '什么是提示注入？如何防范？', answer: '攻击者通过精心构造的输入让模型忽略系统指令执行恶意操作。防范：1.输入输出过滤 2.指令和数据分离 3.权限最小化 4.监控异常输出 5.使用Guard模型。', tags: '提示注入,安全', importance: 5 },
    { category: 'Agent框架', question: 'Multi-Agent系统怎么设计？', answer: '多个Agent协作完成复杂任务。模式：层级式(Manager+Worker)、辩论式(多Agent讨论)、流水线式(分工协作)。框架：AutoGen、CrewAI、LangGraph。关键：任务分解、通信协议、冲突解决。', tags: 'Multi-Agent,协作', importance: 4 },
    { category: 'RAG', question: 'Advanced RAG有哪些优化技术？', answer: '查询改写(HyDE/多查询)、重排序(Reranker)、混合检索(向量+关键词)、元数据过滤、上下文压缩、Self-RAG(自我反思)、Corrective RAG(检索后验证)。', tags: 'AdvancedRAG,优化', importance: 4 },
    { category: 'LLM基础', question: 'Attention机制的计算过程？', answer: 'Q(Query)K(Key)V(Value)矩阵：1.QK^T/√dk计算注意力分数 2.Softmax归一化 3.乘以V得到输出。Self-Attention中QKV都来自同一输入。Multi-Head并行多个Attention再拼接。', tags: 'Attention,QKV', importance: 5 },
    { category: '模型微调', question: 'SFT数据怎么准备？', answer: '1.数据清洗(去重/去噪/质量过滤) 2.格式统一(instruction/input/output) 3.数据增强(回译/改写) 4.多样性保证(覆盖各场景) 5.质量>数量(几千条高质量数据即可)。', tags: 'SFT,数据准备', importance: 4 },
    { category: '评估与部署', question: 'LLM推理优化有哪些方法？', answer: '量化(GPTQ/AWQ/GGUF)、KV Cache优化(PagedAttention)、投机解码(Speculative Decoding)、批处理(Continuous Batching)、模型蒸馏、Flash Attention。vLLM/TGI框架集成多种优化。', tags: '推理优化,量化', importance: 4 },
    { category: 'Agent框架', question: 'Tool Use的最佳实践？', answer: '1.工具描述清晰(参数/返回值/使用场景) 2.工具粒度适中(不要太细碎) 3.错误处理(超时/重试/降级) 4.权限控制(沙箱执行) 5.结果格式化(便于LLM理解)。', tags: 'ToolUse,最佳实践', importance: 4 },
    { category: 'Prompt工程', question: 'System Prompt设计原则？', answer: '1.明确角色和能力边界 2.定义输出格式 3.设定行为约束(安全/礼貌) 4.提供示例 5.处理边界情况 6.保持简洁避免冲突。好的System Prompt是Agent可靠性的基础。', tags: 'SystemPrompt,设计', importance: 4 },
    { category: 'RAG', question: 'Embedding模型怎么选？', answer: '考虑因素：维度(768-1536)、多语言支持、领域适配、推理速度。推荐：OpenAI text-embedding-3-small/large、BGE系列(中文优秀)、E5、Cohere embed。需在自己的数据上评估效果。', tags: 'Embedding,选型', importance: 1 },
  ];

  const seedAll = db.transaction(() => { for (const q of qs) insert.run(q); });
  seedAll();
}

export function seedKnowledge() {
  const db = getDb();
  const count = (db.prepare('SELECT COUNT(*) as c FROM knowledge_entries').get() as { c: number }).c;
  if (count > 0) return;

  const insert = db.prepare(`INSERT INTO knowledge_entries (title, content, source_type, source_url, source_name, category, tags) VALUES (@title, @content, @source_type, @source_url, @source_name, @category, @tags)`);

  const entries = [
    { title: 'LangChain Agent 完整开发指南', content: 'LangChain Agent 是基于 LLM 的自主决策系统，核心组件包括：Agent(决策引擎)、Tool(工具集)、Memory(记忆)、Chain(执行链)。开发步骤：1.定义工具函数 2.创建Agent 3.配置Memory 4.测试迭代。推荐使用LangGraph进行复杂工作流编排。', source_type: 'ai_search', source_url: 'https://python.langchain.com/docs/modules/agents/', source_name: 'LangChain官方文档', category: 'AI Agent', tags: 'LangChain,Agent,开发指南' },
    { title: 'RAG 系统性能优化实践', content: 'RAG优化关键点：1.文档切分策略(语义切分优于固定大小) 2.Embedding模型选择(多语言场景用BGE) 3.检索策略(混合检索：向量+BM25) 4.重排序(Reranker提升精度) 5.上下文压缩(减少token消耗)。实测优化后检索准确率可提升30-50%。', source_type: 'ai_search', source_url: 'https://www.pinecone.io/learn/series/rag/', source_name: 'Pinecone RAG系列教程', category: 'AI Agent', tags: 'RAG,优化,检索增强' },
    { title: 'Java 并发编程最佳实践总结', content: '并发编程核心原则：1.优先使用并发工具类(ConcurrentHashMap/BlockingQueue)而非手动同步 2.使用线程池管理线程(ThreadPoolExecutor) 3.避免在锁内做IO操作 4.使用volatile保证可见性 5.优先使用不可变对象 6.注意ThreadLocal内存泄漏。', source_type: 'personal', source_url: '', source_name: '', category: 'Java', tags: '并发,最佳实践,线程池' },
    { title: 'MySQL 索引优化实战笔记', content: '索引优化要点：1.最左前缀原则(联合索引注意字段顺序) 2.覆盖索引避免回表 3.避免索引失效(函数操作/隐式转换/like前缀%) 4.EXPLAIN关注type(key/index/range/ref)和Extra(Using index/Using filesort) 5.大表考虑分区或分库分表。', source_type: 'personal', source_url: '', source_name: '', category: '数据库', tags: 'MySQL,索引,优化' },
    { title: 'Spring Boot 微服务架构设计模式', content: '微服务设计模式：1.API Gateway(统一入口/鉴权/限流) 2.Service Registry(服务发现) 3.Circuit Breaker(熔断降级) 4.CQRS(读写分离) 5.Event Sourcing(事件溯源) 6.Saga(分布式事务)。Spring Cloud Alibaba提供完整解决方案。', source_type: 'ai_search', source_url: 'https://microservices.io/patterns/microservices.html', source_name: 'microservices.io', category: '架构', tags: '微服务,设计模式,SpringCloud' },
    { title: 'Prompt Engineering 高级技巧汇总', content: '高级Prompt技巧：1.Chain-of-Thought(思维链提升推理) 2.Tree-of-Thought(多路径探索) 3.Self-Consistency(多次采样投票) 4.ReAct(推理+行动循环) 5.Meta-Prompting(让模型优化prompt) 6.Constitutional AI(自我约束)。关键是迭代优化和评估。', source_type: 'ai_search', source_url: 'https://www.promptingguide.ai/', source_name: 'Prompt Engineering Guide', category: 'AI Agent', tags: 'Prompt,CoT,高级技巧' },
    { title: 'Redis 高可用架构方案对比', content: 'Redis高可用方案：1.主从复制(读写分离，异步复制可能丢数据) 2.Sentinel(自动故障转移，适合中小规模) 3.Cluster(数据分片，水平扩展，16384个slot) 4.Codis/Twemproxy(代理层分片)。生产推荐Cluster模式+持久化。', source_type: 'personal', source_url: '', source_name: '', category: '数据库', tags: 'Redis,高可用,架构' },
    { title: 'AI Agent 评测框架与指标体系', content: 'Agent评测维度：1.任务完成率(核心指标) 2.工具调用准确率 3.推理步骤质量(CoT评估) 4.安全性(提示注入防御) 5.效率(token消耗/延迟)。评测框架：AgentBench、GAIA、WebArena。建议建立领域特定评测集。', source_type: 'ai_search', source_url: 'https://arxiv.org/abs/2308.03688', source_name: 'AgentBench论文', category: 'AI Agent', tags: 'Agent,评测,指标' },
    { title: 'JVM 垃圾回收器选择指南', content: 'GC选择：1.Serial(单线程，客户端模式) 2.Parallel(吞吐量优先，JDK8默认) 3.CMS(低延迟，已废弃) 4.G1(JDK9+默认，Region化，可预测停顿) 5.ZShenandoah(超低延迟<10ms)。大堆(>8G)推荐G1或ZGC。', source_type: 'personal', source_url: '', source_name: '', category: 'JVM', tags: 'GC,垃圾回收,JVM调优' },
    { title: '向量数据库选型与性能测试报告', content: '向量数据库对比测试(100万条1536维向量)：Milvus(QPS:5000,P99:50ms)、Qdrant(QPS:8000,P99:30ms)、Chroma(轻量但性能一般)、FAISS(纯库无服务)。结论：大规模生产用Milvus/Qdrant，原型验证用Chroma+FAISS。', source_type: 'personal', source_url: '', source_name: '', category: 'AI Agent', tags: '向量数据库,性能测试,选型' },
    // ===== %E4%BB%A5%E4%B8%8B%E4%B8%BA2025-2026%E9%9D%A2%E7%BB%8F%E7%83%AD%E5%BA%A6%E6%95%B0%E6%8D%AE%E8%BF%BD%E5%8A%A0%EF%BC%8C%E6%9D%A5%E6%BA%90%E4%BA%8E%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%83%AD%E5%B8%96%E5%8F%8A%E8%B7%A8%E5%B9%B3%E5%8F%B0%E9%9D%A2%E7%BB%8F%E6%B1%87%E6%80%BB =====
    { title: '面经算法题高频汇总 TOP20 (2025-2026)', content: '数据来源：面经帖子，覆盖字节/阿里/腾讯/美团/百度/快手/拼多多/京东/网易/华为。\n\nTOP20最高频手撕算法题：\n1.LRU缓存(146) ~50+ 全部公司\n2.反转链表(206) ~45+ 全部\n3.手撕快速排序 ~40+ 全部\n4.无重复字符最长子串(3) ~35+ 全部\n5.三数之和(15) ~35+ 全部\n6.数组第K大元素(215) ~30+ 全部\n7.最大子数组和(53) ~30+ 全部\n8.合并区间(56) ~28+ 字节/阿里/腾讯/美团\n9.岛屿数量(200) ~28+ 全部\n10.两数之和(1) ~25+ 全部\n11.二叉树层序遍历(102) ~25+ 全部\n12.K个一组翻转链表(25) ~25+ 字节/阿里/腾讯\n13.合并两个有序链表(21) ~22+ 全部\n14.接雨水(42) ~22+ 字节/阿里/腾讯\n15.全排列(46) ~20+ 全部\n16.买卖股票最佳时机(121) ~18+ 全部\n17.有效的括号(20) ~18+ 全部\n18.旋转排序数组最小值(153) ~15+ 字节/阿里/腾讯\n19.重排链表(143) ~15+ 阿里/美团/字节\n20.打家劫舍(198) ~15+ 全部', source_type: 'ai_search', source_url: 'https://www.xiaohongshu.com/discovery/item/6a3f3ad9000000000f0338a3', source_name: '小红书-果果姐聊AI', category: '面试算法', tags: '面经,算法,高频,TOP20,LeetCode' },
    { title: '面经算法分类频次统计 - 链表/树/DP/滑动窗口', content: '链表(总计~180次提及)：反转链表(206)🔥×45+、K个一组翻转(25)🔥×25+、合并有序链表(21)🔥×22+、重排链表(143)🔥×15+、环检测(141)🔥×12+、删除倒数第N个(19)🔥×10+、合并K个升序链表(23)🔥×10+、回文链表(234)🔥×10+、区间反转(92)🔥×8+、公共节点(160)🔥×8+\n\n二叉树(总计~120次)：层序遍历(102)🔥×25+、前中后序(144/94/145)🔥×15+、验证BST(98)🔥×15+、最近公共祖先(236)🔥×12+、最大深度(104)🔥×10+、对称/翻转(101/226)🔥×8+、最大路径和(124)🔥×8+、构造二叉树(105)🔥×8+\n\n动态规划(总计~110次)：最大子数组和(53)🔥×30+、打家劫舍(198)🔥×15+、买卖股票(121)🔥×15+、爬楼梯(70)🔥×10+、LIS(300)🔥×10+、编辑距离(72)🔥×8+、最长回文子串(5)🔥×8+\n\n滑动窗口/双指针(总计~80次)：无重复最长子串(3)🔥×35+、三数之和(15)🔥×35+、接雨水(42)🔥×22+、盛水容器(11)🔥×8+\n\n栈/堆/队列(总计~65次)：有效括号(20)🔥×18+、最小栈(155)🔥×10+、用栈实现队列(232)🔥×10+', source_type: 'ai_search', source_url: 'https://www.xiaohongshu.com/discovery/item/6a3f3ad9000000000f0338a3', source_name: '小红书-果果姐聊AI', category: '面试算法', tags: '面经,算法,分类,频次,链表,树,DP' },
    { title: '面经算法分类频次统计 - 二分/回溯/BFS/DFS', content: '二分查找(总计~50次)：搜索旋转排序数组(33)🔥×12+、二分查找基础(704)🔥×8+、寻找峰值(162)🔥×8+、旋转数组最小值(153)🔥×15+、搜索二维矩阵(74/240)🔥×6+\n\n回溯/DFS/BFS(总计~55次)：岛屿数量(200)🔥×28+、全排列(46)🔥×20+、组合总和(39)🔥×12+、子集(78)🔥×8+、括号生成(22)🔥×8+、单词搜索(79)🔥×5+\n\n设计模式/系统设计手撕：线程安全单例(DCL)🔥🔥🔥🔥🔥、生产者消费者🔥🔥🔥🔥、带超时LRU🔥🔥🔥、线程安全LRU🔥🔥🔥、两个线程交替输出🔥🔥\n\n非LeetCode原创高频题：小于n的最大数(给定数字集合)🔥🔥🔥、Rand7实现Rand10(470)🔥🔥🔥、手撕快速排序🔥🔥🔥🔥🔥、归并排序🔥🔥🔥、堆排序🔥🔥', source_type: 'ai_search', source_url: 'https://www.xiaohongshu.com/discovery/item/6a3f3ad9000000000f0338a3', source_name: '小红书-果果姐聊AI', category: '面试算法', tags: '面经,算法,二分,回溯,BFS,设计模式' },
    { title: '大厂面试算法高频题 - 按公司分', content: '字节跳动(面经最多)：LRU(146)×20+、接雨水(42)×15+、岛屿数量(200)×15+、合并区间(56)×12+、K个一组翻转(25)×12+、层序遍历(102)×10+、三数之和(15)×10+、原创题：小于n的最大数\n\n阿里巴巴：反转链表(206)×15+、LRU(146)×12+、第K大(215)×12+、编辑距离(72)×10+、重排链表(143)×8+、K个一组翻转(25)×8+、线程安全单例(DCL)几乎必考\n\n腾讯(一面3题限时30min压力测试)：LRU(146)×32、反转链表(206)×30、快排×24、合并有序链表(21)×18、Rand7→Rand10(470)×15、LFU(460)×12、第K大(215)×10\n\n美团：层序遍历(102)×8+、有效括号(20)×6+、三数之和(15)×6+、快排×6+、SQL题(留存率/窗口函数)美团特色、生产者消费者模型', source_type: 'ai_search', source_url: 'https://www.xiaohongshu.com/discovery/item/6a3f3ad9000000000f0338a3', source_name: '小红书-果果姐聊AI', category: '面试算法', tags: '面经,算法,字节,阿里,腾讯,美团,大厂' },
    { title: '面试刷题优先级建议 (2026版)', content: '第一梯队(必刷，几乎每家公司都考)：\nLRU(146) > 反转链表(206) > 快排 > 三数之和(15) > 无重复最长子串(3) > 第K大(215) > 最大子数组和(53) > 岛屿数量(200)\n\n第二梯队(高频)：\n层序遍历(102) > 合并区间(56) > 接雨水(42) > K个一组翻转(25) > 两数之和(1) > 全排列(46) > 有效括号(20) > 买卖股票(121)\n\n第三梯队(目标公司常考)：\n编辑距离(72) > 打家劫舍(198) > 旋转数组搜索(33) > 重排链表(143) > 二叉树最大路径和(124) > LFU(460)\n\n趋势提醒：2026年纯八股占比从60%降到25%，场景题和AI工程化成为新分水岭。建议在刷算法的同时加强系统设计和场景题练习。', source_type: 'ai_search', source_url: 'https://www.xiaohongshu.com/discovery/item/6a3f3ad9000000000f0338a3', source_name: '小红书-果果姐聊AI', category: '面试算法', tags: '面经,刷题,优先级,必刷,2026趋势' },
  ];

  const seedAll = db.transaction(() => { for (const e of entries) insert.run(e); });
  seedAll();
}
