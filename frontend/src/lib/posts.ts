export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  image: string;
  featured: boolean;
  color: string;
  /** <title> text, under ~50 chars — the layout template appends " | RudraAI" */
  seoTitle: string;
  /** 150–160 characters, shown in search results */
  metaDescription: string;
  /** ISO dates for structured data and the sitemap */
  datePublished: string;
  dateModified: string;
  keywords: string[];
  imageAlt: string;
  /** Short "key takeaways" shown above the article */
  takeaways: string[];
  /** Rendered as a visible FAQ and as FAQPage structured data */
  faqs: { q: string; a: string }[];
  content: string; // HTML body
}

export const posts: BlogPost[] = [
  {
    slug: "rag-architecture-explained",
    category: "Architecture",
    title: "RAG Architecture, Explained: How to Build Retrieval-Augmented Generation That Actually Works",
    excerpt:
      "What RAG is, the two pipelines inside every RAG system, the design choices that decide answer quality — chunking, embeddings, hybrid search, reranking — and how to evaluate and run it in production.",
    readTime: "14 min read",
    date: "Oct 4, 2026",
    image: "/blog/rag-architecture-explained.png",
    featured: true,
    color: "#BF5AF2",
    seoTitle: "RAG Architecture Explained: A Practical Guide",
    metaDescription:
      "Learn how RAG architecture works: chunking, embeddings, vector databases, hybrid search, reranking, evaluation and production tips for accurate AI answers.",
    datePublished: "2026-10-04",
    dateModified: "2026-10-04",
    keywords: ["RAG architecture", "retrieval-augmented generation", "vector database", "embeddings", "hybrid search", "reranking", "RAG evaluation"],
    imageAlt: "RAG architecture diagram: chunks flow into retrieve, rerank and a cited answer",
    takeaways: [
      "RAG retrieves your own documents at question time and grounds the model's answer in them — no retraining needed.",
      "Most RAG failures are retrieval failures: fix chunking, use hybrid search and add a reranker before blaming the model.",
      "Enforce permissions and tenant isolation inside the retrieval query, never in the prompt.",
      "Measure retrieval and generation separately with a golden set of 50–200 real questions.",
    ],
    faqs: [
      { q: "What is RAG in simple terms?", a: "RAG (Retrieval-Augmented Generation) is a way of giving an AI model access to your own information. When a question comes in, the system searches your documents for the most relevant passages, adds them to the prompt, and the model writes an answer based on that text, usually with citations." },
      { q: "Is RAG better than fine-tuning?", a: "They solve different problems. RAG is best for knowledge — facts and documents that change and need citations. Fine-tuning is best for behaviour — tone, format or a narrow skill. Many production systems use RAG for knowledge and, optionally, light fine-tuning for style." },
      { q: "Which vector database should I use for RAG?", a: "If you already run PostgreSQL, start with pgvector: it keeps data, permissions and vectors together. Choose a dedicated vector database such as Qdrant, Pinecone, Weaviate or Milvus when you need very large scale, advanced filtering or isolation from your main database." },
      { q: "What chunk size is best for RAG?", a: "There is no universal number, but 300–800 tokens with 10–20% overlap is a solid baseline. Structure-aware chunks that follow headings and sections usually beat fixed sizes. Test a few settings against your golden question set and keep the one with the best recall." },
      { q: "How do I stop a RAG chatbot from hallucinating?", a: "Retrieve better context (hybrid search plus a reranker), instruct the model to answer only from the provided sources, require citations, allow it to say it doesn't know, and measure faithfulness on a golden set so regressions are caught before release." },
      { q: "How do I keep a RAG index up to date?", a: "Run ingestion as a sync service: detect changes with webhooks, change-data-capture or an updated_at column, re-embed only chunks whose content hash changed, upsert by stable IDs and delete chunks when their source document is removed." },
    ],
    content: `
<p>A large language model only knows what was in its training data. It has never seen your product catalogue, your refund policy, last week's pricing change or the PDF your operations team wrote in March. Ask it about any of those and it will either say it doesn't know or, worse, confidently make something up.</p>

<p><strong>Retrieval-Augmented Generation (RAG)</strong> fixes this without retraining the model. At question time, the system <em>retrieves</em> the few passages from your own data that are most relevant to the question, <em>augments</em> the prompt with them, and lets the model <em>generate</em> an answer grounded in that text — ideally with citations back to the source.</p>

<p>That one-sentence description hides a lot of engineering. Most RAG systems that disappoint in production don't fail because of the model; they fail because the wrong passages were retrieved. This guide walks through the full architecture, the decisions at each step, and how to know whether it's working.</p>

<h2>What is RAG? A one-paragraph definition</h2>
<p><strong>Retrieval-Augmented Generation is an AI architecture that answers questions by first searching a knowledge base for relevant passages and then passing those passages to a large language model as context.</strong> The model's answer is grounded in your data rather than in what it memorised during training, which makes answers more accurate, current and verifiable. The knowledge base is usually a vector database of document chunks, and the search usually combines semantic (vector) and keyword matching.</p>
<p>Typical RAG use cases include customer-support assistants over a help centre, internal knowledge assistants over policies and wikis, sales assistants over product documentation, and research tools over contracts, reports or papers.</p>

<h2>RAG vs fine-tuning vs a giant prompt</h2>
<p>There are three common ways to give a model knowledge it doesn't have. They solve different problems:</p>
<table>
  <thead><tr><th></th><th>RAG</th><th>Fine-tuning</th><th>Long-context prompt</th></tr></thead>
  <tbody>
    <tr><td>What it changes</td><td>What the model reads at answer time</td><td>The model's weights</td><td>What the model reads at answer time</td></tr>
    <tr><td>Best for</td><td>Facts, documents, data that changes</td><td>Style, format, a narrow skill</td><td>A small, fixed set of documents</td></tr>
    <tr><td>Freshness</td><td>Update the index in seconds</td><td>Retrain to update</td><td>Edit the prompt</td></tr>
    <tr><td>Citations</td><td>Natural — you know which chunks were used</td><td>Not possible</td><td>Possible but vague</td></tr>
    <tr><td>Cost per question</td><td>Low (only relevant chunks are sent)</td><td>Low</td><td>High (everything is sent, every time)</td></tr>
    <tr><td>Scales to</td><td>Millions of documents</td><td>—</td><td>What fits in the context window</td></tr>
  </tbody>
</table>
<p>The short version: <strong>use RAG for knowledge, fine-tuning for behaviour</strong>. If your whole knowledge base is a few pages, skip RAG and put it in the prompt. Once it's larger than that, or changes often, or needs per-user permissions, you want retrieval.</p>

<h2>The two pipelines inside every RAG system</h2>
<p>Every RAG system is really two pipelines that share a vector index. One runs ahead of time (or continuously) to prepare your data. The other runs on every question.</p>

<pre><code>INGESTION  (offline / on every data change)

  Sources ──► Load &amp; clean ──► Chunk ──► Embed ──► Store
  (docs, DB,     (text +        (split    (text →   (vector index
   tickets,       metadata)      into      vectors)   + metadata)
   web pages)                    passages)

QUERY  (on every question)

  Question ──► Rewrite ──► Retrieve ──► Rerank ──► Prompt ──► Generate ──► Answer
               (optional)  (vector +    (keep the  (question   (LLM)       + citations
                            keyword)     best 5–8)  + chunks)</code></pre>

<p>Let's go through each stage.</p>

<h2>1. Loading and cleaning</h2>
<p>Garbage in, garbage retrieved. Before anything is embedded, turn every source into clean text plus metadata:</p>
<ul>
  <li><strong>Extract text properly.</strong> PDFs, slides and scanned documents need real parsing (and OCR for scans). Tables are the usual casualty — convert them to Markdown or one row per line so they survive.</li>
  <li><strong>Strip the noise.</strong> Navigation menus, cookie banners, repeated headers and footers all pollute embeddings.</li>
  <li><strong>Keep metadata.</strong> Source URL, title, section heading, author, last-updated date, product, language and — critically — <em>who is allowed to see it</em>. You'll filter on these later.</li>
</ul>

<h2>2. Chunking</h2>
<p>You can't embed a 60-page manual as one vector — the meaning gets averaged into mush, and you couldn't fit it all in the prompt anyway. So documents are split into chunks. Chunking is the single most underrated decision in RAG.</p>
<ul>
  <li><strong>Fixed-size with overlap.</strong> Split every ~300–800 tokens with 10–20% overlap so sentences on a boundary aren't lost. Simple, and a fine baseline.</li>
  <li><strong>Structure-aware.</strong> Split on headings, sections, list items or FAQ entries so each chunk is one coherent idea. Almost always better than fixed-size for documentation.</li>
  <li><strong>Semantic chunking.</strong> Start a new chunk where the topic shifts, detected by embedding similarity between sentences. Useful for long, unstructured prose.</li>
  <li><strong>Parent–child (small-to-big).</strong> Embed small chunks for precise matching, but send the larger parent section to the model so it has the surrounding context.</li>
  <li><strong>Contextual chunk headers.</strong> Prepend the document title and section path to each chunk before embedding (e.g. "Returns policy › International orders › …"). A chunk that just says "this must be done within 14 days" is useless on its own; with a header it becomes findable.</li>
</ul>
<p><strong>Rule of thumb:</strong> a chunk should make sense if a person read it with no other context. If it doesn't, it won't make sense to the retriever either.</p>

<h2>3. Embeddings</h2>
<p>An embedding model turns text into a vector — a list of a few hundred to a few thousand numbers — such that texts with similar meaning end up close together. "How do I get my money back?" lands near "Refund policy" even though they share no words.</p>
<ul>
  <li><strong>Use the same model for documents and questions.</strong> Vectors from different models aren't comparable.</li>
  <li><strong>Pick for your language and domain.</strong> Check retrieval benchmarks (the MTEB leaderboard is the usual reference), then test on your own data — see the evaluation section below.</li>
  <li><strong>Changing models means re-embedding everything.</strong> Store the model name alongside each vector so migrations are deliberate.</li>
  <li><strong>Mind the dimensions.</strong> Bigger vectors can be slightly more accurate but cost more storage and search time. Many models let you truncate dimensions with little loss.</li>
</ul>

<h2>4. The vector store</h2>
<p>The vector store holds your chunks, their vectors and their metadata, and answers "which vectors are closest to this one?" quickly using an approximate nearest-neighbour index (HNSW is the most common).</p>
<p>Options range from dedicated vector databases (Qdrant, Pinecone, Weaviate, Milvus, Chroma) to adding vectors to the database you already run. If you're on PostgreSQL, <strong>pgvector</strong> keeps everything — data, metadata, permissions and vectors — in one place, which removes a whole class of sync bugs:</p>

<pre><code>create extension if not exists vector;

create table chunks (
  id          bigserial primary key,
  document_id text not null,
  content     text not null,
  metadata    jsonb not null default '{}',
  embedding   vector(1536) not null
);

create index on chunks using hnsw (embedding vector_cosine_ops);

-- top 20 chunks for a question, limited to one product
select id, content, 1 - (embedding &lt;=&gt; $1) as similarity
from chunks
where metadata-&gt;&gt;'product' = 'billing'
order by embedding &lt;=&gt; $1
limit 20;</code></pre>
<p>A dedicated vector database earns its place at very large scale, when you need advanced filtering and quantisation, or when search load would compete with your transactional database.</p>

<h3>Choosing a vector database</h3>
<table>
  <thead><tr><th>Option</th><th>Good fit when</th><th>Things to consider</th></tr></thead>
  <tbody>
    <tr><td>pgvector (PostgreSQL)</td><td>You already run Postgres; you want data, permissions and vectors in one place</td><td>Tune HNSW settings and memory as the index grows</td></tr>
    <tr><td>Qdrant</td><td>You want a fast open-source engine with strong payload filtering, self-hosted or managed</td><td>A second datastore to keep in sync</td></tr>
    <tr><td>Pinecone</td><td>You want a fully managed, serverless service with minimal operations</td><td>Hosted only; costs scale with usage</td></tr>
    <tr><td>Weaviate / Milvus</td><td>You need very large collections, built-in hybrid search or many tenants</td><td>More moving parts to operate if self-hosted</td></tr>
    <tr><td>Chroma</td><td>Prototypes, notebooks and local development</td><td>Plan your production store early</td></tr>
  </tbody>
</table>
<p>In practice, the quality of your chunks and retrieval strategy matters far more than which of these you pick.</p>

<h2>5. Retrieval: dense, sparse and hybrid</h2>
<p>Pure vector (dense) search is great at meaning but surprisingly bad at exact terms: product codes, error numbers, names, acronyms. Keyword (sparse) search such as BM25 is the opposite. So production systems usually run both and merge the results — <strong>hybrid search</strong>.</p>
<p>The standard way to merge is <strong>Reciprocal Rank Fusion (RRF)</strong>: each result scores <code>1 / (60 + rank)</code> in each list, and the scores are summed. It needs no tuning and works well.</p>
<p>Two other retrieval levers matter as much as the algorithm:</p>
<ul>
  <li><strong>Metadata filters.</strong> Restrict the search to the right product, language, date range — and to documents the current user is permitted to see. Permission filtering must happen <em>in the retrieval query</em>, never by asking the model to ignore things.</li>
  <li><strong>How many to fetch.</strong> Retrieve generously at this stage (20–50 candidates) and let the reranker narrow it down.</li>
</ul>

<h2>6. Reranking</h2>
<p>Embedding search compares a question vector with chunk vectors that were computed independently, which is fast but approximate. A <strong>reranker</strong> (a cross-encoder) reads the question and each candidate chunk <em>together</em> and scores how well the chunk actually answers it. It's slower, so you only run it on the shortlist.</p>
<p>Retrieve 30–50, rerank, keep the top 5–8. In our experience this is the single cheapest large improvement you can make to a RAG system that "sort of works".</p>

<h2>7. Building the prompt and generating</h2>
<p>Finally, the chosen chunks go into the prompt with clear instructions. A solid starting template:</p>

<pre><code>You answer questions using ONLY the sources below.

Rules:
- If the sources don't contain the answer, say you don't know.
- Cite the sources you used like [1], [2].
- Quote numbers, dates and prices exactly as written.

Sources:
[1] Returns policy › International orders
Items shipped outside the UK can be returned within 30 days ...

[2] Help centre › Refund timelines
Refunds are issued to the original payment method within 5–10 business days ...

Question: How long do I have to return an order shipped to Germany?</code></pre>
<p>Put the most relevant chunks first, keep instructions short and explicit, and always give the model permission to say "I don't know". A RAG system that admits ignorance is far more trustworthy than one that improvises.</p>

<h2>Advanced patterns worth knowing</h2>
<ul>
  <li><strong>Query rewriting.</strong> Users ask vague, conversational questions ("what about the other one?"). Have a fast model rewrite the question into a standalone search query using the chat history before retrieving.</li>
  <li><strong>Multi-query and HyDE.</strong> Generate several phrasings of the question — or a hypothetical answer — and search with each, then fuse the results. Helps when users and documents use different vocabulary.</li>
  <li><strong>Agentic RAG.</strong> Give the model retrieval as a <em>tool</em> instead of retrieving once up front. It can search, read, decide it needs more, and search again — essential for multi-step questions like "compare our 2025 and 2026 pricing for annual plans".</li>
  <li><strong>GraphRAG.</strong> Extract entities and relationships into a knowledge graph, so questions about connections ("which suppliers affect product X?") or whole-corpus themes can be answered, not just look-ups.</li>
  <li><strong>Multi-tenant RAG.</strong> When several customers or products share one system, every chunk carries a tenant ID and every query is filtered by it — or each tenant gets its own collection. Isolation is enforced by the retriever, never by the prompt.</li>
</ul>

<h2>Keeping the index fresh</h2>
<p>A RAG system is only as current as its index. Treat ingestion as a sync service, not a one-off script:</p>
<ul>
  <li><strong>Detect changes</strong> with webhooks, database change-data-capture, or polling an <code>updated_at</code> column.</li>
  <li><strong>Hash each chunk's content</strong> and only re-embed chunks whose hash changed — re-embedding everything on every change gets expensive fast.</li>
  <li><strong>Handle deletes.</strong> When a document is removed or unpublished, its chunks must go too, or the assistant will keep quoting it.</li>
  <li><strong>Upsert by stable IDs</strong> (document ID + chunk position) so updates replace rather than duplicate.</li>
</ul>

<h2>RAG over structured data: when to use SQL instead</h2>
<p>RAG is built for unstructured text. If the question is "how many orders shipped late last month?", embedding database rows and searching them is the wrong tool — the answer needs counting and filtering, not similarity. For structured data, let the model write a query instead (<strong>text-to-SQL</strong>) against a read-only database user and a documented schema, or expose specific, safe query tools. Many real assistants combine both: RAG for policies and documentation, SQL tools for numbers and records.</p>

<h2>A latency and cost budget</h2>
<p>Every stage adds time and money. Typical ranges (they vary by provider and scale):</p>
<table>
  <thead><tr><th>Stage</th><th>Typical latency</th><th>How to keep it down</th></tr></thead>
  <tbody>
    <tr><td>Query rewriting</td><td>200–500 ms</td><td>Use a small, fast model; skip it for first messages</td></tr>
    <tr><td>Embedding the question</td><td>50–150 ms</td><td>Cache embeddings for repeated questions</td></tr>
    <tr><td>Vector + keyword search</td><td>10–100 ms</td><td>Proper indexes, metadata filters, sensible top-k</td></tr>
    <tr><td>Reranking</td><td>100–400 ms</td><td>Rerank 30–50 candidates, not hundreds</td></tr>
    <tr><td>Generation</td><td>1–5 s</td><td>Stream the answer; send fewer, better chunks</td></tr>
  </tbody>
</table>
<p>Streaming the response hides most of this: users see the first words almost immediately. On cost, the biggest lever is sending fewer tokens of context — which is exactly what good retrieval and reranking give you.</p>

<h2>Security and privacy in RAG</h2>
<ul>
  <li><strong>Permission-aware retrieval.</strong> Store access rules as metadata and filter on them in every query, so a user can only ever retrieve what they could open themselves.</li>
  <li><strong>Prompt injection in documents.</strong> Retrieved text can contain instructions ("ignore previous rules…"). Treat it as data, keep system instructions separate, and never let retrieved text alone trigger actions.</li>
  <li><strong>Sensitive data.</strong> Decide what should never be indexed — passwords, personal data you don't need, secrets in old documents — and filter it at ingestion.</li>
  <li><strong>Data residency.</strong> Check where your embedding model, vector store and LLM process data if you have regulatory obligations.</li>
</ul>

<h2>How to evaluate a RAG system</h2>
<p>"It looks good when I try it" is not an evaluation. Build a <strong>golden set</strong> of 50–200 real questions, each with the correct answer and the document(s) that contain it. Then measure the two halves separately:</p>
<table>
  <thead><tr><th>Stage</th><th>Metric</th><th>Question it answers</th></tr></thead>
  <tbody>
    <tr><td>Retrieval</td><td>Recall@k / hit rate</td><td>Was the right chunk in the top k at all?</td></tr>
    <tr><td>Retrieval</td><td>MRR</td><td>How high up was it ranked?</td></tr>
    <tr><td>Retrieval</td><td>Context precision</td><td>How much of what we sent was actually relevant?</td></tr>
    <tr><td>Generation</td><td>Faithfulness</td><td>Is every claim in the answer supported by the retrieved text?</td></tr>
    <tr><td>Generation</td><td>Answer relevance</td><td>Does the answer address the question that was asked?</td></tr>
    <tr><td>End to end</td><td>Correctness</td><td>Does it match the reference answer?</td></tr>
  </tbody>
</table>
<p>Libraries such as Ragas and DeepEval compute the generation metrics using an LLM as the judge. Run the golden set on every change to chunking, embeddings, prompts or models, and you'll know immediately whether a change helped. We cover evals in depth in <a href="/blog/llm-models-benchmarks-evals">our guide to LLM benchmarks and evals</a>.</p>

<h2>Common failure modes, and what usually fixes them</h2>
<table>
  <thead><tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr></thead>
  <tbody>
    <tr><td>Can't find answers that are definitely in the docs</td><td>Poor chunking or parsing; exact terms missed</td><td>Structure-aware chunks, contextual headers, hybrid search</td></tr>
    <tr><td>Finds the right document, wrong part of it</td><td>Chunks too large or no reranker</td><td>Smaller chunks + parent–child, add a reranker</td></tr>
    <tr><td>Answers with outdated information</td><td>Stale index, deletes not synced</td><td>Change detection, content hashing, delete handling</td></tr>
    <tr><td>Confident answers not in the sources</td><td>Prompt allows guessing</td><td>Explicit "only from sources" rule, require citations, check faithfulness</td></tr>
    <tr><td>Fails on follow-up questions</td><td>Retrieval uses the raw follow-up text</td><td>Rewrite the query using chat history</td></tr>
    <tr><td>Shows one customer another's data</td><td>Permissions applied after retrieval (or not at all)</td><td>Filter by tenant/permissions inside the retrieval query</td></tr>
  </tbody>
</table>

<h2>A production checklist</h2>
<ul>
  <li>Clean parsing, with tables and headings preserved</li>
  <li>Structure-aware chunks with contextual headers</li>
  <li>Hybrid search plus a reranker</li>
  <li>Permission and tenant filters inside the retrieval query</li>
  <li>An incremental sync pipeline that handles updates and deletes</li>
  <li>Citations in every answer, and permission to say "I don't know"</li>
  <li>A golden set run on every change, and logging of real questions to grow it</li>
  <li>Latency and cost tracked per stage, not just end to end</li>
</ul>

<h2>RAG glossary</h2>
<ul>
  <li><strong>Chunk</strong> — a passage of a document, embedded and retrieved as one unit.</li>
  <li><strong>Embedding</strong> — a vector of numbers representing the meaning of a piece of text.</li>
  <li><strong>Vector database</strong> — a store that finds the vectors most similar to a query vector.</li>
  <li><strong>HNSW</strong> — the most common approximate nearest-neighbour index for fast vector search.</li>
  <li><strong>BM25</strong> — a classic keyword-ranking algorithm used for sparse search.</li>
  <li><strong>Hybrid search</strong> — combining vector and keyword search, typically with Reciprocal Rank Fusion.</li>
  <li><strong>Reranker</strong> — a cross-encoder model that rescores candidate chunks against the question.</li>
  <li><strong>Faithfulness</strong> — whether every claim in an answer is supported by the retrieved context.</li>
</ul>

<p>RAG is less about any one clever technique and more about getting a dozen ordinary decisions right. Get retrieval right and almost any modern model will give good answers; get it wrong and no model can save you.</p>

<p><strong>Keep reading:</strong> learn how to choose and test the model behind your RAG system in <a href="/blog/llm-models-benchmarks-evals">LLM Models, Benchmarks and Evals</a>, and how to expose your knowledge base to any AI app in <a href="/blog/mcp-vs-api-build-deploy-mcp-server">MCP vs API: build and deploy an MCP server</a>.</p>
    `.trim(),
  },
  {
    slug: "llm-models-benchmarks-evals",
    category: "Models",
    title: "LLM Models, Benchmarks and Evals: How to Choose a Model on Evidence, Not Leaderboards",
    excerpt:
      "How large language models differ, what the popular benchmarks really measure — and where they mislead — and how to build your own evals so you pick and change models with confidence.",
    readTime: "12 min read",
    date: "Oct 4, 2026",
    image: "/blog/llm-models-benchmarks-evals.png",
    featured: false,
    color: "#10B981",
    seoTitle: "LLM Benchmarks & Evals: How to Choose a Model",
    metaDescription:
      "A practical guide to LLM benchmarks and evals: what MMLU, GPQA and SWE-bench measure, where leaderboards mislead, and how to build evals for your own task.",
    datePublished: "2026-10-04",
    dateModified: "2026-10-04",
    keywords: ["LLM benchmarks", "LLM evals", "LLM evaluation", "choosing an LLM", "LLM-as-a-judge", "MMLU", "SWE-bench"],
    imageAlt: "Bar chart of illustrative eval pass rates for four models against a quality bar",
    takeaways: [
      "Benchmarks are useful for a shortlist; your own evals should make the final decision.",
      "Watch for contamination, saturation and different test harnesses when comparing leaderboard scores.",
      "A good eval set is 50–200 real examples with code-based checks first and an LLM judge for the rest.",
      "Pick the cheapest, fastest model that clears your quality bar — then route harder requests to bigger models.",
    ],
    faqs: [
      { q: "What is the difference between an LLM benchmark and an eval?", a: "A benchmark is a public, fixed test used to compare models on general skills such as knowledge, maths or coding. An eval is your own repeatable test of your system on your task, with your data and your definition of a good answer. Benchmarks shortlist models; evals choose between them." },
      { q: "Which LLM benchmark matters most?", a: "The one closest to your task. For agents, look at tool-use benchmarks such as τ-bench and BFCL; for coding, SWE-bench Verified and LiveCodeBench; for hard reasoning, GPQA Diamond and Humanity's Last Exam. No single benchmark predicts performance on your specific product." },
      { q: "What is LLM-as-a-judge?", a: "LLM-as-a-judge means using a language model to grade another model's output against a rubric, for qualities that simple code can't check, such as faithfulness or tone. It is fast and scalable but biased, so calibrate it against human labels before trusting it." },
      { q: "How many examples do I need for an LLM eval?", a: "Start with 50–200 realistic examples drawn from real usage, including edge cases and a few adversarial inputs. That is enough to catch most regressions. Grow the set every week by adding real failures from production." },
      { q: "How often should I re-evaluate my model choice?", a: "Re-run your evals whenever a prompt, model, tool or retrieval setting changes, and at least quarterly. New models ship frequently, and with an eval suite in place, testing a new one takes hours instead of weeks." },
      { q: "Are open-weight models good enough for production?", a: "Often, yes — especially for focused tasks such as classification, extraction or RAG over your own documents. They let you self-host and keep data in your infrastructure. Run the same eval against an open-weight and a frontier model and let the results decide." },
    ],
    content: `
<p>New models ship almost every month, each with a chart showing it beating the last one. If you're building anything on top of LLMs, you need a way to cut through that: which model is actually best <em>for your task</em>, at a price and speed you can live with — and how will you know if switching models breaks something?</p>

<p>This guide covers three things: how LLMs differ, what public benchmarks measure (and don't), and how to build your own <strong>evals</strong> — the tests that turn model choice from guesswork into engineering.</p>

<h2>Benchmarks vs evals: the short answer</h2>
<p><strong>An LLM benchmark is a standard public test used to compare models on general abilities; an LLM eval is your own repeatable test that measures how well your specific application performs on your specific task.</strong> Benchmarks answer "which models are strong in general?" Evals answer "which model, prompt and setup work best for us?" You need both: benchmarks to shortlist, evals to decide.</p>

<h2>What an LLM is, in four ideas</h2>
<ul>
  <li><strong>Tokens.</strong> Models read and write text as tokens — word pieces of roughly three-quarters of a word in English. Pricing, speed and limits are all measured in tokens.</li>
  <li><strong>Next-token prediction.</strong> A transformer network predicts the most likely next token, over and over. Everything else — answering, coding, reasoning — emerges from doing this extremely well.</li>
  <li><strong>Parameters.</strong> The learned weights of the network. More parameters generally means more capability and more cost, though training data and techniques matter as much as size.</li>
  <li><strong>Context window.</strong> How many tokens the model can consider at once — your instructions, documents, conversation and its own answer. Large windows are useful, but models don't use every part of a huge context equally well.</li>
</ul>
<p>Modern models are built in stages: <strong>pre-training</strong> on vast amounts of text, <strong>instruction tuning</strong> to follow requests, <strong>preference training</strong> (such as RLHF) to be helpful and safe, and increasingly <strong>reasoning training</strong> so the model can work through a problem step by step before answering.</p>

<h2>The model landscape</h2>
<p>Specific versions change constantly, so it's more useful to think in categories:</p>
<table>
  <thead><tr><th>Category</th><th>Examples (families)</th><th>Strengths</th><th>Trade-offs</th></tr></thead>
  <tbody>
    <tr><td>Frontier, closed</td><td>Anthropic Claude, OpenAI GPT, Google Gemini</td><td>Highest capability, strong tool use, managed APIs</td><td>Per-token cost, data leaves your infrastructure</td></tr>
    <tr><td>Open-weight</td><td>Meta Llama, Mistral, Qwen, DeepSeek, Google Gemma</td><td>Self-hostable, fine-tunable, data stays with you</td><td>You run the infrastructure; usually a step behind the frontier</td></tr>
    <tr><td>Reasoning / thinking modes</td><td>Extended-thinking variants of most frontier families</td><td>Maths, code, multi-step planning, hard analysis</td><td>Slower and more output tokens per answer</td></tr>
    <tr><td>Small and fast</td><td>The "mini", "flash" or "haiku" tier of each family</td><td>Low latency and cost; great for classification, extraction, routing</td><td>Weaker on complex reasoning</td></tr>
    <tr><td>Specialist</td><td>Embedding, reranking, speech, vision and code models</td><td>Best at one job (e.g. embeddings for RAG)</td><td>Not general-purpose</td></tr>
  </tbody>
</table>
<p>Always check the provider's documentation for the current model names, context limits and prices — anything written in a blog post (including this one) will date quickly.</p>

<h2>What actually differs between models</h2>
<ul>
  <li><strong>Quality on your task</strong> — the only quality measure that matters, and the one no leaderboard can give you.</li>
  <li><strong>Latency</strong> — time to first token (how fast it starts) and tokens per second (how fast it finishes). Critical for chat and voice.</li>
  <li><strong>Cost</strong> — priced per million input and output tokens; output is usually several times more expensive. Prompt caching and batch APIs can cut costs substantially.</li>
  <li><strong>Context window</strong> — and how well the model actually uses information buried in the middle of a long input.</li>
  <li><strong>Tool use and structured output</strong> — how reliably it calls functions with correct arguments and returns valid JSON. Make-or-break for agents.</li>
  <li><strong>Multimodality</strong> — images, PDFs, audio, video in; images or speech out.</li>
  <li><strong>Deployment and data</strong> — available regions, data-retention terms, self-hosting options and licence.</li>
</ul>

<h2>Estimating cost: a worked example</h2>
<p>Model prices are quoted per million tokens, with input and output priced separately. Here's how to estimate a monthly bill, using <em>illustrative</em> prices of $3 per million input tokens and $15 per million output tokens:</p>
<table>
  <thead><tr><th>Item</th><th>Calculation</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td>Conversations per month</td><td>—</td><td>10,000</td></tr>
    <tr><td>Input tokens</td><td>10,000 × 2,000 tokens (instructions, context, history)</td><td>20M → $60</td></tr>
    <tr><td>Output tokens</td><td>10,000 × 300 tokens</td><td>3M → $45</td></tr>
    <tr><td><strong>Total</strong></td><td></td><td><strong>≈ $105 / month</strong></td></tr>
  </tbody>
</table>
<p>Two things usually dominate: how much context you send on every call (trim it, cache it) and whether you use a large model for requests a small one could handle (route them). Reasoning modes also generate many extra "thinking" tokens, so measure their real cost per task before turning them on everywhere.</p>

<h2>Benchmarks: what they measure</h2>
<p>A benchmark is a fixed public test set with a scoring method. These are the ones you'll see most often on model launch charts:</p>
<table>
  <thead><tr><th>Benchmark</th><th>What it measures</th><th>Watch out for</th></tr></thead>
  <tbody>
    <tr><td>MMLU / MMLU-Pro</td><td>Broad knowledge across ~57 subjects, multiple choice (Pro: harder, 10 options)</td><td>Original MMLU is saturated — top models all score similarly</td></tr>
    <tr><td>GPQA Diamond</td><td>Graduate-level science questions designed to be "Google-proof"</td><td>Small set (~200 questions), so scores are noisy</td></tr>
    <tr><td>Humanity's Last Exam</td><td>Very hard expert questions across many fields</td><td>Measures the frontier, says little about everyday tasks</td></tr>
    <tr><td>AIME, MATH</td><td>Competition and school-level mathematics</td><td>Tests reasoning in maths specifically</td></tr>
    <tr><td>HumanEval</td><td>Writing short Python functions from a docstring</td><td>Saturated and widely leaked into training data</td></tr>
    <tr><td>SWE-bench Verified</td><td>Fixing real GitHub issues in real repositories</td><td>Scores depend heavily on the agent scaffold around the model</td></tr>
    <tr><td>LiveCodeBench</td><td>Fresh coding problems collected after model training cut-offs</td><td>Designed to resist contamination — a good sign</td></tr>
    <tr><td>τ-bench, BFCL</td><td>Tool and function calling; multi-turn agent tasks with simulated users</td><td>Closest public proxy for agent reliability</td></tr>
    <tr><td>ARC-AGI</td><td>Abstract pattern puzzles that are easy for people, hard for models</td><td>Measures novel reasoning, not knowledge</td></tr>
    <tr><td>LMArena (Chatbot Arena)</td><td>Human preference in blind side-by-side chats, ranked by Elo</td><td>Rewards style and length as well as correctness</td></tr>
    <tr><td>RULER, needle-in-a-haystack</td><td>Finding and using information in long contexts</td><td>Simple "needle" tests overstate real long-document ability</td></tr>
  </tbody>
</table>

<h2>How to read a leaderboard without being misled</h2>
<ul>
  <li><strong>Contamination.</strong> If test questions leaked into training data, the model is remembering, not reasoning. Prefer benchmarks with fresh or private questions.</li>
  <li><strong>Saturation.</strong> When every top model scores 90%+, the differences are noise.</li>
  <li><strong>Different harnesses.</strong> Prompts, number of attempts, "thinking" budgets and agent scaffolds vary between reports. A vendor's number and an independent lab's number for the same model often differ.</li>
  <li><strong>pass@1 vs pass@k.</strong> "Solved in one try" and "solved in any of five tries" are very different claims.</li>
  <li><strong>Missing columns.</strong> Leaderboards rarely show cost and latency — and a model that is 2% better but 5× the price is often the wrong choice.</li>
  <li><strong>Goodhart's law.</strong> Once a benchmark becomes a target, models get optimised for it, and it stops measuring what it was designed to measure.</li>
</ul>
<p>Use benchmarks to build a <strong>shortlist</strong>. Use your own evals to make the <strong>decision</strong>.</p>

<h2>Evals: your own benchmark</h2>
<p>An eval is a repeatable test of your system on your task: a set of inputs, the expected behaviour, and a way of scoring the output automatically. Benchmarks tell you how a model does on someone else's exam; evals tell you how your product does on yours.</p>

<h3>Step 1 — Define what "good" means</h3>
<p>Write it down in checkable terms. "Helpful answers" isn't checkable. "Answers the question, cites a source, under 120 words, never invents an order number, escalates refund requests over £500" is.</p>

<h3>Step 2 — Build a golden dataset</h3>
<p>Collect 50–200 realistic examples: real user messages (anonymised) are best. Include the easy common cases, the awkward edge cases, the ambiguous ones, and a few adversarial ones (prompt injection, off-topic requests, missing information). Each example gets an expected answer or a description of what a good answer must contain.</p>

<h3>Step 3 — Choose graders</h3>
<table>
  <thead><tr><th>Grader</th><th>Use it for</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Code-based</td><td>Anything objectively checkable — fast, cheap, deterministic</td><td>Valid JSON, matches schema, contains the order ID, under N words, correct label</td></tr>
    <tr><td>LLM-as-judge</td><td>Qualities that need judgement</td><td>"Is every claim supported by the sources?" "Is the tone appropriate?"</td></tr>
    <tr><td>Human review</td><td>Calibrating the judge, high-stakes outputs, spot checks</td><td>A weekly review of 30 sampled conversations</td></tr>
  </tbody>
</table>
<p>LLM judges are powerful but biased: they favour longer answers, the first option in a pair, and sometimes their own model family. Mitigate this by giving the judge a specific rubric, asking for a short justification before a pass/fail verdict, swapping answer order in pairwise comparisons, and checking the judge's verdicts against human labels on a sample before trusting it.</p>

<h3>Step 4 — Run, compare, decide</h3>
<p>Run every candidate model (or prompt, or retrieval setting) over the same dataset and record quality, cost and latency side by side. Here is the core of an eval harness — wire <code>complete()</code> to whichever provider SDK you use:</p>

<pre><code>import json, time

def complete(model: str, prompt: str) -&gt; str:
    """Call your LLM provider here and return the text response."""
    raise NotImplementedError

JUDGE_PROMPT = """You are grading a customer-support answer.
Question: {question}
Reference answer: {reference}
Candidate answer: {answer}

Does the candidate answer agree with the reference on every fact,
without adding unsupported claims? Explain in one sentence, then
finish with exactly PASS or FAIL on its own line."""

def run_eval(model: str, dataset_path: str, judge_model: str) -&gt; dict:
    # one JSON object per line: {"question": ..., "reference": ..., "must_include": ...}
    cases = [json.loads(line) for line in open(dataset_path)]
    passed, latencies = 0, []
    for case in cases:
        start = time.perf_counter()
        answer = complete(model, case["question"])
        latencies.append(time.perf_counter() - start)

        # cheap deterministic checks first
        if case.get("must_include") and case["must_include"] not in answer:
            continue
        verdict = complete(judge_model, JUDGE_PROMPT.format(
            question=case["question"], reference=case["reference"], answer=answer))
        if verdict.strip().splitlines()[-1].strip() == "PASS":
            passed += 1
    latencies.sort()
    return {
        "model": model,
        "pass_rate": passed / len(cases),
        "p50_latency_s": latencies[len(latencies) // 2],
    }</code></pre>

<h3>Step 5 — Make it a regression test</h3>
<p>Run the eval in CI whenever a prompt, model, retrieval setting or tool definition changes, and fail the build if the pass rate drops below your bar. This is what lets you upgrade to next month's model in an afternoon instead of hoping for the best.</p>

<h3>Step 6 — Keep evaluating in production</h3>
<p>Offline evals catch regressions; production tells you what you didn't think to test. Log inputs and outputs (respecting privacy), sample a slice for automatic and human grading, collect thumbs-up/down feedback, and add every real failure to the golden dataset. The dataset should grow every week.</p>

<h2>Measuring hallucinations</h2>
<p>A hallucination is a confident statement that isn't supported by the facts. You can't eliminate them entirely, but you can measure and reduce them:</p>
<ul>
  <li><strong>Grounded tasks</strong> (RAG, summarisation): score <em>faithfulness</em> — the share of claims in the answer supported by the provided sources — with an LLM judge, and spot-check by hand.</li>
  <li><strong>Factual tasks</strong>: compare against reference answers and track the rate of unsupported or wrong facts.</li>
  <li><strong>Refusal behaviour</strong>: include questions that <em>can't</em> be answered from the data and check the system says so instead of inventing an answer.</li>
  <li><strong>Reduce it</strong> with better context, explicit "only from sources" instructions, citations, lower temperature for factual tasks, and structured outputs that leave less room for improvisation.</li>
</ul>

<h2>Evals for RAG and agents</h2>
<ul>
  <li><strong>RAG systems:</strong> evaluate retrieval (did we fetch the right chunks? recall@k, MRR) separately from generation (faithfulness, answer relevance). See <a href="/blog/rag-architecture-explained">our RAG architecture guide</a>.</li>
  <li><strong>Agents:</strong> score task completion, whether the right tools were chosen with the right arguments, number of steps, recovery from tool errors, and cost per completed task. Check the final state (was the ticket actually created?) rather than just the final message.</li>
  <li><strong>Safety:</strong> test prompt injection hidden in documents or emails, attempts to extract other users' data, and requests the system should refuse.</li>
</ul>

<h2>Tools that help</h2>
<p>You can start with a script like the one above and a spreadsheet. When you outgrow that, open-source and hosted tools such as <strong>promptfoo</strong>, <strong>DeepEval</strong>, <strong>Ragas</strong>, <strong>OpenAI Evals</strong>, <strong>Langfuse</strong>, <strong>LangSmith</strong>, <strong>Braintrust</strong> and <strong>Arize Phoenix</strong> add dataset management, judges, tracing and dashboards. The tool matters far less than having a golden set and running it consistently.</p>

<h2>Prompting, RAG or fine-tuning?</h2>
<p>Before switching models, check whether the problem is the model at all:</p>
<table>
  <thead><tr><th>Problem</th><th>Try first</th><th>Why</th></tr></thead>
  <tbody>
    <tr><td>Wrong format, tone or structure</td><td>Better prompt, examples, structured output</td><td>Cheapest and fastest to iterate</td></tr>
    <tr><td>Doesn't know your facts or documents</td><td>RAG</td><td>Adds knowledge without retraining; supports citations</td></tr>
    <tr><td>Can't use your systems</td><td>Tools / MCP</td><td>Gives the model live data and actions</td></tr>
    <tr><td>Consistent narrow skill at high volume</td><td>Fine-tuning a smaller model</td><td>Can match a larger model on one task at lower cost</td></tr>
    <tr><td>Genuinely hard reasoning</td><td>A stronger or reasoning model</td><td>Some tasks need more capability</td></tr>
  </tbody>
</table>

<h2>A practical model-selection recipe</h2>
<ol>
  <li><strong>Shortlist</strong> three models from benchmarks relevant to your task — say, one frontier, one fast/cheap, one open-weight.</li>
  <li><strong>Run your eval</strong> on all three with the same prompt.</li>
  <li><strong>Pick the cheapest, fastest model that clears your quality bar</strong> — not the one at the top of the leaderboard.</li>
  <li><strong>Route where it pays.</strong> Send simple requests to a small model and escalate hard ones to a larger or reasoning model. Many teams cut costs dramatically this way with no loss in quality.</li>
  <li><strong>Re-run quarterly</strong>, or whenever a new model ships. With evals in place, switching is an afternoon's work.</li>
</ol>

<h2>LLM glossary</h2>
<ul>
  <li><strong>Token</strong> — the unit models read and write; roughly ¾ of an English word.</li>
  <li><strong>Context window</strong> — the maximum tokens a model can consider in one request.</li>
  <li><strong>Temperature</strong> — how random the output is; lower for factual tasks, higher for creative ones.</li>
  <li><strong>System prompt</strong> — standing instructions that shape the model's behaviour for a conversation.</li>
  <li><strong>Time to first token (TTFT)</strong> — how long before the response starts streaming.</li>
  <li><strong>pass@k</strong> — the share of problems solved in at least one of k attempts.</li>
  <li><strong>Contamination</strong> — test data leaking into training data, inflating benchmark scores.</li>
  <li><strong>Golden dataset</strong> — your curated set of inputs and expected outputs used for evals.</li>
</ul>

<p>Leaderboards tell you who is good at exams. Evals tell you who is good at your job. Only one of those is worth paying for.</p>

<p><strong>Keep reading:</strong> see how evals fit into a retrieval system in <a href="/blog/rag-architecture-explained">RAG Architecture, Explained</a>, and how to give your model safe access to tools in <a href="/blog/mcp-vs-api-build-deploy-mcp-server">MCP vs API: build and deploy an MCP server</a>.</p>
    `.trim(),
  },
  {
    slug: "mcp-vs-api-build-deploy-mcp-server",
    category: "Protocols",
    title: "MCP vs API: What the Model Context Protocol Is, Its Types, and How to Build and Deploy an MCP Server",
    excerpt:
      "MCP is the standard way for AI apps to use tools and data. How it differs from a normal API, its building blocks and server types, and a step-by-step guide to building an MCP server in Python and deploying it.",
    readTime: "14 min read",
    date: "Oct 4, 2026",
    image: "/blog/mcp-vs-api-build-deploy-mcp-server.png",
    featured: false,
    color: "#A78BFA",
    seoTitle: "MCP vs API: Build & Deploy an MCP Server",
    metaDescription:
      "What is MCP (Model Context Protocol) and how is it different from an API? Learn the MCP server types, then build and deploy an MCP server in Python.",
    datePublished: "2026-10-04",
    dateModified: "2026-10-04",
    keywords: ["MCP vs API", "Model Context Protocol", "MCP server", "build an MCP server", "deploy MCP server", "FastMCP", "Streamable HTTP"],
    imageAlt: "Diagram of an AI host app connected to three MCP servers: Orders, CRM and Files",
    takeaways: [
      "MCP is an open standard that lets any AI app discover and use your tools and data — build a server once, use it everywhere.",
      "MCP doesn't replace APIs: most MCP servers are a thin, model-friendly layer on top of an existing API.",
      "Use stdio for local servers and Streamable HTTP for remote, shared servers.",
      "Treat a remote MCP server like any public API: HTTPS, authentication, least privilege and logging.",
    ],
    faqs: [
      { q: "What is MCP in simple terms?", a: "MCP (Model Context Protocol) is an open standard that defines how AI applications connect to tools and data. An MCP server describes what it can do — tools, resources and prompts — and any MCP-compatible AI app can discover and use them without custom integration code." },
      { q: "Is MCP a replacement for REST APIs?", a: "No. MCP sits on top of APIs. A REST API is designed for developers writing code; an MCP server wraps that API in a self-describing interface designed for AI models, so the model can decide at runtime which action to take." },
      { q: "What is the difference between MCP and function calling?", a: "Function calling is a feature of a model API: you send tool definitions with each request. MCP standardises where those tools come from — servers that any host can connect to and discover. Under the hood, hosts usually present MCP tools to the model through function calling." },
      { q: "Which language should I use to build an MCP server?", a: "Use the language of the system you're wrapping. Official SDKs exist for Python and TypeScript, among others. Python's FastMCP is the quickest way to start: decorators turn ordinary functions into tools, resources and prompts." },
      { q: "Where can I deploy a remote MCP server?", a: "Anywhere that runs a container behind HTTPS — Google Cloud Run, AWS App Runner or ECS, Azure Container Apps, Render, Railway or Fly.io — or Cloudflare Workers. Use the Streamable HTTP transport and add authentication before exposing it." },
      { q: "Is MCP secure?", a: "MCP is as secure as the server you build. Use HTTPS, authenticate every request (OAuth 2.1 for public multi-user servers), grant least-privilege credentials, require confirmation for destructive actions, validate inputs and treat tool output as untrusted because of prompt injection." },
    ],
    content: `
<p>An AI assistant becomes genuinely useful when it can <em>do</em> things — look up an order, query a database, create a ticket, read a file. For a long time, every AI app wired up every tool in its own custom way. Ten AI apps and fifty tools meant hundreds of one-off integrations, each built and maintained separately.</p>

<p>The <strong>Model Context Protocol (MCP)</strong> fixes that. Introduced by Anthropic as an open standard in November 2024, it defines one common way for AI applications to discover and use tools and data. Build an MCP server for your system once, and any MCP-compatible app — Claude, Cursor, VS Code, and a growing list of others — can use it. It's often described as "USB-C for AI": one standard plug instead of a drawer full of adapters.</p>

<h2>MCP vs API: what's actually different?</h2>
<p>The first thing to understand is that <strong>MCP doesn't replace APIs</strong>. Most MCP servers are thin layers on top of existing APIs. The difference is who the interface is designed for.</p>
<p>A REST API is designed for <em>developers</em>: someone reads the documentation, writes code to call specific endpoints, and ships it. MCP is designed for <em>AI models</em>: the AI app connects to a server, asks it what it can do, gets back a list of tools with plain-language descriptions and input schemas, and the model decides at runtime which to call.</p>
<table>
  <thead><tr><th></th><th>Traditional API (REST / GraphQL)</th><th>MCP</th></tr></thead>
  <tbody>
    <tr><td>Designed for</td><td>Developers writing integration code</td><td>AI models choosing tools at runtime</td></tr>
    <tr><td>Discovery</td><td>Humans read docs</td><td>The client asks the server (<code>tools/list</code>) and gets names, descriptions and JSON schemas</td></tr>
    <tr><td>Interface</td><td>Different for every vendor — endpoints, auth, pagination, errors</td><td>The same small set of JSON-RPC methods for every server</td></tr>
    <tr><td>Integration cost</td><td>Custom code per app × per API</td><td>Build a server once; it works in any MCP host</td></tr>
    <tr><td>Connection</td><td>Usually stateless request/response</td><td>A session that starts with capability negotiation</td></tr>
    <tr><td>Direction</td><td>Client calls server</td><td>Two-way: servers can request model completions, ask the user for input and send notifications</td></tr>
    <tr><td>Context</td><td>Returns raw data</td><td>Also exposes readable resources and reusable prompt templates for the model</td></tr>
  </tbody>
</table>
<p><strong>When to use which:</strong> if you're writing ordinary software where the developer decides exactly which call to make, use the API directly — it's simpler and faster. If you want an AI model to be able to use your system, especially across several AI apps, wrap the API in an MCP server.</p>

<h3>MCP vs function calling vs custom plugins</h3>
<table>
  <thead><tr><th></th><th>Function calling</th><th>Custom plugin / integration</th><th>MCP</th></tr></thead>
  <tbody>
    <tr><td>What it is</td><td>A model API feature: you pass tool definitions with each request</td><td>Code written for one specific AI app</td><td>An open protocol for serving tools and data to any AI app</td></tr>
    <tr><td>Where tools live</td><td>In your application code</td><td>Inside one product's ecosystem</td><td>In separate, reusable servers</td></tr>
    <tr><td>Reuse across apps</td><td>No — rebuilt per app</td><td>No</td><td>Yes — any MCP host</td></tr>
    <tr><td>Best for</td><td>One app calling a few of its own functions</td><td>Deep integration with a single platform</td><td>Tools you want available across many AI apps and agents</td></tr>
  </tbody>
</table>
<p>They aren't rivals: an MCP host typically takes the tools it discovers from MCP servers and presents them to the model <em>through</em> function calling.</p>

<h3>When not to use MCP</h3>
<ul>
  <li>A fixed, deterministic pipeline with no model decisions — call the API directly.</li>
  <li>A single app with two or three internal functions — plain function calling is simpler.</li>
  <li>Hard real-time or very high-throughput paths where an extra protocol hop matters.</li>
</ul>

<h2>How MCP works</h2>
<p>MCP has three roles:</p>
<ul>
  <li><strong>Host</strong> — the AI application the user interacts with (Claude Desktop, Claude Code, an IDE, your own agent).</li>
  <li><strong>Client</strong> — a connector inside the host. The host creates one client per server it connects to.</li>
  <li><strong>Server</strong> — a program that exposes tools, resources and prompts for one system (your CRM, your database, GitHub, the file system).</li>
</ul>

<pre><code>Host (e.g. Claude Desktop)
│
├── LLM
├── MCP client A ──►  MCP server: Orders ──►  Orders API
├── MCP client B ──►  MCP server: CRM    ──►  CRM API
└── MCP client C ──►  MCP server: Files  ──►  Local disk</code></pre>

<p>Messages are <strong>JSON-RPC 2.0</strong>. A session goes through a simple lifecycle: the client sends <code>initialize</code>, both sides declare which capabilities they support, and then the client can list and call what the server offers. When the model decides to use a tool, the client sends a request like this:</p>

<pre><code>{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "tools/call",
  "params": {
    "name": "get_order_status",
    "arguments": { "order_id": "A1001" }
  }
}</code></pre>
<p>…and the server replies with content the model can read:</p>
<pre><code>{
  "jsonrpc": "2.0",
  "id": 7,
  "result": {
    "content": [
      { "type": "text", "text": "Order A1001: shipped, estimated delivery 2026-10-08." }
    ],
    "isError": false
  }
}</code></pre>

<h2>MCP specification versions</h2>
<p>The protocol is versioned by date, and client and server agree on a version during initialisation. The key milestones so far:</p>
<table>
  <thead><tr><th>Revision</th><th>Notable changes</th></tr></thead>
  <tbody>
    <tr><td>2024-11-05</td><td>Initial public release: tools, resources, prompts, sampling; stdio and HTTP+SSE transports</td></tr>
    <tr><td>2025-03-26</td><td>Streamable HTTP transport replaces HTTP+SSE; OAuth 2.1-based authorisation; tool annotations</td></tr>
    <tr><td>2025-06-18</td><td>Structured tool output, elicitation, resource links in tool results, stricter authorisation guidance</td></tr>
  </tbody>
</table>
<p>Check <a href="https://modelcontextprotocol.io">modelcontextprotocol.io</a> for the current revision before you build — the official SDKs track it for you.</p>

<h2>The building blocks</h2>
<p>Servers can offer three kinds of things, each controlled by a different party:</p>
<table>
  <thead><tr><th>Primitive</th><th>Controlled by</th><th>What it is</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><strong>Tools</strong></td><td>The model</td><td>Functions the model can call to take actions or fetch live data</td><td><code>create_ticket</code>, <code>search_orders</code>, <code>run_query</code></td></tr>
    <tr><td><strong>Resources</strong></td><td>The application</td><td>Read-only data identified by a URI, which the app can attach as context</td><td><code>policy://returns</code>, a file, a database schema</td></tr>
    <tr><td><strong>Prompts</strong></td><td>The user</td><td>Reusable templates the user can pick, often surfaced as slash commands</td><td>"Draft a reply to this customer", "Summarise this PR"</td></tr>
  </tbody>
</table>
<p>Clients can also offer capabilities back to servers: <strong>sampling</strong> (the server asks the host's model to generate text, so the server doesn't need its own LLM key), <strong>roots</strong> (which folders or locations the server may work in) and <strong>elicitation</strong> (the server asks the user for missing information mid-task).</p>

<h2>Types of MCP servers</h2>
<p>"Types of MCP" usually means one of four ways of classifying servers:</p>

<h3>1. By transport — how client and server talk</h3>
<ul>
  <li><strong>stdio (local).</strong> The host launches the server as a child process on the same machine and talks over standard input/output. Zero network setup, ideal for personal and developer tools — file system, local databases, Git.</li>
  <li><strong>Streamable HTTP (remote).</strong> The server runs as a web service at a URL (usually ending in <code>/mcp</code>). Clients send JSON-RPC over HTTP POST and the server can stream responses. This is what you deploy for teams and customers.</li>
  <li><strong>HTTP + SSE (legacy).</strong> The original remote transport, replaced by Streamable HTTP in the March 2025 spec revision. You'll still meet it in older servers; don't build new ones on it.</li>
</ul>

<h3>2. By where it runs</h3>
<ul>
  <li><strong>Local servers</strong> on the user's machine, with access to local files and apps.</li>
  <li><strong>Self-hosted remote servers</strong> that you deploy for your team or customers — for example, an MCP server in front of your internal order system.</li>
  <li><strong>Vendor-hosted servers</strong> that SaaS companies run for their own products, such as the official GitHub MCP server. You connect with a URL and sign in.</li>
</ul>

<h3>3. By what it exposes</h3>
<ul>
  <li><strong>Action servers</strong> — mostly tools that change things (create, update, send).</li>
  <li><strong>Data/context servers</strong> — mostly resources and read-only tools (search docs, query analytics).</li>
  <li><strong>Workflow servers</strong> — mostly prompts that package a repeatable process.</li>
  <li>In practice, most useful servers mix all three.</li>
</ul>

<h3>4. By access level</h3>
<ul>
  <li><strong>Read-only</strong> servers are safe to connect broadly.</li>
  <li><strong>Read-write</strong> servers need tighter permissions, confirmation before destructive actions, and careful auditing.</li>
</ul>

<h2>How to build an MCP server (Python)</h2>
<p>We'll build a small "orders" server with one tool, one resource and one prompt, using the official Python SDK and its <strong>FastMCP</strong> interface. You'll need Python 3.10+ and <a href="https://docs.astral.sh/uv/">uv</a>.</p>

<h3>Step 1 — Set up the project</h3>
<pre><code>uv init orders-mcp
cd orders-mcp
uv add "mcp[cli]"</code></pre>

<h3>Step 2 — Write the server</h3>
<p>Create <code>server.py</code>. In a real server, the dictionary would be a call to your database or API:</p>
<pre><code>import os
from mcp.server.fastmcp import FastMCP

mcp = FastMCP(
    "orders",
    host=os.environ.get("HOST", "127.0.0.1"),
    port=int(os.environ.get("PORT", "8000")),
    stateless_http=True,  # lets you run several replicas behind a load balancer
)

# Stand-in for your real order system
ORDERS = {
    "A1001": {"status": "shipped", "eta": "2026-10-08"},
    "A1002": {"status": "processing", "eta": "2026-10-11"},
}


@mcp.tool()
def get_order_status(order_id: str) -&gt; str:
    """Look up the shipping status and estimated delivery date of an order.

    Args:
        order_id: The order reference, e.g. "A1001".
    """
    order = ORDERS.get(order_id.strip().upper())
    if order is None:
        return f"No order found with ID {order_id}. Ask the customer to check the reference."
    return f"Order {order_id}: {order['status']}, estimated delivery {order['eta']}."


@mcp.resource("policy://returns")
def returns_policy() -&gt; str:
    """The store's returns policy."""
    return "Items can be returned within 30 days of delivery in original condition. Refunds take 5-10 business days."


@mcp.prompt()
def customer_reply(order_id: str) -&gt; str:
    """Draft a reply to a customer asking about their order."""
    return (
        f"Use get_order_status to check order {order_id}, then write a short, "
        "friendly reply to the customer. Mention the returns policy only if relevant."
    )


if __name__ == "__main__":
    # stdio for local use; "streamable-http" when deployed
    mcp.run(transport=os.environ.get("MCP_TRANSPORT", "stdio"))</code></pre>
<p>Notice what FastMCP does for you: the function name becomes the tool name, the docstring becomes the description the model reads, and the type hints become the JSON input schema. <strong>That docstring is effectively a prompt</strong> — it's how the model decides when to use the tool, so write it for the model.</p>

<h3>Step 3 — Test it with the MCP Inspector</h3>
<pre><code>uv run mcp dev server.py</code></pre>
<p>This opens the <strong>MCP Inspector</strong> in your browser, where you can list the tools, resources and prompts, call them with test inputs and see the raw responses — before any AI is involved.</p>

<h3>Step 4 — Connect it to an AI app</h3>
<p>For <strong>Claude Desktop</strong>, add the server to <code>claude_desktop_config.json</code> (Settings → Developer → Edit Config) and restart the app:</p>
<pre><code>{
  "mcpServers": {
    "orders": {
      "command": "uv",
      "args": ["--directory", "/absolute/path/to/orders-mcp", "run", "server.py"]
    }
  }
}</code></pre>
<p>For <strong>Claude Code</strong>, one command does it:</p>
<pre><code>claude mcp add orders -- uv --directory /absolute/path/to/orders-mcp run server.py</code></pre>
<p>Now ask "Where is order A1001?" and watch the model call your tool.</p>

<h3>The same server in TypeScript</h3>
<p>If your stack is Node.js, the official TypeScript SDK follows the same shape:</p>
<pre><code>import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "orders", version: "1.0.0" });

server.registerTool(
  "get_order_status",
  {
    title: "Get order status",
    description: "Look up the shipping status of an order by its ID, e.g. A1001.",
    inputSchema: { orderId: z.string() },
  },
  async ({ orderId }) =&gt; ({
    content: [{ type: "text", text: "Order " + orderId + ": shipped." }],
  })
);

await server.connect(new StdioServerTransport());</code></pre>

<h2>Designing tools that models use well</h2>
<ul>
  <li><strong>Few, focused tools.</strong> Ten clear tools beat fifty overlapping ones. Model accuracy drops as the tool list grows and descriptions blur together.</li>
  <li><strong>Name and describe for the model.</strong> Say what the tool does, when to use it, and what the inputs look like, with an example.</li>
  <li><strong>Design around tasks, not endpoints.</strong> One <code>find_customer</code> tool that searches by email, phone or name is better than mirroring three API endpoints.</li>
  <li><strong>Return concise, readable results.</strong> Trim huge API payloads to the fields that matter; paginate long lists.</li>
  <li><strong>Return errors as helpful text</strong> ("No order found — ask the customer to check the reference") so the model can recover, rather than crashing the call.</li>
  <li><strong>Validate every input</strong> on the server. The model is not a trusted caller.</li>
</ul>

<h2>How to deploy an MCP server</h2>
<p>Local stdio servers are great for one person. To share a server with a team or customers, deploy it as a remote <strong>Streamable HTTP</strong> server.</p>

<h3>Step 1 — Containerise it</h3>
<pre><code>FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
COPY server.py .

ENV MCP_TRANSPORT=streamable-http HOST=0.0.0.0 PORT=8000
EXPOSE 8000
CMD ["uv", "run", "server.py"]</code></pre>
<p>Run it locally with <code>docker build -t orders-mcp . &amp;&amp; docker run -p 8000:8000 orders-mcp</code>; the MCP endpoint is now at <code>http://localhost:8000/mcp</code>.</p>

<h3>Step 2 — Host it</h3>
<p>Any platform that runs a container behind HTTPS works: Google Cloud Run, AWS (App Runner or ECS), Azure Container Apps, Render, Railway or Fly.io. Cloudflare Workers is another option, with its own tooling for remote MCP servers. Because we set <code>stateless_http=True</code>, you can scale to several instances behind a load balancer without sticky sessions.</p>

<h3>Step 3 — Add authentication</h3>
<p>A remote MCP server is an API on the public internet that can take actions in your systems — treat it accordingly:</p>
<ul>
  <li><strong>Internal or team use:</strong> put it behind your API gateway, VPN or identity-aware proxy, or require a bearer token checked on every request.</li>
  <li><strong>Public, multi-user servers:</strong> the MCP specification defines an <strong>OAuth 2.1</strong>-based authorisation flow, so each user signs in and the server acts with <em>their</em> permissions. The official SDKs include support for it.</li>
</ul>

<h3>Step 4 — Connect clients to the URL</h3>
<pre><code>claude mcp add --transport http orders https://orders-mcp.example.com/mcp --header "Authorization: Bearer $ORDERS_MCP_TOKEN"</code></pre>
<p>Most MCP hosts now accept a remote server URL directly in their settings.</p>

<h2>Monitoring an MCP server in production</h2>
<ul>
  <li><strong>Log each tool call</strong> — tool name, arguments (with secrets redacted), user, duration and whether it returned an error.</li>
  <li><strong>Track error and timeout rates per tool.</strong> A tool that often errors usually needs a clearer description or better input validation.</li>
  <li><strong>Watch which tools are never called.</strong> They may be badly described, or unnecessary — remove them to keep the tool list focused.</li>
  <li><strong>Version your tool descriptions</strong> like code. A wording change can change model behaviour, so test it with an eval before shipping.</li>
</ul>

<h2>Troubleshooting common MCP problems</h2>
<table>
  <thead><tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr></thead>
  <tbody>
    <tr><td>Server doesn't appear in the host</td><td>Invalid JSON in the config, a relative path, or the host wasn't restarted</td><td>Validate the JSON, use absolute paths, fully restart the host and check its MCP logs</td></tr>
    <tr><td>stdio server connects then breaks</td><td>Something prints to stdout, corrupting the JSON-RPC stream</td><td>Log to stderr only — never print() to stdout in a stdio server</td></tr>
    <tr><td>The model never calls the tool</td><td>Vague name or description; too many similar tools</td><td>Describe when to use the tool, with an example; trim overlapping tools</td></tr>
    <tr><td>Wrong or missing arguments</td><td>Loose input schema</td><td>Use precise types, enums and examples; validate and return helpful errors</td></tr>
    <tr><td>401 / 403 from a remote server</td><td>Missing or expired token, wrong audience</td><td>Check the Authorization header and token scopes; re-run the OAuth flow</td></tr>
    <tr><td>Calls time out</td><td>Slow upstream API or large payloads</td><td>Add timeouts and pagination; return summaries instead of full records</td></tr>
  </tbody>
</table>

<h2>Security checklist</h2>
<ul>
  <li><strong>HTTPS only</strong> for remote servers, and validate the <code>Origin</code> header (the spec requires this to prevent DNS-rebinding attacks).</li>
  <li><strong>Bind local servers to 127.0.0.1</strong>, never 0.0.0.0, unless they're inside a container behind a proxy.</li>
  <li><strong>Least privilege.</strong> Give the server credentials that can do only what its tools need — a read-only database user for a read-only server.</li>
  <li><strong>Confirm destructive actions.</strong> Deleting, paying, emailing customers: require human approval in the host or a confirmation step.</li>
  <li><strong>Assume prompt injection.</strong> Text returned by tools (emails, web pages, tickets) can contain instructions aimed at the model. Never let tool output alone authorise sensitive actions.</li>
  <li><strong>Vet third-party servers.</strong> A malicious server can hide instructions in its tool descriptions. Install servers only from sources you trust, and pin their versions.</li>
  <li><strong>Log every tool call</strong> with the user, arguments and result, and rate-limit per user.</li>
</ul>

<h2>Real-world MCP use cases</h2>
<ul>
  <li><strong>Customer support:</strong> look up orders, subscriptions and tickets, and draft replies with live account data.</li>
  <li><strong>Sales and CRM:</strong> find contacts, log calls and update deal stages from a chat or an agent.</li>
  <li><strong>Internal knowledge:</strong> search wikis, policies and documents — often as a RAG system exposed through MCP.</li>
  <li><strong>Engineering:</strong> read repositories, issues and logs; query staging databases with read-only credentials.</li>
  <li><strong>Operations:</strong> check inventory, schedules and dashboards, and trigger approved workflows.</li>
</ul>

<h2>The bottom line</h2>
<p>APIs connect software to software. MCP connects AI to software, by putting a standard, self-describing layer on top of the APIs you already have. If you want AI assistants — yours or your customers' — to work with your systems, an MCP server is now the most reusable way to do it: build it once, and it works everywhere MCP does.</p>

<p><strong>Keep reading:</strong> pair an MCP server with a knowledge base using <a href="/blog/rag-architecture-explained">RAG Architecture, Explained</a>, and test the agents that use your tools with <a href="/blog/llm-models-benchmarks-evals">LLM Models, Benchmarks and Evals</a>.</p>
    `.trim(),
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export const categoryColors: Record<string, string> = {
  Architecture: "#BF5AF2",
  Models: "#10B981",
  Protocols: "#A78BFA",
};
