import { useEffect, useRef } from "react";
import { CLUSTERS, neighborsOf } from "@/data/atlas/catalog";
import { getLaidOutGraph, type SimNode } from "@/lib/graph/layout";
import { useAtlas } from "@/store/atlas";

const CLUSTER_COLOR: Record<string, string> = {
  atlas: "#EAFBEA",
  philosophy: "#C27DFF",
  physics: "#00C7E5",
  mathematics: "#00DAD2",
  biology: "#5AD664",
  computing: "#00AFF3",
  history: "#EFA831",
  mind: "#EB7FE3",
  systems: "#00C38B",
};

type Cam = { x: number; y: number; k: number };

function hexRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function screenPt(n: { x: number; y: number }, cam: Cam, w: number, h: number) {
  return {
    x: (n.x - cam.x) * cam.k + w / 2,
    y: (n.y - cam.y) * cam.k + h / 2,
  };
}

export function GraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cam = useRef<Cam>({ x: 0, y: 0, k: 0.56 });
  const hoverId = useRef<string | null>(null);
  const panTo = useRef<{ x: number; y: number } | null>(null);
  const drag = useRef<{
    button: number;
    sx: number;
    sy: number;
    cx: number;
    cy: number;
    moved: boolean;
  } | null>(null);
  const pulse = useRef(0);
  const selectedId = useAtlas((s) => s.selectedId);
  const settings = useAtlas((s) => s.settings);
  const select = useAtlas((s) => s.select);
  const hover = useAtlas((s) => s.hover);
  const openArticle = useAtlas((s) => s.openArticle);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const graph = getLaidOutGraph();
    const nodes = graph.nodes;
    const links = graph.links;
    const byId = new Map(nodes.map((n) => [n.id, n]));

    let raf = 0;
    let running = true;
    const dpr = () => Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      const px = dpr();
      canvas.width = Math.max(1, Math.floor(r.width * px));
      canvas.height = Math.max(1, Math.floor(r.height * px));
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const hit = (sx: number, sy: number): SimNode | null => {
      const rect = canvas.getBoundingClientRect();
      const x = sx - rect.left;
      const y = sy - rect.top;
      const w = rect.width;
      const h = rect.height;
      let best: SimNode | null = null;
      let bestD = 28;
      for (const n of nodes) {
        const p = screenPt(n, cam.current, w, h);
        const d = Math.hypot(p.x - x, p.y - y);
        const rad = Math.max(16, n.r * cam.current.k + 10);
        if (d < rad && d < bestD) {
          best = n;
          bestD = d;
        }
      }
      return best;
    };

    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      if (!nodes.length || rect.width < 10) return;
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      for (const n of nodes) {
        minX = Math.min(minX, n.x);
        minY = Math.min(minY, n.y);
        maxX = Math.max(maxX, n.x);
        maxY = Math.max(maxY, n.y);
      }
      const pad = 140;
      const k = Math.min(
        (rect.width - pad) / Math.max(1, maxX - minX),
        (rect.height - pad) / Math.max(1, maxY - minY),
      );
      panTo.current = null;
      cam.current = {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2,
        k: Math.max(0.18, Math.min(1.35, k)),
      };
    };

    const home = () => {
      panTo.current = null;
      cam.current = { x: 0, y: 0, k: 0.56 };
    };
    home();

    const onFit = () => fit();
    window.addEventListener("atlas:fit", onFit);

    const unsub = useAtlas.subscribe((s, prev) => {
      if (!s.selectedId || s.selectedId === prev.selectedId) return;
      const n = byId.get(s.selectedId);
      if (!n) return;
      panTo.current = { x: n.x, y: n.y };
    });

    const draw = () => {
      if (!running) return;
      raf = requestAnimationFrame(draw);
      pulse.current += 0.03;
      if (panTo.current && !drag.current) {
        const t = panTo.current;
        cam.current.x += (t.x - cam.current.x) * 0.09;
        cam.current.y += (t.y - cam.current.y) * 0.09;
        if (Math.hypot(t.x - cam.current.x, t.y - cam.current.y) < 4) panTo.current = null;
      }
      const { settings: st, selectedId: sel, hoveredId } = useAtlas.getState();
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const px = dpr();
      ctx.setTransform(px, 0, 0, px, 0, 0);
      ctx.fillStyle = "#05080C";
      ctx.fillRect(0, 0, w, h);

      const k = cam.current.k;
      const selSet = new Set<string>();
      if (sel) {
        selSet.add(sel);
        for (const id of neighborsOf(sel)) selSet.add(id);
      }
      const focus = hoveredId ?? sel;
      const focusSet = new Set<string>();
      if (focus) {
        focusSet.add(focus);
        for (const id of neighborsOf(focus)) focusSet.add(id);
      }

      const visible = (n: SimNode) => {
        if (st.localMode && sel) return selSet.has(n.id);
        return true;
      };

      ctx.lineCap = "round";
      ctx.globalCompositeOperation = "lighter";

      for (const l of links) {
        if (!visible(l.source) || !visible(l.target)) continue;
        const a = screenPt(l.source, cam.current, w, h);
        const b = screenPt(l.target, cam.current, w, h);
        if (
          (a.x < -40 && b.x < -40) ||
          (a.x > w + 40 && b.x > w + 40) ||
          (a.y < -40 && b.y < -40) ||
          (a.y > h + 40 && b.y > h + 40)
        ) {
          continue;
        }
        const hot = focus && focusSet.has(l.source.id) && focusSet.has(l.target.id);
        const dim = st.dimUnrelated && focus && !hot;
        const same = l.source.cluster === l.target.cluster;
        const alpha = hot ? 0.46 : dim ? 0.028 : same ? 0.15 : 0.055;
        const col = st.colorGroups ? CLUSTER_COLOR[l.source.cluster] ?? "#5AD664" : "#5AD664";
        const [r, g, bl] = hexRgb(col);
        ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
        ctx.lineWidth = hot ? 1.5 : same ? 0.75 : 0.42;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        if (st.showArrows && k > 0.7 && hot) {
          const ang = Math.atan2(b.y - a.y, b.x - a.x);
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(mx - 6 * Math.cos(ang - 0.4), my - 6 * Math.sin(ang - 0.4));
          ctx.moveTo(mx, my);
          ctx.lineTo(mx - 6 * Math.cos(ang + 0.4), my - 6 * Math.sin(ang + 0.4));
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        if (!visible(n)) continue;
        const p = screenPt(n, cam.current, w, h);
        if (p.x < -40 || p.y < -40 || p.x > w + 40 || p.y > h + 40) continue;
        const hot = !focus || focusSet.has(n.id);
        const dim = st.dimUnrelated && focus && !hot;
        const col = st.colorGroups ? CLUSTER_COLOR[n.cluster] ?? "#5AD664" : "#C27DFF";
        const [r, g, bl] = hexRgb(n.kind === "atlas" || n.kind === "hub" ? "#EAFBEA" : col);
        const rad = n.r * Math.max(0.9, Math.sqrt(k) * 1.05);
        const glowR = rad * (n.kind === "atlas" ? 7.2 : n.kind === "hub" ? 5.0 : 3.4);
        const pulseAmt = n.id === sel ? 0.12 * (0.5 + 0.5 * Math.sin(pulse.current)) : 0;
        const galpha = dim ? 0.04 : n.kind === "atlas" ? 0.55 : n.kind === "hub" ? 0.4 : 0.24;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR * (1 + pulseAmt));
        grad.addColorStop(0, `rgba(${r},${g},${bl},${galpha + pulseAmt})`);
        grad.addColorStop(0.45, `rgba(${r},${g},${bl},${galpha * 0.25})`);
        grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR * (1 + pulseAmt), 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = dim
          ? `rgba(${r},${g},${bl},0.18)`
          : n.kind === "atlas"
            ? "#F6FFF3"
            : n.kind === "hub"
              ? "#E4FBDD"
              : `rgba(${r},${g},${bl},0.95)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fill();

        if (n.id === hoverId.current || n.id === sel) {
          ctx.strokeStyle = "rgba(255,255,255,0.75)";
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad + 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      // Cluster captions so the larger map stays navigable.
      if (k < 1.15) {
        ctx.font = `600 ${Math.max(11, 12.5 * Math.min(1.2, k * 1.4))}px "IBM Plex Sans", system-ui, sans-serif`;
        for (const c of CLUSTERS) {
          const hub = byId.get(c.id);
          if (!hub || !visible(hub)) continue;
          const p = screenPt(hub, cam.current, w, h);
          if (p.x < 40 || p.y < 28 || p.x > w - 40 || p.y > h - 20) continue;
          ctx.fillStyle = "rgba(122, 240, 255, 0.42)";
          ctx.fillText(c.title.toUpperCase(), p.x, p.y - hub.r * Math.max(1, k) - 22);
        }
      }

      if (st.showLabels) {
        const placed: { x: number; y: number; w: number }[] = [];
        const labelOk = (x: number, y: number, tw: number) => {
          for (const q of placed) {
            if (Math.abs(q.x - x) < (q.w + tw) * 0.52 && Math.abs(q.y - y) < 15) return false;
          }
          return true;
        };
        const order = [...nodes].sort((a, b) => {
          const rank = (n: SimNode) =>
            n.kind === "atlas" ? 4 : n.kind === "hub" ? 3 : n.kind === "topic" ? 2 : n.kind === "figure" ? 1 : 0;
          const dr = rank(b) - rank(a);
          return dr !== 0 ? dr : b.degree - a.degree;
        });
        const fontPx = Math.max(11, Math.min(15, 12.5 * Math.min(1.25, Math.max(0.7, k))));
        ctx.font = `${fontPx}px "IBM Plex Sans", system-ui, sans-serif`;
        for (const n of order) {
          if (!visible(n)) continue;
          const p = screenPt(n, cam.current, w, h);
          if (p.x < 18 || p.y < 14 || p.x > w - 18 || p.y > h - 16) continue;
          const important =
            n.kind === "atlas" || n.kind === "hub" || n.id === sel || n.id === hoverId.current;
          const show =
            important ||
            (n.kind === "topic" && k > 0.34) ||
            (n.kind === "figure" && k > 0.5) ||
            (n.kind === "concept" && k > 0.58);
          if (!show) continue;
          const ly = p.y + n.r * Math.max(0.9, Math.sqrt(k)) + 7;
          const tw = ctx.measureText(n.title).width;
          if (!important && !labelOk(p.x, ly, tw)) continue;
          placed.push({ x: p.x, y: ly, w: tw });
          const dim = st.dimUnrelated && focus && !focusSet.has(n.id);
          ctx.lineWidth = 3.2;
          ctx.strokeStyle = "rgba(5,8,12,0.85)";
          ctx.strokeText(n.title, p.x, ly);
          ctx.fillStyle = dim
            ? "rgba(160,168,184,0.32)"
            : important
              ? "#EAFBEA"
              : n.kind === "topic"
                ? "rgba(214, 226, 236, 0.92)"
                : "rgba(176, 188, 204, 0.86)";
          ctx.fillText(n.title, p.x, ly);
        }
      }

      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.28, w / 2, h / 2, Math.max(w, h) * 0.74);
      vg.addColorStop(0, "rgba(3,4,10,0)");
      vg.addColorStop(1, "rgba(3,4,10,0.5)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(draw);

    const zoomAt = (clientX: number, clientY: number, factor: number) => {
      const rect = canvas.getBoundingClientRect();
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;
      const worldX = cam.current.x + (sx - rect.width / 2) / cam.current.k;
      const worldY = cam.current.y + (sy - rect.height / 2) / cam.current.k;
      const next = Math.max(0.14, Math.min(5.2, cam.current.k * factor));
      cam.current.k = next;
      cam.current.x = worldX - (sx - rect.width / 2) / next;
      cam.current.y = worldY - (sy - rect.height / 2) / next;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0015);
      zoomAt(e.clientX, e.clientY, factor);
    };
    const onDown = (e: PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      panTo.current = null;
      drag.current = {
        button: e.button,
        sx: e.clientX,
        sy: e.clientY,
        cx: cam.current.x,
        cy: cam.current.y,
        moved: false,
      };
    };
    const onMove = (e: PointerEvent) => {
      if (drag.current) {
        const dx = e.clientX - drag.current.sx;
        const dy = e.clientY - drag.current.sy;
        if (Math.hypot(dx, dy) > 3) drag.current.moved = true;
        cam.current.x = drag.current.cx - dx / cam.current.k;
        cam.current.y = drag.current.cy - dy / cam.current.k;
        canvas.style.cursor = "grabbing";
        return;
      }
      const n = hit(e.clientX, e.clientY);
      const id = n?.id ?? null;
      if (id !== hoverId.current) {
        hoverId.current = id;
        hover(id);
        canvas.style.cursor = id ? "pointer" : "grab";
      }
    };
    const onUp = (e: PointerEvent) => {
      const was = drag.current;
      drag.current = null;
      canvas.style.cursor = hoverId.current ? "pointer" : "grab";
      if (!was || was.moved) return;
      const n = hit(e.clientX, e.clientY);
      if (n) select(n.id);
      else select(null);
    };
    const onDbl = (e: MouseEvent) => {
      const n = hit(e.clientX, e.clientY);
      if (n) openArticle(n.id);
    };
    const onLeave = () => {
      hoverId.current = null;
      hover(null);
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("dblclick", onDbl);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      unsub();
      window.removeEventListener("atlas:fit", onFit);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("dblclick", onDbl);
    };
  }, [hover, openArticle, select]);

  void selectedId;
  void settings;

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full touch-none bg-canvas"
      aria-label="Knowledge graph"
    />
  );
}

export function clusterColor(id: string): string {
  return CLUSTER_COLOR[id] ?? "#5AD664";
}

export { CLUSTERS };
