"use client";

import { useRef, useState, type PointerEvent } from "react";
import { getStrokeOutline, outlineToPath, type InkPoint } from "./ink";
import styles from "./proposal.module.css";

const forumSamples = [
  { title: "CLS Corporate State of the Union", caption: "Professional launch video", still: "cls-state-of-the-union", vimeoId: "1225651686" },
  { title: "Resident interview", caption: "The Gathering Salisbury", still: "interview", file: "01-gathering-testimonial-reference" },
  { title: "Location film", caption: "The View at Morgan Town", still: "location", file: "02-morgan-town-reference" },
];

export function SampleFilms({ clsOnly = false }: { clsOnly?: boolean }) {
  const samples = clsOnly ? forumSamples.filter(sample => sample.vimeoId) : forumSamples;
  const [playing, setPlaying] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const selected = playing === null ? null : samples[playing];
  return <section className={styles.gallery} aria-label="Sample films">
    {samples.map(({ title, caption, still, file, vimeoId }, index) => {
      const poster = "/proposals/forum/launch-video/assets/" + still + ".jpg";
      return <figure key={still}>
        {vimeoId || playing !== index ? (
          <button type="button" className={styles.poster} style={{ backgroundImage: "url(" + poster + ")" }}
              aria-haspopup={vimeoId ? "dialog" : undefined} aria-label={"Play " + title}
              onClick={() => {
                setPlaying(index);
                if (vimeoId) dialog.current?.showModal();
              }}>
              <span>▶ &nbsp; Play sample</span>
          </button>
        ) : (
          <video controls autoPlay playsInline poster={poster} src={`/storyboards/csl-brand-awareness/videos/${file}.mp4`}
            aria-label={title} onEnded={() => setPlaying(null)} />
        )}
        <figcaption><strong>{title}</strong><span>{caption}</span></figcaption>
      </figure>;
    })}
    <dialog ref={dialog} className={styles.filmDialog} aria-labelledby="forum-film-title"
      onClose={() => setPlaying(null)}
      onClick={event => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}>
      <div className={styles.filmPanel}>
        <header>
          <h2 id="forum-film-title">{selected?.title}</h2>
          <button type="button" onClick={() => dialog.current?.close()}>Close</button>
        </header>
        {selected?.vimeoId && <iframe title={selected.title}
          src={`https://player.vimeo.com/video/${selected.vimeoId}?autoplay=1`}
          allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />}
      </div>
    </dialog>
  </section>;
}

type Mark = { name: string; title: string; date: string; paths: string[] };
export function Signatory({ provider, onSign, customer = "Forum Asset Management" }: {
  provider: boolean;
  onSign?: () => void;
  customer?: string;
}) {
  const [name, setName] = useState(provider ? "Amulya Parmar" : "");
  const [title, setTitle] = useState(provider ? "CEO" : "");
  const [editing, setEditing] = useState(false);
  const [draw, setDraw] = useState(false);
  const [paths, setPaths] = useState<string[]>([]);
  const [live, setLive] = useState("");
  const [mark, setMark] = useState<Mark | null>(null);
  const stroke = useRef<{ id: number; points: InkPoint[] } | null>(null);
  const party = provider ? "LeaseMagnets, Inc." : customer;

  function addPoint(e: PointerEvent<SVGSVGElement>) {
    if (stroke.current?.id !== e.pointerId) return "";
    const bounds = e.currentTarget.getBoundingClientRect();
    const points = stroke.current.points;
    points.push({ x: (e.clientX - bounds.left) * 600 / bounds.width,
      y: (e.clientY - bounds.top) * 180 / bounds.height, t: e.timeStamp, p: e.pressure });
    const path = outlineToPath(getStrokeOutline(points, { size: 5, simulatePressure: e.pointerType !== "pen" }));
    setLive(path);
    return path;
  }
  return <section className={styles.signer} aria-label={party}>
    <h3>{party}</h3>
    <p>{mark ? mark.name + " · " + mark.title : provider ? "Amulya Parmar · CEO" : "Authorized representative"}</p>
    {mark ? <>
      {mark.paths.length ? <svg className={styles.ink} viewBox="0 0 600 180" aria-label={"Signature of " + mark.name}>
        {mark.paths.map((path, i) => <path key={i} d={path} />)}</svg> : <div className={styles.autograph}>{mark.name}</div>}
      <small>Signed {mark.date}</small>
    </> : editing ? <form className={styles.fields} onSubmit={event => {
      event.preventDefault();
      if (!name.trim() || !title.trim() || (draw && !paths.length)) return;
      setMark({ name: name.trim(), title: title.trim(), paths: draw ? paths : [],
        date: new Date().toLocaleDateString(undefined, { dateStyle: "long" }) });
      onSign?.();
    }}>
      <label>Full name<input required value={name} onChange={e => setName(e.target.value)} /></label>
      <label>Title<input required value={title} onChange={e => setTitle(e.target.value)} /></label>
      <div className={styles.modes}>{["Type", "Draw"].map((method, i) =>
        <button type="button" aria-pressed={draw === Boolean(i)} key={method} onClick={() => setDraw(Boolean(i))}>{method}</button>)}</div>
      {draw ? <>
        <svg viewBox="0 0 600 180" preserveAspectRatio="none" className={styles.ink} aria-label="Draw signature here"
          onPointerDown={e => {
            if (stroke.current || e.button !== 0) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            stroke.current = { id: e.pointerId, points: [] };
            addPoint(e);
          }} onPointerMove={addPoint} onPointerCancel={() => { stroke.current = null; setLive(""); }}
          onPointerUp={e => {
            const path = addPoint(e);
            if (!path) return;
            setPaths(previous => [...previous, path]); stroke.current = null; setLive("");
          }}>
          {paths.map((path, i) => <path key={i} d={path} />)}<path d={live} />
        </svg>
        <button type="button" disabled={!paths.length} onClick={() => setPaths([])}>Clear ink</button>
      </> : <div className={styles.autograph}>{name.trim() || "Your signature"}</div>}
      <button className={styles.button} disabled={!name.trim() || !title.trim() || (draw && !paths.length)}>Apply signature</button>
    </form> : <button type="button" className={styles.signLine} onClick={() => setEditing(true)}>Add signature</button>}
  </section>;
}

export function Agreement() {
  const [quantity, setQuantity] = useState("0");
  const [signed, setSigned] = useState(false);
  const count = Number(quantity);
  const estimate = 1500 + count * 600 + 2500;
  const valid = /^\d+$/.test(quantity) && Number.isSafeInteger(estimate);
  const total = valid ? "$" + estimate.toLocaleString("en-US") : "Enter a whole number";
  return <section id="agreement" className={styles.agreement}>
    <h2>Production agreement</h2>
    <p>In one day, LeaseMagnets will film sit-down interviews with Aly and an expected two to three members of Forum’s investor relations team. The $1,500 session includes two cameras, lighting and interview audio. Forum’s Toronto office is the proposed setting. The venue and November availability are to be confirmed.</p>
    <p>Forum will select a representative set of properties for aerial footage in the style of its previous shoots. Drone coverage is $600 per site. Once the sites, cities and storyboard are set, we’ll confirm travel costs outside the Greater Toronto Area and any savings from booking the shoots together.</p>
    <p>The $2,500 final edit brings the interviews and property footage together in one REIIF anniversary film.</p>
    <dl className={styles.rates}>
      <div><dt>One-day interview shoot with two cameras, lighting and audio</dt><dd>$1,500</dd></div>
      <div><dt>Property drone footage</dt><dd>$600 / location</dd></div>
      <div><dt>Final commercial edit</dt><dd>$2,500</dd></div>
    </dl>
    <div className={styles.estimate}>
      <label>Drone filming locations <input type="number" min="0" step="1" disabled={signed} value={quantity} onChange={e => setQuantity(e.target.value)} /></label>
      <strong aria-live="polite">Estimated total　{total}</strong>
    </div>
    <h2 className={styles.signTitle}>Signatures</h2>
    <p>By signing, each party approves the scope and rates above. Print or save a PDF to keep a copy with the signatures entered on this device.</p>
    <fieldset disabled={!valid} className={styles.signGrid}>
      <Signatory provider onSign={() => setSigned(true)} />
      <Signatory provider={false} onSign={() => setSigned(true)} />
    </fieldset>
    <button className={styles.button} type="button" onClick={() => window.print()}>Print or save PDF</button>
  </section>;
}
