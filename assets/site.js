(() => {
  "use strict";

  const scenarioCards = [...document.querySelectorAll("[data-scenario]")];
  const decisionEmpty = document.querySelector("#decision-empty");
  const occupationalFlow = document.querySelector("#occupational-flow");
  const ordinaryFlow = document.querySelector("#ordinary-flow");
  const decisionSubtitle = document.querySelector("#decision-subtitle");
  const resultCard = document.querySelector("#result-card");
  const resultSymbol = document.querySelector("#result-symbol");
  const resultTitle = document.querySelector("#result-title");
  const resultDetail = document.querySelector("#result-detail");
  const resultLink = document.querySelector("#result-link");

  const setResult = (status, symbol, title, detail, showLink = false) => {
    resultCard.classList.remove("result-idle", "result-pending", "result-eligible", "result-ineligible");
    resultCard.classList.add(`result-${status}`);
    resultSymbol.textContent = symbol;
    resultTitle.textContent = title;
    resultDetail.textContent = detail;
    resultLink.hidden = !showLink;
  };

  const clearChoices = () => {
    document.querySelectorAll(".choice-button.active").forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
    });
    document.querySelectorAll(".question-block.dependent").forEach((block) => block.classList.remove("visible"));
  };

  const activateChoice = (button) => {
    const row = button.closest(".choice-row");
    row.querySelectorAll(".choice-button").forEach((choice) => {
      choice.classList.remove("active");
      choice.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
  };

  scenarioCards.forEach((card) => {
    card.addEventListener("click", () => {
      const scenario = card.dataset.scenario;
      scenarioCards.forEach((item) => {
        const selected = item === card;
        item.classList.toggle("selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      clearChoices();
      decisionEmpty.hidden = true;
      occupationalFlow.hidden = scenario !== "occupational";
      ordinaryFlow.hidden = scenario !== "ordinary";

      if (scenario === "occupational") {
        decisionSubtitle.textContent = "目前選擇：與工作有關的職業傷害或職業病。";
        setResult("pending", "…", "再確認不能工作的天數", "職業傷病可適用門診或住院；請回答左側問題。", false);
      } else {
        decisionSubtitle.textContent = "目前選擇：與工作無關的普通傷害或普通疾病。";
        setResult("pending", "…", "先確認勞保身分", "請依序回答是否已領老年給付、治療方式與住院天數。", false);
      }

      window.setTimeout(() => document.querySelector("#decision")?.scrollIntoView({ behavior: "smooth" }), 80);
    });
  });

  document.querySelectorAll('[data-flow="occupational"]').forEach((button) => {
    button.addEventListener("click", () => {
      activateChoice(button);
      if (button.dataset.value === "long") {
        setResult(
          "eligible",
          "✓",
          "可進一步申請職業傷病給付",
          "自不能工作的第 4 日起，可準備勞保局文件；勞保局核發後，再依流程申請富邦產物保險。",
          true,
        );
      } else {
        setResult(
          "ineligible",
          "!",
          "未達第 4 日起算門檻",
          "不能工作期間在 3 日以內，無法申請職災傷病給付。請依公傷病假規定辦理。",
          false,
        );
      }
    });
  });

  const retiredButtons = [...document.querySelectorAll('[data-question="retired"]')];
  const careButtons = [...document.querySelectorAll('[data-question="care"]')];
  const ordinaryDayButtons = [...document.querySelectorAll('[data-question="ordinary-days"]')];
  const careBlock = document.querySelector('[data-depends="retired-no"]');
  const ordinaryDaysBlock = document.querySelector('[data-depends="care-inpatient"]');

  retiredButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateChoice(button);
      careButtons.concat(ordinaryDayButtons).forEach((choice) => {
        choice.classList.remove("active");
        choice.setAttribute("aria-pressed", "false");
      });
      ordinaryDaysBlock.classList.remove("visible");

      if (button.dataset.value === "yes") {
        careBlock.classList.remove("visible");
        setResult(
          "ineligible",
          "!",
          "無法申請普通傷病給付",
          "已領取勞保老年給付者，如保險身分僅保職災、未投保普通事故，不適用普通傷病申請。",
          false,
        );
      } else {
        careBlock.classList.add("visible");
        setResult("pending", "…", "接著確認治療方式", "普通傷病給付原則上須住院治療，請繼續回答。", false);
      }
    });
  });

  careButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateChoice(button);
      ordinaryDayButtons.forEach((choice) => {
        choice.classList.remove("active");
        choice.setAttribute("aria-pressed", "false");
      });

      if (button.dataset.value === "outpatient") {
        ordinaryDaysBlock.classList.remove("visible");
        setResult(
          "ineligible",
          "!",
          "門診無法申請普通傷病給付",
          "普通傷病給付以住院診療為條件；請依普通傷病假規定辦理。",
          false,
        );
      } else {
        ordinaryDaysBlock.classList.add("visible");
        setResult("pending", "…", "最後確認住院天數", "請確認住院不能工作的期間是否已達第 4 日。", false);
      }
    });
  });

  ordinaryDayButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateChoice(button);
      if (button.dataset.value === "long") {
        setResult(
          "eligible",
          "✓",
          "可進一步申請普通傷病給付",
          "自住院不能工作的第 4 日起，可依文件清單準備勞工保險局申請資料。普通傷病不申請富邦產物保險。",
          true,
        );
      } else {
        setResult(
          "ineligible",
          "!",
          "未達第 4 日起算門檻",
          "住院不能工作期間在 3 日以內，無法申請普通傷病給付。",
          false,
        );
      }
    });
  });

  const tabs = [...document.querySelectorAll("[data-doc-tab]")];
  const panels = [...document.querySelectorAll("[data-doc-panel]")];

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.docTab;
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      panels.forEach((panel) => {
        const active = panel.dataset.docPanel === target;
        panel.hidden = !active;
        panel.classList.toggle("active", active);
      });
    });
  });

  const updateProgress = (column) => {
    const checkboxes = [...column.querySelectorAll('.document-item input[type="checkbox"]')];
    const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
    const progressText = column.querySelector(".progress-text");
    const progressBar = column.querySelector(".progress-track span");
    progressText.textContent = `${completed} / ${checkboxes.length}`;
    progressBar.style.width = `${checkboxes.length ? (completed / checkboxes.length) * 100 : 0}%`;
  };

  document.querySelectorAll('.document-item input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const item = checkbox.closest(".document-item");
      const column = checkbox.closest(".document-column");
      item.classList.toggle("checked", checkbox.checked);
      updateProgress(column);
    });
  });
})();
