import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./site.css";

type Scenario = "occupational" | "ordinary";
type Care = "outpatient" | "inpatient";
type Answer = "yes" | "no";

type DocumentItem = {
  id: string;
  title: string;
  note: string;
};

const links = {
  occupational: "https://child.bli.gov.tw/0000000032.html",
  ordinary: "https://child.bli.gov.tw/0000000031.html",
  ordinaryApply: "https://www.bli.gov.tw/0004850.html",
  occupationalDocs: "https://www.bli.gov.tw/0106241.html",
};

const baseDocuments: DocumentItem[] = [
  {
    id: "application",
    title: "傷病給付申請書及給付收據",
    note: "使用對應的勞保或職保書表，資料請完整填寫。",
  },
  {
    id: "diagnosis",
    title: "傷病診斷書正本",
    note: "請確認診斷書載明治療、住院與不能工作的相關期間。",
  },
  {
    id: "records",
    title: "出勤、請假與領薪紀錄",
    note: "勞保局可能依個案需要請你補充其他相關證明。",
  },
];

function App() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [care, setCare] = useState<Care | null>(null);
  const [days, setDays] = useState<"upTo3" | "over3" | null>(null);
  const [paid, setPaid] = useState<Answer | null>(null);
  const [commute, setCommute] = useState(false);
  const [traffic, setTraffic] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const resetAnswers = (next: Scenario) => {
    setScenario(next);
    setCare(null);
    setDays(null);
    setPaid(null);
    setCommute(false);
    setTraffic(false);
    setChecked(new Set());
    window.setTimeout(() => {
      document.querySelector("#check")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  const result = useMemo(() => {
    if (!scenario) {
      return {
        status: "idle",
        symbol: "？",
        title: "先選擇受傷或生病的原因",
        detail: "完成三個問題後，這裡會顯示初步判斷。",
      };
    }
    if (!care || !days || !paid) {
      return {
        status: "pending",
        symbol: "…",
        title: "再回答幾個問題",
        detail: "請完成左側問題，確認治療方式、不能工作天數與薪資狀況。",
      };
    }
    if (paid === "yes") {
      return {
        status: "ineligible",
        symbol: "!",
        title: "可能不符合傷病給付條件",
        detail: "傷病給付的條件之一，是因不能工作而未取得原有薪資。若只有部分薪資或情況特殊，請向投保單位或勞保局確認。",
      };
    }
    if (days === "upTo3") {
      return {
        status: "ineligible",
        symbol: "!",
        title: "目前未達第 4 日起算門檻",
        detail: "傷病給付原則上自不能工作的第 4 日起發給。若後續治療期間延長，可再重新判斷。",
      };
    }
    if (scenario === "ordinary" && care === "outpatient") {
      return {
        status: "ineligible",
        symbol: "!",
        title: "普通傷病門診通常不能請領",
        detail: "勞保普通傷病給付以住院診療期間為限；僅門診或出院後在家休養，通常不在給付範圍。",
      };
    }
    return {
      status: "eligible",
      symbol: "✓",
      title: "可能符合初步申請條件",
      detail:
        scenario === "occupational"
          ? "若因工作造成傷病、治療中不能工作且未領原有薪資，可準備職保傷病給付文件。"
          : "若因普通傷病住院、不能工作且未領原有薪資，可準備勞保普通傷病給付文件。",
    };
  }, [scenario, care, days, paid]);

  const documents = useMemo(() => {
    const items = [...baseDocuments];
    if (scenario === "occupational") {
      items[0] = {
        id: "application",
        title: "職災保險傷病給付申請書及給付收據",
        note: "使用勞工職業災害保險專用書表。",
      };
      items.push({
        id: "work-proof",
        title: "職業傷病相關證明",
        note: "例如雇主或目擊者證明，以及可說明事故經過的資料。",
      });
      if (commute) {
        items.push({
          id: "commute-statement",
          title: "上下班或公出途中事故陳述書",
          note: "通勤或公出途中發生事故，首次申請時應一併填具。",
        });
      }
      if (traffic) {
        items.push({
          id: "traffic-proof",
          title: "交通事故相關證明",
          note: "依個案備妥事故登記、現場圖或其他可證明事故的資料。",
        });
      }
    }
    return items;
  }, [scenario, commute, traffic]);

  const completed = documents.filter((item) => checked.has(item.id)).length;
  const progress = documents.length ? (completed / documents.length) * 100 : 0;

  const toggleDocument = (id: string) => {
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <a className="skip-link" href="#main">跳到主要內容</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="傷病給付申請指南首頁">
          <span className="brand-mark">給付</span>
          <span><strong>傷病給付申請指南</strong><small>勞保 × 職保初步判斷</small></span>
        </a>
        <nav aria-label="主要選單">
          <a href="#check">資格檢查</a>
          <a href="#benefits">給付比較</a>
          <a href="#documents">文件清單</a>
          <a className="nav-cta" href="#apply">如何申請</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <span className="eyebrow">不能工作時，先把權益理清楚</span>
            <h1>受傷生病，<br /><em>你可能有一筆給付。</em></h1>
            <p>用簡單問答區分職業傷病與普通傷病，快速掌握初步資格、給付方式與申請文件。</p>
            <div className="hero-actions">
              <a className="primary-action" href="#choose">開始免費檢查 <span aria-hidden="true">→</span></a>
              <span>不需登入・不會儲存個人資料</span>
            </div>
          </div>
          <aside className="route-card" aria-label="申請流程摘要">
            <div className="route-head"><span>申請路線圖</span><strong>6 個步驟</strong></div>
            <ol>
              {[
                "確認事故原因",
                "檢查初步資格",
                "備妥診斷文件",
                "核對薪資與出勤",
                "送出申請資料",
                "追蹤審核結果",
              ].map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}
            </ol>
          </aside>
        </section>

        <section className="section choose-section" id="choose">
          <div className="section-heading centered">
            <span className="section-number">01</span>
            <h2>這次傷病，與工作有關嗎？</h2>
            <p>先選擇最接近的情況；不確定是否屬於職災時，建議向勞保局或專業人員確認。</p>
          </div>
          <div className="scenario-grid">
            <button className={`scenario-card occupational ${scenario === "occupational" ? "selected" : ""}`} type="button" aria-pressed={scenario === "occupational"} onClick={() => resetAnswers("occupational")}>
              <span className="card-index">A</span>
              <span className="card-kicker">工作中・通勤中・職業病</span>
              <strong>與工作有關</strong>
              <span>可能適用勞工職業災害保險傷病給付，門診或住院治療期間都有機會納入。</span>
              <span className="card-link">選擇這個情況 →</span>
            </button>
            <button className={`scenario-card ordinary ${scenario === "ordinary" ? "selected" : ""}`} type="button" aria-pressed={scenario === "ordinary"} onClick={() => resetAnswers("ordinary")}>
              <span className="card-index">B</span>
              <span className="card-kicker">一般疾病・生活意外</span>
              <strong>與工作無關</strong>
              <span>可能適用勞保普通傷病給付，原則上須住院診療，且自住院第 4 日起計。</span>
              <span className="card-link">選擇這個情況 →</span>
            </button>
          </div>
        </section>

        <section className="section check-section" id="check">
          <div className="section-heading">
            <span className="section-number">02</span>
            <h2>快速檢查初步資格</h2>
            <p>{scenario ? `目前選擇：${scenario === "occupational" ? "與工作有關" : "與工作無關"}` : "請先完成上一步，選擇傷病原因。"}</p>
          </div>
          <div className="check-layout">
            <div className={`questions ${scenario ? "" : "disabled"}`} aria-disabled={!scenario}>
              <Question number="A" title="目前是門診還是住院治療？">
                <Choice active={care === "outpatient"} onClick={() => setCare("outpatient")}>門診治療</Choice>
                <Choice active={care === "inpatient"} onClick={() => setCare("inpatient")}>住院治療</Choice>
              </Question>
              <Question number="B" title="因治療不能工作的期間有多久？">
                <Choice active={days === "upTo3"} onClick={() => setDays("upTo3")}>3 日以內</Choice>
                <Choice active={days === "over3"} onClick={() => setDays("over3")}>4 日以上</Choice>
              </Question>
              <Question number="C" title="不能工作期間，仍有領到原有薪資嗎？">
                <Choice active={paid === "no"} onClick={() => setPaid("no")}>沒有領原薪</Choice>
                <Choice active={paid === "yes"} onClick={() => setPaid("yes")}>有領原薪</Choice>
              </Question>
            </div>
            <aside className={`result result-${result.status}`} aria-live="polite">
              <span className="result-label">初步判斷結果</span>
              <span className="result-symbol" aria-hidden="true">{result.symbol}</span>
              <h3>{result.title}</h3>
              <p>{result.detail}</p>
              {result.status === "eligible" && <a href="#documents">接著準備文件 →</a>}
              {result.status === "ineligible" && <a href={scenario === "occupational" ? links.occupational : links.ordinary} target="_blank" rel="noreferrer">查看勞保局完整說明 ↗</a>}
            </aside>
          </div>
          <p className="legal-note">本工具僅提供一般資訊與初步檢查，不代表勞保局核定結果；實際資格與金額以主管機關審核為準。</p>
        </section>

        <section className="section benefits-section" id="benefits">
          <div className="section-heading">
            <span className="section-number">03</span>
            <h2>兩種給付，差在哪裡？</h2>
            <p>核心差異在於傷病是否與工作有關，以及門診或住院期間能否納入。</p>
          </div>
          <div className="benefit-grid">
            <article className="benefit-card featured">
              <span className="benefit-type">職業傷病</span>
              <h3>職保傷病給付</h3>
              <dl>
                <div><dt>適用治療</dt><dd>門診或住院</dd></div>
                <div><dt>起算時間</dt><dd>不能工作的第 4 日起</dd></div>
                <div><dt>前 60 日</dt><dd>平均日投保薪資 100%</dd></div>
                <div><dt>第 61 日起</dt><dd>平均日投保薪資 70%</dd></div>
                <div><dt>最長期間</dt><dd>合計最長 2 年</dd></div>
              </dl>
              <a href={links.occupational} target="_blank" rel="noreferrer">勞保局職保說明 ↗</a>
            </article>
            <article className="benefit-card">
              <span className="benefit-type">普通傷病</span>
              <h3>勞保普通傷病給付</h3>
              <dl>
                <div><dt>適用治療</dt><dd>住院期間</dd></div>
                <div><dt>起算時間</dt><dd>住院不能工作的第 4 日起</dd></div>
                <div><dt>給付標準</dt><dd>平均日投保薪資 50%</dd></div>
                <div><dt>一般期間</dt><dd>最長 6 個月</dd></div>
                <div><dt>加保滿 1 年</dt><dd>持續住院者合計最長 1 年</dd></div>
              </dl>
              <a href={links.ordinary} target="_blank" rel="noreferrer">勞保局普通傷病說明 ↗</a>
            </article>
          </div>
        </section>

        <section className="section documents-section" id="documents">
          <div className="section-heading">
            <span className="section-number">04</span>
            <h2>把申請文件一次備齊</h2>
            <p>依你的情況建立清單。這份勾選紀錄只留在目前頁面，重新整理後會清除。</p>
          </div>
          <div className="documents-layout">
            <aside className="document-options">
              <span className="mini-label">補充情況</span>
              <h3>事故是否符合以下情形？</h3>
              {scenario === "occupational" ? (
                <>
                  <label><input type="checkbox" checked={commute} onChange={(event) => setCommute(event.target.checked)} /><span>上下班或公出途中發生</span></label>
                  <label><input type="checkbox" checked={traffic} onChange={(event) => setTraffic(event.target.checked)} /><span>屬於交通事故</span></label>
                </>
              ) : <p>普通傷病的基本文件已列在右側；實際案件仍可能需要補件。</p>}
              <a href={scenario === "occupational" ? links.occupationalDocs : links.ordinaryApply} target="_blank" rel="noreferrer">查看官方請領手續 ↗</a>
            </aside>
            <div className="checklist">
              <div className="checklist-head">
                <span>文件準備進度</span><strong>{completed} / {documents.length}</strong>
                <div className="progress" aria-label={`已完成 ${completed} 項，共 ${documents.length} 項`}><span style={{ width: `${progress}%` }} /></div>
              </div>
              <div className="document-list">
                {documents.map((item) => (
                  <label className={checked.has(item.id) ? "document checked" : "document"} key={item.id}>
                    <input type="checkbox" checked={checked.has(item.id)} onChange={() => toggleDocument(item.id)} />
                    <span className="custom-check" aria-hidden="true">✓</span>
                    <span><strong>{item.title}</strong><small>{item.note}</small></span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section apply-section" id="apply">
          <div className="section-heading light">
            <span className="section-number">05</span>
            <h2>接下來，這樣完成申請</h2>
          </div>
          <div className="apply-grid">
            <article><span>1</span><h3>確認適用給付</h3><p>釐清是職業傷病或普通傷病，不確定時先請投保單位協助確認。</p></article>
            <article><span>2</span><h3>備妥證明文件</h3><p>準備申請書、診斷書正本，以及出勤、請假、領薪與事故相關證明。</p></article>
            <article><span>3</span><h3>送件並保留副本</h3><p>依規定透過投保單位、郵寄或親送辦理；普通傷病也可依資格選擇線上申辦。</p></article>
          </div>
        </section>

        <section className="official-section">
          <div><span className="eyebrow">最後核對</span><h2>送件前，以官方最新資訊為準。</h2><p>法規、表單與申請方式可能更新；請至勞動部勞工保險局查閱最新版本。</p></div>
          <div className="official-links">
            <a href={links.ordinaryApply} target="_blank" rel="noreferrer"><span>普通傷病</span><strong>請領手續與線上申辦</strong><b>↗</b></a>
            <a href={links.occupationalDocs} target="_blank" rel="noreferrer"><span>職業傷病</span><strong>應備文件與申請說明</strong><b>↗</b></a>
          </div>
        </section>
      </main>

      <footer><span>傷病給付申請指南</span><span>資訊更新：2026 年 8 月・本站不蒐集個人資料</span></footer>
    </>
  );
}

function Question({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <div className="question"><span className="question-number">{number}</span><div><h3>{title}</h3><div className="choice-row">{children}</div></div></div>;
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" className={active ? "choice active" : "choice"} aria-pressed={active} onClick={onClick}>{children}</button>;
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
