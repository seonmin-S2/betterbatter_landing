/**
 * js/pages/home/film.js
 * ---------------------------------------------------------------------------
 * 소개 영상 플레이어 — 실제 앱 화면을 녹화한 영상 네 편을 탭으로 바꿔 본다.
 *
 * · 영상은 소리가 없다. 음소거 버튼을 두지 않는다.
 * · preload="none" — 재생을 누르기 전까지 영상을 내려받지 않는다. 덮개는 포스터(WebP)다.
 * · 좁은 화면(640px 이하)에서는 세로로 녹화한 모바일 영상을 쓴다.
 * · 화면 밖으로 나가면 자동으로 멈춘다.
 *
 * 탭 목록: js/pages/home/home.data.js의 FILMS
 * 파일: assets/videos/<id>-d.mp4 (데스크톱) · <id>-m.mp4 (모바일) · 같은 이름의 .webp 포스터
 */

import { FILMS } from "./home.data.js";
import { icon } from "../../data/icons.js";
import { $, $$, el } from "../../shared/utils.js";

/** 초 → "0:42" */
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

const narrow = window.matchMedia("(max-width: 640px)");

export function initFilm() {
  const frame = $(".film__frame");
  const video = $(".film__video");
  const tabs = $(".film__tabs");
  if (!frame || !video || !tabs) return;

  const playBtn = $(".film__play", frame);
  const toggleBtn = $("[data-film-toggle]", frame);
  const fullBtn = $("[data-film-full]", frame);
  const bar = $(".film__bar", frame);
  const barFill = $(".film__bar-fill", frame);
  const time = $(".film__time", frame);
  const title = $(".film__cover-title", frame);

  if (playBtn) playBtn.innerHTML = icon("play", 26);
  if (toggleBtn) toggleBtn.innerHTML = icon("play", 15);
  if (fullBtn) fullBtn.innerHTML = icon("maximize", 15);

  let current = FILMS[0];

  /** 지금 폭에 맞는 영상을 건다. 재생 중이던 상태는 초기화한다. */
  function load(film) {
    current = film;
    const kind = narrow.matches ? "m" : "d";
    frame.dataset.kind = kind;
    frame.classList.remove("is-playing");
    video.pause();
    video.removeAttribute("src");
    video.src = `assets/videos/${film.id}-${kind}.mp4`;
    video.poster = `assets/videos/${film.id}-${kind}.webp`;
    if (title) title.textContent = film.title;
    if (barFill) barFill.style.width = "0%";
    if (time) time.textContent = "0:00 / 0:00";
    $$(".film__tab", tabs).forEach((tab) => {
      const on = tab.dataset.film === film.id;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
    });
  }

  /* 탭 — 마우스 · ← → 키 */
  FILMS.forEach((film) => {
    tabs.append(el("button", {
      className: "film__tab",
      text: film.label,
      attrs: { type: "button", role: "tab", "data-film": film.id, "aria-controls": "film-frame", "aria-selected": "false" },
      on: { click: () => load(film) },
    }));
  });
  tabs.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const i = FILMS.indexOf(current);
    const next = FILMS[(i + (event.key === "ArrowRight" ? 1 : FILMS.length - 1)) % FILMS.length];
    load(next);
    $(`[data-film="${next.id}"]`, tabs)?.focus();
  });

  load(FILMS[0]);
  narrow.addEventListener("change", () => load(current));

  const start = () => {
    frame.classList.add("is-playing");
    video.play().catch(() => {});
  };
  playBtn?.addEventListener("click", start);

  toggleBtn?.addEventListener("click", () => (video.paused ? video.play() : video.pause()));

  video.addEventListener("play", () => {
    frame.classList.add("is-playing");
    if (toggleBtn) {
      toggleBtn.innerHTML = icon("pause", 15);
      toggleBtn.setAttribute("aria-label", "일시정지");
    }
  });
  video.addEventListener("pause", () => {
    if (toggleBtn) {
      toggleBtn.innerHTML = icon("play", 15);
      toggleBtn.setAttribute("aria-label", "재생");
    }
  });
  video.addEventListener("ended", () => {
    frame.classList.remove("is-playing");
    video.currentTime = 0;
    if (barFill) barFill.style.width = "0%";
  });

  fullBtn?.addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else frame.requestFullscreen?.().catch(() => {});
  });

  video.addEventListener("timeupdate", () => {
    const ratio = video.duration ? video.currentTime / video.duration : 0;
    if (barFill) barFill.style.width = `${ratio * 100}%`;
    if (time) time.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  });
  video.addEventListener("loadedmetadata", () => {
    if (time) time.textContent = `0:00 / ${formatTime(video.duration)}`;
  });

  bar?.addEventListener("click", (event) => {
    if (!video.duration) return;
    const rect = bar.getBoundingClientRect();
    video.currentTime = ((event.clientX - rect.left) / rect.width) * video.duration;
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && !video.paused) video.pause();
      });
    }, { threshold: 0.25 }).observe(frame);
  }
}
